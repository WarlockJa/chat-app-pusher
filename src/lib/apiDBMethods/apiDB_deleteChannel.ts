import { TSchemaApiV1dbChannelDELETE } from "../validators/db/channel/generatedTypes";

export default function apiDB_deleteChannel(body: TSchemaApiV1dbChannelDELETE) {
  fetch("/api/v1/db/channel", {
    method: "DELETE",
    headers: {
      "Content-Type": "Application/json",
    },
    body: JSON.stringify(body),
  }).catch((error: Error) => {
    throw new Error(error.message);
  });
}
