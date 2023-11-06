const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    headless: false, // Set headless to false to run in non-headless mode
  });
  const page = await browser.newPage();
  
  await page.goto('http://localhost:3000/login/login.html'); // Replace with the URL of the page you want to test.
  let prevURL = page.url()
  await page.fill('#email','Sally.Loh@allinone.com.sg')
  await page.fill('#password', '1234567')

  // Your Playwright test code here
  await page.click('#submit')
  await page.waitForTimeout(3000);
  let currentURL = page.url()
  console.log(currentURL)
  // This line will keep the browser open until you manually close it
  if(prevURL == currentURL){
    console.log("Login Failed")
    await browser.close();
    process.exit(1)
  }

  else{
    console.log('Login successful');
    await browser.close();
    process.exit(0); // Zero exit code indicates success
  }

  
})();



