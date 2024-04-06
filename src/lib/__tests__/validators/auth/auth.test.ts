import { schemaApiV1AuthPOST } from "@/lib/validators/auth/auth";
import { TSchemaApiV1AuthPost } from "@/lib/validators/auth/generatedTypes";
import { describe, expect, it } from "vitest";

// testing schemaPusherAuthPOST. POST request params validation
const testSchemaApiV1AuthPOST = (params: any) => {
  return schemaApiV1AuthPOST.parse(params);
};

const mockValidParams: TSchemaApiV1AuthPost = {
  user_id: "7f6bf857-1f52-40f6-b7c7-399b9b6702d4",
  user_admin: false,
  signature: "signatureString",
};

describe("Validating schemaApiV1AuthPOST", () => {
  it("should return the parsed params when given a valid params object", () => {
    const result = testSchemaApiV1AuthPOST(mockValidParams);
    expect(result).toEqual(mockValidParams);
  });

  it("should return the parsed params when given a valid params object", () => {
    const params = {
      ...mockValidParams,
      user_admin: "1",
    };

    const result = testSchemaApiV1AuthPOST(params);
    expect(result).toEqual(mockValidParams);
  });

  it("should return the parsed params when given a valid params object", () => {
    const params = {
      ...mockValidParams,
      user_admin: "false",
    };

    const result = testSchemaApiV1AuthPOST(params);
    expect(result).toEqual(mockValidParams);
  });

  it("should return the parsed params when given a valid params object", () => {
    const params = {
      ...mockValidParams,
      user_admin: "true",
    };

    const expectedResult = {
      ...mockValidParams,
      user_admin: true,
    };

    const result = testSchemaApiV1AuthPOST(params);
    expect(result).toEqual(expectedResult);
  });

  it("should throw an error when given an empty params object", () => {
    const params = {};
    expect(() => {
      testSchemaApiV1AuthPOST(params);
    }).toThrow();
  });

  it("should throw an error when given a params object without user_id", () => {
    const params = {
      user_admin: mockValidParams.user_admin,
      signature: mockValidParams.signature,
    };
    expect(() => {
      testSchemaApiV1AuthPOST(params);
    }).toThrow();
  });

  it("should throw an error when given a params object with user_id no UUIDv4", () => {
    const params = {
      user_id: "user_id",
      user_admin: mockValidParams.user_admin,
      signature: mockValidParams.signature,
    };
    expect(() => {
      testSchemaApiV1AuthPOST(params);
    }).toThrow();
  });

  it("should throw an error when given a params object without signature", () => {
    const params = {
      user_id: mockValidParams.user_id,
      user_admin: mockValidParams.user_admin,
    };
    expect(() => {
      testSchemaApiV1AuthPOST(params);
    }).toThrow();
  });
});
