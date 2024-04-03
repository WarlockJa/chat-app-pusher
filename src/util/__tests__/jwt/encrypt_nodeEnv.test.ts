// https://github.com/vitest-dev/vitest/issues/4043
// vitest and node environment have different ways of working with Unit8Array
// which causes for the test to fail unless node environment specified
// @vitest-environment node
import { encrypt } from "@/util/jwt/encrypt";
import { describe, expect, it } from "vitest";

describe("Testing JWT encrypt function with vitest node environment", () => {
  it("should encrypt payload when secret key is provided", async () => {
    const secretKey = "secret";
    const payload: { userToken: IAccessToken; expires: Date } = {
      userToken: {
        user_id: "7f6bf857-1f52-40f6-b7c7-399b9b6702d4",
        user_admin: true,
      },
      expires: new Date(Date.now() + 10000),
    };
    const result = await encrypt({ payload, secretKey });
    expect(result).toBeDefined();
  });

  it("should encrypt undefined when payload is not provided", async () => {
    const secretKey = "secret";
    // @ts-expect-error
    expect(encrypt({ secretKey })).toBeDefined();
  });
});
