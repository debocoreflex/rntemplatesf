
// jest.config.js
module.exports = {
  preset: 'react-native',

  // 👇 THIS is where you reference the setup file
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],

   transformIgnorePatterns: [
    'node_modules/(?!(jest-)?react-native|@react-native|@react-navigation|@react-native-community|@testing-library|@react-native/js-polyfills)',
  ],
  testPathIgnorePatterns: ['/node_modules/', '/android/', '/ios/'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};