import { schemaChatProps } from "@/lib/validators/chatprops/chatprops";
import { TSchemaChatProps } from "@/lib/validators/chatprops/generatedTypes";
import { describe, expect, it } from "vitest";

// testing schemaPusherAuthPOST. POST request params validation
const testSchemaChatProps = (params: any) => {
  return schemaChatProps.parse(params);
};

const mockValidParams: TSchemaChatProps = {
  user_id: "7f6bf857-1f52-40f6-b7c7-399b9b6702d4",
  user_admin: false,
  user_name: "Test User",
};

describe("Validating schemaChatProps", () => {
  it("should return the parsed params when given a valid params object", () => {
    const result = testSchemaChatProps(mockValidParams);
    expect(result).toEqual(mockValidParams);
  });

  it("should return the parsed params when given a valid params object", () => {
    const params = {
      ...mockValidParams,
      user_admin: "0",
    };

    const result = testSchemaChatProps(params);
    expect(result).toEqual(mockValidParams);
  });

  it("should return the parsed params when given a valid params object", () => {
    const params = {
      ...mockValidParams,
      user_admin: "false",
    };

    const result = testSchemaChatProps(params);
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

    const result = testSchemaChatProps(params);
    expect(result).toEqual(expectedResult);
  });

  it("should throw an error when given an empty params object", () => {
    const params = {};
    expect(() => {
      testSchemaChatProps(params);
    }).toThrow();
  });

  it("should throw an error when given a params object without user_id", () => {
    const params = {
      user_admin: mockValidParams.user_admin,
      user_name: mockValidParams.user_name,
    };
    expect(() => {
      testSchemaChatProps(params);
    }).toThrow();
  });

  it("should throw an error when given a params object with user_id no UUIDv4", () => {
    const params = {
      user_id: "user_id",
      user_admin: mockValidParams.user_admin,
      user_name: mockValidParams.user_name,
    };
    expect(() => {
      testSchemaChatProps(params);
    }).toThrow();
  });

  it("should throw an error when given a params object without user_admin", () => {
    const params = {
      user_id: mockValidParams.user_id,
      user_name: mockValidParams.user_name,
    };
    expect(() => {
      testSchemaChatProps(params);
    }).toThrow();
  });

  it("should throw an error when given a params object without user_name", () => {
    const params = {
      user_id: mockValidParams.user_id,
      user_admin: mockValidParams.user_admin,
    };
    expect(() => {
      testSchemaChatProps(params);
    }).toThrow();
  });

  it("should throw an error when user_name is less than 3 characters", () => {
    const params = {
      user_name: "Ab",
      user_id: mockValidParams.user_id,
      user_admin: mockValidParams.user_admin,
    };
    expect(() => {
      testSchemaChatProps(params);
    }).toThrow();
  });

  it("should throw an error when user_name is longer than 36 characters", () => {
    const params = {
      user_name: "A".repeat(37),
      user_id: mockValidParams.user_id,
      user_admin: mockValidParams.user_admin,
    };
    expect(() => {
      testSchemaChatProps(params);
    }).toThrow();
  });
});
