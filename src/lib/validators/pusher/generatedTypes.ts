import { z } from "zod";
import { schemaApiV1PusherMessagePost } from "./message";
import { schemaApiV1PusherTypingPost } from "./typing";

export type TSchemaApiV1PusherMessagePost = z.infer<
  typeof schemaApiV1PusherMessagePost
>;
export type TSchemaApiV1PusherTypingPost = z.infer<
  typeof schemaApiV1PusherTypingPost
>;
