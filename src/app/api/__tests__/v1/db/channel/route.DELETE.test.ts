import { DELETE } from "@/app/api/v1/db/channel/route";
import { prisma } from "@/lib/__mocks__/globalForPrisma";
import { NextRequest } from "next/server";
import { afterEach, describe, expect, it, vi } from "vitest";

const mock_channel_name = "presence-4765440c-6d54-48fc-b8ec-d8fab8a75502";

describe("Running channel DELETE request", () => {
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
        method: "DELETE",
        headers: {
          "Content-Type": "Application/json",
        },
        body: JSON.stringify({ channel_name: mock_channel_name }),
      }),
      {}
    );

    // mock DB response data
    const mockPrismaDeleteResult = true;

    // @ts-ignore
    prisma.channel.delete.mockResolvedValue(mockPrismaDeleteResult);

    const response = await DELETE(nextReq);

    expect(prisma.channel.delete).toHaveBeenCalledOnce();
    expect(response?.status).toBe(200);
  });

  it("successful call to the DB with no channels found return JSON response with status code 200", async () => {
    // recreating NextRequest
    const nextReq = new NextRequest(
      new Request(`http://localhost:3000/api/v1/db/channel`, {
        method: "DELETE",
        headers: {
          "Content-Type": "Application/json",
        },
        body: JSON.stringify({ channel_name: mock_channel_name }),
      }),
      {}
    );

    // mock DB response data
    const mockPrismaDeleteResult = false;

    // @ts-ignore
    prisma.channel.delete.mockResolvedValue(mockPrismaDeleteResult);

    const response = await DELETE(nextReq);

    expect(prisma.channel.delete).toHaveBeenCalledOnce();
    expect(response?.status).toBe(200);
  });

  it("receives invalid body, return JSON response with status code 400", async () => {
    // recreating NextRequest
    const nextReq = new NextRequest(
      new Request(`http://localhost:3000/api/v1/db/channel`, {
        method: "DELETE",
        headers: {
          "Content-Type": "Application/json",
        },
        body: JSON.stringify({ channel_name: "invalid" }),
      }),
      {}
    );

    const response = await DELETE(nextReq);

    expect(prisma.channel.delete).toHaveBeenCalledTimes(0);
    expect(response?.status).toBe(400);
  });

  it("imitating DB down return error response with status code 500", async () => {
    // recreating NextRequest
    const nextReq = new NextRequest(
      new Request(`http://localhost:3000/api/v1/db/channel`, {
        method: "DELETE",
        headers: {
          "Content-Type": "Application/json",
        },
        body: JSON.stringify({ channel_name: mock_channel_name }),
      }),
      {}
    );

    prisma.channel.delete.mockImplementation(() => {
      throw new Error("Database connection error");
    });

    const response = await DELETE(nextReq);

    expect(prisma.channel.delete).toHaveBeenCalledOnce();
    expect(response?.status).toBe(500);
  });
});
