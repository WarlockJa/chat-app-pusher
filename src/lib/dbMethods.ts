import { z } from "zod";
import { schemaApiDBPUT } from "./validators";

type schemaDBPut = z.infer<typeof schemaApiDBPUT>;

export function updateLastAccessTimestamp(body: schemaDBPut) {
  fetch("/api/v1/db", {
    method: "PUT",
    body: JSON.stringify(body),
  });
}
