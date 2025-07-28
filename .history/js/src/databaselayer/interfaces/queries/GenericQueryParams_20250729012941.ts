// GenericQueryParams.ts

export type SortDirection = 'ASC' | 'DESC';

export interface GenericQueryParams {
  table: string; // soupName or Realm class or Salesforce object
  fields?: string[]; // optional - e.g., ['Id', 'Name']
  filters?: Array<[string, '=' | '!=' | 'IN' | 'LIKE', any]>; // e.g., ['Id', '=', '123'], ['Status', 'IN', ['A','B']]
  searchText?: string; // used for full-text or name match
  orderBy?: string; // single field name
  orderDirection?: 'ASC' | 'DESC'; // default 'ASC'
  limit?: number;
  offset?: number; // for pagination if needed
  rawQuery?: string; // for advanced use cases like SmartSQL/ SOQL string override
}

export interface FilterCondition {
  field: string;
  operator: '=' | '!=' | '>' | '>=' | '<' | '<=' | 'IS NOT NULL' | 'IS NULL' | 'EQUALS' | 'NOT_EQUALS';
  value?: string | number | null;
}
export type QueryType =
  | 'exact'
  | 'range'
  | 'like'
  | 'match'
  | 'all'
  | 'smart';

// EXAMPLE 1
// {
//   table: 'contacts',
//   searchText: 'John Doe'
// }

// EXAMPLE 2
// {
//   table: 'contacts',
//   fields: ['_soup'],
//   filters: [['FirstName', '=', 'John']],
//   orderBy: 'LastName',
//   orderDirection: 'ASC',
//   limit: 50
// }

// EXAMPLE 3
// {
//   table: 'Account',
//   fields: ['Id', 'Name', 'BillingCountry'],
//   filters: [['Id', '=', '001E000001KnMkTIAV']],
//   limit: 10
// }




function buildSoqlQuery(params: GenericQueryParams): string {
  const { table, fields = ['Id'], filters = [], limit } = params;
  const selectClause = `SELECT ${fields.join(', ')} FROM ${table}`;
  const whereClause = filters.length
    ? 'WHERE ' + filters.map(([f, op, v]) =>
        Array.isArray(v)
          ? `${f} IN (${v.map(x => `'${x}'`).join(', ')})`
          : `${f} ${op} '${v}'`
      ).join(' AND ')
    : '';
  const limitClause = limit ? `LIMIT ${limit}` : '';
  return `${selectClause} ${whereClause} ${limitClause}`.trim();
}
