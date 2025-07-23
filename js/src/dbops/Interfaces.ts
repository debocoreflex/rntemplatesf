// repositories/IRepository.ts

//GENERIC INTERFACE FOR REPOSITORIES
// This interface defines the basic CRUD operations for a repository
// It can be implemented by any repository class to ensure consistency
// across different data sources (e.g., SmartStore, SQLite, etc.)

export interface IRepository<T> {
  getAll(): Promise<T[]>;
  getById(id: string): Promise<T | null>;
  create(item: T): Promise<void>;
  update(id: string, item: Partial<T>): Promise<void>;
  delete(id: string): Promise<void>;
  save(item:T): Promise<void>;
}
