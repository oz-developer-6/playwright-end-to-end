import { expect, test } from "@playwright/test";
import { MSW_FLAG_KEY } from "../src/lib/constants";

test.describe("MSW browser interception", () => {
  test("shows a deterministic 500 from the mock worker", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page.getByText("Aurora Press")).toBeVisible();
    await page.getByRole("button", { name: "500 error" }).click();
    await expect(page.getByRole("alert", { name: "Ledger replica is unavailable" })).toBeVisible();
  });

  test("keeps the reconciling status visible on a slow mock", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page.getByText("Aurora Press")).toBeVisible();
    await page.getByRole("button", { name: "Slow network" }).click();
    await expect(page.getByRole("status")).toHaveText("Reconciling the ledger…");
    await expect(page.getByText("Mocked Harbor Ops")).toBeVisible({ timeout: 10_000 });
  });
});

test.describe("Playwright route mocking", () => {
  test("can empty the ledger without MSW", async ({ page }) => {
    await page.addInitScript(
      ({ key, value }) => localStorage.setItem(key, value),
      { key: MSW_FLAG_KEY, value: "off" },
    );

    await page.route("**/api/transfers", async (route) => {
      if (route.request().method() !== "GET") {
        await route.continue();
        return;
      }
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ transfers: [] }),
      });
    });

    await page.goto("/dashboard");
    await expect(page.getByText("No transfers yet")).toBeVisible();
  });
});
