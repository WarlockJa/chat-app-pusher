"use client";
import Pusher from "pusher-js/types/src/core/pusher";
import { PropsWithChildren, createContext, useContext, useState } from "react";

interface IPusherContext {
  pusher: Pusher | null;
  setPusher: (newPusherConnection: Pusher | null) => void;
}

const PusherContext = createContext<IPusherContext | null>(null);

export function PusherConnectionProvider({ children }: PropsWithChildren<{}>) {
  const [pusher, setPusher] = useState<Pusher | null>(null);

  return (
    <PusherContext.Provider value={{ pusher, setPusher }}>
      {children}
    </PusherContext.Provider>
  );
}

export function usePusherContext() {
  const context = useContext(PusherContext);

  if (!context)
    throw new Error("usePusherContext must be inside PusherConnectionProvider");

  return context;
}
