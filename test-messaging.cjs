const { chromium } = require("playwright");
const path = require("path");

const BASE_URL = "http://localhost:8080";
const VENDOR_EMAIL = "fikstathebastard@gmail.com";
const BUYER_EMAIL = "adideeavi01@gmail.com";
const PASSWORD = "Joburgjan@2017";
const TEST_MSG = `Test message ${Date.now()}`;
const REPLY_MSG = `Vendor reply ${Date.now()}`;
const SCREENSHOTS = "/tmp/booksmart-test";

let pass = 0;
let fail = 0;

function log(label, ok, detail = "") {
  if (ok) {
    console.log(`  ✅ PASS: ${label}`);
    pass++;
  } else {
    console.log(`  ❌ FAIL: ${label}${detail ? " — " + detail : ""}`);
    fail++;
  }
}

async function screenshot(page, name) {
  const { mkdirSync } = require("fs");
  mkdirSync(SCREENSHOTS, { recursive: true });
  await page.screenshot({ path: `${SCREENSHOTS}/${name}.png`, fullPage: true });
  console.log(`  📸 Screenshot: ${SCREENSHOTS}/${name}.png`);
}

async function login(page, email, password) {
  await page.goto(`${BASE_URL}/my-account`);
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(1000);
  await page.fill('#login-email', email);
  await page.fill('#login-password', password);
  await page.click('button:has-text("Log in")');
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(2000);
}

// Helper: find text anywhere in page (not strict)
async function hasText(page, text, timeout = 5000) {
  return page.locator(`text=${text}`).first().isVisible({ timeout }).catch(() => false);
}

// Helper: find text inside dialog
async function dialogHasText(page, text, timeout = 5000) {
  return page.locator('[role="dialog"]').locator(`text=${text}`).first().isVisible({ timeout }).catch(() => false);
}

(async () => {
  const browser = await chromium.launch({ headless: false, slowMo: 200 });

  // ─────────────────────────────────────────────────────────────
  // TEST 1: Buyer can log in and reach the shop
  // ─────────────────────────────────────────────────────────────
  console.log("\n[TEST 1] Buyer login and shop access");
  const buyerCtx = await browser.newContext();
  const buyerPage = await buyerCtx.newPage();

  await login(buyerPage, BUYER_EMAIL, PASSWORD);
  const buyerLoggedIn = await buyerPage.locator("h2").filter({ hasText: "Welcome back" }).isVisible().catch(() => false);
  log("Buyer logged in successfully", buyerLoggedIn);
  await screenshot(buyerPage, "01-buyer-logged-in");

  await buyerPage.goto(`${BASE_URL}/shop`);
  await buyerPage.waitForLoadState("networkidle");
  await buyerPage.waitForTimeout(1000);
  const shopLoaded = await buyerPage.locator("text=Message Seller").first().isVisible({ timeout: 8000 }).catch(() => false);
  log("Shop page loads with product listings", shopLoaded);
  await screenshot(buyerPage, "02-buyer-shop");

  // ─────────────────────────────────────────────────────────────
  // TEST 2: Buyer opens message dialog for Econ TextBook
  // ─────────────────────────────────────────────────────────────
  console.log("\n[TEST 2] Buyer opens message dialog for Econ TextBook");

  const econCardH3 = buyerPage.locator("h3").filter({ hasText: /Econ.*TextBook|TextBook.*Econ/i }).first();
  const econCardVisible = await econCardH3.isVisible({ timeout: 6000 }).catch(() => false);
  log("Econ TextBook product is visible in shop", econCardVisible);

  let dialogOpen = false;
  if (econCardVisible) {
    // Navigate up to card container, find its Message Seller button
    const card = econCardH3.locator("../..");
    const msgBtn = card.locator('button:has-text("Message Seller")');
    await msgBtn.click();
    await buyerPage.waitForTimeout(2000);

    dialogOpen = await buyerPage.locator('[role="dialog"]').isVisible({ timeout: 5000 }).catch(() => false);
    log("Message dialog opens for buyer", dialogOpen);

    if (dialogOpen) {
      const dialogTitle = await buyerPage.locator('[role="dialog"]').locator('h2').first().textContent().catch(() => "");
      log("Dialog shows product title", /econ|textbook/i.test(dialogTitle), `title="${dialogTitle}"`);
      await screenshot(buyerPage, "03-buyer-dialog-open");
    }
  } else {
    log("Message dialog opens for buyer", false, "product not found");
    log("Dialog shows product title", false, "skipped");
  }

  // ─────────────────────────────────────────────────────────────
  // TEST 3: Buyer sends a message
  // ─────────────────────────────────────────────────────────────
  console.log("\n[TEST 3] Buyer sends a message");
  dialogOpen = await buyerPage.locator('[role="dialog"]').isVisible().catch(() => false);

  if (dialogOpen) {
    const inputField = buyerPage.locator('[role="dialog"] input[placeholder="Type a message..."]');
    await inputField.fill(TEST_MSG);
    await buyerPage.keyboard.press("Enter");
    await buyerPage.waitForTimeout(2500);

    const msgVisible = await dialogHasText(buyerPage, TEST_MSG);
    log("Buyer's sent message appears in dialog", msgVisible, msgVisible ? "" : `looking for: "${TEST_MSG}"`);
    await screenshot(buyerPage, "04-buyer-sent-message");

    await buyerPage.keyboard.press("Escape");
    await buyerPage.waitForTimeout(1000);
  } else {
    log("Buyer's sent message appears in dialog", false, "dialog not open");
  }

  // Give Supabase time to propagate the insert before vendor checks
  await buyerPage.waitForTimeout(1000);

  // ─────────────────────────────────────────────────────────────
  // TEST 4: Vendor inbox shows unread badge for Econ TextBook
  // ─────────────────────────────────────────────────────────────
  console.log("\n[TEST 4] Vendor inbox shows unread message badge");
  const vendorCtx = await browser.newContext();
  const vendorPage = await vendorCtx.newPage();

  await login(vendorPage, VENDOR_EMAIL, PASSWORD);
  const vendorLoggedIn = await vendorPage.locator("h2").filter({ hasText: "Welcome back" }).isVisible().catch(() => false);
  log("Vendor logged in successfully", vendorLoggedIn);
  await screenshot(vendorPage, "05-vendor-logged-in");

  const messagesSection = await vendorPage.locator("h3:has-text('Messages'), h2:has-text('Messages')").first().isVisible({ timeout: 5000 }).catch(() => false);
  log("Messages inbox section is visible", messagesSection);

  // Use first() to avoid strict mode if title appears in multiple places
  const econConvLocator = vendorPage.locator("text=Econ TextBook").first();
  const econConv = await econConvLocator.isVisible({ timeout: 5000 }).catch(() => false);
  log("Econ TextBook conversation appears in vendor inbox", econConv);

  const unreadBadge = await vendorPage.locator("text=new").first().isVisible({ timeout: 3000 }).catch(() => false);
  log("Unread badge is shown on the conversation", unreadBadge);
  await screenshot(vendorPage, "06-vendor-inbox");

  // ─────────────────────────────────────────────────────────────
  // TEST 5: Vendor opens conversation and sees buyer's message (the bug fix)
  // ─────────────────────────────────────────────────────────────
  console.log("\n[TEST 5] Vendor opens conversation and sees buyer message (core bug fix)");

  if (econConv) {
    // Click the conversation row (the button wrapping the title)
    await econConvLocator.click();
    await vendorPage.waitForTimeout(2500);

    const vendorDialog = await vendorPage.locator('[role="dialog"]').isVisible({ timeout: 5000 }).catch(() => false);
    log("Dialog opens when vendor clicks conversation", vendorDialog);
    await screenshot(vendorPage, "07-vendor-dialog");

    if (vendorDialog) {
      const noMsgsText = await dialogHasText(vendorPage, "No messages yet", 2000);
      log("Dialog does NOT show 'No messages yet'", !noMsgsText, noMsgsText ? "BUG STILL PRESENT — showing empty state" : "");

      const buyerMsgVisible = await dialogHasText(vendorPage, TEST_MSG);
      log("Buyer's message is visible to vendor", buyerMsgVisible, buyerMsgVisible ? "" : `looking for: "${TEST_MSG}"`);
      await screenshot(vendorPage, "08-vendor-sees-messages");

      // ─────────────────────────────────────────────────────────
      // TEST 6: Vendor replies
      // ─────────────────────────────────────────────────────────
      console.log("\n[TEST 6] Vendor sends a reply");
      const replyInput = vendorPage.locator('[role="dialog"] input[placeholder="Type a message..."]');
      await replyInput.fill(REPLY_MSG);
      await vendorPage.keyboard.press("Enter");
      await vendorPage.waitForTimeout(2500);

      const replyVisible = await dialogHasText(vendorPage, REPLY_MSG);
      log("Vendor's reply appears in dialog", replyVisible);
      await screenshot(vendorPage, "09-vendor-reply-sent");

      await vendorPage.keyboard.press("Escape");
      await vendorPage.waitForTimeout(1000);
    } else {
      log("Dialog does NOT show 'No messages yet'", false, "dialog did not open");
      log("Buyer's message is visible to vendor", false, "dialog did not open");
      console.log("\n[TEST 6] Vendor sends a reply");
      log("Vendor's reply appears in dialog", false, "dialog did not open");
    }
  } else {
    log("Dialog opens when vendor clicks conversation", false, "conversation not found");
    log("Dialog does NOT show 'No messages yet'", false, "skipped");
    log("Buyer's message is visible to vendor", false, "skipped");
    console.log("\n[TEST 6] Vendor sends a reply");
    log("Vendor's reply appears in dialog", false, "skipped");
  }

  // ─────────────────────────────────────────────────────────────
  // TEST 7: Buyer sees vendor's reply in their own inbox
  // ─────────────────────────────────────────────────────────────
  console.log("\n[TEST 7] Buyer sees vendor reply in their inbox");
  await buyerPage.goto(`${BASE_URL}/my-account`);
  await buyerPage.waitForLoadState("networkidle");
  await buyerPage.waitForTimeout(2000);
  await screenshot(buyerPage, "10-buyer-account-page");

  const buyerInboxConv = await buyerPage.locator("text=Econ TextBook").first().isVisible({ timeout: 5000 }).catch(() => false);
  log("Econ TextBook conversation visible in buyer inbox", buyerInboxConv);

  if (buyerInboxConv) {
    await buyerPage.locator("text=Econ TextBook").first().click();
    await buyerPage.waitForTimeout(2500);

    const buyerDialogOpen = await buyerPage.locator('[role="dialog"]').isVisible({ timeout: 5000 }).catch(() => false);
    log("Buyer can open the conversation", buyerDialogOpen);
    await screenshot(buyerPage, "11-buyer-dialog-with-reply");

    if (buyerDialogOpen) {
      const vendorReplyVisible = await dialogHasText(buyerPage, REPLY_MSG);
      log("Buyer sees vendor's reply in the conversation", vendorReplyVisible, vendorReplyVisible ? "" : `looking for: "${REPLY_MSG}"`);

      const ownMsgVisible = await dialogHasText(buyerPage, TEST_MSG);
      log("Buyer's own original message still shows", ownMsgVisible);
    } else {
      log("Buyer can open the conversation", false, "dialog did not open");
      log("Buyer sees vendor's reply in the conversation", false, "dialog did not open");
      log("Buyer's own original message still shows", false, "dialog did not open");
    }
  } else {
    log("Buyer can open the conversation", false, "no conversation found");
    log("Buyer sees vendor's reply in the conversation", false, "skipped");
    log("Buyer's own original message still shows", false, "skipped");
  }

  // ─────────────────────────────────────────────────────────────
  // SUMMARY
  // ─────────────────────────────────────────────────────────────
  console.log("\n─────────────────────────────────────");
  console.log(`RESULTS: ${pass} passed, ${fail} failed`);
  console.log(`Screenshots saved to: ${SCREENSHOTS}/`);
  console.log("─────────────────────────────────────\n");

  await browser.close();
  process.exit(fail > 0 ? 1 : 0);
})();
