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
      user_id: "7f6bf857-1f52-40f6-b7c7-399b9b6702d4",
      user_admin: "false",
      user_name: "abc123",
    };
    const expectedResult = {
      socket_id: "socket_id",
      channel_name: "channel_name",
      user_id: "7f6bf857-1f52-40f6-b7c7-399b9b6702d4",
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
      user_id: "7f6bf857-1f52-40f6-b7c7-399b9b6702d4",
      user_admin: "0",
      user_name: "abc123",
    };
    const expectedResult = {
      socket_id: "socket_id",
      channel_name: "channel_name",
      user_id: "7f6bf857-1f52-40f6-b7c7-399b9b6702d4",
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
      user_id: "7f6bf857-1f52-40f6-b7c7-399b9b6702d4",
      user_admin: "true",
      user_name: "abc123",
    };
    const expectedResult = {
      socket_id: "socket_id",
      channel_name: "channel_name",
      user_id: "7f6bf857-1f52-40f6-b7c7-399b9b6702d4",
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
      user_id: "7f6bf857-1f52-40f6-b7c7-399b9b6702d4",
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

  it("should throw an error when given a params object with user_id no UUIDv4", () => {
    const params = {
      socket_id: "socket_id",
      user_id: "abc123",
      channel_name: "channel_name",
      user_admin: "0",
      user_name: "abc123",
    };
    expect(() => {
      testSchemaPusherAuthPost(params);
    }).toThrow();
  });

  it("should throw an error when given a params object without user_name", () => {
    const params = {
      socket_id: "socket_id",
      user_id: "7f6bf857-1f52-40f6-b7c7-399b9b6702d4",
      channel_name: "channel_name",
      user_admin: "0",
    };
    expect(() => {
      testSchemaPusherAuthPost(params);
    }).toThrow();
  });

  it("should throw an error when given a params object with user_name shorter than 3 characters", () => {
    const params = {
      socket_id: "socket_id",
      user_id: "7f6bf857-1f52-40f6-b7c7-399b9b6702d4",
      channel_name: "channel_name",
      user_admin: "0",
      user_name: "ab",
    };
    expect(() => {
      testSchemaPusherAuthPost(params);
    }).toThrow();
  });

  it("should throw an error when given a params object with user_name longer than 36 characters", () => {
    const params = {
      socket_id: "socket_id",
      user_id: "7f6bf857-1f52-40f6-b7c7-399b9b6702d4",
      channel_name: "channel_name",
      user_admin: "0",
      user_name: "a".repeat(37),
    };
    expect(() => {
      testSchemaPusherAuthPost(params);
    }).toThrow();
  });
});
