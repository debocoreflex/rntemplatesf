import { IWrite, IRead, IQuery } from "../interfaces/CommonInterfaces";
import { getContactsFromSmartStore, saveContact,searchContactsComplex } from '../../services/store/SmartStoreUtils';
import { GenericQueryParams } from "./queries/GenericQueryParams";



export abstract  class BaseRepository<T> implements IWrite<T>, IRead<T>, IQuery<T> {
   
    query(params: GenericQueryParams): Promise<T[]> {
       const { searchText } = params;

    return new Promise((resolve, reject) => {
      if (!searchText) {
        return reject('No search text provided for complex search');
      }

      searchContactsComplex(
        'customQuery1',
        searchText,
        (results) => {
          //resolve(results as ContactEntity[]);
          console.log(`Complex search results: ${JSON.stringify(results)}`);
        },
        (error) => {
          reject(error);
        }
      );
    });
  
    }
    //write operations
    create(item: T): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    update(id: string, item: T): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    delete(id: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
   async save(item:T): Promise<void> {
        const entry = {
            ...item,
            attributes: { type: "Contact" },
            __locally_created__: true,
            __locally_updated__: false,
            __locally_deleted__: false,
            __local__: true,
        };
        //this attributes param is only for smartstore it can be changed based on the database implementation
        //for example in firestore we can use set method to save the data
        //in sqlite we can use insert or update method to save the data
        await saveContact(entry, () => { });
        //note:- this save method is used to save the data in the database in smartstore
        //it can be changed based on the database implementation
        //for example in firestore we can use set method to save the data and we will import the firestore service
    }

    //read operations
    get(id: string): Promise<T | null> {
        throw new Error("Method not implemented.");
    }
    getAll(): Promise<T[]> {
        throw new Error("Method not implemented.");
    }
    

}



