import { SalesForceManager } from "../SalesForceManager";
import { smartstore } from 'react-native-force'
import { querySoupSpecPromise } from "../promisifySFSDK";
import { User } from "../../../entities/UserEnitiies";

export class UserStoreManager extends SalesForceManager {
  
 
async getUserDataDB(item) {
 let userData
 try {
    const response: smartstore.StoreCursor<User> = await querySoupSpecPromise<User>(
      this.storeConfig,
      this.soupName,
      smartstore.buildAllQuerySpec('Id', 'ascending', 100)
    )
    const userInfo = response?.currentPageOrderedEntries[0]

    userData = userInfo
 } catch (error) {
    console.log('UserStoreManager getUserData error', error)
 }
 return userData
  }

}