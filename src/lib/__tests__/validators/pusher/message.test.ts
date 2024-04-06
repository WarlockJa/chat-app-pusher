import { TSchemaApiV1PusherMessagePost } from "@/lib/validators/pusher/generatedTypes";
import { schemaApiV1PusherMessagePost } from "@/lib/validators/pusher/message";
import { describe, expect, it } from "vitest";

const testSchemaApiV1PusherMessagePost = (params: any) => {
  return schemaApiV1PusherMessagePost.parse(params);
};

const mockValidParams: TSchemaApiV1PusherMessagePost = {
  author: "7f6bf857-1f52-40f6-b7c7-399b9b6702d4",
  channel_name: "presence-7f6bf857-1f52-40f6-b7c7-399b9b6702d4",
  message: "Test message",
  message_id: "c781f6fe-0764-495d-8771-ef50e88170d3",
};

describe("Validating schemaPusherAuthPOST", () => {
  it("should return the parsed params when given a valid params object", () => {
    const result = testSchemaApiV1PusherMessagePost(mockValidParams);
    expect(result).toEqual(mockValidParams);
  });

  it("should throw an error when given an empty params object", () => {
    const params = {};
    expect(() => {
      testSchemaApiV1PusherMessagePost(params);
    }).toThrow();
  });

  it("should throw an error when given a params object without channel_name", () => {
    const params = {
      author: mockValidParams.author,
      message: mockValidParams.message,
      message_id: mockValidParams.message_id,
    };
    expect(() => {
      testSchemaApiV1PusherMessagePost(params);
    }).toThrow();
  });

  it("should throw an error when given a params object channel_name does not start with 'presence-'", () => {
    const params = {
      channel_name: "7f6bf857-1f52-40f6-b7c7-399b9b6702d4",
      author: mockValidParams.author,
      message: mockValidParams.message,
      message_id: mockValidParams.message_id,
    };
    expect(() => {
      testSchemaApiV1PusherMessagePost(params);
    }).toThrow();
  });

  it("should throw an error when given a params object channel_name is longer than 45 characters", () => {
    const params = {
      channel_name: mockValidParams.channel_name.concat(
        "A".repeat(46 - mockValidParams.channel_name.length)
      ),
      author: mockValidParams.author,
      message: mockValidParams.message,
      message_id: mockValidParams.message_id,
    };
    expect(() => {
      testSchemaApiV1PusherMessagePost(params);
    }).toThrow();
  });

  it("should throw an error when given a params object without author", () => {
    const params = {
      channel_name: mockValidParams.channel_name,
      message: mockValidParams.message,
      message_id: mockValidParams.message_id,
    };
    expect(() => {
      testSchemaApiV1PusherMessagePost(params);
    }).toThrow();
  });

  it("should throw an error when given a params object with author not UUIDv4", () => {
    const params = {
      author: "author_id",
      channel_name: mockValidParams.channel_name,
      message: mockValidParams.message,
      message_id: mockValidParams.message_id,
    };
    expect(() => {
      testSchemaApiV1PusherMessagePost(params);
    }).toThrow();
  });

  it("should throw an error when given a params object without message", () => {
    const params = {
      author: mockValidParams.author,
      channel_name: mockValidParams.channel_name,
      message_id: mockValidParams.message_id,
    };
    expect(() => {
      testSchemaApiV1PusherMessagePost(params);
    }).toThrow();
  });

  it("should throw an error when given a params object with message shorter than 1 character", () => {
    const params = {
      author: mockValidParams.author,
      channel_name: mockValidParams.channel_name,
      message: "",
      message_id: mockValidParams.message_id,
    };
    expect(() => {
      testSchemaApiV1PusherMessagePost(params);
    }).toThrow();
  });

  it("should throw an error when given a params object with message longer than 400 characters", () => {
    const params = {
      author: mockValidParams.author,
      channel_name: mockValidParams.message,
      message: "A".repeat(401),
      message_id: mockValidParams.message_id,
    };
    expect(() => {
      testSchemaApiV1PusherMessagePost(params);
    }).toThrow();
  });

  it("should throw an error when given a params object without message_id", () => {
    const params = {
      author: mockValidParams.author,
      channel_name: mockValidParams.channel_name,
      message: mockValidParams.message,
    };
    expect(() => {
      testSchemaApiV1PusherMessagePost(params);
    }).toThrow();
  });
});
