// https://github.com/vitest-dev/vitest/issues/4043
// vitest and node environment have different ways of working with Unit8Array
// which causes for the test to fail unless node environment specified
// @vitest-environment node
import { decrypt } from "@/util/jwt/decrypt";
import { describe, expect, it } from "vitest";

describe("Testing JWT decrypt function with vitest node environment", () => {
  it("should encrypt payload when secret key is provided", async () => {
    const secretKey = "secretKey";
    const input =
      "eyJhbGciOiJIUzI1NiJ9.eyJkYXRhIjoidGVzdCIsImlhdCI6MTcxMjEzNjQ2NywiZXhwIjozMTU3NDcyMTM2NDY3fQ.HFeHZyaZoGu2HuZ4NcvVgfZZx55g2OcYWmaRAo1bsnA";
    const result = await decrypt({ input, secretKey });
    expect(result).toBeDefined();
  });

  it("should encrypt undefined when payload is not provided", async () => {
    const secretKey = "secretKey";
    // @ts-expect-error
    expect(decrypt({ secretKey })).rejects.toThrowError();
  });
});
