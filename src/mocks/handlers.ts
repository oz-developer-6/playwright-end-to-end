import { delay, http, HttpResponse, passthrough } from "msw";
import { MSW_SCENARIO_KEY } from "@/lib/constants";
import type { MswScenario, Transfer } from "@/lib/types";

const mockedTransfers: Transfer[] = [
  {
    id: "tr_mock_harbor",
    recipient: "Mocked Harbor Ops",
    email: "ops@mock.harbor",
    amount: 2400,
    note: "Served by MSW",
    status: "settled",
    createdAt: "2026-10-28T12:00:00.000Z",
  },
];

function currentScenario(): MswScenario {
  if (typeof window === "undefined") return "live";
  const value = window.localStorage.getItem(MSW_SCENARIO_KEY);
  if (value === "server-error" || value === "slow" || value === "live") {
    return value;
  }
  return "live";
}

export const handlers = [
  http.get("/api/transfers", async () => {
    const scenario = currentScenario();
    if (scenario === "live") {
      return passthrough();
    }

    if (scenario === "slow") {
      await delay(2500);
      return HttpResponse.json({ transfers: mockedTransfers });
    }

    return HttpResponse.json(
      {
        error: "Ledger replica is unavailable",
        code: "LEDGER_500",
      },
      { status: 500 },
    );
  }),
];
