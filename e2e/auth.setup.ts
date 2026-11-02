import { expect, test as setup } from "@playwright/test";
import { DEMO_USER } from "../src/lib/constants";

const authFile = "playwright/.auth/user.json";

setup("authenticate once and persist storageState", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("Work email").fill(DEMO_USER.email);
  await page.getByLabel("Password").fill(DEMO_USER.password);
  await page.getByRole("button", { name: "Sign in to Harbor" }).click();
  await expect(page).toHaveURL(/\/dashboard/);
  await expect(page.getByRole("heading", { name: "Welcome back, Mira Chen"})).toBeVisible();
  await page.context().storageState({ path: authFile });
});
