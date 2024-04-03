// https://github.com/vitest-dev/vitest/issues/4043
// vitest and node environment have different ways of working with Unit8Array
// which causes for the test to fail unless node environment specified
// @vitest-environment node
import { getSession } from "@/util/jwt/getSession";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { loadEnvConfig } from "@next/env";

const mockPositive_SessionValue =
  "eyJhbGciOiJIUzI1NiJ9.eyJkYXRhIjoidGVzdCIsImlhdCI6MTcxMjEzNjQ2NywiZXhwIjozMTU3NDcyMTM2NDY3fQ.HFeHZyaZoGu2HuZ4NcvVgfZZx55g2OcYWmaRAo1bsnA";
const mockPositive_ResolvedValue = {
  data: "test",
  exp: 3157472136467,
  iat: 1712136467,
};

describe("Testing JWT getSession function with positive mocks", () => {
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
              return { value: mockPositive_SessionValue }; // Or any desired value
            } else {
              return undefined;
            }
          },
        };
      },
    };
  });

  it("should return a decrypted value", async () => {
    const result = await getSession();
    expect(result).toEqual(mockPositive_ResolvedValue);
  });
});
