"use client";
import { PropsWithChildren, createContext, useContext, useState } from "react";

interface IUserIdContext {
  userId: IUserId | null;
  setUserId: (newUserId: IUserId | null) => void;
}

const UserIdContext = createContext<IUserIdContext | null>(null);

export function UserIdProvider({
  children,
  userIdToken,
}: {
  children: React.ReactNode | undefined;
  userIdToken: IUserId | null;
}) {
  const [userId, setUserId] = useState<IUserId | null>(userIdToken);

  return (
    <UserIdContext.Provider value={{ userId, setUserId }}>
      {children}
    </UserIdContext.Provider>
  );
}

export function useUserIdContext() {
  const context = useContext(UserIdContext);

  if (!context)
    throw new Error("useUserIdContext must be inside UserIdProvider");

  return context;
}
