import { encrypt } from "@/util/jwt/encrypt";
import { describe, expect, it } from "vitest";

describe("Testing JWT encrypt function", () => {
  it("should throw an error when secretKey is not provided", async () => {
    const payload: { userToken: IAccessToken; expires: Date } = {
      userToken: {
        user_id: "7f6bf857-1f52-40f6-b7c7-399b9b6702d4",
        user_admin: true,
      },
      expires: new Date(Date.now() + 10000),
    };
    // @ts-expect-error
    await expect(encrypt({ payload })).rejects.toThrowError();
  });
});
