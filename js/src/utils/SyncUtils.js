// SyncUtils.js
import { smartstore, mobilesync, net } from 'react-native-force'

export const syncDown = (config, target, soupName, options, name) =>
  new Promise((res, rej) => mobilesync.syncDown(config, target, soupName, options, name, res, rej))

export const syncUp = (config, target, soupName, options, name) =>
  new Promise((res, rej) => mobilesync.syncUp(config, target, soupName, options, name, res, rej))

export const reSync = (config, syncName) =>
  new Promise((res, rej) => mobilesync.reSync(config, syncName, res, rej))

export const getSyncStatus = (config, syncName) =>
  new Promise((res, rej) => mobilesync.getSyncStatus(config, syncName, res, rej))

export const querySoup = (config, soupName, querySpec) =>
  new Promise((res, rej) => smartstore.querySoup(config, soupName, querySpec, res, rej))

export const soupExists = (config, soupName) =>
  new Promise((res, rej) => smartstore.soupExists(config, soupName, res, rej))
