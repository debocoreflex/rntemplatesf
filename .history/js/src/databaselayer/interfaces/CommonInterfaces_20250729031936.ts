import { User } from "../entities/UserEnitiies";
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

export interface IDatabaseWrite<T> {
  add(item: T): Promise<T>;
  addAll(items: T[]): Promise<T[]>;

  update(item: T): Promise<T>;
  updateAll(items: T[]): Promise<T[]>;

  deleteById(id: string): Promise<void>;
  deleteManyByIds(ids: string[]): Promise<void>;
}

export interface IDatabaseRead<T> {
  getById(id: string): Promise<T | null>;
  getAll(): Promise<T[]>;
  query(queryParams: GenericQueryParams): Promise<T[]>;
  getUserData( query:GenericQueryParams): User | undefined;
}

export interface IRepository<T> extends IDatabaseWrite<T>, IDatabaseRead<T> {}
