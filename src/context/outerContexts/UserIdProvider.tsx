"use client";
import { TPrisma_User } from "@/lib/prisma/prisma";
import { createContext, useContext, useState } from "react";

interface IUserIdContext {
  userId: TPrisma_User | null;
  setUserId: (newUserId: TPrisma_User | null) => void;
}

const UserIdContext = createContext<IUserIdContext | null>(null);

export function UserIdProvider({
  children,
  userIdToken,
}: {
  children: React.ReactNode | undefined;
  userIdToken: TPrisma_User | null;
}) {
  const [userId, setUserId] = useState<TPrisma_User | null>(userIdToken);

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
