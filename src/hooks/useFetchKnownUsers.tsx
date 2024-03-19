// this hook keeps track of the knowUsers array in KnowUsers context
// upon change it fetches data for the added user from the DB
"use client";
import { useKnownUsersContext } from "@/context/innerContexts/KnownUsersProvider";
import apiDB_getChannelOwner from "@/lib/apiDBMethods/apiDB_getChannelOwner";
import { useEffect } from "react";

export default function useFetchKnownUsers() {
  // known users in context
  const { knownUsers, knownUsers_addNewUser } = useKnownUsersContext();

  useEffect(() => {
    knownUsers
      .filter((user) => user.user_name === "loading")
      .forEach((user) =>
        apiDB_getChannelOwner({ author: user.user_id, knownUsers_addNewUser })
      );
  }, [knownUsers]);

  return null;
}
