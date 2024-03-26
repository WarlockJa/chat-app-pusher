import { schemaApiV1dbMessagesHistoryGET } from "@/lib/validators/db/messages/history";
import { describe, expect, it } from "vitest";

// testing schemaApiV1dbMessagesHistoryGET. GET request body validation
const testSchemaApiDBMessagesHistoryGet = (body: any) => {
  return schemaApiV1dbMessagesHistoryGET.parse(body);
};

describe("Validating request body tests", () => {
  it("should return the parsed body when given a valid body object", () => {
    const body = {
      channel_name: "presence-abc123",
      message_id: "2f9ae51b-70c1-4de9-9c6f-793f8a8f8281",
      limit: 10,
    };
    const result = testSchemaApiDBMessagesHistoryGet(body);
    expect(result).toEqual(body);
  });
  it("should return the parsed body when given a valid body object without optional limit", () => {
    const body = {
      channel_name: "presence-abc123",
      message_id: "2f9ae51b-70c1-4de9-9c6f-793f8a8f8281",
      limit: null,
    };
    const expectedResult = {
      channel_name: "presence-abc123",
      message_id: "2f9ae51b-70c1-4de9-9c6f-793f8a8f8281",
      limit: null,
    };
    const result = testSchemaApiDBMessagesHistoryGet(body);
    expect(result).toEqual(expectedResult);
  });
  it("should return the parsed body when given a valid body object without optional message_id", () => {
    const body = {
      channel_name: "presence-abc123",
      message_id: null,
      limit: 10,
    };
    const expectedResult = {
      channel_name: "presence-abc123",
      message_id: null,
      limit: 10,
    };
    const result = testSchemaApiDBMessagesHistoryGet(body);
    expect(result).toEqual(expectedResult);
  });

  it("should return the parsed body when given a valid body object with additional fields", () => {
    const body = {
      channel_name: "presence-abc123",
      message_id: "2f9ae51b-70c1-4de9-9c6f-793f8a8f8281",
      limit: 10,
      extraField: "extra",
    };
    const expectedResult = {
      channel_name: "presence-abc123",
      message_id: "2f9ae51b-70c1-4de9-9c6f-793f8a8f8281",
      limit: 10,
    };
    const result = testSchemaApiDBMessagesHistoryGet(body);
    expect(result).toEqual(expectedResult);
  });

  it("should throw an error when given an empty body object", () => {
    const body = {};
    expect(() => {
      testSchemaApiDBMessagesHistoryGet(body);
    }).toThrow();
  });

  it("should throw an error when given a body object with special characters for room", () => {
    const body = {
      channel_name: "presence-abc123!",
      message_id: "2f9ae51b-70c1-4de9-9c6f-793f8a8f8281",
      limit: 10,
    };
    expect(() => {
      testSchemaApiDBMessagesHistoryGet(body);
    }).toThrow();
  });

  it("should throw an error when given a body object with a room longer than 45 characters", () => {
    const body = {
      channel_name:
        "presence-abc123presence-abc123presence-abc123presence-abc123presence-abc123presence-abc123presence-abc123presence-abc123presence-abc123presence-abc123presence-abc123presence-abc123presence-abc123presence-abc123presence-abc123presence-abc123presence-abc123presence-abc123presence-abc123presence-abc123presence-abc123presence-abc123presence-abc123presence-abc123presence-abc123",
      message_id: "2f9ae51b-70c1-4de9-9c6f-793f8a8f8281",
      limit: 10,
    };
    expect(() => {
      testSchemaApiDBMessagesHistoryGet(body);
    }).toThrow();
  });

  it('should throw an error when given a body object with a room that does not start with "presence-"', () => {
    const body = {
      channel_name: "room1",
      message_id: "2f9ae51b-70c1-4de9-9c6f-793f8a8f8281",
      limit: 10,
    };
    expect(() => {
      testSchemaApiDBMessagesHistoryGet(body);
    }).toThrow();
  });
});
