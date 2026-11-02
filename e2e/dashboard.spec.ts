import { expect, test } from "@playwright/test";

test("reuses the saved session and never visits login", async ({ page }) => {
  await page.goto("/dashboard");
  await expect(page.getByRole("heading", { name: /Welcome back, Mira Chen/ })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Recent transfers" })).toBeVisible();
  await expect(page.getByText("Aurora Press")).toBeVisible();
  await expect(page).not.toHaveURL(/\/login/);
});
