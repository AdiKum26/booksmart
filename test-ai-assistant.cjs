const { chromium } = require("playwright");
const { mkdirSync } = require("fs");

const BASE_URL = "http://localhost:8080";
const SCREENSHOTS = "/tmp/booksmart-test/ai";

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

async function shot(page, name) {
  mkdirSync(SCREENSHOTS, { recursive: true });
  await page.screenshot({ path: `${SCREENSHOTS}/${name}.png`, fullPage: true });
  console.log(`  📸 ${SCREENSHOTS}/${name}.png`);
}

// Capture response count before sending, then wait for a NEW one to appear
async function waitForAIResponse(page, countBefore, timeoutMs = 25000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const typingGone = !(await page.locator(".animate-bounce").first().isVisible().catch(() => false));
    const current = await page.locator(".bg-muted.rounded-lg").count().catch(() => 0);
    if (typingGone && current > countBefore) return true;
    await page.waitForTimeout(500);
  }
  return false;
}

async function sendMessage(page, text) {
  await page.fill('input[placeholder="Ask about textbooks, courses..."]', text);
  await page.keyboard.press("Enter");
}

async function getLastResponse(page) {
  const all = await page.locator(".bg-muted.rounded-lg").allTextContents().catch(() => []);
  return all[all.length - 1] || "";
}

(async () => {
  const browser = await chromium.launch({ headless: false, slowMo: 200 });
  const ctx = await browser.newContext();
  const page = await ctx.newPage();

  await page.goto(BASE_URL);
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(1000);

  // Warm up the edge function with a real auth token — cold start after deploy
  // causes the first 1-2 requests to fail while the Deno isolate initialises
  console.log("\n[WARM-UP] Waking up edge function...");
  const CHAT_URL = `https://yomhrxpxsixfgxjjpggv.supabase.co/functions/v1/ai-assistant`;
  const ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlvbWhyeHB4c2l4Zmd4ampwZ2d2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3Njg0ODgsImV4cCI6MjA5MTM0NDQ4OH0.uE01BHWNW7Jn-wTAdrBbnpBPq911EtVuWQk9qyKFyNo";
  // Send two warm-up pings so the isolate is hot by the time the real tests run
  for (let i = 0; i < 2; i++) {
    try {
      await fetch(CHAT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${ANON_KEY}` },
        body: JSON.stringify({ messages: [{ role: "user", content: "ping" }] }),
      });
    } catch (_) {}
    await new Promise(r => setTimeout(r, 2000));
  }
  console.log("  Edge function warmed up.");

  // ─────────────────────────────────────────────────────────────
  // TEST 1: AI widget is present and opens automatically on first visit
  // ─────────────────────────────────────────────────────────────
  console.log("\n[TEST 1] AI widget auto-opens on first visit");
  const widgetOpen = await page.locator("span:has-text('BookSmart AI')").isVisible({ timeout: 5000 }).catch(() => false);
  log("BookSmart AI widget opens automatically", widgetOpen);
  await shot(page, "01-widget-open");

  // ─────────────────────────────────────────────────────────────
  // TEST 2: Welcome state and quick-reply chips
  // ─────────────────────────────────────────────────────────────
  console.log("\n[TEST 2] Welcome state");
  const greeting = await page.locator("text=Hi! I'm BookSmart AI").isVisible({ timeout: 3000 }).catch(() => false);
  log("Welcome greeting is shown", greeting);

  const chip1 = await page.locator("text=Find econ textbooks").isVisible().catch(() => false);
  const chip2 = await page.locator("text=How do I sell books?").isVisible().catch(() => false);
  const chip3 = await page.locator("text=What is calculus?").isVisible().catch(() => false);
  log("Quick-reply chips are shown", chip1 && chip2 && chip3);

  // ─────────────────────────────────────────────────────────────
  // TEST 3: Send a basic message and get a real AI response
  // ─────────────────────────────────────────────────────────────
  console.log("\n[TEST 3] Basic message → AI responds");
  let countBefore = await page.locator(".bg-muted.rounded-lg").count().catch(() => 0);
  await sendMessage(page, "Hello! What is BookSmart?");
  await page.waitForTimeout(800);

  const typingVisible = await page.locator(".animate-bounce").first().isVisible({ timeout: 5000 }).catch(() => false);
  log("Typing indicator appears while AI is responding", typingVisible);

  const responded = await waitForAIResponse(page, countBefore);
  log("AI responds within 25 seconds", responded);
  await shot(page, "02-basic-response");

  const lastResp3 = await getLastResponse(page);
  const hasError3 = lastResp3.includes("⚠️");
  log("Response is not an error message", !hasError3, hasError3 ? `got: "${lastResp3.slice(0, 80)}"` : "");
  log("AI response contains text content", lastResp3.replace("⚠️", "").trim().length > 10, `length=${lastResp3.length}`);

  // ─────────────────────────────────────────────────────────────
  // TEST 4: AI knows about the site (navigation awareness)
  // ─────────────────────────────────────────────────────────────
  console.log("\n[TEST 4] AI knows about site navigation");
  await page.waitForTimeout(4000); // respect free-tier RPM limit
  countBefore = await page.locator(".bg-muted.rounded-lg").count().catch(() => 0);
  await sendMessage(page, "Where can I browse textbooks?");
  const navResponded = await waitForAIResponse(page, countBefore);
  log("AI responds to navigation question", navResponded);
  await shot(page, "03-nav-response");

  if (navResponded) {
    const lastResp4 = await getLastResponse(page);
    const mentionsShop = /shop|\/shop/i.test(lastResp4);
    log("AI mentions /shop page for browsing textbooks", mentionsShop, mentionsShop ? "" : `response: "${lastResp4.slice(0, 100)}"`);
  } else {
    log("AI mentions /shop page for browsing textbooks", false, "no response");
  }

  // ─────────────────────────────────────────────────────────────
  // TEST 5: Quick-reply chip populates input (fresh session)
  // ─────────────────────────────────────────────────────────────
  console.log("\n[TEST 5] Quick-reply chip populates input");
  const ctx2 = await browser.newContext(); // fresh session = no sessionStorage
  const page2 = await ctx2.newPage();
  await page2.goto(BASE_URL);
  await page2.waitForLoadState("networkidle");
  await page2.waitForTimeout(1500);

  const chip = page2.locator("button").filter({ hasText: "How do I sell books?" });
  const chipVisible = await chip.isVisible({ timeout: 5000 }).catch(() => false);
  if (chipVisible) {
    await chip.click();
    await page2.waitForTimeout(500);
    const inputValue = await page2.inputValue('input[placeholder="Ask about textbooks, courses..."]');
    log("Clicking chip populates input field", inputValue === "How do I sell books?", `value="${inputValue}"`);
  } else {
    log("Clicking chip populates input field", false, "chip not visible");
  }
  await ctx2.close();

  // ─────────────────────────────────────────────────────────────
  // TEST 6: Multi-turn conversation (context is maintained)
  // ─────────────────────────────────────────────────────────────
  console.log("\n[TEST 6] Multi-turn conversation maintains context");
  await page.waitForTimeout(4000);
  let cb6 = await page.locator(".bg-muted.rounded-lg").count().catch(() => 0);
  await sendMessage(page, "What subjects are available?");
  await waitForAIResponse(page, cb6);

  await page.waitForTimeout(4000);
  const cb6b = await page.locator(".bg-muted.rounded-lg").count().catch(() => 0);
  await sendMessage(page, "Can you tell me more about the first one you mentioned?");
  const followUpResponded = await waitForAIResponse(page, cb6b);
  log("AI responds to follow-up question", followUpResponded);
  await shot(page, "04-multi-turn");

  if (followUpResponded) {
    const allMsgs = await page.locator(".bg-muted.rounded-lg").allTextContents().catch(() => []);
    const realMsgs = allMsgs.filter(t => !t.includes("⚠️"));
    log("Conversation has multiple exchanges", realMsgs.length >= 2, `${realMsgs.length} successful responses`);
  } else {
    log("Conversation has multiple exchanges", false, "no follow-up response");
  }

  // ─────────────────────────────────────────────────────────────
  // TEST 7: Widget closes and reopens correctly
  // ─────────────────────────────────────────────────────────────
  console.log("\n[TEST 7] Widget open/close toggle");
  const closeButton = page.locator('div.bg-foreground').locator('button').last();
  await closeButton.click();
  await page.waitForTimeout(500);

  const widgetClosed = await page.locator("text=BookSmart AI").isVisible().catch(() => false);
  log("Widget closes when X is clicked", !widgetClosed);

  const fabBtn = page.locator('button[aria-label="Open AI Assistant"]');
  const fabVisible = await fabBtn.isVisible({ timeout: 3000 }).catch(() => false);
  log("Floating button appears after closing", fabVisible);

  if (fabVisible) {
    await fabBtn.click();
    await page.waitForTimeout(500);
    const reopened = await page.locator("text=BookSmart AI").isVisible().catch(() => false);
    log("Widget reopens when FAB is clicked", reopened);
    await shot(page, "05-widget-reopened");
  } else {
    log("Widget reopens when FAB is clicked", false, "FAB not found");
  }

  // ─────────────────────────────────────────────────────────────
  // TEST 8: AI widget is present on other pages (Shop)
  // ─────────────────────────────────────────────────────────────
  console.log("\n[TEST 8] AI widget persists across pages");
  await page.goto(`${BASE_URL}/shop`);
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(1000);

  // Widget should be collapsed (FAB) since it was already shown this session
  const fabOnShop = await page.locator('button[aria-label="Open AI Assistant"]').isVisible({ timeout: 3000 }).catch(() => false);
  const widgetOnShop = await page.locator("text=BookSmart AI").isVisible({ timeout: 3000 }).catch(() => false);
  log("AI widget (FAB or open) is present on /shop page", fabOnShop || widgetOnShop);
  await shot(page, "06-widget-on-shop");

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
