import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/__mocks__/globalForPrisma";
import { GET } from "@/app/api/v1/db/messages/history/route";
import { JsonObject } from "@prisma/client/runtime/library";
import { loadEnvConfig } from "@next/env";
import generateSignature from "@/util/crypto/aes-cbc/generateSignature";

// testing history GET with mocks for NextRequest and Prisma MongoDB call
describe("Running GET request", () => {
  beforeEach(() => {
    loadEnvConfig(process.cwd());
  });

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

  it("successful call to the DB with existing documents return JSON response with status code 200", async () => {
    // request parameters
    const params = {
      channel_name: "presence-abc123",
      message_id: "4765440c-6d54-48fc-b8ec-d8fab8a75503",
      limit: 2,
    };
    // recreating NextRequest
    const nextReq = new NextRequest(
      new Request(
        `http://localhost:3000/api/v1/db/history?channel_name=${params.channel_name}&message_id=${params.message_id}&limit=${params.limit}`,
        {
          method: "GET",
          headers: {
            "pusher-chat-signature": generateSignature({
              key: process.env.NEXT_PUBLIC_API_SIGNATURE_KEY!,
            }),
          },
        }
      ),
      {}
    );

    // mock DB data
    const mockDBResult_aggregateRaw = [
      {
        id: "272f4e6c-eb74-4062-8677-6692878bc9d0",
        text: "Test message 1",
        author: "testAuthor1",
        timestamp: {
          $date: "2024-02-02T10:55:27.632Z",
        },
      },
      {
        id: "2cf09415-0f32-4536-b23c-329619cdb097",
        text: "Test message 2",
        author: "testAuthor1",
        timestamp: {
          $date: "2024-02-02T11:10:49.247Z",
        },
      },
      {
        id: "086c9256-3f7f-48ef-aca3-139d7b4b7798",
        text: "Test message 3",
        author: "testAuthor2",
        timestamp: {
          $date: "2024-02-02T11:11:33.739Z",
        },
      },
    ];

    // api result data
    const mockApiResult = {
      messages: [
        {
          id: "2cf09415-0f32-4536-b23c-329619cdb097",
          text: "Test message 2",
          author: "testAuthor1",
          timestamp: "2024-02-02T11:10:49.247Z",
        },
        {
          id: "086c9256-3f7f-48ef-aca3-139d7b4b7798",
          text: "Test message 3",
          author: "testAuthor2",
          timestamp: "2024-02-02T11:11:33.739Z",
        },
      ],
      hasMore: true,
    };

    prisma.channel.aggregateRaw.mockResolvedValue(
      mockDBResult_aggregateRaw as unknown as JsonObject
    );

    const response = await GET(nextReq);
    const result = await response.json();

    expect(prisma.channel.aggregateRaw).toHaveBeenCalledOnce();
    expect(response.status).toBe(200);
    expect(result).toEqual(mockApiResult);
  });

  it("successful call to the DB without optional parameters return JSON response with status code 200", async () => {
    // request parameters
    const params = {
      channel_name: "presence-abc123",
    };
    // recreating NextRequest
    const nextReq = new NextRequest(
      new Request(
        `http://localhost:3000/api/v1/db/history?channel_name=${params.channel_name}`,
        {
          method: "GET",
          headers: {
            "pusher-chat-signature": generateSignature({
              key: process.env.NEXT_PUBLIC_API_SIGNATURE_KEY!,
            }),
          },
        }
      ),
      {}
    );

    // mock DB data
    const mockDBResult_aggregateRaw = [
      {
        id: "272f4e6c-eb74-4062-8677-6692878bc9d0",
        text: "Test message 1",
        author: "testAuthor1",
        timestamp: {
          $date: "2024-02-02T10:55:27.632Z",
        },
      },
      {
        id: "2cf09415-0f32-4536-b23c-329619cdb097",
        text: "Test message 2",
        author: "testAuthor1",
        timestamp: {
          $date: "2024-02-02T11:10:49.247Z",
        },
      },
      {
        id: "086c9256-3f7f-48ef-aca3-139d7b4b7798",
        text: "Test message 3",
        author: "testAuthor2",
        timestamp: {
          $date: "2024-02-02T11:11:33.739Z",
        },
      },
    ];

    // api result data
    const mockApiResult = {
      messages: [
        {
          id: "272f4e6c-eb74-4062-8677-6692878bc9d0",
          text: "Test message 1",
          author: "testAuthor1",
          timestamp: "2024-02-02T10:55:27.632Z",
        },
        {
          id: "2cf09415-0f32-4536-b23c-329619cdb097",
          text: "Test message 2",
          author: "testAuthor1",
          timestamp: "2024-02-02T11:10:49.247Z",
        },
        {
          id: "086c9256-3f7f-48ef-aca3-139d7b4b7798",
          text: "Test message 3",
          author: "testAuthor2",
          timestamp: "2024-02-02T11:11:33.739Z",
        },
      ],
      hasMore: false,
    };

    prisma.channel.aggregateRaw.mockResolvedValue(
      mockDBResult_aggregateRaw as unknown as JsonObject
    );

    const response = await GET(nextReq);
    const result = await response.json();

    expect(prisma.channel.aggregateRaw).toHaveBeenCalledOnce();
    expect(response.status).toBe(200);
    expect(result).toEqual(mockApiResult);
  });

  it("should receive valid request params not found in DB and return null response with status code 200", async () => {
    const params = {
      channel_name: "presence-notFound",
      message_id: "4765440c-6d54-48fc-b8ec-d8fab8a75503",
      limit: 2,
    };
    // recreating NextRequest
    const nextReq = new NextRequest(
      new Request(
        `http://localhost:3000/api/v1/db/history?channel_name=${params.channel_name}&message_id=${params.message_id}&limit=${params.limit}`,
        {
          method: "GET",
          headers: {
            "pusher-chat-signature": generateSignature({
              key: process.env.NEXT_PUBLIC_API_SIGNATURE_KEY!,
            }),
          },
        }
      ),
      {}
    );

    // mock DB data
    const mockDBResult_aggregateRaw: any = [];

    // api result data
    const mockApiResult = {
      messages: [],
      hasMore: false,
    };

    prisma.channel.aggregateRaw.mockResolvedValue(mockDBResult_aggregateRaw);

    const response = await GET(nextReq);
    const result = await response.json();

    expect(response.status).toBe(200);
    expect(prisma.channel.aggregateRaw).toHaveBeenCalledOnce();
    expect(result).toEqual(mockApiResult);
  });

  it("should receive invalid request params and return error response with status code 400", async () => {
    // recreating NextRequest
    const nextReq = new NextRequest(
      new Request(`http://localhost:3000/api/v1/db/history`, {
        method: "GET",
        headers: {
          "pusher-chat-signature": generateSignature({
            key: process.env.NEXT_PUBLIC_API_SIGNATURE_KEY!,
          }),
        },
      }),
      {}
    );

    const response = await GET(nextReq);

    expect(response.status).toBe(400);
    expect(prisma.channel.aggregateRaw).toHaveBeenCalledTimes(0);
  });

  it("should receive valid request with additional parameters and return successful response with status code 200", async () => {
    // request parameters
    const params = {
      channel_name: "presence-abc123",
      message_id: "4765440c-6d54-48fc-b8ec-d8fab8a75503",
      limit: 2,
      test: "test",
    };
    // recreating NextRequest
    const nextReq = new NextRequest(
      new Request(
        `http://localhost:3000/api/v1/db/history?channel_name=${params.channel_name}&message_id=${params.message_id}&limit=${params.limit}&test=test`,
        {
          method: "GET",
          headers: {
            "pusher-chat-signature": generateSignature({
              key: process.env.NEXT_PUBLIC_API_SIGNATURE_KEY!,
            }),
          },
        }
      ),
      {}
    );

    // mock DB data
    const mockDBResult_aggregateRaw = [
      {
        id: "272f4e6c-eb74-4062-8677-6692878bc9d0",
        text: "Test message 1",
        author: "testAuthor1",
        timestamp: {
          $date: "2024-02-02T10:55:27.632Z",
        },
      },
      {
        id: "2cf09415-0f32-4536-b23c-329619cdb097",
        text: "Test message 2",
        author: "testAuthor1",
        timestamp: {
          $date: "2024-02-02T11:10:49.247Z",
        },
      },
      {
        id: "086c9256-3f7f-48ef-aca3-139d7b4b7798",
        text: "Test message 3",
        author: "testAuthor2",
        timestamp: {
          $date: "2024-02-02T11:11:33.739Z",
        },
      },
    ];

    // api result data
    const mockApiResult = {
      messages: [
        {
          id: "2cf09415-0f32-4536-b23c-329619cdb097",
          text: "Test message 2",
          author: "testAuthor1",
          timestamp: "2024-02-02T11:10:49.247Z",
        },
        {
          id: "086c9256-3f7f-48ef-aca3-139d7b4b7798",
          text: "Test message 3",
          author: "testAuthor2",
          timestamp: "2024-02-02T11:11:33.739Z",
        },
      ],
      hasMore: true,
    };

    prisma.channel.aggregateRaw.mockResolvedValue(
      mockDBResult_aggregateRaw as unknown as JsonObject
    );

    const response = await GET(nextReq);
    const result = await response.json();

    expect(prisma.channel.aggregateRaw).toHaveBeenCalledOnce();
    expect(response.status).toBe(200);
    expect(result).toEqual(mockApiResult);
  });

  it("imitating DB down return error response with status code 500", async () => {
    const params = {
      channel_name: "presence-abc123",
      message_id: "4765440c-6d54-48fc-b8ec-d8fab8a75503",
      limit: 2,
    };
    // recreating NextRequest
    const nextReq = new NextRequest(
      new Request(
        `http://localhost:3000/api/v1/db/history?channel_name=${params.channel_name}&message_id=${params.message_id}&limit=${params.limit}`,
        {
          method: "GET",
          headers: {
            "pusher-chat-signature": generateSignature({
              key: process.env.NEXT_PUBLIC_API_SIGNATURE_KEY!,
            }),
          },
        }
      ),
      {}
    );

    // mock DB data
    const mockDBResult_aggregateRaw = {};

    const response = await GET(nextReq);
    const result = await response.json();

    prisma.channel.aggregateRaw.mockResolvedValue(mockDBResult_aggregateRaw);

    expect(response.status).toBe(500);
    expect(prisma.channel.aggregateRaw).toHaveBeenCalledOnce();
    expect(result).toEqual({});
  });
});
