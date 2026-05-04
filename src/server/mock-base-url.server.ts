import { getRequest } from "@tanstack/react-start/server";

export function setMockBaseUrlFromRequest() {
  try {
    const req = getRequest();
    if (req?.url) {
      (globalThis as { __MOCK_BASE_URL__?: string }).__MOCK_BASE_URL__ =
        new URL(req.url).origin;
    }
  } catch {
    // ignore
  }
}
