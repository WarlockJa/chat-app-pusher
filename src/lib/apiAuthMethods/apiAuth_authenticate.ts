import generateSignature from "@/util/crypto/aes-cbc/generateSignature";
import { TSchemaApiV1AuthPost } from "../validators/auth/generatedTypes";

export default function apiAuth_authenticate({
  user_admin,
  user_id,
}: TSchemaApiV1AuthPost) {
  fetch("/api/v1/auth", {
    method: "POST",
    headers: {
      "Content-Type": "Application/json",
      // API endpoints protection
      "pusher-chat-signature": generateSignature({
        key: process.env.NEXT_PUBLIC_API_SIGNATURE_KEY!,
      }),
    },
    body: JSON.stringify({
      user_id: user_id,
      user_admin: user_admin,
    }),
  }).catch((error) => {
    throw new Error(error);
  });
}
