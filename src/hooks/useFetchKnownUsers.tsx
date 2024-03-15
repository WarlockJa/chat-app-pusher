// this hook keeps track of the knowUsers array in KnowUsers context
// upon change it fetches data for the added user from the DB
"use client";
import { useKnownUsers } from "@/context/innerContexts/KnownUsersProvider";
import getChannelOwner from "@/lib/apiDBMethods/getChannelOwner";
import { useEffect } from "react";

export default function useFetchKnownUsers() {
  // known users in context
  const { knownUsers, knownUsers_addNewUser } = useKnownUsers();

  useEffect(() => {
    knownUsers
      .filter((user) => user.user_name === "loading")
      .forEach((user) =>
        getChannelOwner({ author: user.user_id, knownUsers_addNewUser })
      );
  }, [knownUsers]);

  return null;
}
