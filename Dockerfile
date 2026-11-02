# Official Playwright image: browsers, OS fonts, and system deps stay in lockstep
# with @playwright/test. Pin this tag whenever you bump Playwright.
FROM mcr.microsoft.com/playwright:v1.64.1-noble

WORKDIR /app

ENV CI=true \
    HOME=/root \
    NEXT_TELEMETRY_DISABLED=1

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

CMD ["npx", "playwright", "test"]
