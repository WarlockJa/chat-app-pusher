import { afterEach, describe, expect, it, vi } from "vitest";

describe("testing fetch helper for room messages", () => {
  const fetchMock = vi.spyOn(window, "fetch");

  afterEach(() => {
    fetchMock.mockClear();
  });

  it('should send a POST request to "/api/db" with correct headers and body and call the callback function with roomId and messages', () => {
    const callbackMock = vi.fn();

    const userId = "user123";
    const room = "room123";
    const roomId = "room123";
    const messages = [{ id: "message1", content: "Hello" }];

    fetchMock.mockResolvedValueOnce(
      json: vi.fn().mockResolvedValueOnce({ messages }),
    );

    fetchRoomMessages({ userId, room, callback: callbackMock });

    expect(fetchMock).toHaveBeenCalledWith("/api/db", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        room,
      }),
    });

    expect(callbackMock).toHaveBeenCalledWith({ roomId, messages });

    fetchMock.mockRestore();
  });
});
