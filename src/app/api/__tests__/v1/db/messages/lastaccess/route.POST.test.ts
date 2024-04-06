import { POST } from "@/app/api/v1/db/messages/lastaccess/route";
import { prisma } from "@/lib/__mocks__/globalForPrisma";
import { NextRequest } from "next/server";
import { afterEach, describe, expect, it, vi } from "vitest";

const mock_channel_name = "presence-4765440c-6d54-48fc-b8ec-d8fab8a75502";
const mock_user_id = "7f6bf857-1f52-40f6-b7c7-399b9b6702d4";
const mock_message_id = "ca3373b5-0056-4830-befc-a4a3edf589ba";

describe("Running db messages lastaccess POST request", () => {
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

  it("successful call to the DB with existing channel and message with message_id, return JSON response with status code 200", async () => {
    // recreating NextRequest
    const nextReq = new NextRequest(
      new Request(`http://localhost:3000/api/v1/db/messages/lastaccess`, {
        method: "POST",
        headers: {
          "Content-Type": "Application/json",
        },
        body: JSON.stringify({
          user_id: mock_user_id,
          message_id: mock_message_id,
          channel_name: mock_channel_name,
        }),
      }),
      {}
    );

    // mock DB aggregateRaw response data
    const mockPrismaAggregateRawResult = [
      {
        timestamp: { $date: new Date("2024-03-25T14:29:43.887+00:00") },
      },
    ];
    const mockPrismaRunCommandRawResult = { n: 2, nModified: 1, ok: 1 };

    // @ts-ignore
    prisma.channel.aggregateRaw.mockResolvedValue(mockPrismaAggregateRawResult);
    prisma.$runCommandRaw.mockResolvedValue(mockPrismaRunCommandRawResult);

    const response = await POST(nextReq);
    const result = await response?.json();

    expect(prisma.channel.aggregateRaw).toHaveBeenCalledOnce();
    expect(prisma.$runCommandRaw).toHaveBeenCalledOnce();
    expect(response?.status).toBe(200);
    expect(result).toEqual(mockPrismaRunCommandRawResult);
  });

  it("successful call to the DB with existing channel but message_id doesn't exist, return JSON response with status code 201", async () => {
    // recreating NextRequest
    const nextReq = new NextRequest(
      new Request(`http://localhost:3000/api/v1/db/messages/lastaccess`, {
        method: "POST",
        headers: {
          "Content-Type": "Application/json",
        },
        body: JSON.stringify({
          user_id: mock_user_id,
          message_id: mock_message_id,
          channel_name: mock_channel_name,
        }),
      }),
      {}
    );

    // mock DB aggregateRaw response data
    const mockPrismaAggregateRawResult: any = [];

    // @ts-ignore
    prisma.channel.aggregateRaw.mockResolvedValue(mockPrismaAggregateRawResult);

    const response = await POST(nextReq);
    const result = await response?.json();

    expect(prisma.channel.aggregateRaw).toHaveBeenCalledOnce();
    expect(prisma.$runCommandRaw).toHaveBeenCalledTimes(0);
    expect(response?.status).toBe(201);
    expect(result).toEqual("Message not found");
  });

  it("receives invalid body, return JSON response with status code 400", async () => {
    // recreating NextRequest
    const nextReq = new NextRequest(
      new Request(`http://localhost:3000/api/v1/db/messages/lastaccess`, {
        method: "POST",
        headers: {
          "Content-Type": "Application/json",
        },
        body: JSON.stringify({
          channel_name: mock_channel_name,
        }),
      }),
      {}
    );

    const response = await POST(nextReq);

    expect(prisma.channel.aggregateRaw).toHaveBeenCalledTimes(0);
    expect(prisma.$runCommandRaw).toHaveBeenCalledTimes(0);
    expect(response?.status).toBe(400);
  });

  it("imitating DB down return error response with status code 500", async () => {
    // recreating NextRequest
    const nextReq = new NextRequest(
      new Request(`http://localhost:3000/api/v1/db/messages/lastaccess`, {
        method: "POST",
        headers: {
          "Content-Type": "Application/json",
        },
        body: JSON.stringify({
          user_id: mock_user_id,
          message_id: mock_message_id,
          channel_name: mock_channel_name,
        }),
      }),
      {}
    );

    prisma.channel.aggregateRaw.mockImplementation(() => {
      throw new Error("Database connection error");
    });

    const response = await POST(nextReq);

    expect(prisma.channel.aggregateRaw).toHaveBeenCalledOnce();
    expect(prisma.$runCommandRaw).toHaveBeenCalledTimes(0);
    expect(response?.status).toBe(500);
  });
});
