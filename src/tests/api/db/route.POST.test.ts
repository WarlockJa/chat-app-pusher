import { schemaPOST } from "@/app/api/db/route";
import { afterEach, describe, expect, it, vi } from "vitest";
import prisma from "@/prisma/__mocks__/globalForPrisma";
import { POST } from "@/app/api/db/route";

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

// testing POST with mocks for MongoDB request
describe("Running POST request", () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  // db successful response on POST
  // {
  //   messages: [
  //     {
  //       author: 'WJ',
  //       text: 'TEST',
  //       timestamp: 2023-12-27T08:32:47.365Z,
  //       readusers: [Array]
  //     }
  //   ],
  //   id: '658be12f4b51f57271598a61',
  //   name: 'presence-WJ'
  // }

  it("should receive valid request body and return JSON response with status code 200", async () => {
    // const req = {
    //   json: vi
    //     .fn()
    //     .mockResolvedValueOnce({ userId: "abc123", room: "presence-abc123" }),
    // };
    const req = new Request("http://localhost:3000/api/db", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: "abc123", room: "presence-abc123" }),
    });

    vi.mock("@/prisma/globalForPrisma");

    prisma.channel.findFirst.mockResolvedValue({
      name: "presence-abc123",
      id: "abcdefghijklmn123456789",
      messages: [],
    });

    const response = await POST(req);

    // expect(req.json).toHaveBeenCalledOnce();
    expect(prisma.channel.findFirst).toHaveBeenCalledOnce();
    expect(prisma.channel.findFirst).toHaveBeenCalledWith({
      where: {
        name: "presence-abc123",
      },
    });
    expect(response).toEqual({
      messages: [],
    });
  });

  //   // Function receives a valid request body with userId and room keys
  //   it("should parse valid request body and return JSON response with status code 200", async () => {
  //     const req = {
  //       json: jest
  //         .fn()
  //         .mockResolvedValueOnce({ userId: "abc123", room: "presence-abc123" }),
  //     };

  //     const prismaMock = {
  //       channel: {
  //         findFirst: jest.fn().mockResolvedValueOnce({ messages: [] }),
  //       },
  //     };

  //     jest.mock("@/prisma/globalForPrisma", () => ({
  //       prisma: prismaMock,
  //     }));

  //     const { POST } = require("@/app/api/db/route");

  //     const response = await POST(req);

  //     expect(req.json).toHaveBeenCalledTimes(1);
  //     expect(prismaMock.channel.findFirst).toHaveBeenCalledTimes(1);
  //     expect(prismaMock.channel.findFirst).toHaveBeenCalledWith({
  //       where: {
  //         name: "presence-abc123",
  //       },
  //     });
  //     expect(response).toEqual({ messages: [] });
  //   });
});
