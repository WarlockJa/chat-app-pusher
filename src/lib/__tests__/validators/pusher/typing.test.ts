import { TSchemaApiV1PusherTypingPost } from "@/lib/validators/pusher/generatedTypes";
import { schemaApiV1PusherTypingPost } from "@/lib/validators/pusher/typing";
import { describe, expect, it } from "vitest";

// testing schemaPusherAuthPOST. POST request params validation
const testSchemaApiV1PusherTypingPost = (params: any) => {
  return schemaApiV1PusherTypingPost.parse(params);
};

const mockValidParams: TSchemaApiV1PusherTypingPost = {
  author: "Test User",
  channel_name: "presence-7f6bf857-1f52-40f6-b7c7-399b9b6702d4",
};

describe("Validating schemaApiV1PusherTypingPost", () => {
  it("should return the parsed params when given a valid params object", () => {
    const result = testSchemaApiV1PusherTypingPost(mockValidParams);
    expect(result).toEqual(mockValidParams);
  });

  it("should throw an error when given an empty params object", () => {
    const params = {};
    expect(() => {
      testSchemaApiV1PusherTypingPost(params);
    }).toThrow();
  });

  it("should throw an error when given a params object without channel_name", () => {
    const params = {
      author: mockValidParams.author,
    };
    expect(() => {
      testSchemaApiV1PusherTypingPost(params);
    }).toThrow();
  });

  it("should throw an error when given a params object channel_name does not start with 'presence-'", () => {
    const params = {
      channel_name: "7f6bf857-1f52-40f6-b7c7-399b9b6702d4",
      author: mockValidParams.author,
    };
    expect(() => {
      testSchemaApiV1PusherTypingPost(params);
    }).toThrow();
  });

  it("should throw an error when given a params object channel_name is longer than 45 characters", () => {
    const params = {
      channel_name: mockValidParams.channel_name.concat(
        "A".repeat(46 - mockValidParams.channel_name.length)
      ),
      author: mockValidParams.author,
    };
    expect(() => {
      testSchemaApiV1PusherTypingPost(params);
    }).toThrow();
  });

  it("should throw an error when given a params object without author", () => {
    const params = {
      channel_name: mockValidParams.channel_name,
    };
    expect(() => {
      testSchemaApiV1PusherTypingPost(params);
    }).toThrow();
  });

  it("should throw an error when given a params object author is less than 3 characters", () => {
    const params = {
      channel_name: mockValidParams.channel_name,
      author: "Ab",
    };
    expect(() => {
      testSchemaApiV1PusherTypingPost(params);
    }).toThrow();
  });

  it("should throw an error when given a params object author is longer than 45 characters", () => {
    const params = {
      channel_name: mockValidParams.channel_name,
      author: mockValidParams.author.concat(
        "A".repeat(46 - mockValidParams.author.length)
      ),
    };
    expect(() => {
      testSchemaApiV1PusherTypingPost(params);
    }).toThrow();
  });
});
