import { IChatData } from "@/context/innerContexts/ChatDataProvider";
import getOlderMessage from "@/util/getOlderMessage";
import { describe, expect, it } from "vitest";

// tested function takes two Intersection Observer Objects containing message_id
// these two message_id found in ChatData Object and compared.
// the IIOObject with the older message_id is returned

const testRoomChatData: IChatData = {
  room_id: "test room id",
  state: "success",
  messages: [
    {
      id: "test message id 1",
      author: "test author 1",
      text: "text",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      unread: false,
    },
    {
      id: "test message id 2",
      author: "test author 2",
      text: "text",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
      unread: false,
    },
    {
      id: "test message id 3",
      author: "test author 1",
      text: "text",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
      unread: false,
    },
  ],
};

describe("Testing getOlderMessage helper function", () => {
  it("Sending two valid IIO and getting IIOObject for the older message_id", () => {
    const firstIIOObject: IIODebouncedEntry = {
      message_id: "test message id 1",
      entryTimestamp: Date.now() - 1000 * 60 * 60 * 1,
    };
    const secondIIOObject: IIODebouncedEntry = {
      message_id: "test message id 2",
      entryTimestamp: Date.now() - 1000 * 60 * 60 * 2,
    };

    const expectedResult: IIODebouncedEntry = {
      message_id: "test message id 1",
      entryTimestamp: Date.now() - 1000 * 60 * 60 * 1,
    };

    const result = getOlderMessage({
      first: firstIIOObject,
      second: secondIIOObject,
      activeRoom_chatData: testRoomChatData,
    });

    expect(result).toEqual(expectedResult);
  });

  it("Sending two same IIO and getting IIOObject", () => {
    const firstIIOObject: IIODebouncedEntry = {
      message_id: "test message id 1",
      entryTimestamp: Date.now() - 1000 * 60 * 60 * 1,
    };

    const expectedResult: IIODebouncedEntry = {
      message_id: "test message id 1",
      entryTimestamp: Date.now() - 1000 * 60 * 60 * 1,
    };

    const result = getOlderMessage({
      first: firstIIOObject,
      second: firstIIOObject,
      activeRoom_chatData: testRoomChatData,
    });

    expect(result).toEqual(expectedResult);
  });

  it("Sending two valid IIO with empty room data returns undefined", () => {
    const firstIIOObject: IIODebouncedEntry = {
      message_id: "test message id 1",
      entryTimestamp: Date.now() - 1000 * 60 * 60 * 1,
    };
    const secondIIOObject: IIODebouncedEntry = {
      message_id: "test message id 2",
      entryTimestamp: Date.now() - 1000 * 60 * 60 * 2,
    };

    const result = getOlderMessage({
      first: firstIIOObject,
      second: secondIIOObject,
      // @ts-expect-error
      activeRoom_chatData: {},
    });

    expect(result).toEqual(undefined);
  });

  it("Sending an invalid IIO returns undefined", () => {
    const firstIIOObject: IIODebouncedEntry = {
      message_id: "test message id invalid",
      entryTimestamp: Date.now() - 1000 * 60 * 60 * 1,
    };
    const secondIIOObject: IIODebouncedEntry = {
      message_id: "test message id 2",
      entryTimestamp: Date.now() - 1000 * 60 * 60 * 2,
    };

    const result = getOlderMessage({
      first: firstIIOObject,
      second: secondIIOObject,
      activeRoom_chatData: testRoomChatData,
    });

    expect(result).toEqual(undefined);
  });
});
