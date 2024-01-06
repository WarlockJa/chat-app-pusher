import { schemaApiDBGET } from "@/lib/validators";
import { describe, expect, it } from "vitest";

// testing schemaApiDBGET. GET request body validation
const testSchemaApiDBGet = (body: any) => {
  return schemaApiDBGET.parse(body);
};

describe("Validating request body tests", () => {
  it("should return the parsed body when given a valid body object", () => {
    const body = {
      roomId: "presence-abc123",
    };
    const result = testSchemaApiDBGet(body);
    expect(result).toEqual(body);
  });

  it("should throw an error when given an empty body object", () => {
    const body = {};
    expect(() => {
      testSchemaApiDBGet(body);
    }).toThrow();
  });

  it("should throw an error when given a body object with special characters for room", () => {
    const body = {
      roomId: "presence-room!",
    };
    expect(() => {
      testSchemaApiDBGet(body);
    }).toThrow();
  });

  it("should throw an error when given a body object with a room longer than 45 characters", () => {
    const body = {
      roomId:
        "presence-abc123presence-abc123presence-abc123presence-abc123presence-abc123presence-abc123presence-abc123presence-abc123presence-abc123presence-abc123presence-abc123presence-abc123presence-abc123presence-abc123presence-abc123presence-abc123presence-abc123presence-abc123presence-abc123presence-abc123presence-abc123presence-abc123presence-abc123presence-abc123presence-abc123",
    };
    expect(() => {
      testSchemaApiDBGet(body);
    }).toThrow();
  });

  it('should throw an error when given a body object with a room that does not start with "presence-"', () => {
    const body = {
      roomId: "room1",
    };
    expect(() => {
      testSchemaApiDBGet(body);
    }).toThrow();
  });

  it("should throw an error when given a body object with extra fields that are not part of the schema", () => {
    const body = {
      roomId: "presence-abc123",
      extraField: "extra",
    };
    expect(() => {
      testSchemaApiDBGet(body);
    }).toThrow();
  });
});
