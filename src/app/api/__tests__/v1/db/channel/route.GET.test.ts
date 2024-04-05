import { GET } from "@/app/api/v1/db/channel/route";
import { prisma } from "@/lib/__mocks__/globalForPrisma";
import { NextRequest } from "next/server";
import { afterEach, describe, expect, it, vi } from "vitest";

describe("Running channel GET request", () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  // following prisma guide https://www.prisma.io/blog/testing-series-1-8eRB5p0Y8o
  vi.mock("@/lib/prisma/globalForPrisma", async () => {
    const actual = await vi.importActual<
      typeof import("@/lib/__mocks__/globalForPrisma")
    >("@/lib/__mocks__/globalForPrisma");
    return {
      ...actual,
    };
  });

  it("successful call to the DB with existing channel return JSON response with status code 200", async () => {
    // recreating NextRequest
    const nextReq = new NextRequest(
      new Request(`http://localhost:3000/api/v1/db/channel`, {
        method: "GET",
      }),
      {}
    );

    // mock DB response data
    const mockPrismaFindManyResult = [
      {
        name: "presence-7f6bf857-1f52-40f6-b7c7-399b9b6702d4",
        owner: {
          user_id: "7f6bf857-1f52-40f6-b7c7-399b9b6702d4",
          user_name: "Test User 1",
          user_admin: false,
        },
        lastmessage: new Date("2024-04-04T07:33:07.000Z"),
      },
      {
        name: "presence-ac7a4918-a3b1-4d87-bdb8-21b77268e6ba",
        owner: {
          user_id: "ac7a4918-a3b1-4d87-bdb8-21b77268e6ba",
          user_name: "Test User 2",
          user_admin: true,
        },
        lastmessage: null,
      },
    ];

    const mockApiResult = [
      {
        name: "presence-7f6bf857-1f52-40f6-b7c7-399b9b6702d4",
        owner: {
          user_id: "7f6bf857-1f52-40f6-b7c7-399b9b6702d4",
          user_name: "Test User 1",
          user_admin: false,
        },
        lastmessage: new Date("2024-04-04T07:33:07.000Z").toISOString(),
      },
      {
        name: "presence-ac7a4918-a3b1-4d87-bdb8-21b77268e6ba",
        owner: {
          user_id: "ac7a4918-a3b1-4d87-bdb8-21b77268e6ba",
          user_name: "Test User 2",
          user_admin: true,
        },
        lastmessage: null,
      },
    ];

    // @ts-ignore
    prisma.channel.findMany.mockResolvedValue(mockPrismaFindManyResult);

    const response = await GET(nextReq);
    const result = await response?.json();

    expect(prisma.channel.findMany).toHaveBeenCalledOnce();
    expect(response?.status).toBe(200);
    expect(result).toEqual(mockApiResult);
  });

  it("successful call to the DB with no channels found return JSON response with status code 200", async () => {
    // recreating NextRequest
    const nextReq = new NextRequest(
      new Request(`http://localhost:3000/api/v1/db/channel`, {
        method: "GET",
      }),
      {}
    );

    // mock DB response data
    const mockPrismaFindManyResult: any[] = [];

    const mockApiResult: any[] = [];

    // @ts-ignore
    prisma.channel.findMany.mockResolvedValue(mockPrismaFindManyResult);

    const response = await GET(nextReq);
    const result = await response?.json();

    expect(prisma.channel.findMany).toHaveBeenCalledOnce();
    expect(response?.status).toBe(200);
    expect(result).toEqual(mockApiResult);
  });

  it("imitating DB down return error response with status code 500", async () => {
    // recreating NextRequest
    const nextReq = new NextRequest(
      new Request(`http://localhost:3000/api/v1/db/channel`, {
        method: "GET",
      }),
      {}
    );

    prisma.channel.findMany.mockImplementation(() => {
      throw new Error("Database connection error");
    });

    const response = await GET(nextReq);

    expect(prisma.channel.findMany).toHaveBeenCalledOnce();
    expect(response?.status).toBe(500);
  });
});
