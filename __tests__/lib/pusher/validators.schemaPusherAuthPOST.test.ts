import { schemaApiV1PusherAuthPOST } from "@/lib/validators/pusher/auth";
import { describe, expect, it } from "vitest";

// testing schemaPusherAuthPOST. POST request params validation
const testSchemaPusherAuthPost = (params: any) => {
  return schemaApiV1PusherAuthPOST.parse(params);
};

describe("Validating schemaPusherAuthPOST", () => {
  it("should return the parsed params when given a valid params object", () => {
    const params = {
      socket_id: "socket_id",
      channel_name: "channel_name",
      user_id: "abc123",
      user_admin: "false",
      user_name: "abc123",
    };
    const expectedResult = {
      socket_id: "socket_id",
      channel_name: "channel_name",
      user_id: "abc123",
      user_admin: false,
      user_name: "abc123",
    };

    const result = testSchemaPusherAuthPost(params);
    expect(result).toEqual(expectedResult);
  });

  it("should return the parsed params when given a valid params object", () => {
    const params = {
      socket_id: "socket_id",
      channel_name: "channel_name",
      user_id: "abc123",
      user_admin: "0",
      user_name: "abc123",
    };
    const expectedResult = {
      socket_id: "socket_id",
      channel_name: "channel_name",
      user_id: "abc123",
      user_admin: false,
      user_name: "abc123",
    };

    const result = testSchemaPusherAuthPost(params);
    expect(result).toEqual(expectedResult);
  });

  it("should return the parsed params when given a valid params object", () => {
    const params = {
      socket_id: "socket_id",
      channel_name: "channel_name",
      user_id: "abc123",
      user_admin: "true",
      user_name: "abc123",
    };
    const expectedResult = {
      socket_id: "socket_id",
      channel_name: "channel_name",
      user_id: "abc123",
      user_admin: true,
      user_name: "abc123",
    };

    const result = testSchemaPusherAuthPost(params);
    expect(result).toEqual(expectedResult);
  });

  it("should throw an error when given an empty params object", () => {
    const params = {};
    expect(() => {
      testSchemaPusherAuthPost(params);
    }).toThrow();
  });

  it("should throw an error when given a params object without channel_name", () => {
    const params = {
      socket_id: "socket_id",
      user_id: "abc123",
      user_admin: "0",
      user_name: "abc123",
    };
    expect(() => {
      testSchemaPusherAuthPost(params);
    }).toThrow();
  });

  it("should throw an error when given a params object without user_id", () => {
    const params = {
      socket_id: "socket_id",
      channel_name: "channel_name",
      user_admin: "0",
      user_name: "abc123",
    };
    expect(() => {
      testSchemaPusherAuthPost(params);
    }).toThrow();
  });

  it("should throw an error when given a params object with special characters for user_id", () => {
    const params = {
      socket_id: "socket_id",
      channel_name: "channel_name",
      user_id: "abc@123",
      user_admin: "0",
      user_name: "abc123",
    };
    expect(() => {
      testSchemaPusherAuthPost(params);
    }).toThrow();
  });

  it("should throw an error when given a params object with a user_id longer than 36 characters", () => {
    const params = {
      socket_id: "socket_id",
      channel_name: "channel_name",
      user_id: "a".repeat(37),
      user_admin: "0",
      user_name: "abc123",
    };
    expect(() => {
      testSchemaPusherAuthPost(params);
    }).toThrow();
  });

  it("should throw an error when given a params object with an empty string for user_id", () => {
    const params = {
      socket_id: "socket_id",
      channel_name: "channel_name",
      user_id: "",
      user_admin: "0",
      user_name: "abc123",
    };
    expect(() => testSchemaPusherAuthPost(params)).toThrow();
  });
});
