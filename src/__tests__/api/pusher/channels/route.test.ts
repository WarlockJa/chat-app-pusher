import { createMocks } from "node-mocks-http";
import { Mock, afterEach, describe, expect, it, vi } from "vitest";
import { GET } from "@/app/api/pusher/channels/route";
import { pusherServer } from "@/lib/pusher";
import { PassThrough } from "stream";

describe("Running POST request", () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  it("should receive valid request body and return JSON response with status code 200", async () => {
    const { req } = createMocks({
      method: "GET",
    });

    vi.mock("@/lib/pusher");

    const meta = {
      "Content-Type": "application/json",
      Accept: "*/*",
    };
    const headers = new Headers(meta);

    const ResponseInit = {
      status: 200,
      statusText: "fail",
      headers: headers,
    };

    const mockData = { channels: {} };
    const getMockData = new PassThrough();

    (pusherServer.get as Mock).mockResolvedValue({
      status: 200,
      body: vi.fn().mockResolvedValue(mockData),
    });
    // const mockResponse = (pusherServer.get as Mock).mockResolvedValue({
    //   status: 200,
    //   body: Promise.resolve(getMockData),
    // });

    // @ts-ignore For testing purposes. GET does not expect any parameters.
    const response = await GET(req);
    const data = await response.json();
    // expect(response.status).toBe(200);
    // const data = await response.json();
    // console.log(data);
    // expect(data).toEqual({ channels: {} });
  });
});
