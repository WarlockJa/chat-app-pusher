import { authenticate } from "@/util/jwt/authenticate";
import { loadEnvConfig } from "@next/env";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mockValidUser = {
  user_id: "4765440c-6d54-48fc-b8ec-d8fab8a75502",
  user_admin: false,
};

describe("Testing jwt authenticate function", () => {
  beforeEach(() => {
    loadEnvConfig(process.cwd());
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  // mocking server only function cookies()
  vi.mock("next/headers", async (importOriginal) => {
    return {
      cookies: () => {
        return {
          // Implement custom logic for get(name) here
          set: (
            name: string,
            session: string,
            args: { expires: Date; httpOnly: true }
          ) => {
            // confirming that mocked cookies().set() is called with correct input
            if (
              session === JSON.stringify(mockValidUser) &&
              name === "pusher-chat" &&
              args.httpOnly
            ) {
              return { value: "true" }; // Or any desired value
            } else {
              throw new Error("cookies.set error");
            }
          },
        };
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
        payload: { userToken: IAccessToken; expires: Date };
        secretKey: string;
      }) => {
        // confirming that mocked encrypt is called with correct input
        if (
          payload.userToken.user_id !== mockValidUser.user_id ||
          payload.userToken.user_admin !== mockValidUser.user_admin ||
          secretKey !== process.env.NEXT_PUBLIC_API_JWT_SECRET!
        )
          throw new Error("Encrypt error");
        return JSON.stringify(payload.userToken);
      },
    };
  });

  it("should authenticate user with valid credentials", async () => {
    await authenticate(mockValidUser);
  });

  it("should throw an encryption error when complete user data is not provided", async () => {
    expect(async () => {
      // @ts-expect-error
      await authenticate({ user_id: mockValidUser.user_id });
    }).rejects.toThrowError();

    expect(async () => {
      // @ts-expect-error
      await authenticate({ user_admin: mockValidUser.user_admin });
    }).rejects.toThrowError();

    expect(async () => {
      // @ts-expect-error
      await authenticate();
    }).rejects.toThrowError();
  });
});
