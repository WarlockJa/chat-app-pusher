// this context is for non-admin user to hold information about another user connecting to their channel
// the only scenario is administrator connecting to the user's channel.
// information about connecting administrator will be read in Pusher member_added event and stored here
// this information is to be used to display information about administrator for the user
"use client";
import { TPrisma_User } from "@/lib/prisma/prisma";
import { createContext, useContext, useState } from "react";

interface IKnownUsersContext {
  knownUsers: TPrisma_User[];
  knownUsers_findKnownUser: (user_id: string) => TPrisma_User | undefined;
  knownUsers_addNewUser: (user: TPrisma_User) => void;
}

const KnownUsersContext = createContext<IKnownUsersContext | null>(null);

export function KnownUsersProvider({
  children,
  userId,
}: {
  children: React.ReactNode | undefined;
  userId: TPrisma_User;
}) {
  const [knownUsers, setKnownUsers] = useState<TPrisma_User[]>([userId]);

  // adding user if not already exist otherwise updating
  const knownUsers_addNewUser = (user: TPrisma_User) => {
    // checking if user with user.user_id already exists in context
    const userExists =
      knownUsers.findIndex(
        (knownUser) => knownUser.user_id === user.user_id
      ) !== -1;

    // stopping execution if user already in the context or new user object is in the loading state
    if (userExists && user.user_name === "loading") return;

    // saving user data in context
    setKnownUsers([
      ...knownUsers.filter((knownUser) => knownUser.user_id !== user.user_id),
      user,
    ]);
  };

  // find known user by user_id
  const knownUsers_findKnownUser = (user_id: string) => {
    return knownUsers.find((user) => user.user_id === user_id);
  };

  return (
    <KnownUsersContext.Provider
      value={{
        knownUsers,
        knownUsers_findKnownUser,
        knownUsers_addNewUser,
      }}
    >
      {children}
    </KnownUsersContext.Provider>
  );
}

export function useKnownUsers() {
  const context = useContext(KnownUsersContext);

  if (!context)
    throw new Error("useKnownUsers must be inside KnownUsersProvider");

  return context;
}
