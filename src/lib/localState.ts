import { atom } from "jotai";

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

export const userIdAtom = atom<IUserId>({}); // replace with IdToken data in production
export const activeRoomAtom = atom("");
export const roomsListAtom = atom<string[]>([]);
export const chatDataAtom = atom<IChatData[]>([]);
