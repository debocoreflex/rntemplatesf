import { GenericQueryParams } from "./queries/GenericQueryParams";

export interface IWrite<T> {
  create(item: T): Promise<boolean>;
  update(id: string, item: T): Promise<boolean>;
  delete(id: string): Promise<boolean>;
  save:(item:T) => Promise<void>;
}
export interface IRead<T> {
  get(id: string): Promise<T | null>;
  getAll(): Promise<T[]>;
}

export interface IQuery<T> {
  query(params: GenericQueryParams): Promise<T[]>;
}
