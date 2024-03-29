import { User } from "@prisma/client";
import { IKnownUsersAddUser } from "@/context/innerContexts/KnownUsersProvider";
import apiRequestWrapperWithReauth from "../apiRequestWrapperWithReauth";

export default function apiDB_getChannelOwner({
  author,
  dispatchKnownUsers,
  accessToken,
}: {
  author: string;
  dispatchKnownUsers: (action: IKnownUsersAddUser) => void;
  accessToken: IAccessToken;
}) {
  const callback = (result: User | null) => {
    dispatchKnownUsers({
      type: "KnownUsers_addKnownUser",
      user: {
        user_id: author,
        user_admin: result?.user_admin ? result.user_admin : false,
        user_name: result?.user_name ? result.user_name : "user deleted",
      },
    });
  };

  // wrapping request in reauth wrapper
  apiRequestWrapperWithReauth({
    api: `api/v1/db/channel/owner?channel_name=presence-${author}`,
    accessToken,
    callback,
  });
}
