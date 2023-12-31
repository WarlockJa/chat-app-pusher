import { afterEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/__mocks__/globalForPrisma";
import { GET } from "@/app/api/v1/db/route";

// testing GET with mocks for NextRequest and Prisma MongoDB call
describe("Running GET request", () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  // following prisma guide https://www.prisma.io/blog/testing-series-1-8eRB5p0Y8o
  vi.mock("@/lib/globalForPrisma", async () => {
    const actual = await vi.importActual<
      typeof import("@/lib/__mocks__/globalForPrisma")
    >("@/lib/__mocks__/globalForPrisma");
    return {
      ...actual,
    };
  });

  it("successful call to the DB with an existing document return JSON response with status code 200", async () => {
    // recreating NextRequest
    const nextReq = new NextRequest(
      new Request("http://localhost:3000/api/v1/db?roomId=presence-abc123", {
        method: "GET",
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

    const response = await GET(nextReq);
    const result = await response.json();

    expect(response.status).toBe(200);
    expect(prisma.channel.findFirst).toHaveBeenCalledOnce();
    expect(prisma.channel.findFirst).toBeCalledWith(
      expectedDBCallObject_findFirst
    );
    expect(result).toEqual(mockDBResult_findFirst);
  });

  it("should receive valid request params not found in DB and return null response with status code 200", async () => {
    // recreating NextRequest
    const nextReq = new NextRequest(
      new Request("http://localhost:3000/api/v1/db?roomId=presence-abc123", {
        method: "GET",
      }),
      {}
    );

    // mock DB data
    const mockDBResult_findFirst = null;

    const expectedDBCallObject_findFirst = {
      where: {
        name: "presence-abc123",
      },
    };

    prisma.channel.findFirst.mockResolvedValue(mockDBResult_findFirst);

    const response = await GET(nextReq);
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
      new Request("http://localhost:3000/api/v1/db?roomId=presence-abc123", {
        method: "GET",
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

    const response = await GET(nextReq);
    const result = await response.json();

    expect(response.status).toBe(500);
    expect(prisma.channel.findFirst).toHaveBeenCalledOnce();
    expect(prisma.channel.findFirst).toBeCalledWith(
      expectedDBCallObject_findFirst
    );
    expect(result).toEqual(mockDBResult_findFirst);
  });
});
