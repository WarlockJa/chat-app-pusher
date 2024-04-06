import { POST } from "@/app/api/v1/pusher/auth/route";
import { pusherServer } from "@/lib/__mocks__/pusher";
import generateSignature from "@/util/crypto/aes-cbc/generateSignature";
import { loadEnvConfig } from "@next/env";
import { NextRequest } from "next/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mock_socket_id = "180247.32858607";
const mock_channel_name = "presence-7f6bf857-1f52-40f6-b7c7-399b9b6702d4";
const mock_user_id = "7f6bf857-1f52-40f6-b7c7-399b9b6702d4";
const mock_user_name = "Test User";
const mock_user_admin = false;

const mockPusherAuthorizeChannelResponse = {
  channel_data:
    '{"user_id":"7f6bf857-1f52-40f6-b7c7-399b9b6702d4","user_name":"Test User","user_admin":false}',
  auth: "4550f02015d4f306974a:4aa2000f6a3a419c77b767306dba046f44864ddd25bf40c85677f3faae514e3d",
};

const mockPresenceData = {
  user_id: mock_user_id,
  user_info: {
    user_admin: mock_user_admin,
    user_name: mock_user_name,
  },
};

describe("Testing auth route POST request", () => {
  beforeEach(() => {
    loadEnvConfig(process.cwd());
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.resetAllMocks();
    vi.useRealTimers();
  });

  vi.mock("@/lib/apiPusherMethods/pusher", async () => {
    const actual = await vi.importActual<
      typeof import("@/lib/__mocks__/pusher")
    >("@/lib/__mocks__/pusher");
    return {
      ...actual,
    };
  });

  it("should authenticate user with valid credentials", async () => {
    // calling real function generateSignature with test NEXT_PUBLIC_API_SIGNATURE_KEY
    const mockSignature = generateSignature({
      key: process.env.NEXT_PUBLIC_API_SIGNATURE_KEY!,
    });
    // recreating NextRequest
    const nextReq = new NextRequest(
      new Request(`http://localhost:3000/api/v1/pusher/auth`, {
        method: "POST",
        headers: {
          "Content-Type": "Application/json",
        },
        body: `socket_id=${mock_socket_id}&channel_name=${mock_channel_name}&user_id=${mock_user_id}&user_admin=${mock_user_admin}&user_name=${mock_user_name}&signature=${mockSignature}`,
      }),
      {}
    );

    pusherServer.authorizeChannel.mockResolvedValue(
      mockPusherAuthorizeChannelResponse
    );

    const response = await POST(nextReq);

    expect(response.status).toBe(200);
    expect(pusherServer.authorizeChannel).toBeCalledWith(
      mock_socket_id,
      mock_channel_name,
      mockPresenceData
    );
  });

  it("should return a validation error", async () => {
    const mockSignature = generateSignature({
      key: process.env.NEXT_PUBLIC_API_SIGNATURE_KEY!,
    });
    // recreating NextRequest
    const nextReq = new NextRequest(
      new Request(`http://localhost:3000/api/v1/pusher/auth`, {
        method: "POST",
        headers: {
          "Content-Type": "Application/json",
        },
        body: `socket_id=${mock_socket_id}&channel_name=${mock_channel_name}&user_id=${mock_user_id}&user_admin=${mock_user_admin}&user_name=&signature=${mockSignature}`,
      }),
      {}
    );

    const response = await POST(nextReq);

    expect(response.status).toBe(400);
  });

  it("should return a 403 error when signature has expired", async () => {
    const expiredDate = new Date(2000, 1, 1, 12);

    // changing system time in order to generate an expired signature
    vi.setSystemTime(expiredDate);
    const mockSignature = generateSignature({
      key: process.env.NEXT_PUBLIC_API_SIGNATURE_KEY!,
    });

    // removing fake timer
    vi.useRealTimers();

    // recreating NextRequest
    const nextReq = new NextRequest(
      new Request(`http://localhost:3000/api/v1/pusher/auth`, {
        method: "POST",
        headers: {
          "Content-Type": "Application/json",
        },
        body: `socket_id=${mock_socket_id}&channel_name=${mock_channel_name}&user_id=${mock_user_id}&user_admin=${mock_user_admin}&user_name=${mock_user_name}&signature=${mockSignature}`,
      }),
      {}
    );

    pusherServer.authorizeChannel.mockResolvedValue(
      mockPusherAuthorizeChannelResponse
    );

    const response = await POST(nextReq);

    expect(response.status).toBe(403);
  });

  it("should return a 403 error when signature is missing", async () => {
    // recreating NextRequest
    const nextReq = new NextRequest(
      new Request(`http://localhost:3000/api/v1/pusher/auth`, {
        method: "POST",
        headers: {
          "Content-Type": "Application/json",
        },
        body: `socket_id=${mock_socket_id}&channel_name=${mock_channel_name}&user_id=${mock_user_id}&user_admin=${mock_user_admin}&user_name=${mock_user_name}`,
      }),
      {}
    );

    const response = await POST(nextReq);

    expect(response.status).toBe(403);
  });

  it("should return a 500 error when pusher service is down", async () => {
    const mockSignature = generateSignature({
      key: process.env.NEXT_PUBLIC_API_SIGNATURE_KEY!,
    });
    // recreating NextRequest
    const nextReq = new NextRequest(
      new Request(`http://localhost:3000/api/v1/pusher/auth`, {
        method: "POST",
        headers: {
          "Content-Type": "Application/json",
        },
        body: `socket_id=${mock_socket_id}&channel_name=${mock_channel_name}&user_id=${mock_user_id}&user_admin=${mock_user_admin}&user_name=${mock_user_name}&signature=${mockSignature}`,
      }),
      {}
    );

    pusherServer.authorizeChannel.mockImplementation(() => {
      throw new Error("Database connection error");
    });

    const response = await POST(nextReq);

    expect(response.status).toBe(500);
  });
});
