interface IMessageData {
  id: string;
  message: string;
  author: string;
}
interface IUserLocalStorageData {
  user_id: string;
  user_name: string;
  storage_uuid: string;
}

interface IInitUserId {
  user_id?: string;
  user_name?: string;
  user_admin?: boolean;
}

interface IUserId {
  user_id: string;
  user_name: string;
  user_admin: boolean;
}

interface IChatProps extends IInitUserId {
  storage_uuid?: string;
  pageLimit?: number;
}

interface IUserInfo {
  user_admin: boolean;
  user_name: string;
}

interface ITriggerEventData {
  id: string;
  info: IUserInfo;
}

// TODO export from Prisma? and extend with state?
interface IChatRoom {
  roomId: string;
  owner: IUserId | null;
  users: IUserId[];
  lastmessage: Date | null;
  state: TChatDataStateLiteral;
}

// pusher.channel("channel-name").members.members
interface IChannelMembers {
  [user_id: string]: {
    user_admin: boolean;
    user_name: string;
  };
}

// Object.values(pusher.channel("channel-name").members.members.get("user_name"))
type IChannelGetMember = [string, { user_admin: boolean; user_name: string }];

// TODO rename excluding ChatData
type TChatDataStateLiteral = "loading" | "success" | "error";

interface ITypingUserTimeout {
  id: string;
  timeout: NodeJS.Timeout;
}

// useIOUnreadMsgsArray interface for the debounced lastaccess update object
interface IIODebouncedEntry {
  message_id: string;
  entryTimestamp: number;
}

interface IChatProps extends IInitUserId {
  storage_uuid: string;
  pageLimit?: number;
}
