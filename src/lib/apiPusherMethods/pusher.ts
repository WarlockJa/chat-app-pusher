import generateSignature from "@/util/crypto/aes-cbc/generateSignature";
import PusherServer from "pusher";
import PusherClient from "pusher-js";

export const pusherServer = new PusherServer({
  appId: process.env.NEXT_PUBLIC_PUSHER_APP_ID!,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
  secret: process.env.NEXT_PUBLIC_PUSHER_SECRET!,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
  useTLS: true,
});

export const pusherClient = ({
  user_id,
  user_admin,
  user_name,
}: {
  user_id: string;
  user_admin?: boolean;
  user_name?: string;
}) =>
  new PusherClient(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    authEndpoint: "/api/v1/pusher/auth",
    authTransport: "ajax",
    auth: {
      headers: {
        "Content-Type": "application/json",
      },
      params: {
        signature: generateSignature({
          key: process.env.NEXT_PUBLIC_API_SIGNATURE_KEY!,
        }),
        user_id,
        user_admin,
        user_name: user_name ? user_name : user_id,
      },
    },
  });
