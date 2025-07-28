
import { smartstore } from 'react-native-force'
import { querySoupSpecPromise } from "../promisifySFSDK";
import { userStoreConfig,userStoreSoups,userStoreSync } from "../storetypes/UserStore";
import { StoreCursor } from "react-native-force/dist/react.force.smartstore";
import { User } from "../../../entities/UserEnitiies";
import { GenericQueryParams } from "../../../interfaces/queries/GenericQueryParams";

/**
 
 * This function is triggered internally from `BaseRepository.getUserData()` 
 * using a `GenericQueryParams` object. It fully abstracts SmartStore-level 
 * logic and provides domain-level data (`User` entity) back to the repository layer.
 *
 * ✅ It uses SmartStore `querySoup` via a promisified utility.
 * ✅ Decoupled from DB config – accepts all config via `GenericQueryParams`.
 * ✅ Only returns the first User (i.e., the latest or topmost result).
 *
 * Usage:
 * ```ts
 * const queryParams: GenericQueryParams = {
 *   soupName: 'UserSoup',
 *   orderPath: 'Id',
 *   order: 'ascending',
 *   pageSize: 1
 * };
 *
 * const userRepo = new UserRepository();
 * const user = await userRepo.getUserData(queryParams);
 * ```
 *
 * @param params - Generic query params to specify soup name, ordering path, direction, and page size.
 * @returns A Promise resolving to the first `User` entity found or `null` if no data is found.
 */
export async function getUserDataDB(params: GenericQueryParams): Promise<User | null> {
  try {
    const {
      soupName,
      orderPath,
      order,
      pageSize
    } = params;

    const querySpec = smartstore.buildAllQuerySpec(orderPath!!, order, pageSize!!);

    const response: StoreCursor<User> = await querySoupSpecPromise<User>(
      userStoreConfig,
      soupName!!,
      querySpec
    );

    console.log('getUserDataDB result:', response);
    return response?.currentPageOrderedEntries?.[0] ?? null;
  } catch (error) {
    console.log('getUserDataDB error:', error);
    return null;
  }
}
