import { POST } from "@/app/api/v1/db/messages/new/route";
import { prisma } from "@/lib/__mocks__/globalForPrisma";
import { NextRequest } from "next/server";
import { afterEach, describe, expect, it, vi } from "vitest";

// testing POST with mocks for NextRequest and Prisma MongoDB call
describe("Running POST request", () => {
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

  it("adding new message to the exsiting room in the DB returns JSON response with status code 200", async () => {
    // await apiAuth_authenticate(mockUser);

    // recreating NextRequest
    const nextReq = new NextRequest(
      new Request("http://localhost:3000/api/v1/db/messages/new", {
        method: "POST",
        headers: {
          "Content-Type": "Application/json",
        },
        body: JSON.stringify({
          author: "4765440c-6d54-48fc-b8ec-d8fab8a75502",
          message_id: "4765440c-6d54-48fc-b8ec-d8fab8a75503",
          channel_name: "presence-4765440c-6d54-48fc-b8ec-d8fab8a75502",
          message_text: "message",
        }),
      }),
      {}
    );

    // mongodb response format
    const mockDBResult_runCommanRaw = { n: 1, nModified: 1, ok: 1 };

    // searching for the existing room in DB
    prisma.$runCommandRaw.mockResolvedValue(mockDBResult_runCommanRaw);

    const response = await POST(nextReq);
    const result = await response.json();

    expect(response.status).toBe(200);
    expect(result).toEqual(mockDBResult_runCommanRaw);
    expect(prisma.$runCommandRaw).toHaveBeenCalledOnce();
  });

  it("adding new message to the room not found in the DB returns JSON response with status code 200", async () => {
    // recreating NextRequest
    const nextReq = new NextRequest(
      new Request("http://localhost:3000/api/v1/db/messages/new", {
        method: "POST",
        headers: {
          "Content-Type": "Application/json",
        },
        body: JSON.stringify({
          author: "4765440c-6d54-48fc-b8ec-d8fab8a75502",
          message_id: "4765440c-6d54-48fc-b8ec-d8fab8a75503",
          channel_name: "presence-4765440c-6d54-48fc-b8ec-d8fab8a75502",
          message_text: "message",
        }),
      }),
      {}
    );

    // mongodb response format
    const mockDBResult_runCommandRaw = {
      n: 2,
      upserted: [
        {
          index: 0,
          _id: {
            $oid: "65d22ac2b03146ec204daead",
          },
        },
      ],
      nModified: 1,
      ok: 1,
    };

    // searching for the existing room in DB
    prisma.$runCommandRaw.mockResolvedValue(mockDBResult_runCommandRaw);

    const response = await POST(nextReq);
    const result = await response.json();

    expect(response.status).toBe(200);
    expect(result).toEqual(mockDBResult_runCommandRaw);
    expect(prisma.$runCommandRaw).toHaveBeenCalledOnce();
  });

  it("should return a validation error 400 when invalid body is passed", async () => {
    // recreating NextRequest
    const nextReq = new NextRequest(
      new Request("http://localhost:3000/api/v1/db/messages/new", {
        method: "POST",
        headers: {
          "Content-Type": "Application/json",
        },
        body: JSON.stringify({
          author: "4765440c-6d54-48fc-b8ec-d8fab8a75502",
          channel_name: "presence-4765440c-6d54-48fc-b8ec-d8fab8a75502",
          message_text: "message",
        }),
      }),
      {}
    );

    const response = await POST(nextReq);

    expect(response.status).toBe(400);
    expect(prisma.$runCommandRaw).toHaveBeenCalledTimes(0);
  });

  it("imitating DB down return error response with status code 500", async () => {
    // recreating NextRequest
    const nextReq = new NextRequest(
      new Request("http://localhost:3000/api/v1/db/messages/new", {
        method: "POST",
        headers: {
          "Content-Type": "Application/json",
        },
        body: JSON.stringify({
          author: "4765440c-6d54-48fc-b8ec-d8fab8a75502",
          message_id: "4765440c-6d54-48fc-b8ec-d8fab8a75503",
          channel_name: "presence-4765440c-6d54-48fc-b8ec-d8fab8a75502",
          message_text: "message",
        }),
      }),
      {}
    );

    const mockDBResult_runCommandRaw = {};

    const response = await POST(nextReq);
    const result = await response.json();

    expect(response.status).toBe(500);
    expect(prisma.$runCommandRaw).toHaveBeenCalledOnce();
    expect(result).toEqual(mockDBResult_runCommandRaw);
  });
});
