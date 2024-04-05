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

  it("successful call to the DB with existing channel and user data unchanged return JSON response with status code 200", async () => {
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

  //   it("successful call to the DB with existing channel, user data has changed return JSON response with status code 200", async () => {
  //     // recreating NextRequest
  //     const nextReq = new NextRequest(
  //       new Request(`http://localhost:3000/api/v1/db/channel`, {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "Application/json",
  //         },
  //         body: JSON.stringify({
  //           user_id: mockUser.user_id,
  //           user_name: mockUser.user_name.concat("test"),
  //           user_admin: !mockUser.user_admin,
  //           channel_name: mock_channel_name,
  //         }),
  //       }),
  //       {}
  //     );

  //     // mock DB findUnique response data
  //     const mockPrismaFindUniqueResult = {
  //       owner: mockUser,
  //     };

  //     // mock DB $runCommandRaw response data
  //     const mockPrismaRunCommandRawResult = {
  //       n: 1,
  //       nModified: 1,
  //       ok: 1,
  //     };

  //     // @ts-ignore
  //     prisma.channel.findUnique.mockResolvedValue(mockPrismaFindUniqueResult);
  //     prisma.$runCommandRaw.mockResolvedValue(mockPrismaRunCommandRawResult);

  //     const response = await POST(nextReq);
  //     const result = await response?.json();

  //     expect(prisma.channel.findUnique).toHaveBeenCalledOnce();
  //     expect(prisma.channel.create).toHaveBeenCalledTimes(0);
  //     expect(prisma.$runCommandRaw).toHaveBeenCalledTimes(1);
  //     expect(response?.status).toBe(200);
  //     expect(result).toEqual(mockPrismaRunCommandRawResult);
  //   });

  //   it("successful call to the DB with existing channel, user data has partially changed return JSON response with status code 200", async () => {
  //     // recreating NextRequest
  //     const nextReq = new NextRequest(
  //       new Request(`http://localhost:3000/api/v1/db/channel`, {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "Application/json",
  //         },
  //         body: JSON.stringify({
  //           user_id: mockUser.user_id,
  //           user_name: mockUser.user_name,
  //           user_admin: !mockUser.user_admin,
  //           channel_name: mock_channel_name,
  //         }),
  //       }),
  //       {}
  //     );

  //     // mock DB findUnique response data
  //     const mockPrismaFindUniqueResult = {
  //       owner: mockUser,
  //     };

  //     // mock DB $runCommandRaw response data
  //     const mockPrismaRunCommandRawResult = {
  //       n: 1,
  //       nModified: 1,
  //       ok: 1,
  //     };

  //     // @ts-ignore
  //     prisma.channel.findUnique.mockResolvedValue(mockPrismaFindUniqueResult);
  //     prisma.$runCommandRaw.mockResolvedValue(mockPrismaRunCommandRawResult);

  //     const response = await POST(nextReq);
  //     const result = await response?.json();

  //     expect(prisma.channel.findUnique).toHaveBeenCalledOnce();
  //     expect(prisma.channel.create).toHaveBeenCalledTimes(0);
  //     expect(prisma.$runCommandRaw).toHaveBeenCalledTimes(1);
  //     expect(response?.status).toBe(200);
  //     expect(result).toEqual(mockPrismaRunCommandRawResult);
  //   });

  //   it("successful call to the DB without existing channel, return JSON response with status code 200", async () => {
  //     // recreating NextRequest
  //     const nextReq = new NextRequest(
  //       new Request(`http://localhost:3000/api/v1/db/channel`, {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "Application/json",
  //         },
  //         body: JSON.stringify({
  //           ...mockUser,
  //           channel_name: mock_channel_name,
  //         }),
  //       }),
  //       {}
  //     );

  //     // mock DB findUnique response data
  //     const mockPrismaFindUniqueResult = null;

  //     // mock DB $runCommandRaw response data
  //     const mockPrismaCreateResult = {
  //       owner: mockUser,
  //       messages: [],
  //       lastaccess: [],
  //       id: "660fd92c326c0f13c577a799",
  //       name: mock_channel_name,
  //       lastmessage: null,
  //     };

  //     // @ts-ignore
  //     prisma.channel.findUnique.mockResolvedValue(mockPrismaFindUniqueResult);
  //     prisma.channel.create.mockResolvedValue(mockPrismaCreateResult);

  //     const response = await POST(nextReq);
  //     const result = await response?.json();

  //     expect(prisma.channel.findUnique).toHaveBeenCalledOnce();
  //     expect(prisma.channel.create).toHaveBeenCalledTimes(1);
  //     expect(prisma.$runCommandRaw).toHaveBeenCalledTimes(0);
  //     expect(response?.status).toBe(200);
  //     expect(result).toEqual(mockPrismaCreateResult);
  //   });

  //   it("invalid body data, return JSON response with status code 400", async () => {
  //     // recreating NextRequest
  //     const nextReq = new NextRequest(
  //       new Request(`http://localhost:3000/api/v1/db/channel`, {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "Application/json",
  //         },
  //         body: JSON.stringify({
  //           channel_name: mock_channel_name,
  //         }),
  //       }),
  //       {}
  //     );

  //     const response = await POST(nextReq);

  //     expect(prisma.channel.findUnique).toHaveBeenCalledTimes(0);
  //     expect(prisma.channel.create).toHaveBeenCalledTimes(0);
  //     expect(prisma.$runCommandRaw).toHaveBeenCalledTimes(0);
  //     expect(response?.status).toBe(400);
  //   });

  //   it("imitating DB down return error response with status code 500", async () => {
  //     // recreating NextRequest
  //     const nextReq = new NextRequest(
  //       new Request(`http://localhost:3000/api/v1/db/channel`, {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "Application/json",
  //         },
  //         body: JSON.stringify({
  //           ...mockUser,
  //           channel_name: mock_channel_name,
  //         }),
  //       }),
  //       {}
  //     );

  //     prisma.channel.findUnique.mockImplementation(() => {
  //       throw new Error("Database connection error");
  //     });

  //     const response = await POST(nextReq);

  //     expect(prisma.channel.findUnique).toHaveBeenCalledOnce();
  //     expect(prisma.channel.create).toHaveBeenCalledTimes(0);
  //     expect(prisma.$runCommandRaw).toHaveBeenCalledTimes(0);
  //     expect(response?.status).toBe(500);
  //   });
});
