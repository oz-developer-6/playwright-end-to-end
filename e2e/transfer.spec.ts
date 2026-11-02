import { faker } from "@faker-js/faker";
import { expect, test } from "@playwright/test";

test("posts a transfer with faker-generated payee data", async ({ page }) => {
  const recipient = faker.company.name();
  const email = faker.internet.email({ provider: "payee.test" }).toLowerCase();
  const amount = faker.number.int({ min: 25, max: 900 });
  const note = faker.lorem.words(3);

  await page.goto("/dashboard/transfer");
  await page.getByLabel("Recipient name").fill(recipient);
  await page.getByLabel("Recipient email").fill(email);
  await page.getByLabel("Amount (USD)").fill(String(amount));
  await page.getByLabel("Note").fill(note);
  await page.getByRole("button", { name: "Post transfer" }).click();

  await expect(page).toHaveURL(/\/dashboard/);
  await expect(page.getByText(recipient)).toBeVisible();
  await expect(page.getByText(note)).toBeVisible();
});
