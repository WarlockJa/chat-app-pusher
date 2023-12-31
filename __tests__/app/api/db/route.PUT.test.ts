import { PUT } from "@/app/api/db/route";
import { prisma } from "@/lib/__mocks__/globalForPrisma";
import { NextRequest } from "next/server";
import { afterEach, describe, expect, it, vi } from "vitest";

// testing POST with mocks for NextRequest and Prisma MongoDB call
describe("Running POST request", () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  // following (loosely) prisma guide https://www.prisma.io/blog/testing-series-1-8eRB5p0Y8o
  vi.mock("@/lib/globalForPrisma", async () => {
    const actual = await vi.importActual<
      typeof import("@/lib/__mocks__/globalForPrisma")
    >("@/lib/__mocks__/globalForPrisma");
    return {
      ...actual,
    };
  });

  it("adding new message to the exsiting room in the DB returns JSON response with status code 200", async () => {
    // recreating NextRequest
    const nextReq = new NextRequest(
      new Request("http://localhost:3000", {
        method: "PUT",
        body: JSON.stringify({
          userId: "abc123",
          room: "presence-abc123",
          message: "message",
        }),
      }),
      {}
    );

    // mock DB data
    const expectedDBCallObject_findFirst = {
      where: {
        name: "presence-abc123",
      },
    };

    const expectedDBCallObject_update = {
      where: {
        name: "presence-abc123",
      },
      data: {
        messages: {
          push: [
            {
              text: "message",
              author: "abc123",
              readusers: ["abc123"],
            },
          ],
        },
      },
    };

    const mockDBResult_findFirst = {
      id: "abcdefghijklmn123456789",
      name: "presence-abc123",
      messages: [],
    };

    const mockDBResult_update = {
      messages: [
        {
          author: "abc123",
          text: "message",
          timestamp: "2023-12-29T09:42:08.000Z",
          readusers: ["abc123"],
        },
      ],
      id: "abcdefghijklmn123456789",
      name: "presence-abc123",
    };

    // searching for the existing room in DB
    prisma.channel.findFirst.mockResolvedValue(mockDBResult_findFirst);
    // @ts-ignore timestap arrives as string
    prisma.channel.update.mockResolvedValue(mockDBResult_update);

    const response = await PUT(nextReq);
    const result = await response.json();

    expect(response.status).toBe(200);
    expect(prisma.channel.findFirst).toHaveBeenCalledOnce();
    expect(prisma.channel.findFirst).toBeCalledWith(
      expectedDBCallObject_findFirst
    );
    expect(prisma.channel.update).toBeCalledWith(expectedDBCallObject_update);
    expect(prisma.channel.create).toBeCalledTimes(0);
    expect(result).toEqual(mockDBResult_update);
  });

  it("adding new message to the room not found in the DB returns JSON response with status code 200", async () => {
    // recreating NextRequest
    const nextReq = new NextRequest(
      new Request("http://localhost:3000", {
        method: "PUT",
        body: JSON.stringify({
          userId: "abc123",
          room: "presence-abc123",
          message: "message",
        }),
      }),
      {}
    );

    // mock DB data
    const expectedDBCallObject_findFirst = {
      where: {
        name: "presence-abc123",
      },
    };

    const expectedDBCallObject_create = {
      data: {
        name: "presence-abc123",
        messages: [
          {
            text: "message",
            author: "abc123",
            readusers: ["abc123"],
          },
        ],
      },
    };

    const mockDBResult_findFirst = null;

    const mockDBResult_create = {
      messages: [
        {
          author: "abc123",
          text: "message",
          timestamp: "2023-12-29T09:42:08.000Z",
          readusers: ["abc123"],
        },
      ],
      id: "abcdefghijklmn123456789",
      name: "presence-abc123",
    };

    // searching for the non-existing room in DB
    prisma.channel.findFirst.mockResolvedValue(mockDBResult_findFirst);
    // @ts-ignore timestap arrives as string
    prisma.channel.create.mockResolvedValue(mockDBResult_create);

    const response = await PUT(nextReq);
    const result = await response.json();

    expect(response.status).toBe(200);
    expect(prisma.channel.findFirst).toHaveBeenCalledOnce();
    expect(prisma.channel.findFirst).toBeCalledWith(
      expectedDBCallObject_findFirst
    );
    expect(prisma.channel.update).toBeCalledTimes(0);
    expect(prisma.channel.create).toHaveBeenCalledOnce();
    expect(prisma.channel.create).toBeCalledWith(expectedDBCallObject_create);
    expect(result).toEqual(mockDBResult_create);
  });

  it("imitating DB down return error response with status code 500", async () => {
    // recreating NextRequest
    const nextReq = new NextRequest(
      new Request("http://localhost:3000", {
        method: "PUT",
        body: JSON.stringify({
          userId: "abc123",
          room: "presence-abc123",
          message: "message",
        }),
      }),
      {}
    );

    // mock DB data
    const expectedDBCallObject_findFirst = {
      where: {
        name: "presence-abc123",
      },
    };

    const mockDBResult_findFirst = {};

    const response = await PUT(nextReq);
    const result = await response.json();

    expect(response.status).toBe(500);
    expect(prisma.channel.findFirst).toHaveBeenCalledOnce();
    expect(prisma.channel.findFirst).toBeCalledWith(
      expectedDBCallObject_findFirst
    );
    expect(result).toEqual(mockDBResult_findFirst);
  });
});
