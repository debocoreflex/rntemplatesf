import { User } from "../../entities/UserEnitiies";
import { GenericQueryParams } from "../../interfaces/queries/GenericQueryParams";
import { BaseRepository } from "../BaseRepository";

/**
 * UserRepository acts as the domain-specific wrapper for User-related
 * database operations using the generic BaseRepository.
 *
 * It provides an abstraction for fetching user data in a structured,
 * extensible way.
 *
 * Usage:
 * ```ts
 * const repo = new UserRepository();
 * const user = await repo.getUserData({
 *   soupName: 'users',
 *   storeConfig: false,
 *   orderPath: 'Id',
 *   order: 'ascending',
 *   pageSize: 1
 * });
 * console.log(user?.Name);
 * ```
 */
export class UserRepository extends BaseRepository<User> {
    
    /**
     * Fetch a single User record from the database using generic query parameters.
     *
     * @param query - The query metadata including soup name, ordering, pagination, etc.
     * @returns A Promise resolving to a `User` object or `null` if not found.
     */
    getUserData(query: GenericQueryParams): Promise<User | null> {
        // Call the base repository's getUserData method
        return super.getUserData(query);
    }

}
