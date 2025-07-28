import { QuerySpec, SoupIndexSpec, StoreConfig, StoreCursor } from 'react-native-force/dist/react.force.smartstore'
import { smartstore, mobilesync, net } from 'react-native-force'


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
        resolve(result) // Resolve the promise on success
      },
      (error: Error) => {
        reject(error) // Reject the promise on error
      }
    )
  })
}