"use client";
import { PresenceChannel } from "pusher-js";
import Pusher from "pusher-js/types/src/core/pusher";
import { PropsWithChildren, createContext, useContext, useState } from "react";

// adjusting Pusher interface to work with PresenceChannel instead of Channel
export interface PusherPresence extends Pusher {
  channel: (name: string) => PresenceChannel;
  subscribe: (channel_name: string) => PresenceChannel;
}

interface IPusherContext {
  pusher: PusherPresence | null;
  setPusher: (newPusherConnection: PusherPresence | null) => void;
}

const PusherContext = createContext<IPusherContext | null>(null);

export function PusherConnectionProvider({ children }: PropsWithChildren<{}>) {
  const [pusher, setPusher] = useState<PusherPresence | null>(null);

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
