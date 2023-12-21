import { atom } from "jotai";
import Pusher from "pusher-js/types/src/core/pusher";

export interface IUserId {
  user_id?: string;
  user_name?: string;
  user_admin?: boolean;
}

export interface IChatData {
  roomId: string;
  messages: {
    author: string;
    text: string;
    timestamp: Date;
  }[];
}

// TODO simplify
export const userIdAtom = atom<IUserId>({}); // replace with IdToken data in production
export const activeRoomAtom = atom("");
export const roomsListAtom = atom<string[]>([]);
export const chatDataAtom = atom<IChatData[]>([]);
export const pusherAtom = atom<Pusher | null>(null);
