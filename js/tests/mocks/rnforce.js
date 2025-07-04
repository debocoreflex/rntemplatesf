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
  }
};
