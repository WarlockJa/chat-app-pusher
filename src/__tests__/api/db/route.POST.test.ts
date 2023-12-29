import { schemaPOST } from "@/app/api/db/route";
import { afterEach, describe, expect, it, vi } from "vitest";
import { POST } from "@/app/api/db/route";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/__mocks__/globalForPrisma";

// testing schemaPOST. POST request body validation
const testSchemaPost = (body: any) => {
  return schemaPOST.parse(body);
};

describe("Validating request body tests", () => {
  // Returns the parsed body when given a valid body object.
  it("should return the parsed body when given a valid body object", () => {
    const body = {
      userId: "abc123",
      room: "presence-abc123",
    };
    const result = testSchemaPost(body);
    expect(result).toEqual(body);
  });

  // Throws an error when given an empty body object.
  it("should throw an error when given an empty body object", () => {
    const body = {};
    expect(() => {
      testSchemaPost(body);
    }).toThrow();
  });

  // Throws an error when given a body object without room.
  it("should throw an error when given a body object without room", () => {
    const body = {
      userId: "abc123",
    };
    expect(() => {
      testSchemaPost(body);
    }).toThrow();
  });

  // Throws an error when given a body object without userId.
  it("should throw an error when given a body object without userId", () => {
    const body = {
      room: "presence-abc123",
    };
    expect(() => {
      testSchemaPost(body);
    }).toThrow();
  });

  // Throws an error when given a body object with special characters for room.
  it("should throw an error when given a body object with special characters for room", () => {
    const body = {
      userId: "abc123",
      room: "presence-room!",
    };
    expect(() => {
      testSchemaPost(body);
    }).toThrow();
  });

  // Throws an error when given a body object with special characters for userId.
  it("should throw an error when given a body object with special characters for userId", () => {
    const body = {
      userId: "abc@123",
      room: "presence-abc123",
    };
    expect(() => testSchemaPost(body)).toThrow();
  });

  // Throws an error when given a body object with a room longer than 45 characters.
  it("should throw an error when given a body object with a room longer than 45 characters", () => {
    const body = {
      userId: "abc123",
      room: "presence-abc123presence-abc123presence-abc123presence-abc123presence-abc123presence-abc123presence-abc123presence-abc123presence-abc123presence-abc123presence-abc123presence-abc123presence-abc123presence-abc123presence-abc123presence-abc123presence-abc123presence-abc123presence-abc123presence-abc123presence-abc123presence-abc123presence-abc123presence-abc123presence-abc123",
    };
    expect(() => {
      testSchemaPost(body);
    }).toThrow();
  });

  // Throws an error when given a body object with a room that does not start with 'presence-'.
  it('should throw an error when given a body object with a room that does not start with "presence-"', () => {
    const body = {
      userId: "abc123",
      room: "room1",
    };
    expect(() => {
      testSchemaPost(body);
    }).toThrow();
  });

  // Throws an error when given a body object with a userId longer than 36 characters.
  it("should throw an error when given a body object with a userId longer than 36 characters", () => {
    const body = {
      userId: "abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz",
      room: "presence-abc123",
    };
    expect(() => {
      testSchemaPost(body);
    }).toThrow();
  });

  // Throws an error when given a body object with an empty string for room.
  it("should throw an error when given a body object with an empty string for room", () => {
    const body = {
      userId: "abc123",
      room: "",
    };
    expect(() => testSchemaPost(body)).toThrow();
  });

  // Throws an error when given a body object with an empty string for userId.
  it("should throw an error when given a body object with an empty string for userId", () => {
    const body = {
      userId: "",
      room: "presence-abc123",
    };
    expect(() => testSchemaPost(body)).toThrow();
  });

  // Throws an error when given a body object with extra fields that are not part of the schema.
  it("should throw an error when given a body object with extra fields that are not part of the schema", () => {
    const body = {
      userId: "abc123",
      room: "presence-abc123",
      extraField: "extra",
    };
    expect(() => {
      testSchemaPost(body);
    }).toThrow();
  });
});

// testing POST with mocks for NextRequest and Prisma MongoDB call
describe("Running POST request", () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  // following (loosely) prisma guide https://www.prisma.io/blog/testing-series-1-8eRB5p0Y8o
  vi.mock("@/lib/globalForPrisma", async () => {
    const actual = await vi.importActual("@/lib/__mocks__/globalForPrisma");
    return {
      ...actual,
    };
  });

  it("successful call to the DB with an existing document return JSON response with status code 200", async () => {
    // recreating NextRequest
    const nextReq = new NextRequest(
      new Request("http://localhost:3000", {
        method: "POST",
        body: JSON.stringify({ userId: "abc123", room: "presence-abc123" }),
      }),
      {}
    );

    // mock DB data
    const mockDBResult_findFirst = {
      id: "abcdefghijklmn123456789",
      name: "presence-abc123",
      messages: [],
    };

    const expectedDBCallObject_findFirst = {
      where: {
        name: "presence-abc123",
      },
    };

    prisma.channel.findFirst.mockResolvedValue(mockDBResult_findFirst);

    const response = await POST(nextReq);
    const result = await response.json();

    expect(response.status).toBe(200);
    expect(prisma.channel.findFirst).toHaveBeenCalledOnce();
    expect(prisma.channel.findFirst).toBeCalledWith(
      expectedDBCallObject_findFirst
    );
    expect(result).toEqual(mockDBResult_findFirst);
  });

  it("should receive valid request body not found in DB and return null response with status code 200", async () => {
    // recreating NextRequest
    const nextReq = new NextRequest(
      new Request("http://localhost:3000", {
        method: "POST",
        body: JSON.stringify({ userId: "def123", room: "presence-def123" }),
      }),
      {}
    );

    // mock DB data
    const mockDBResult_findFirst = null;

    const expectedDBCallObject_findFirst = {
      where: {
        name: "presence-def123",
      },
    };

    prisma.channel.findFirst.mockResolvedValue(mockDBResult_findFirst);

    const response = await POST(nextReq);
    const result = await response.json();

    expect(response.status).toBe(200);
    expect(prisma.channel.findFirst).toHaveBeenCalledOnce();
    expect(prisma.channel.findFirst).toBeCalledWith(
      expectedDBCallObject_findFirst
    );
    expect(result).toEqual(mockDBResult_findFirst);
  });

  it("imitating DB down return error response with status code 500", async () => {
    // recreating NextRequest
    const nextReq = new NextRequest(
      new Request("http://localhost:3000", {
        method: "POST",
        body: JSON.stringify({ userId: "abc123", room: "presence-abc123" }),
      }),
      {}
    );

    // mock DB data
    const mockDBResult_findFirst = {};

    const expectedDBCallObject_findFirst = {
      where: {
        name: "presence-abc123",
      },
    };

    const response = await POST(nextReq);
    const result = await response.json();

    expect(response.status).toBe(500);
    expect(prisma.channel.findFirst).toHaveBeenCalledOnce();
    expect(prisma.channel.findFirst).toBeCalledWith(
      expectedDBCallObject_findFirst
    );
    expect(result).toEqual(mockDBResult_findFirst);
  });
});
