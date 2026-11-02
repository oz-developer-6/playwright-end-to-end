import { faker } from "@faker-js/faker";
import { expect, test } from "@playwright/test";

test.use({ storageState: { cookies: [], origins: [] } });

test("creates a studio account with generated identity data", async ({ page }) => {
  const name = faker.person.fullName();
  const email = faker.internet.email({ provider: "harbor.test" }).toLowerCase();
  const password = faker.internet.password({ length: 12 });

  await page.goto("/signup");
  await page.getByLabel("Full name").fill(name);
  await page.getByLabel("Work email").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Create account" }).click();

  await expect(page).toHaveURL(/\/dashboard/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText(name);
});
