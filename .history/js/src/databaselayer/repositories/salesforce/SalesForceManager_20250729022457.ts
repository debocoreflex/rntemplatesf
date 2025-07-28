import { mobilesync, smartstore } from 'react-native-force'
import { StoreConfig } from 'react-native-force/dist/react.force.smartstore'
import { SyncDownTarget } from 'react-native-force/dist/typings/mobilesync'



type MergeMode = 'OVERWRITE' | 'LEAVE_IF_CHANGED' | undefined

export class StoreManager {
  // Smart Store Table Name
  public soupName: string
  // Smart Store Config
  public storeConfig: StoreConfig | boolean;
  // Soup Field List
  public syncUpFieldList: {
    syncUpTarget:{
    createFieldlist:string[],
    updateFieldlist:string[]
  };
  felidList:string[]
 }

  // Salesforce Mobile Sync Name for data syncing
  private syncName: string
  // Salesforce Mobile Sync target for data syncing
  private _target: SyncDownTarget | undefined
  // Salesforce Mobile Sync merge mode for data syncing
  private mergeMode: MergeMode = mobilesync.MERGE_MODE.LEAVE_IF_CHANGED

  // Salesforce Mobile SyncUp merge mode for data syncing
  private syncUpMergeMode: MergeMode = mobilesync.MERGE_MODE.OVERWRITE;

  // To track sync process - to prevent multiple sync operations
  private syncInFlight: boolean = false
  // To track sync process - to prevent multiple sync operations
  // private event = createEventEmitter()

  /**
   *
   * @param {string} soupName - The `soupName` parameter is a string that represents the name of a soup,
   * which is a collection of data in a database.
   * @param {StoreConfig | boolean} storeConfig - The `storeConfig` parameter in the constructor is of
   * type `StoreConfig` or `boolean`. It is used to configure the store settings for the soup being
   * created.
   * @param {SoupIndexSpec[]} indexSpec - The `indexSpec` parameter in the constructor is an array of
   * `SoupIndexSpec` objects. These objects define the indexing specifications for the soup.
   * @param {string} syncName - The `syncName` parameter in the constructor is a string that represents
   * the name of the synchronization.
   */
  public constructor(
    soupName: string,
    storeConfig: StoreConfig | boolean,
    syncName: string,
    syncUpFieldList?: {
      syncUpTarget:{
      createFieldlist:string[],
      updateFieldlist:string[]
    };
    felidList:string[] }
  ) {
    this.soupName = soupName;
    this.storeConfig = storeConfig;
    this.syncName = syncName;
    this.syncUpFieldList = syncUpFieldList ??  {syncUpTarget:{
      createFieldlist:[],
      updateFieldlist:[]
    },
    felidList:[]}
  }

  /**
   * @returns target for syncing data
   */
  public get target(): SyncDownTarget | undefined {
    return this._target
  }

  /**
   * @returns sets target for syncing data
   */
  public set target(value: SyncDownTarget) {
    this._target = value
  }


 

}
