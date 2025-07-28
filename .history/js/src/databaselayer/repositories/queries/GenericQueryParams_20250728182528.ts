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
