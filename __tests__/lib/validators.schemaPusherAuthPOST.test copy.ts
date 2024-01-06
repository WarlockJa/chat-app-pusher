import {
  schemaApiDBPOST,
  schemaApiDBGET,
  schemaPusherAuthPOST,
} from "@/lib/validators";
import { describe, expect, it } from "vitest";

// testing schemaPusherAuthPOST. POST request params validation
const testSchemaPusherAuthPost = (params: any) => {
  return schemaPusherAuthPOST.parse(params);
};

describe("Validating schemaPusherAuthPOST", () => {
  it("should return the parsed params when given a valid params object", () => {
    const params = {
      socket_id: "socket_id",
      channel_name: "channel_name",
      user_id: "abc123",
    };
    const result = testSchemaPusherAuthPost(params);
    expect(result).toEqual(params);
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
    };
    expect(() => {
      testSchemaPusherAuthPost(params);
    }).toThrow();
  });

  it("should throw an error when given a params object without user_id", () => {
    const params = {
      socket_id: "socket_id",
      channel_name: "channel_name",
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
    };
    expect(() => {
      testSchemaPusherAuthPost(params);
    }).toThrow();
  });

  it("should throw an error when given a params object with an empty string for user_id", () => {
    const params = {
      userId: "",
      socket_id: "socket_id",
      channel_name: "channel_name",
    };
    expect(() => testSchemaPusherAuthPost(params)).toThrow();
  });
});
