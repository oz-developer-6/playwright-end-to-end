import { expect, test } from "@playwright/test";

test("opens a statement in a second tab from the same browser context", async ({
  page,
  context,
}) => {
  await page.goto("/dashboard");
  await expect(page.getByText("Aurora Press")).toBeVisible();

  const statementPromise = context.waitForEvent("page");
  await page
    .getByRole("row", { name: /Aurora Press/ })
    .getByRole("link", { name: "Open statement" })
    .click();
  const statement = await statementPromise;

  await expect(statement.getByRole("heading", { name: "Statement" })).toBeVisible();
  await expect(statement.getByText("Aurora Press")).toBeVisible();
  await expect(statement.getByText("Print run 48")).toBeVisible();
});
