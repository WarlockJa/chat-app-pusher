import { authenticate } from "@/util/jwt/authenticate";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { loadEnvConfig } from "@next/env";
import { cookies } from "next/headers";

const mockUserToken = {
  user_id: "7f6bf857-1f52-40f6-b7c7-399b9b6702d4",
  user_admin: true,
};

describe("Testing JWT authenticate function with positive mocks", () => {
  beforeEach(() => {
    loadEnvConfig(process.cwd());
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  vi.mock("next/headers", async (importOriginal) => {
    return {
      cookies: () => {
        return {
          // Implement custom logic for get(name) here
          set: (
            key: string,
            value: string,
            args: { expires: Date; httpOnly: true }
          ) => {
            // Define the behavior for getting a specific cookie value
            if (key === "pusher-chat") {
              return { value: true }; // Or any desired value
            } else {
              return undefined;
            }
          },
        };
      },
    };
  });

  it("should create a session and set an httpOnly cookie with valid user_id and user_admin values", async () => {
    const setSpy = vi.spyOn(cookies(), "set");
    await authenticate(mockUserToken);
    expect(setSpy).toHaveBeenCalledOnce();
  });
});
