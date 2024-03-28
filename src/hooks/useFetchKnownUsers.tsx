// this hook keeps track of the knowUsers array in KnowUsers context
// upon change it fetches data for the added user from the DB
"use client";
import { useKnownUsersContext } from "@/context/innerContexts/KnownUsersProvider";
import { useUserIdContext } from "@/context/outerContexts/UserIdProvider";
import apiDB_getChannelOwner from "@/lib/apiDBMethods/apiDB_getChannelOwner";
import { useEffect } from "react";

export default function useFetchKnownUsers() {
  // known users in context
  const { knownUsers, dispatchKnownUsers } = useKnownUsersContext();
  const { userId } = useUserIdContext();

  useEffect(() => {
    knownUsers
      .filter((user) => user.user_name === "loading")
      .forEach((user) =>
        apiDB_getChannelOwner({
          author: user.user_id,
          dispatchKnownUsers,
          accessToken: {
            user_id: userId?.user_id,
            user_admin: userId?.user_admin,
          },
        })
      );
  }, [knownUsers]);

  return null;
}
