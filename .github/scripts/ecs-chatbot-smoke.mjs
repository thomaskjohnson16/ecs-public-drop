import { chromium } from 'playwright';

const baseUrl = process.env.BASE_URL || 'http://127.0.0.1:4173';
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
const failures = [];
const externalRequests = [];
const consoleErrors = [];

page.on('console', (msg) => {
  if (msg.type() === 'error') consoleErrors.push(msg.text());
});
page.on('request', (request) => {
  const url = request.url();
  if (!url.startsWith(baseUrl) && !url.startsWith('data:') && !url.startsWith('blob:')) {
    externalRequests.push(url);
  }
});

function check(condition, message) {
  if (!condition) failures.push(message);
}

await page.goto(`${baseUrl}/index.html`, { waitUntil: 'networkidle' });
const openButton = page.locator('#chatOpenButton');
check(await openButton.isEnabled(), 'Chat open button is not enabled.');
check((await openButton.textContent())?.includes('Open ECS Assistant'), 'Chat open button label is incorrect.');

await openButton.click();
check(await page.locator('#chatDialog').isVisible(), 'Chat dialog did not open.');
check((await page.locator('#chatStatus').textContent())?.includes('Automated assistant'), 'Automation disclosure/status is missing.');
check((await page.locator('#ecsChatLog').textContent())?.includes('do not provide legal advice'), 'First-message safety disclosure is missing.');

const composer = page.locator('#chatComposer');
await composer.fill('What services does ECS provide?');
await composer.press('Enter');
await page.waitForTimeout(150);
let logText = await page.locator('#ecsChatLog').textContent();
check(logText?.includes('Workforce Governance & Organizational Risk Advisory Group'), 'Normal ECS service response did not render.');

await composer.fill('I have an employee medical complaint and need legal advice about retaliation.');
await composer.press('Enter');
await page.waitForTimeout(150);
logText = await page.locator('#ecsChatLog').textContent();
check(logText?.includes('can’t evaluate a complaint'), 'Sensitive/legal request did not receive bounded refusal.');

const storage = await page.evaluate(() => ({ local: localStorage.length, session: sessionStorage.length }));
check(storage.local === 0 && storage.session === 0, 'Chat session wrote to browser persistent/session storage.');
check(externalRequests.length === 0, `Unexpected external requests: ${externalRequests.join(', ')}`);
check(consoleErrors.length === 0, `Console errors: ${consoleErrors.join(' | ')}`);

await page.locator('#chatCloseButton').click();
check(!(await page.locator('#chatDialog').isVisible()), 'Chat dialog did not close.');

await browser.close();

if (failures.length) {
  console.error(JSON.stringify({ status: 'RED', failures, externalRequests, consoleErrors }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({
  status: 'GREEN',
  checks: [
    'chat enabled',
    'dialog open/close',
    'automation disclosure',
    'service FAQ response',
    'sensitive/legal refusal',
    'no outbound request in local mode',
    'no local/session storage',
    'no console errors'
  ]
}, null, 2));
