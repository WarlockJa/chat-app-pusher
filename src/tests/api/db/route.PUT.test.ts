import { schemaPUT } from "@/app/api/db/route";
import { describe, expect, it } from "vitest";

// testing schemaPOST. POST request body validation
const testSchemaPut = (body: any) => {
  return schemaPUT.parse(body);
};

describe("Validating request body test", () => {
  // Returns the parsed body when given a valid body object.
  it("should return the parsed body when given a valid body object", () => {
    const body = {
      userId: "abc123",
      message: "message",
      room: "presence-room1",
    };
    const result = testSchemaPut(body);
    expect(result).toEqual(body);
  });

  // Throws an error when given an empty body object.
  it("should throw an error when given an empty body object", () => {
    const body = {};
    expect(() => {
      testSchemaPut(body);
    }).toThrow();
  });

  // Throws an error when given a body object without room.
  it("should throw an error when given a body object without room", () => {
    const body = {
      userId: "abc123",
      message: "message",
    };
    expect(() => {
      testSchemaPut(body);
    }).toThrow();
  });

  // Throws an error when given a body object without userId.
  it("should throw an error when given a body object without userId", () => {
    const body = {
      room: "presence-room1",
      message: "message",
    };
    expect(() => {
      testSchemaPut(body);
    }).toThrow();
  });

  // Throws an error when given a body object without m.
  it("should throw an error when given a body object without message", () => {
    const body = {
      userId: "abc123",
      room: "presence-room1",
    };
    expect(() => {
      testSchemaPut(body);
    }).toThrow();
  });

  // Throws an error when given a body object with special characters for room.
  it("should throw an error when given a body object with special characters for room", () => {
    const body = {
      userId: "abc123",
      room: "presence-room!",
      message: "message",
    };
    expect(() => {
      testSchemaPut(body);
    }).toThrow();
  });

  // Throws an error when given a body object with special characters for userId.
  it("should throw an error when given a body object with special characters for userId", () => {
    const body = {
      userId: "abc@123",
      room: "presence-room1",
      message: "message",
    };
    expect(() => testSchemaPut(body)).toThrow();
  });

  // Throws an error when given a body object with a room longer than 45 characters.
  it("should throw an error when given a body object with a room longer than 45 characters", () => {
    const body = {
      userId: "abc123",
      room: "presence-room1presence-room1presence-room1presence-room1presence-room1presence-room1presence-room1presence-room1presence-room1presence-room1presence-room1presence-room1presence-room1presence-room1presence-room1presence-room1presence-room1presence-room1presence-room1presence-room1presence-room1presence-room1presence-room1presence-room1presence-room1",
      message: "message",
    };
    expect(() => {
      testSchemaPut(body);
    }).toThrow();
  });

  // Throws an error when given a body object with a room that does not start with 'presence-'.
  it('should throw an error when given a body object with a room that does not start with "presence-"', () => {
    const body = {
      userId: "abc123",
      room: "room1",
      message: "message",
    };
    expect(() => {
      testSchemaPut(body);
    }).toThrow();
  });

  // Throws an error when given a body object with a userId longer than 36 characters.
  it("should throw an error when given a body object with a userId longer than 36 characters", () => {
    const body = {
      userId: "abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz",
      room: "presence-room1",
      message: "message",
    };
    expect(() => {
      testSchemaPut(body);
    }).toThrow();
  });

  // Throws an error when given a body object with an empty string for room.
  it("should throw an error when given a body object with an empty string for room", () => {
    const body = {
      userId: "abc123",
      room: "",
      message: "message",
    };
    expect(() => testSchemaPut(body)).toThrow();
  });

  // Throws an error when given a body object with an empty string for userId.
  it("should throw an error when given a body object with an empty string for userId", () => {
    const body = {
      userId: "",
      room: "presence-room1",
      message: "message",
    };
    expect(() => testSchemaPut(body)).toThrow();
  });

  // Throws an error when given a body object with an empty string for message.
  it("should throw an error when given a body object with an empty string for userId", () => {
    const body = {
      userId: "abc123",
      room: "presence-room1",
      message: "",
    };
    expect(() => testSchemaPut(body)).toThrow();
  });

  // Throws an error when given a body object with a message longer than 400 characters.
  it("should throw an error when given a body object with a message longer than 100 characters", () => {
    const body = {
      userId: "abc123",
      room: "presence-room1",
      message: "a".repeat(401),
    };
    expect(() => {
      testSchemaPut(body);
    }).toThrow();
  });

  // Throws an error when given a body object with extra fields that are not part of the schema.
  it("should throw an error when given a body object with extra fields that are not part of the schema", () => {
    const body = {
      userId: "abc123",
      room: "presence-room1",
      message: "message",
      extraField: "extra",
    };
    expect(() => {
      testSchemaPut(body);
    }).toThrow();
  });
});
