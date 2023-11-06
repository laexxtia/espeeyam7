const { chromium } = require('playwright');

describe('Login Test', () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await chromium.launch({
      headless: true, // Set headless to false to run in non-headless mode
    });
    page = await browser.newPage();
  });

  afterAll(async () => {
    await browser.close();
  });

  test('Login Test', async () => {
    await page.goto('http://localhost:3000/login/login.html'); // Replace with the URL of the page you want to test.
    let prevURL = page.url();
    await page.fill('#email', 'Sally.Loh@allinone.com.sg');
    await page.fill('#password', '123456');

    // Your Playwright test code here
    await page.click('#submit');

    targetURL = "http://localhost:3000/admin/job_listing.html"
    await page.waitForURL(targetURL, { timeout: 10000 })
    currentURL = page.url()
    console.log(currentURL);

    // Assertions can be added here to determine if the login was successful or not.
    if (prevURL == currentURL) {
      console.log('Login Failed');
      await page.screenshot({ path: 'error screenshot.png' });

      throw new Error('Login Failed'); // This will fail the test
    } else {
      console.log('Login successful');
    }
  });
});




