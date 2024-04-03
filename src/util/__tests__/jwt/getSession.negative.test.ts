// https://github.com/vitest-dev/vitest/issues/4043
// vitest and node environment have different ways of working with Unit8Array
// which causes for the test to fail unless node environment specified
// @vitest-environment node
import { getSession } from "@/util/jwt/getSession";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { loadEnvConfig } from "@next/env";

const mockNegative_SessionValue = undefined;
const mockNegative_ResolvedValue = null;

describe("Testing JWT getSession function", () => {
  beforeEach(() => {
    loadEnvConfig(process.cwd());
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  vi.mock("next/headers", async (importOriginal) => {
    return {
      cookies: () => {
        return {
          // Implement custom logic for get(name) here
          get: (name: string) => {
            // Define the behavior for getting a specific cookie value
            if (name === "pusher-chat") {
              return { value: mockNegative_SessionValue }; // Or any desired value
            } else {
              return undefined;
            }
          },
        };
      },
    };
  });

  it("should return null when no session cookie found", async () => {
    const result = await getSession();
    expect(result).toEqual(mockNegative_ResolvedValue);
  });
});
