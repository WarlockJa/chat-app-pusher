import { schemaApiV1dbMessagesHistoryPOST } from "@/lib/validators/db/messages/history";
import { describe, expect, it } from "vitest";

// testing schemaApiV1dbMessagesHistoryPOST. POST request body validation
const testSchemaApiDBMessagesHistoryPost = (body: any) => {
  return schemaApiV1dbMessagesHistoryPOST.parse(body);
};

describe("Validating request body test", () => {
  it("should return the parsed body when given a valid body object", () => {
    const body = {
      message_id: "46a874fa-ac6f-476d-9b54-f5f98f14ebcb",
      user_id: "7269b5ec-882e-4bf2-85c2-5bdaaab53017",
      message_text: "message",
      channel_name: "presence-abc123",
    };
    const result = testSchemaApiDBMessagesHistoryPost(body);
    expect(result).toEqual(body);
  });

  it("should return the parsed body when given a valid body object with extra fields", () => {
    const body = {
      message_id: "46a874fa-ac6f-476d-9b54-f5f98f14ebcb",
      user_id: "7269b5ec-882e-4bf2-85c2-5bdaaab53017",
      message_text: "message",
      channel_name: "presence-abc123",
      extraField: "extra",
    };
    const expectedResult = {
      message_id: "46a874fa-ac6f-476d-9b54-f5f98f14ebcb",
      user_id: "7269b5ec-882e-4bf2-85c2-5bdaaab53017",
      message_text: "message",
      channel_name: "presence-abc123",
    };
    const result = testSchemaApiDBMessagesHistoryPost(body);
    expect(result).toEqual(expectedResult);
  });

  it("should throw an error when given an empty body object", () => {
    const body = {};
    expect(() => {
      testSchemaApiDBMessagesHistoryPost(body);
    }).toThrow();
  });

  it("should throw an error when given a body object without channel_name", () => {
    const body = {
      message_id: "46a874fa-ac6f-476d-9b54-f5f98f14ebcb",
      user_id: "7269b5ec-882e-4bf2-85c2-5bdaaab53017",
      message_text: "message",
    };
    expect(() => {
      testSchemaApiDBMessagesHistoryPost(body);
    }).toThrow();
  });

  it("should throw an error when given a body object without user_id", () => {
    const body = {
      message_id: "46a874fa-ac6f-476d-9b54-f5f98f14ebcb",
      message_text: "message",
      channel_name: "presence-abc123",
    };
    expect(() => {
      testSchemaApiDBMessagesHistoryPost(body);
    }).toThrow();
  });

  it("should throw an error when given a body object without message_text", () => {
    const body = {
      message_id: "46a874fa-ac6f-476d-9b54-f5f98f14ebcb",
      user_id: "7269b5ec-882e-4bf2-85c2-5bdaaab53017",
      channel_name: "presence-abc123",
    };
    expect(() => {
      testSchemaApiDBMessagesHistoryPost(body);
    }).toThrow();
  });

  it("should throw an error when given a body object without message_id", () => {
    const body = {
      message_text: "message",
      user_id: "7269b5ec-882e-4bf2-85c2-5bdaaab53017",
      channel_name: "presence-abc123",
    };
    expect(() => {
      testSchemaApiDBMessagesHistoryPost(body);
    }).toThrow();
  });

  it("should throw an error when given a body object with special characters in channel_name", () => {
    const body = {
      message_id: "46a874fa-ac6f-476d-9b54-f5f98f14ebcb",
      user_id: "7269b5ec-882e-4bf2-85c2-5bdaaab53017",
      message_text: "message",
      channel_name: "presence-abc123!",
    };
    expect(() => {
      testSchemaApiDBMessagesHistoryPost(body);
    }).toThrow();
  });

  it("should throw an error when given a body object with user_id not being uuidv4", () => {
    const body = {
      message_id: "46a874fa-ac6f-476d-9b54-f5f98f14ebcb",
      user_id: "user_id",
      message_text: "message",
      channel_name: "presence-abc123",
    };
    expect(() => testSchemaApiDBMessagesHistoryPost(body)).toThrow();
  });

  it("should throw an error when given a body object with message_id not being uuidv4", () => {
    const body = {
      message_id: "message_id",
      user_id: "7269b5ec-882e-4bf2-85c2-5bdaaab53017",
      message_text: "message",
      channel_name: "presence-abc123",
    };
    expect(() => testSchemaApiDBMessagesHistoryPost(body)).toThrow();
  });

  it("should throw an error when given a body object with a channel_name longer than 45 characters", () => {
    const body = {
      message_id: "46a874fa-ac6f-476d-9b54-f5f98f14ebcb",
      user_id: "7269b5ec-882e-4bf2-85c2-5bdaaab53017",
      message_text: "message",
      channel_name:
        "presence-abc123presence-abc123presence-abc123presence-abc123presence-abc123presence-abc123presence-abc123presence-abc123presence-abc123presence-abc123presence-abc123presence-abc123presence-abc123presence-abc123presence-abc123presence-abc123presence-abc123presence-abc123presence-abc123presence-abc123presence-abc123presence-abc123presence-abc123presence-abc123presence-abc123",
    };
    expect(() => {
      testSchemaApiDBMessagesHistoryPost(body);
    }).toThrow();
  });

  it('should throw an error when given a body object with a room that does not start with "presence-"', () => {
    const body = {
      message_id: "46a874fa-ac6f-476d-9b54-f5f98f14ebcb",
      user_id: "7269b5ec-882e-4bf2-85c2-5bdaaab53017",
      message_text: "message",
      channel_name: "channel_abc123",
    };
    expect(() => {
      testSchemaApiDBMessagesHistoryPost(body);
    }).toThrow();
  });

  it("should throw an error when given a body object with an empty string for channel_name", () => {
    const body = {
      message_id: "46a874fa-ac6f-476d-9b54-f5f98f14ebcb",
      user_id: "7269b5ec-882e-4bf2-85c2-5bdaaab53017",
      message_text: "message",
      channel_name: "",
    };
    expect(() => testSchemaApiDBMessagesHistoryPost(body)).toThrow();
  });

  it("should throw an error when given a body object with an empty string for message_text", () => {
    const body = {
      message_id: "46a874fa-ac6f-476d-9b54-f5f98f14ebcb",
      user_id: "7269b5ec-882e-4bf2-85c2-5bdaaab53017",
      message_text: "",
      channel_name: "presence-abc123",
    };
    expect(() => testSchemaApiDBMessagesHistoryPost(body)).toThrow();
  });

  it("should throw an error when given a body object with a message longer than 400 characters", () => {
    const body = {
      message_id: "46a874fa-ac6f-476d-9b54-f5f98f14ebcb",
      user_id: "7269b5ec-882e-4bf2-85c2-5bdaaab53017",
      message_text: "a".repeat(401),
      channel_name: "presence-abc123",
    };
    expect(() => {
      testSchemaApiDBMessagesHistoryPost(body);
    }).toThrow();
  });
});
