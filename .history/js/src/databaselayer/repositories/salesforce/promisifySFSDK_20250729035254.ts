import { QuerySpec, SoupIndexSpec, StoreConfig, StoreCursor } from 'react-native-force/dist/react.force.smartstore'
import { smartstore, mobilesync, net } from 'react-native-force'


/**
 * A Promise-based wrapper around SmartStore's `querySoup` method.
 *
 * ✅ Converts callback-based SmartStore API to modern Promise.
 * ✅ Supports generics, so the typed result is preserved across usage.
 * ✅ Used internally in DB layer (e.g., `getUserDataDB`) to query soups.
 *
 * Usage:
 * ```ts
 * const querySpec = smartstore.buildAllQuerySpec('Id', 'ascending', 1);
 * const response = await querySoupSpecPromise<User>(
 *   userStoreConfig,
 *   'UserSoup',
 *   querySpec
 * );
 * const user = response.currentPageOrderedEntries?.[0];
 * ```
 *
 * @template T The type of each entry in the returned result.
 * 
 * @param storeConfig - SmartStore configuration or boolean (`true` for global store).
 * @param soupName - The name of the soup (table) to query.
 * @param querySpec - The SmartStore QuerySpec object (e.g., built via `buildAllQuerySpec`, `buildExactQuerySpec`, etc.).
 * 
 * @returns A Promise resolving to a SmartStore `StoreCursor<T>` object containing the query result.
 */
export const querySoupSpecPromise = <T>(
  storeConfig: StoreConfig | boolean,
  soupName: string,
  querySpec: QuerySpec
): Promise<StoreCursor<T>> => {
  return new Promise((resolve, reject) => {
    smartstore.querySoup(
      storeConfig,
      soupName,
      querySpec,
      (result: StoreCursor<T>) => {
        resolve(result); // Resolve the promise on success
      },
      (error: Error) => {
        reject(error); // Reject the promise on error
      }
    );
  });
};
