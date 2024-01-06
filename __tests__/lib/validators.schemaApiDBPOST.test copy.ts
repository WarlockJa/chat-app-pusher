import { schemaApiDBPOST } from "@/lib/validators";
import { describe, expect, it } from "vitest";

// testing schemaPOST. POST request body validation
const testSchemaApiDBPost = (body: any) => {
  return schemaApiDBPOST.parse(body);
};

describe("Validating request body test", () => {
  it("should return the parsed body when given a valid body object", () => {
    const body = {
      userId: "abc123",
      message: "message",
      room: "presence-abc123",
    };
    const result = testSchemaApiDBPost(body);
    expect(result).toEqual(body);
  });

  it("should throw an error when given an empty body object", () => {
    const body = {};
    expect(() => {
      testSchemaApiDBPost(body);
    }).toThrow();
  });

  it("should throw an error when given a body object without room", () => {
    const body = {
      userId: "abc123",
      message: "message",
    };
    expect(() => {
      testSchemaApiDBPost(body);
    }).toThrow();
  });

  it("should throw an error when given a body object without userId", () => {
    const body = {
      room: "presence-abc123",
      message: "message",
    };
    expect(() => {
      testSchemaApiDBPost(body);
    }).toThrow();
  });

  it("should throw an error when given a body object without message", () => {
    const body = {
      userId: "abc123",
      room: "presence-abc123",
    };
    expect(() => {
      testSchemaApiDBPost(body);
    }).toThrow();
  });

  it("should throw an error when given a body object with special characters for room", () => {
    const body = {
      userId: "abc123",
      room: "presence-room!",
      message: "message",
    };
    expect(() => {
      testSchemaApiDBPost(body);
    }).toThrow();
  });

  it("should throw an error when given a body object with special characters for userId", () => {
    const body = {
      userId: "abc@123",
      room: "presence-abc123",
      message: "message",
    };
    expect(() => testSchemaApiDBPost(body)).toThrow();
  });

  it("should throw an error when given a body object with a room longer than 45 characters", () => {
    const body = {
      userId: "abc123",
      room: "presence-abc123presence-abc123presence-abc123presence-abc123presence-abc123presence-abc123presence-abc123presence-abc123presence-abc123presence-abc123presence-abc123presence-abc123presence-abc123presence-abc123presence-abc123presence-abc123presence-abc123presence-abc123presence-abc123presence-abc123presence-abc123presence-abc123presence-abc123presence-abc123presence-abc123",
      message: "message",
    };
    expect(() => {
      testSchemaApiDBPost(body);
    }).toThrow();
  });

  it('should throw an error when given a body object with a room that does not start with "presence-"', () => {
    const body = {
      userId: "abc123",
      room: "room1",
      message: "message",
    };
    expect(() => {
      testSchemaApiDBPost(body);
    }).toThrow();
  });

  it("should throw an error when given a body object with a userId longer than 36 characters", () => {
    const body = {
      userId: "abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz",
      room: "presence-abc123",
      message: "message",
    };
    expect(() => {
      testSchemaApiDBPost(body);
    }).toThrow();
  });

  it("should throw an error when given a body object with an empty string for room", () => {
    const body = {
      userId: "abc123",
      room: "",
      message: "message",
    };
    expect(() => testSchemaApiDBPost(body)).toThrow();
  });

  it("should throw an error when given a body object with an empty string for userId", () => {
    const body = {
      userId: "",
      room: "presence-abc123",
      message: "message",
    };
    expect(() => testSchemaApiDBPost(body)).toThrow();
  });

  it("should throw an error when given a body object with an empty string for userId", () => {
    const body = {
      userId: "abc123",
      room: "presence-abc123",
      message: "",
    };
    expect(() => testSchemaApiDBPost(body)).toThrow();
  });

  it("should throw an error when given a body object with a message longer than 100 characters", () => {
    const body = {
      userId: "abc123",
      room: "presence-abc123",
      message: "a".repeat(401),
    };
    expect(() => {
      testSchemaApiDBPost(body);
    }).toThrow();
  });

  it("should throw an error when given a body object with extra fields that are not part of the schema", () => {
    const body = {
      userId: "abc123",
      room: "presence-abc123",
      message: "message",
      extraField: "extra",
    };
    expect(() => {
      testSchemaApiDBPost(body);
    }).toThrow();
  });
});
