import { IWrite, IRead, IQuery,IDatabaseRead } from "../interfaces/CommonInterfaces";
import { getContactsFromSmartStore, saveContact,searchContactsComplex } from '../../services/store/SmartStoreUtils';
import { GenericQueryParams } from "../interfaces/queries/GenericQueryParams";
import { User } from "../entities/UserEnitiies";
import { getUserDataDB } from "./salesforce/specificstoremanagers/UserStoreManager";




/**
 * BaseRepository provides generic CRUD and query operations for any
 * domain entity `T`. This acts as a bridge between application-level
 * code and the underlying database implementation.
 * 
 * It can be extended for specific entities like `ContactRepository`, `UserRepository`, etc.
 *
 * @typeParam T - Entity type (e.g., User, Contact)
 */
export abstract class BaseRepository<T> implements IWrite<T>, IRead<T>, IQuery<T>, IDatabaseRead<T> {

    // ────────────────────────
    // Write Operations
    // ────────────────────────

    /**
     * Create a new entity record.
     * @param item - The item to create.
     */
    create(item: T): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    /**
     * Update an entity record by ID.
     * @param id - The ID of the entity to update.
     * @param item - The updated item data.
     */
    update(id: string, item: T): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    /**
     * Delete an entity record by ID.
     * @param id - The ID of the entity to delete.
     */
    delete(id: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    /**
     * Save the entity to the SmartStore or other underlying database.
     *
     * Adds metadata like `__locally_created__` for SmartStore sync.
     * Can be overridden or extended for Firestore/SQLite.
     *
     * @param item - The item to save.
     */
    async save(item: T): Promise<void> {
        const entry = {
            ...item,
            attributes: { type: "Contact" }, // Changeable per domain
            __locally_created__: true,
            __locally_updated__: false,
            __locally_deleted__: false,
            __local__: true,
        };

        await saveContact(entry, () => { });

        // Note: For Firestore, SQLite, etc., replace with appropriate logic
    }

    // ────────────────────────
    // Read Operations
    // ────────────────────────

    /**
     * Fetch an entity by ID.
     * @param id - Unique ID of the entity.
     */
    get(id: string): Promise<T | null> {
        throw new Error("Method not implemented.");
    }

    /**
     * Fetch all entities of type T.
     * @returns Promise resolving to an array of T.
     */
    getAll(): Promise<T[]> {
        throw new Error("Method not implemented.");
    }


    /**
     * Fetch a single user data entry from the database using abstract query parameters.
     * Used specifically for domain types like `User` where single object fetch is required.
     *
     * @param query - GenericQueryParams including soup name, order path, store config, etc.
     * @returns Promise resolving to a `User` object or `null` if not found.
     *
     * @example
     * const user = await userRepo.getUserData({
     *   soupName: 'users',
     *   orderPath: 'Id',
     *   order: 'ascending',
     *   pageSize: 1,
     *   storeConfig: false
     * });
     */
    async getUserData(query: GenericQueryParams): Promise<User | null> {
        return await getUserDataDB(query);
    }

    /**
     * Fetch entity by ID.
     * @param id - Unique identifier of the entity.
     */
    getById(id: string): Promise<T | null> {
        throw new Error("Method not implemented.");
    }

    /**
     * Perform a complex query based on provided GenericQueryParams.
     *
     * @param params - Query params including optional search text.
     * @returns Promise resolving to a list of results of type `T`.
     */
    query(params: GenericQueryParams): Promise<T[]> {
        const { searchText } = params;

        return new Promise((resolve, reject) => {
            if (!searchText) {
                return reject('No search text provided for complex search');
            }

            searchContactsComplex(
                '001E000001KnMkTIAV',
                searchText,
                (results) => {
                    console.log(`Complex search results: ${JSON.stringify(results)}`);
                    // resolve(results as T[]); // Uncomment this when results are typed
                },
                (error) => {
                    reject(error);
                }
            );
        });
    }

}


