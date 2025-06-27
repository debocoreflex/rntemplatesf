import { device, element, by, waitFor } from 'detox';

describe('App Launch', () => {
  // beforeAll(async () => {
  //   await device.launchApp({ newInstance: true });
  // });

  // it('should show the SearchScreen on launch', async () => {
  //   await waitFor(element(by.id('SearchScreen')))
  //     .toBeVisible()
  //     .withTimeout(5000);
  // });


  beforeAll(async () => {
    await device.launchApp({ newInstance: true, launchArgs: { IS_DETOX: 'true' } });
  });

  it('should display dummy contact list', async () => {
    await expect(element(by.id('SearchScreen'))).toBeVisible();
    await expect(element(by.id('ContactList'))).toBeVisible();
    await expect(element(by.text('John Doe'))).toBeVisible();
    await expect(element(by.text('Jane Smith'))).toBeVisible();
  });
});
