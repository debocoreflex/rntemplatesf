// UserStore.js
import { syncDown, syncUp, reSync, getSyncStatus, querySoup } from '../../utils/SyncUtils';

import { smartstore } from 'react-native-force'

const USER_SOUP = 'UserSoup'
const USER_SYNC_NAME = 'userSoupSync'

export default class UserStore {
  constructor(config, ownerId) {
    this.config = config
    this.ownerId = ownerId
    this.syncName = USER_SYNC_NAME
    this.soupName = USER_SOUP
    this.syncInFlight = false
  }

  get userInfoTarget() {
    return {
      type: 'soql',
      query: `SELECT Id, Country_Code__c, Trade_Channel__c FROM User WHERE Id = '${this.ownerId}'`,
    }
  }

  async syncData() {
    const status = await getSyncStatus(this.config, this.syncName).catch(() => null)
    return status ? this.reSyncData() : this.syncDownData()
  }

  async syncDownData() {
    if (this.syncInFlight) return
    this.syncInFlight = true
    const result = await syncDown(this.config, this.userInfoTarget, this.soupName, { mergeMode: 'LEAVE_IF_CHANGED' }, this.syncName)
    this.syncInFlight = false
    return result
  }

  async reSyncData() {
    if (this.syncInFlight) return
    this.syncInFlight = true
    const result = await reSync(this.config, this.syncName)
    this.syncInFlight = false
    return result
  }

  async getUserInfo() {
    const querySpec = smartstore.buildAllQuerySpec('Id', 'ascending', 100)
    const result = await querySoup(this.config, this.soupName, querySpec)
    return result?.currentPageOrderedEntries?.[0]
  }
}
