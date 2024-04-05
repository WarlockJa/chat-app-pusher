import { GET } from "@/app/api/v1/db/messages/new/route";
import { prisma } from "@/lib/__mocks__/globalForPrisma";
import { TMessageDB } from "@/lib/prisma/prisma";
import { JsonObject } from "@prisma/client/runtime/library";
import { NextRequest } from "next/server";
import { afterEach, describe, expect, it, vi } from "vitest";

const mock_user_id = "7f6bf857-1f52-40f6-b7c7-399b9b6702d4";
const mock_channel_name = "presence-4765440c-6d54-48fc-b8ec-d8fab8a75502";

// testing POST with mocks for NextRequest and Prisma MongoDB call
describe("Running GET request", () => {
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

  it("fetching unread messages from the exsiting room in the DB returns JSON response with status code 200", async () => {
    // recreating NextRequest
    const nextReq = new NextRequest(
      new Request(
        `http://localhost:3000/api/v1/db/messages/new?channel_name=${mock_channel_name}&user_id=${mock_user_id}`
      ),
      {}
    );

    // mongodb response format
    const mockDBResult_aggregateRaw: TMessageDB[] = [
      {
        id: "ca3373b5-0056-4830-befc-a4a3edf589ba",
        author: "7f6bf857-1f52-40f6-b7c7-399b9b6702d4",
        text: "test",
        timestamp: {
          $date: new Date("2024-03-25T14:29:43.887+00:00"),
        },
      },
    ];

    const mockApiResult = [
      {
        id: "ca3373b5-0056-4830-befc-a4a3edf589ba",
        author: "7f6bf857-1f52-40f6-b7c7-399b9b6702d4",
        text: "test",
        timestamp: new Date("2024-03-25T14:29:43.887+00:00").toISOString(),
      },
    ];

    // searching for the existing room in DB
    prisma.channel.aggregateRaw.mockResolvedValue(
      mockDBResult_aggregateRaw as unknown as JsonObject
    );

    const response = await GET(nextReq);
    const result = await response.json();

    expect(response.status).toBe(200);
    expect(result).toEqual(mockApiResult);
    expect(prisma.channel.aggregateRaw).toHaveBeenCalledOnce();
  });

  it("passing invalid params returns JSON response with status code 400", async () => {
    // recreating NextRequest
    const nextReq = new NextRequest(
      new Request(
        `http://localhost:3000/api/v1/db/messages/new?channel_name=${mock_channel_name}&user_id=`
      ),
      {}
    );

    const response = await GET(nextReq);
    const result = await response.json();

    expect(response.status).toBe(400);
    expect(result).toBeDefined();
    expect(prisma.channel.aggregateRaw).toHaveBeenCalledTimes(0);
  });

  it("passing invalid params returns JSON response with status code 400", async () => {
    // recreating NextRequest
    const nextReq = new NextRequest(
      new Request(
        `http://localhost:3000/api/v1/db/messages/new?channel_name=&user_id=${mock_user_id}`
      ),
      {}
    );

    const response = await GET(nextReq);
    const result = await response.json();

    expect(response.status).toBe(400);
    expect(result).toBeDefined();
    expect(prisma.channel.aggregateRaw).toHaveBeenCalledTimes(0);
  });

  it("passing invalid params returns JSON response with status code 400", async () => {
    // recreating NextRequest
    const nextReq = new NextRequest(
      new Request(
        `http://localhost:3000/api/v1/db/messages/new?channel_name=&user_id=`
      ),
      {}
    );

    const response = await GET(nextReq);
    const result = await response.json();

    expect(response.status).toBe(400);
    expect(result).toBeDefined();
    expect(prisma.channel.aggregateRaw).toHaveBeenCalledTimes(0);
  });

  it("imitating DB down return error response with status code 500", async () => {
    // recreating NextRequest
    const nextReq = new NextRequest(
      new Request(
        `http://localhost:3000/api/v1/db/messages/new?channel_name=${mock_channel_name}&user_id=${mock_user_id}`
      ),
      {}
    );

    prisma.channel.aggregateRaw.mockImplementation(() => {
      throw new Error("Database connection error");
    });

    const response = await GET(nextReq);
    const result = await response.json();

    expect(response.status).toBe(500);
    expect(result).toBeDefined();
    expect(prisma.channel.aggregateRaw).toHaveBeenCalledTimes(1);
  });
});
