import { SalesForceManager } from "../SalesForceManager";
import { smartstore } from 'react-native-force'
import { querySoupSpecPromise } from "../promisifySFSDK";
import { userStoreConfig,userStoreSoups,userStoreSync } from "../storetypes/UserStore";
import { StoreCursor } from "react-native-force/dist/react.force.smartstore";
import { User } from "../../../entities/UserEnitiies";
import { GenericQueryParams } from "../../../interfaces/queries/GenericQueryParams";
import { StoreConfig } from 'react-native-force/dist/react.force.smartstore'
// repositories/specificrepositories/UserRepository.ts



export async function getUserDataDB(params: GenericQueryParams): Promise<User | null> {
  try {
    const {
      soupName,
      orderPath = 'Id',
      order = 'ascending',
      pageSize = 100
    } = params;

    const querySpec = smartstore.buildAllQuerySpec(orderPath, order, pageSize);

    const response: StoreCursor<User> = await querySoupSpecPromise<User>(
      userStoreConfig,
      soupName!!,
      querySpec
    );

    return response?.currentPageOrderedEntries?.[0] ?? null;
  } catch (error) {
    console.log('getUserDataDB error:', error);
    return null;
  }
}
