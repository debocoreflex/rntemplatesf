import { device, element, by, waitFor } from 'detox';

describe('App Launch', () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true });
  });

  it('should show the SearchScreen on launch', async () => {
    await waitFor(element(by.id('SearchScreen')))
      .toBeVisible()
      .withTimeout(5000);
  });
});
