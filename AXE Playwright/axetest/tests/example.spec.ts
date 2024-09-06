import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("homepage", () => {
  test("should not have any automatically detectable accessibility issues", async({ page }) => {
    await page.goto("https://www.w3.org/WAI/demos/bad/Overview.html");
    const axeBuilder = await new AxeBuilder({ page })
    .withTags("#meta-header").analyze();
    expect(axeBuilder.violations).toEqual([]);
  });
});



