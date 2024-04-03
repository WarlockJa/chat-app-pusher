import { decrypt } from "@/util/jwt/decrypt";
import { describe, expect, it } from "vitest";

describe("Testing JWT decrypt function", () => {
  it("should throw an error when not secretKey provded", async () => {
    const input = "validInput";

    // @ts-expect-error
    await expect(decrypt({ input })).rejects.toThrowError();
  });
});
