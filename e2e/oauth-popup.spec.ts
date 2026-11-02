import { expect, test } from "@playwright/test";
import { SSO_USER } from "../src/lib/constants";

test.use({ storageState: { cookies: [], origins: [] } });

test("completes Northstar SSO inside a popup window", async ({ page }) => {
  await page.goto("/login");

  const popupPromise = page.waitForEvent("popup");
  await page.getByRole("button", { name: "Continue with Northstar SSO" }).click();
  const popup = await popupPromise;

  await expect(popup.getByRole("heading", { name: "Approve Harbor access" })).toBeVisible();
  await popup.getByRole("button", { name: "Approve access" }).click();

  await expect(page).toHaveURL(/\/dashboard/);
  await expect(
    page.getByRole("heading", { name: `Welcome back, ${SSO_USER.name}` }),
  ).toBeVisible();
});
