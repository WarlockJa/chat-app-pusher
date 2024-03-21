// this context is for users to hold relevant information about another users
// information is updated on new messages added to the ChatData
// for User: this information is to be used to display information about administrator on their channel
// for the administrator: this information is to display channel owner, and track changes in userId
// for optional fields (user_name, user_admin) that may occur in the DB during the active session.
"use client";
import { TPrisma_User } from "@/lib/prisma/prisma";
import { createContext, useContext, useReducer } from "react";

export interface IKnownUsersAddUser {
  type: "KnownUsers_addKnownUser";
  user: TPrisma_User;
}

type TKnownUsersProviderActions = IKnownUsersAddUser;

interface IKnownUsersContext {
  knownUsers: TPrisma_User[];
  knownUsers_findKnownUser: (user_id: string) => TPrisma_User | undefined;
  dispatchKnownUsers: (action: TKnownUsersProviderActions) => void;
}

const KnownUsersContext = createContext<IKnownUsersContext | null>(null);

export function KnownUsersProvider({
  children,
  userId,
}: {
  children: React.ReactNode | undefined;
  userId: TPrisma_User;
}) {
  const initialKnownUsersData: TPrisma_User[] = [userId];
  const [knownUsers, dispatchKnownUsers] = useReducer(
    knownUsersReducer,
    initialKnownUsersData
  );

  // state actions
  // find known user by user_id
  const knownUsers_findKnownUser = (
    user_id: string
  ): TPrisma_User | undefined => {
    const foundUser = knownUsers.find((user) => user.user_id === user_id);
    if (!foundUser) return;

    // if user with the same name exists in KnownUsers, adding 5 first chars from user_id
    return knownUsers.findIndex(
      (user) =>
        user.user_name === foundUser.user_name &&
        user.user_id !== foundUser.user_id
    ) === -1
      ? foundUser
      : {
          ...foundUser,
          user_name: foundUser.user_name.concat(
            "#",
            foundUser.user_id.slice(0, 5)
          ),
        };
  };

  function knownUsersReducer(
    knownUsers: TPrisma_User[],
    action: TKnownUsersProviderActions
  ): TPrisma_User[] {
    switch (action.type) {
      case "KnownUsers_addKnownUser":
        // checking if user with user.user_id already exists in context
        const userExists =
          knownUsers.findIndex(
            (knownUser) => knownUser.user_id === action.user.user_id
          ) !== -1;

        // stopping execution if user already in the context or new user object is in the loading state
        if (userExists && action.user.user_name === "loading")
          return knownUsers;

        // saving user data in context
        return [
          ...knownUsers.filter(
            (knownUser) => knownUser.user_id !== action.user.user_id
          ),
          action.user,
        ];

      default:
        throw Error("Unknown action: " + JSON.stringify(action));
    }
  }

  return (
    <KnownUsersContext.Provider
      value={{
        knownUsers,
        knownUsers_findKnownUser,
        dispatchKnownUsers,
      }}
    >
      {children}
    </KnownUsersContext.Provider>
  );
}

export function useKnownUsersContext() {
  const context = useContext(KnownUsersContext);

  if (!context)
    throw new Error("useKnownUsersContext must be inside KnownUsersProvider");

  return context;
}
