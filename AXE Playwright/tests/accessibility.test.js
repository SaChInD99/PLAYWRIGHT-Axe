import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { createHtmlReport } from 'axe-html-reporter';
const fs = require('fs');

test.describe("homepage", () => {

  //General Accessibility Check

  // Test Case 1: Check for ARIA roles and attributes
  test("should not have any ARIA role or attribute violations", async ({ page }, testInfo) => {
    await page.goto("https://qa.insights2.wiley.com/");

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withRules(["aria-allowed-attr", "aria-required-attr", "aria-required-children", "aria-required-parent", "aria-roles", "aria-valid-attr-value", "aria-valid-attr"])
      .analyze();

    await testInfo.attach("aria-scan-results", {
      body: JSON.stringify(accessibilityScanResults, null, 2),
      contentType: "application/json",
    });

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  // Test Case 2: Check for color contrast issues
  test("should not have any color contrast issues", async ({ page }, testInfo) => {
    await page.goto("https://qa.insights2.wiley.com/");

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(["color-contrast"])
      .analyze();

    await testInfo.attach("color-contrast-scan-results", {
      body: JSON.stringify(accessibilityScanResults, null, 2),
      contentType: "application/json",
    });

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  // Test Case 3: Check for form-related accessibility issues
  test("should not have any form accessibility issues", async ({ page }, testInfo) => {
    await page.goto("https://qa.insights2.wiley.com/");

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withRules(["label", "form-field-multiple-labels", "form-field-multiple-labels"]) // form-related rules
      .analyze();

    await testInfo.attach("form-accessibility-scan-results", {
      body: JSON.stringify(accessibilityScanResults, null, 2),
      contentType: "application/json",
    });
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  // Test Case 4: Check for issues related to interactive elements
  test("should not have any issues with interactive elements", async ({ page }, testInfo) => {
    await page.goto("https://qa.insights2.wiley.com/");

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withRules(["button-name", "link-name", "accesskeys"])
      .analyze();

    await testInfo.attach("interactive-elements-scan-results", {
      body: JSON.stringify(accessibilityScanResults, null, 2),
      contentType: "application/json",
    });

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  //Test Case 5: Check for accessibility issues on a specific section of the page
  test("should not have any accessibility issues in the main content section", async ({ page }, testInfo) => {
    await page.goto("https://qa.insights2.wiley.com/");

    const mainContentSelector = "/html/body/div[1]/main/header[1]"; // Replace with the actual selector for the main content

    const accessibilityScanResults = await new AxeBuilder({ page })
      .include(mainContentSelector)
      .analyze();

    await testInfo.attach("main-content-scan-results", {
      body: JSON.stringify(accessibilityScanResults, null, 2),
      contentType: "application/json",
    });

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should not have any automatically detectable accessibility issues', async ({ page }, testInfo) => {
    await page.goto('https://qa.insights2.wiley.com/');
  
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();
  
    // Filter out known issues
    const filteredResults = {
      ...accessibilityScanResults,
      violations: accessibilityScanResults.violations.filter(
        violation => violation.id !== 'document-title'
      )
    };
  
    await testInfo.attach('accessibility-scan-results', {
      body: JSON.stringify(filteredResults, null, 2),
      contentType: 'application/json',
    });
  
    expect(filteredResults.violations).toEqual([]);
  });

  test("should not have any automatically detectable accessibility issues(checking the known issue)", async ({ page }, testInfo) => {
    await page.goto("https://qa.insights2.wiley.com/");

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .analyze();

    await testInfo.attach("accessibility-scan-results", {
      body: JSON.stringify(accessibilityScanResults, null, 2),
      contentType: "application/json",
    });

    expect(accessibilityScanResults.violations).toEqual([]);
  });

 test("should ensure all interactive elements are keyboard accessible", async ({ page }, testInfo) => {
  await page.goto("https://qa.insights2.wiley.com/");

  const accessibilityScanResults = await new AxeBuilder({ page })
    .withRules(["tabindex"])
    .analyze();

  await testInfo.attach("keyboard-accessibility-scan-results", {
    body: JSON.stringify(accessibilityScanResults, null, 2),
    contentType: "application/json",
  });

  expect(accessibilityScanResults.violations).toEqual([]);
});
  
  test("should ensure all images have appropriate alt attributes", async ({ page }, testInfo) => {
    await page.goto("https://qa.insights2.wiley.com/");
  
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withRules(["image-alt", "image-redundant-alt"])
      .analyze();
  
    await testInfo.attach("image-accessibility-scan-results", {
      body: JSON.stringify(accessibilityScanResults, null, 2),
      contentType: "application/json",
    });
  
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("should ensure proper heading structure", async ({ page }, testInfo) => {
    await page.goto("https://qa.insights2.wiley.com/");
  
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withRules(["heading-order"])
      .analyze();
  
    await testInfo.attach("heading-structure-scan-results", {
      body: JSON.stringify(accessibilityScanResults, null, 2),
      contentType: "application/json",
    });
  
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("should ensure links have a clear purpose", async ({ page }, testInfo) => {
    await page.goto("https://qa.insights2.wiley.com/");
  
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withRules(["link-name"])
      .analyze();
  
    await testInfo.attach("link-purpose-scan-results", {
      body: JSON.stringify(accessibilityScanResults, null, 2),
      contentType: "application/json",
    });
  
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("should ensure semantic HTML is used", async ({ page }, testInfo) => {
    await page.goto("https://qa.insights2.wiley.com/");
  
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withRules(["region", "landmark-one-main"])
      .analyze();
  
    await testInfo.attach("semantic-html-scan-results", {
      body: JSON.stringify(accessibilityScanResults, null, 2),
      contentType: "application/json",
    });
  
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("should ensure multimedia elements are accessible", async ({ page }, testInfo) => {
    await page.goto("https://qa.insights2.wiley.com/");
  
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withRules(["video-caption", "audio-caption"])
      .analyze();
  
    await testInfo.attach("multimedia-scan-results", {
      body: JSON.stringify(accessibilityScanResults, null, 2),
      contentType: "application/json",
    });
  
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("should ensure compatibility with screen readers", async ({ page }, testInfo) => {
    await page.goto("https://qa.insights2.wiley.com/");
  
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withRules(["aria-roles", "aria-allowed-attr", "aria-valid-attr", "aria-valid-attr-value"])
      .analyze();
  
    await testInfo.attach("screen-reader-scan-results", {
      body: JSON.stringify(accessibilityScanResults, null, 2),
      contentType: "application/json",
    });
  
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('Verify there is no accessibility issues', async ({ page }) => {

    await page.goto("https://qa.insights2.wiley.com/");

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

    const reportHTML = createHtmlReport({
      results: accessibilityScanResults,
      options: {
        projectKey: "WJI Homepage"
      },
    });

    if (!fs.existsSync("build/reports/accessibility-report.html")) {
      fs.mkdirSync("build/reports", {
        recursive: true,
      });
    }
    fs.writeFileSync("build/reports/accessibility-report.html", reportHTML);

    expect(accessibilityScanResults.violations).toEqual([]);


  });

  test("should have skip navigation links for easier navigation", async ({ page }, testInfo) => {
    await page.goto("https://qa.insights2.wiley.com/");
  
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withRules(["bypass"])
      .analyze();
  
    await testInfo.attach("skip-navigation-scan-results", {
      body: JSON.stringify(accessibilityScanResults, null, 2),
      contentType: "application/json",
    });
  
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("should ensure a skip link is present", async ({ page }, testInfo) => {
    await page.goto("https://qa.insights2.wiley.com/");
  
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withRules(["skip-link"])
      .analyze();
  
    await testInfo.attach("skip-link-scan-results", {
      body: JSON.stringify(accessibilityScanResults, null, 2),
      contentType: "application/json",
    });
  
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("should identify and recover from input errors", async ({ page }, testInfo) => {
    await page.goto("https://qa.insights2.wiley.com/");
  
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withRules(["aria-required-attr", "label"])
      .analyze();
  
    await testInfo.attach("error-identification-scan-results", {
      body: JSON.stringify(accessibilityScanResults, null, 2),
      contentType: "application/json",
    });
  
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("should ensure aria-live regions are used correctly", async ({ page }, testInfo) => {
    await page.goto("https://qa.insights2.wiley.com/");
  
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withRules(["aria-roles", "aria-valid-attr", "aria-valid-attr-value"])
      .analyze();
  
    await testInfo.attach("aria-live-scan-results", {
      body: JSON.stringify(accessibilityScanResults, null, 2),
      contentType: "application/json",
    });
  
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("should ensure custom controls are accessible", async ({ page }, testInfo) => {
    await page.goto("https://qa.insights2.wiley.com/");
  
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withRules(["aria-roles", "aria-valid-attr", "aria-valid-attr-value"])
      .analyze();
  
    await testInfo.attach("custom-controls-scan-results", {
      body: JSON.stringify(accessibilityScanResults, null, 2),
      contentType: "application/json",
    });
  
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("should ensure ARIA landmarks are used correctly", async ({ page }, testInfo) => {
    await page.goto("https://qa.insights2.wiley.com/");
  
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withRules(["region", "landmark-one-main", "landmark-no-duplicate-banner", "landmark-no-duplicate-contentinfo"])
      .analyze();
  
    await testInfo.attach("aria-landmarks-scan-results", {
      body: JSON.stringify(accessibilityScanResults, null, 2),
      contentType: "application/json",
    });
  
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("should ensure modal dialogs are accessible", async ({ page }, testInfo) => {
    await page.goto("https://qa.insights2.wiley.com/");
  
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withRules(["aria-allowed-role", "aria-required-children", "aria-required-parent", "aria-valid-attr-value", "aria-valid-attr"])
      .analyze();
  
    await testInfo.attach("modal-dialogs-scan-results", {
      body: JSON.stringify(accessibilityScanResults, null, 2),
      contentType: "application/json",
    });
  
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("should ensure data tables are accessible", async ({ page }, testInfo) => {
    await page.goto("https://qa.insights2.wiley.com/");
  
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withRules(["th-has-data-cells", "td-headers-attr"])
      .analyze();
  
    await testInfo.attach("data-tables-scan-results", {
      body: JSON.stringify(accessibilityScanResults, null, 2),
      contentType: "application/json",
    });
  
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("should ensure SVG elements are accessible", async ({ page }, testInfo) => {
    await page.goto("https://qa.insights2.wiley.com/");
  
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withRules(["image-alt"])
      .analyze();
  
    await testInfo.attach("svg-elements-scan-results", {
      body: JSON.stringify(accessibilityScanResults, null, 2),
      contentType: "application/json",
    });
  
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  // test("should ensure iframes are accessible", async ({ page }, testInfo) => {
  //   await page.goto("https://qa.insights2.wiley.com/");
  
  //   const accessibilityScanResults = await new AxeBuilder({ page })
  //     .withRules(["iframe-title"])
  //     .analyze();
  
  //   await testInfo.attach("iframes-scan-results", {
  //     body: JSON.stringify(accessibilityScanResults, null, 2),
  //     contentType: "application/json",
  //   });
  
  //   expect(accessibilityScanResults.violations).toEqual([]);
  // });

  test("should ensure forms are accessible", async ({ page }, testInfo) => {
    await page.goto("https://qa.insights2.wiley.com/");
  
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withRules(["form-labels"])
      .analyze();
  
    await testInfo.attach("forms-scan-results", {
      body: JSON.stringify(accessibilityScanResults, null, 2),
      contentType: "application/json",
    });
  
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("should ensure custom controls (e.g., sliders) are accessible", async ({ page }, testInfo) => {
    await page.goto("https://qa.insights2.wiley.com/");
  
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withRules(["custom-controls"])
      .analyze();
  
    await testInfo.attach("custom-controls-accessibility-scan-results", {
      body: JSON.stringify(accessibilityScanResults, null, 2),
      contentType: "application/json",
    });
  
    expect(accessibilityScanResults.violations).toEqual([]);
  });

});

