import { TSchemaApiV1dbMessagesLastaccessPOST } from "@/lib/validators/db/messages/generatedTypes";
import { schemaApiV1dbMessagesLastaccessPOST } from "@/lib/validators/db/messages/lastaccess";
import { describe, expect, it } from "vitest";

// testing schemaApiV1dbMessagesHistoryGET. GET request body validation
const testSchemaApiV1dbMessagesLastaccessPOST = (body: any) => {
  return schemaApiV1dbMessagesLastaccessPOST.parse(body);
};

const mockValidParams: TSchemaApiV1dbMessagesLastaccessPOST = {
  user_id: "7f6bf857-1f52-40f6-b7c7-399b9b6702d4",
  channel_name: "presence-7f6bf857-1f52-40f6-b7c7-399b9b6702d4",
  message_id: "c781f6fe-0764-495d-8771-ef50e88170d3",
};

describe("Validating schemaPusherAuthPOST", () => {
  it("should return the parsed params when given a valid params object", () => {
    const result = testSchemaApiV1dbMessagesLastaccessPOST(mockValidParams);
    expect(result).toEqual(mockValidParams);
  });

  it("should throw an error when given an empty params object", () => {
    const params = {};
    expect(() => {
      testSchemaApiV1dbMessagesLastaccessPOST(params);
    }).toThrow();
  });

  it("should throw an error when given a params object without channel_name", () => {
    const params = {
      user_id: mockValidParams.user_id,
      message_id: mockValidParams.message_id,
    };
    expect(() => {
      testSchemaApiV1dbMessagesLastaccessPOST(params);
    }).toThrow();
  });

  it("should throw an error when given a params object channel_name does not start with 'presence-'", () => {
    const params = {
      channel_name: "7f6bf857-1f52-40f6-b7c7-399b9b6702d4",
      user_id: mockValidParams.user_id,
      message_id: mockValidParams.message_id,
    };
    expect(() => {
      testSchemaApiV1dbMessagesLastaccessPOST(params);
    }).toThrow();
  });

  it("should throw an error when given a params object channel_name is longer than 45 characters", () => {
    const params = {
      channel_name: mockValidParams.channel_name.concat(
        "A".repeat(46 - mockValidParams.channel_name.length)
      ),
      user_id: mockValidParams.user_id,
      message_id: mockValidParams.message_id,
    };
    expect(() => {
      testSchemaApiV1dbMessagesLastaccessPOST(params);
    }).toThrow();
  });

  it("should throw an error when given a params object without user_id", () => {
    const params = {
      channel_name: mockValidParams.channel_name,
      message_id: mockValidParams.message_id,
    };
    expect(() => {
      testSchemaApiV1dbMessagesLastaccessPOST(params);
    }).toThrow();
  });

  it("should throw an error when given a params object with user_id not UUIDv4", () => {
    const params = {
      user_id: "user_id",
      channel_name: mockValidParams.channel_name,
      message_id: mockValidParams.message_id,
    };
    expect(() => {
      testSchemaApiV1dbMessagesLastaccessPOST(params);
    }).toThrow();
  });

  it("should throw an error when given a params object without message_id", () => {
    const params = {
      user_id: mockValidParams.user_id,
      channel_name: mockValidParams.channel_name,
    };
    expect(() => {
      testSchemaApiV1dbMessagesLastaccessPOST(params);
    }).toThrow();
  });

  it("should throw an error when given a params object with message_id not UUIDv4", () => {
    const params = {
      user_id: mockValidParams.user_id,
      channel_name: mockValidParams.channel_name,
      message_id: "message_id",
    };
    expect(() => {
      testSchemaApiV1dbMessagesLastaccessPOST(params);
    }).toThrow();
  });
});
