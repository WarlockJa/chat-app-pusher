import { z } from "zod";
import {
  schemaApiV1dbGET,
  schemaApiV1dbPOST,
  schemaApiV1dbPUT,
} from "./validators";
import { channel } from "@prisma/client";
import {
  IChatDataAddRoomMessages,
  IChatDataSetRoomError,
} from "@/context/ChatDataProvider";

// inferring api endpoints expected types from zod models
type TSchemaDBPost = z.infer<typeof schemaApiV1dbPOST>;
type TSchemaDBPut = z.infer<typeof schemaApiV1dbPUT>;
type TSchemaDBGet = z.infer<typeof schemaApiV1dbGET>;

// adding message to the DB channel collection messages array
export function addChannelMessage(body: TSchemaDBPost) {
  fetch("/api/v1/db", {
    method: "POST",
    headers: {
      "Content-Type": "Application/json",
    },
    body: JSON.stringify(body),
  })
    .then((response) => response.json())
    .then((test) => console.log(test));
}

// updates user timestamp for the DB channel collection in lastaccess array
export function updateLastAccessTimestamp(body: TSchemaDBPut) {
  fetch("/api/v1/db", {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

// get messages from DB channel collection
export function getChannelMessages({
  params,
  dispatchChatData,
}: {
  params: TSchemaDBGet;
  dispatchChatData: (
    action: IChatDataAddRoomMessages | IChatDataSetRoomError
  ) => void;
}) {
  fetch(`/api/v1/db?roomId=${params.roomId}`)
    .then((response) => response.json())
    .then((result: channel) => {
      const messages = result.messages ? result.messages : [];
      console.log(result);
      dispatchChatData({
        type: "addRoomMessages",
        room_id: params.roomId,
        messages: messages,
      });
    })
    .catch((error) => {
      // error result is null check. No channel found in the DB
      // not actually an error, means no messages were ever created for this room
      error.message === "result is null"
        ? dispatchChatData({
            type: "addRoomMessages",
            room_id: params.roomId,
            messages: [],
          })
        : dispatchChatData({
            type: "setRoomError",
            room_id: params.roomId,
            error,
          });
    });
}
