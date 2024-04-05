import { GET } from "@/app/api/v1/db/channel/lastmessage/route";
import { prisma } from "@/lib/__mocks__/globalForPrisma";
import { NextRequest } from "next/server";
import { afterEach, describe, expect, it, vi } from "vitest";

const mock_channel_name = "presence-4765440c-6d54-48fc-b8ec-d8fab8a75502";

describe("Running channel lastmessage GET request", () => {
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
      new Request(
        `http://localhost:3000/api/v1/db/channel/lastmessage?channel_name=${mock_channel_name}`,
        {
          method: "GET",
        }
      ),
      {}
    );

    // mock DB response data
    const mockPrismaFindUniqueResult = {
      lastmessage: new Date("2024-04-04T07:33:07.394+00:00"),
    };

    // @ts-ignore
    prisma.channel.findUnique.mockResolvedValue(mockPrismaFindUniqueResult);

    const response = await GET(nextReq);
    const result = await response.json();

    expect(prisma.channel.findUnique).toHaveBeenCalledOnce();
    expect(response.status).toBe(200);
    expect(result).toEqual(
      mockPrismaFindUniqueResult.lastmessage.toISOString()
    );
  });

  it("should receive valid request params not found in DB and return null response with status code 404", async () => {
    // recreating NextRequest
    const nextReq = new NextRequest(
      new Request(
        `http://localhost:3000/api/v1/db/channel/lastmessage?channel_name=${mock_channel_name}`,
        {
          method: "GET",
        }
      ),
      {}
    );

    // mock DB response data
    const mockPrismaFindUniqueResult = null;

    // @ts-ignore
    prisma.channel.findUnique.mockResolvedValue(mockPrismaFindUniqueResult);

    const response = await GET(nextReq);
    const result = await response.json();

    expect(prisma.channel.findUnique).toHaveBeenCalledOnce();
    expect(response.status).toBe(404);
    expect(result).toEqual(null);
  });

  it("should receive invalid request params and return error response with status code 400", async () => {
    // recreating NextRequest
    const nextReq = new NextRequest(
      new Request(
        `http://localhost:3000/api/v1/db/channel/lastmessage?channel_name=`,
        {
          method: "GET",
        }
      ),
      {}
    );

    const response = await GET(nextReq);

    expect(prisma.channel.findUnique).toHaveBeenCalledTimes(0);
    expect(response.status).toBe(400);
  });

  it("imitating DB down return error response with status code 500", async () => {
    // recreating NextRequest
    const nextReq = new NextRequest(
      new Request(
        `http://localhost:3000/api/v1/db/channel/lastmessage?channel_name=${mock_channel_name}`,
        {
          method: "GET",
        }
      ),
      {}
    );

    prisma.channel.findUnique.mockImplementation(() => {
      throw new Error("Database connection error");
    });

    const response = await GET(nextReq);

    expect(prisma.channel.findUnique).toHaveBeenCalledOnce();
    expect(response.status).toBe(500);
  });
});
