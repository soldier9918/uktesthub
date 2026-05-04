import { createIsomorphicFn } from "@tanstack/react-start";
import { setMockBaseUrlFromRequest } from "./mock-base-url.server";

export const captureMockBaseUrl = createIsomorphicFn()
  .client(() => {})
  .server(() => setMockBaseUrlFromRequest());
