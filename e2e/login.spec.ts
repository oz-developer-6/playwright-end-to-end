import { expect, test } from "@playwright/test";
import { DEMO_USER } from "../src/lib/constants";

test.use({ storageState: { cookies: [], origins: [] } });

test("rejects an unknown password", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("Work email").fill(DEMO_USER.email);
  await page.getByLabel("Password").fill("not-the-password");
  await page.getByRole("button", { name: "Sign in to Harbor" }).click();
  await expect(page.getByRole("alert", { name: /Those credentials do not match/ })).toBeVisible();
  await expect(page).toHaveURL(/\/login/);
});

test("signs in with the demo account using labelled fields", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("Work email").fill(DEMO_USER.email);
  await page.getByLabel("Password").fill(DEMO_USER.password);
  await page.getByRole("button", { name: "Sign in to Harbor" }).click();
  await expect(page.getByRole("heading", { name: /Welcome back, Mira Chen/ })).toBeVisible();
});
