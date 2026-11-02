# Harbor — Playwright end-to-end reference

A Next.js App Router ledger used to show how Playwright fits a real product: TypeScript tests, locator-first UI, Mock Service Worker, persistent authentication, CI sharding, and traces on failure.

## Stack

| Layer | Choice |
| --- | --- |
| App | Next.js App Router + TypeScript |
| E2E | `@playwright/test` 1.64.1 |
| Network doubles | MSW in the browser, plus `page.route` |
| Data | `@faker-js/faker` |
| Accessibility | `@axe-core/playwright` |
| Reports | Playwright HTML reporter + `allure-playwright` |
| CI | GitHub Actions, 2 shards, official Playwright Docker image |

Demo login: `demo@harbor.test` / `harbor-demo-1`

## What the tests prove

1. **Persistent authentication** — `e2e/auth.setup.ts` signs in once and writes `playwright/.auth/user.json`. The Chromium project reuses that `storageState` so ledger tests skip the login form.
2. **Multi-tab** — `e2e/multi-tab.spec.ts` clicks **Open statement** (`target="_blank"`) and asserts on the second page in the same context.
3. **Popup SSO** — `e2e/oauth-popup.spec.ts` waits for the Northstar window with `page.waitForEvent('popup')`.
4. **Trace viewer** — CI uses `trace: retain-on-failure`. Failed shards upload `test-results` so you can open the zip in `npx playwright show-trace`.
5. **MSW** — dashboard Network lab / `e2e/mocked-network.spec.ts` force a 500 and a slow ledger without changing API code.
6. **Axe** — home, login, and dashboard are scanned against WCAG 2 A/AA.

## Local

```bash
npm install
npx playwright install chromium
npm run dev
```

App: [http://127.0.0.1:3000](http://127.0.0.1:3000)

```bash
npm run test:e2e
npm run test:e2e:ui
npm run test:e2e:report
```

Allure results land in `allure-results/`. Generate a dashboard with Allure CLI if you want historical HTML (`npx allure generate allure-results --clean -o allure-report`).

## Docker (same browsers as CI)

The image is `mcr.microsoft.com/playwright:v1.64.1-noble`. Keep that tag aligned with `@playwright/test` so local, CI, and Docker do not drift on fonts or browser binaries.

```bash
npm run test:e2e:docker
```

## CI

`.github/workflows/e2e.yml` runs on every pull request:

- builds the Next app
- runs Playwright inside the official container
- shards the suite `--shard=1/2` and `--shard=2/2`
- uploads HTML report, traces, and Allure results

## Layout

```
src/app              Harbor UI + route handlers
src/mocks            MSW handlers (passthrough, 500, slow)
e2e                  Playwright specs and auth setup
playwright.config.ts reporters, webServer, storageState
.github/workflows    sharded PR pipeline
Dockerfile           official Playwright image
```
