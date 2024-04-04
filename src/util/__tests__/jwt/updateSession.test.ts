import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { loadEnvConfig } from "@next/env";
import { NextRequest } from "next/server";
import { updateSession } from "@/util/jwt/updateSession";

const mockSession = "session string";
const mockDecryptPayload = "decrypted payload";

describe("Testing jwt updateSession function", () => {
  beforeEach(() => {
    loadEnvConfig(process.cwd());
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  // mocking authenticate function that deals with cookies and therefore is server only
  vi.mock("@/util/jwt/decrypt", async (importOriginal) => {
    return {
      decrypt: async ({
        input,
        secretKey,
      }: {
        input: string;
        secretKey: string;
      }) => {
        // confirming that mocked encrypt is called with correct input
        if (
          input !== mockSession ||
          secretKey !== process.env.NEXT_PUBLIC_API_JWT_SECRET!
        )
          throw new Error("Encrypt error");
        return { value: mockDecryptPayload };
      },
    };
  });

  // mocking authenticate function that deals with cookies and therefore is server only
  vi.mock("@/util/jwt/encrypt", async (importOriginal) => {
    return {
      encrypt: async ({
        payload,
        secretKey,
      }: {
        payload: { value: string; expires: Date };
        secretKey: string;
      }) => {
        // confirming that mocked encrypt is called with correct input
        if (
          payload.value !== mockDecryptPayload ||
          secretKey !== process.env.NEXT_PUBLIC_API_JWT_SECRET!
        )
          throw new Error("Encrypt error");
        return payload.value;
      },
    };
  });

  it("should update authentication cookie", async () => {
    const expiredDate = new Date(2000, 1, 1, 12);
    const mockCookie = {
      name: "pusher-chat",
      value: mockSession,
      httpOnly: true,
      expires: expiredDate,
    };
    // recreating NextRequest
    const nextReq = new NextRequest(
      new Request(`http://localhost:3000/api/v1/db/channel`, {
        method: "GET",
      }),
      {}
    );
    nextReq.cookies.set(mockCookie);

    const result = await updateSession(nextReq);
    const testCookie = result.cookies.get("pusher-chat");
    expect(testCookie?.value).toBe(mockDecryptPayload);
    expect(testCookie?.expires && testCookie.expires > expiredDate).toBe(true);
    expect(testCookie?.httpOnly).toBe(true);
  });

  it("should return 401 authentication error when cookie not present", async () => {
    // recreating NextRequest
    const nextReq = new NextRequest(
      new Request(`http://localhost:3000/api/v1/db/channel`, {
        method: "GET",
      }),
      {}
    );

    const result = await updateSession(nextReq);
    expect(result.status).toBe(401);
  });
});
