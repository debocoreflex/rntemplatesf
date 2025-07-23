// data/repository/RepositoryFactory.ts
import { IRepository } from './Interfaces';
import { ContactEntity } from './models/ContactEnitity';
import { dbRepo } from './dbimplementation/dbRepo';

export class RepositoryFactory {
  static contactRepository(): IRepository<ContactEntity> {
    return new dbRepo(); // could use any repository implementation here
  }
}
