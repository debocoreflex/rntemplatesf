// GenericQueryParams.ts

export type SortDirection = 'ASC' | 'DESC';


export interface GenericQueryParams {
  queryType: QueryType;

  // For exact, like, match, range
  indexPath?: string;

  // For exact/match/like
  matchKey?: string;
  likeKey?: string;

  // For range
  beginKey?: string;
  endKey?: string;

  // Sorting
  orderPath?: string;
  order?: 'ascending' | 'descending';

  // Pagination
  pageSize?: number;

  // For SmartSQL queries
  smartSql?: string;

  // Optional projected fields (for SmartSQL or partial queries)
  selectPaths?: string[];

  table?: string; // For SOQL-like queries
  fields?: string[]; // Fields to select in SOQL-like queries
  filters?: FilterCondition[][]; // Filters for SOQL-like queries
  limit?: number; // Limit for SOQL-like queries

  searchText?: string; // For complex search queries

  storeConfig?: any[]; // For specifying the store configuration

  soupName?: string; // For specifying the soup name in SmartStore queries
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
