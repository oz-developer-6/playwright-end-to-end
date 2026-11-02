export function setupWorker(..._handlers: unknown[]) {
  return {
    start: async () => undefined,
    stop: () => undefined,
  };
}
