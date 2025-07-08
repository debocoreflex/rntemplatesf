let dummyContacts = [];

console.log('🚀 rnforce mock loaded');

module.exports = {
  smartstore: {
    soupExists: jest.fn((_, soupName, callback) => {
      callback(soupName === 'contacts');
    }),
    registerSoup: jest.fn((_, __, ___, resolve) => {
      resolve();
    }),
    buildAllQuerySpec: jest.fn(() => ({})),
    querySoup: jest.fn((_, __, ___, success) => {
      success({ currentPageOrderedEntries: dummyContacts });
    }),
    upsertSoupEntries: jest.fn((_, __, entries, success) => {
      dummyContacts.push(...entries);
      success(entries);
    }),
    removeFromSoup: jest.fn((_, __, ids, success) => {
      dummyContacts = dummyContacts.filter(
        (item) => !ids.includes(item._soupEntryId)
      );
      success();
    }),
  },

  mobilesync: {
    MERGE_MODE: { OVERWRITE: 'overwrite' },

    syncUp: jest.fn((
      isGlobalStore,
      target,
      soupName,
      options,
      success,
      error
    ) => {
      // Simulate Salesforce accepting local records
      success({ totalSize: dummyContacts.length });
    }),

    reSync: jest.fn((
      isGlobalStore,
      syncName,
      success,
      error
    ) => {
      // Simulate downloading updated records
      success(); // Could also return data if needed
    }),
  },

  oauth: {
    getAuthCredentials: jest.fn((success) => success()),
    authenticate: jest.fn((success) => success()),
    logout: jest.fn(),
  }
};
