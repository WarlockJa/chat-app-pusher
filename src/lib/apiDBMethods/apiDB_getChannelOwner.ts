import { User } from "@prisma/client";
import { TPrisma_User } from "../prisma/prisma";

export default function apiDB_getChannelOwner({
  author,
  knownUsers_addNewUser,
}: {
  author: string;
  knownUsers_addNewUser: (user: TPrisma_User) => void;
}) {
  fetch(`api/v1/db/channel/owner?channel_name=presence-${author}`)
    .then((response) => response.json())
    .then((result: User | null) => {
      knownUsers_addNewUser({
        user_id: author,
        user_admin: result?.user_admin ? result.user_admin : false,
        user_name: result?.user_name ? result.user_name : "user deleted",
      });
    });
}
