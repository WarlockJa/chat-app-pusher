import { POST } from "@/app/api/v1/pusher/message/route";
import { pusherServer } from "@/lib/__mocks__/pusher";
import { TSchemaApiV1PusherMessagePost } from "@/lib/validators/pusher/generatedTypes";
import { NextRequest } from "next/server";
import { afterEach, describe, expect, it, vi } from "vitest";

const mockMessageBody: TSchemaApiV1PusherMessagePost = {
  message_id: "c781f6fe-0764-495d-8771-ef50e88170d3",
  message: "Test message",
  channel_name: "presence-7f6bf857-1f52-40f6-b7c7-399b9b6702d4",
  author: "7f6bf857-1f52-40f6-b7c7-399b9b6702d4",
};

describe("Testing pusher message route POST request", () => {
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
      new Request(`http://localhost:3000/api/v1/pusher/message`, {
        method: "POST",
        headers: {
          "Content-Type": "Application/json",
        },
        body: JSON.stringify(mockMessageBody),
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
      mockMessageBody.channel_name,
      "message",
      {
        message: mockMessageBody.message,
        author: mockMessageBody.author,
        message_id: mockMessageBody.message_id,
      }
    );
  });

  it("should return a validation error", async () => {
    // recreating NextRequest
    const nextReq = new NextRequest(
      new Request(`http://localhost:3000/api/v1/pusher/auth`, {
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
      new Request(`http://localhost:3000/api/v1/pusher/auth`, {
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
      new Request(`http://localhost:3000/api/v1/pusher/auth`, {
        method: "POST",
        headers: {
          "Content-Type": "Application/json",
        },
        body: JSON.stringify(mockMessageBody),
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
