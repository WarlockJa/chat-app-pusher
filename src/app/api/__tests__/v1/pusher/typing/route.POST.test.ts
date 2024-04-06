import { POST } from "@/app/api/v1/pusher/typing/route";
import { pusherServer } from "@/lib/__mocks__/pusher";
import { TSchemaApiV1PusherTypingPost } from "@/lib/validators/pusher/generatedTypes";
import { NextRequest } from "next/server";
import { afterEach, describe, expect, it, vi } from "vitest";

const mockTypingBody: TSchemaApiV1PusherTypingPost = {
  channel_name: "presence-7f6bf857-1f52-40f6-b7c7-399b9b6702d4",
  author: "Test User",
};

describe("Testing pusher typing route POST request", () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  vi.mock("@/lib/apiPusherMethods/pusher", async () => {
    const actual = await vi.importActual<
      typeof import("@/lib/__mocks__/pusher")
    >("@/lib/__mocks__/pusher");
    return {
      ...actual,
    };
  });

  it("should receive valid body and trigger message event", async () => {
    // recreating NextRequest
    const nextReq = new NextRequest(
      new Request(`http://localhost:3000/api/v1/pusher/typing`, {
        method: "POST",
        headers: {
          "Content-Type": "Application/json",
        },
        body: JSON.stringify(mockTypingBody),
      }),
      {}
    );

    // @ts-ignore
    pusherServer.trigger.mockImplementation((channel_name, event, data) => {
      return Promise<true>;
    });

    const response = await POST(nextReq);

    expect(response.status).toBe(200);
    expect(pusherServer.trigger).toHaveBeenCalledOnce();
    expect(pusherServer.trigger).toBeCalledWith(
      mockTypingBody.channel_name,
      "typing",
      {
        author: mockTypingBody.author,
      }
    );
  });

  it("should return a validation error", async () => {
    // recreating NextRequest
    const nextReq = new NextRequest(
      new Request(`http://localhost:3000/api/v1/pusher/typing`, {
        method: "POST",
        headers: {
          "Content-Type": "Application/json",
        },
        body: JSON.stringify({}),
      }),
      {}
    );

    const response = await POST(nextReq);

    expect(pusherServer.trigger).toHaveBeenCalledTimes(0);
    expect(response.status).toBe(400);
  });

  it("should return an error 500 when request body is not present", async () => {
    // recreating NextRequest
    const nextReq = new NextRequest(
      new Request(`http://localhost:3000/api/v1/pusher/typing`, {
        method: "POST",
        headers: {
          "Content-Type": "Application/json",
        },
      }),
      {}
    );

    const response = await POST(nextReq);

    expect(pusherServer.trigger).toHaveBeenCalledTimes(0);
    expect(response.status).toBe(500);
  });

  it("should return a 500 error when pusher service is down", async () => {
    // recreating NextRequest
    const nextReq = new NextRequest(
      new Request(`http://localhost:3000/api/v1/pusher/typing`, {
        method: "POST",
        headers: {
          "Content-Type": "Application/json",
        },
        body: JSON.stringify(mockTypingBody),
      }),
      {}
    );

    pusherServer.trigger.mockImplementation(() => {
      throw new Error("Database connection error");
    });

    const response = await POST(nextReq);

    expect(response.status).toBe(500);
  });
});
