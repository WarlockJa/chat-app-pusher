import { POST } from "@/app/api/v1/auth/route";
import generateSignature from "@/util/crypto/aes-cbc/generateSignature";
import { authenticate } from "@/util/jwt/authenticate";
import { loadEnvConfig } from "@next/env";
import { NextRequest } from "next/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mockValidUser = {
  user_id: "4765440c-6d54-48fc-b8ec-d8fab8a75502",
  user_admin: false,
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

  // mocking server only function cookies()
  vi.mock("next/headers", async (importOriginal) => {
    return {
      cookies: () => {
        return {
          // Implement custom logic for get(name) here
          set: (name: string) => {
            // Define the behavior for getting a specific cookie value
            if (name === "pusher-chat") {
              return { value: "true" }; // Or any desired value
            } else {
              return undefined;
            }
          },
        };
      },
    };
  });

  // mocking authenticate function that deals with cookies and therefore is server only
  vi.mock("@/util/jwt/authenticate", async (importOriginal) => {
    return {
      authenticate: (user: IAccessToken) => {
        if (
          user.user_id !== mockValidUser.user_id ||
          user.user_admin !== mockValidUser.user_admin
        ) {
          throw new Error();
        }
        return Promise<void>;
      },
    };
  });

  it("should authenticate user with valid credentials", async () => {
    // calling real function generateSignature with test NEXT_PUBLIC_API_SIGNATURE_KEY
    const mockSignature = generateSignature({
      key: process.env.NEXT_PUBLIC_API_SIGNATURE_KEY!,
    });
    // recreating NextRequest
    const nextReq = new NextRequest(
      new Request("http://localhost:3000/api/v1/auth", {
        method: "POST",
        headers: {
          "Content-Type": "Application/json",
        },
        body: JSON.stringify({ ...mockValidUser, signature: mockSignature }),
      }),
      {}
    );

    const response = await POST(nextReq);

    expect(response.status).toBe(200);
  });

  it("should return a validation error", async () => {
    const mockSignature = generateSignature({
      key: process.env.NEXT_PUBLIC_API_SIGNATURE_KEY!,
    });
    // recreating NextRequest
    const nextReq = new NextRequest(
      new Request("http://localhost:3000/api/v1/auth", {
        method: "POST",
        headers: {
          "Content-Type": "Application/json",
        },
        body: JSON.stringify({
          user_id: mockValidUser.user_id,
          signature: mockSignature,
        }),
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
      new Request("http://localhost:3000/api/v1/auth", {
        method: "POST",
        headers: {
          "Content-Type": "Application/json",
        },
        body: JSON.stringify({ ...mockValidUser, signature: mockSignature }),
      }),
      {}
    );

    const response = await POST(nextReq);

    expect(response.status).toBe(403);
  });

  it("should return a 403 error when signature is missing", async () => {
    // recreating NextRequest
    const nextReq = new NextRequest(
      new Request("http://localhost:3000/api/v1/auth", {
        method: "POST",
        headers: {
          "Content-Type": "Application/json",
        },
        body: JSON.stringify(mockValidUser),
      }),
      {}
    );

    const response = await POST(nextReq);

    expect(response.status).toBe(403);
  });

  it("should return a 500 error when body is missing", async () => {
    // recreating NextRequest
    const nextReq = new NextRequest(
      new Request("http://localhost:3000/api/v1/auth", {
        method: "POST",
        headers: {
          "Content-Type": "Application/json",
        },
      }),
      {}
    );

    const response = await POST(nextReq);

    expect(response.status).toBe(500);
  });
});
