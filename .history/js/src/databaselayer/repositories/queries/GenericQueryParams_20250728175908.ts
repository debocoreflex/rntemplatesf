// GenericQueryParams.ts

export type SortDirection = 'ASC' | 'DESC';

export class GenericQueryParams {
  soupName: string;                  // Name of the soup or table
  selectFields?: string[];           // Fields to select (default: _soup or *)
  from: string?;                      // Table or soup name
  filters?: FilterCondition[];       // WHERE conditions
  orderBy?: {
    field: string;
    direction: SortDirection;
  };
  inFilter?: {
    field: string;
    values: string[];
  };
  likeFilter?: {
    field: string;
    pattern: string; // e.g. '2025-07%'
  };
  limit?: number;                    // pageSize
  offset?: number;                   // For pagination
}

export interface FilterCondition {
  field: string;
  operator: '=' | '!=' | '>' | '>=' | '<' | '<=' | 'IS NOT NULL' | 'IS NULL' | 'EQUALS' | 'NOT_EQUALS';
  value?: string | number | null;
}
