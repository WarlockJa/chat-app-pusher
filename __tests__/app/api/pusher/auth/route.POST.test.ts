import { schemaPOST } from "@/app/api/pusher/auth/route";
import { describe, expect, it } from "vitest";

// testing schemaPOST. POST request params validation
const testSchemaPost = (params: any) => {
  return schemaPOST.parse(params);
};

describe("Validating request params tests", () => {
  it("should return the parsed params when given a valid params object", () => {
    const params = {
      socket_id: "socket_id",
      channel_name: "channel_name",
      user_id: "abc123",
    };
    const result = testSchemaPost(params);
    expect(result).toEqual(params);
  });

  it("should throw an error when given an empty params object", () => {
    const params = {};
    expect(() => {
      testSchemaPost(params);
    }).toThrow();
  });

  it("should throw an error when given a params object without channel_name", () => {
    const params = {
      socket_id: "socket_id",
      user_id: "abc123",
    };
    expect(() => {
      testSchemaPost(params);
    }).toThrow();
  });

  it("should throw an error when given a params object without user_id", () => {
    const params = {
      socket_id: "socket_id",
      channel_name: "channel_name",
    };
    expect(() => {
      testSchemaPost(params);
    }).toThrow();
  });

  it("should throw an error when given a params object with special characters for user_id", () => {
    const params = {
      socket_id: "socket_id",
      channel_name: "channel_name",
      user_id: "abc@123",
    };
    expect(() => {
      testSchemaPost(params);
    }).toThrow();
  });

  it("should throw an error when given a params object with a user_id longer than 36 characters", () => {
    const params = {
      socket_id: "socket_id",
      channel_name: "channel_name",
      user_id: "a".repeat(37),
    };
    expect(() => {
      testSchemaPost(params);
    }).toThrow();
  });

  it("should throw an error when given a params object with an empty string for user_id", () => {
    const params = {
      userId: "",
      socket_id: "socket_id",
      channel_name: "channel_name",
    };
    expect(() => testSchemaPost(params)).toThrow();
  });
});
