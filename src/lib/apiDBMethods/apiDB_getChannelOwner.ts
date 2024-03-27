import { User } from "@prisma/client";
import { IKnownUsersAddUser } from "@/context/innerContexts/KnownUsersProvider";
import generateSignature from "@/util/crypto/aes-cbc/generateSignature";

export default function apiDB_getChannelOwner({
  author,
  dispatchKnownUsers,
}: {
  author: string;
  dispatchKnownUsers: (action: IKnownUsersAddUser) => void;
}) {
  fetch(`api/v1/db/channel/owner?channel_name=presence-${author}`, {
    method: "GET",
    headers: {
      "pusher-chat-signature": generateSignature({
        key: process.env.NEXT_PUBLIC_API_SIGNATURE_KEY!,
      }),
    },
  })
    .then((response) => response.json())
    .then((result: User | null) => {
      dispatchKnownUsers({
        type: "KnownUsers_addKnownUser",
        user: {
          user_id: author,
          user_admin: result?.user_admin ? result.user_admin : false,
          user_name: result?.user_name ? result.user_name : "user deleted",
        },
      });
    });
}
