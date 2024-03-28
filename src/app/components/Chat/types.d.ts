// type for anonymous user data stored in localStorage
interface IUserLocalStorageData {
  user_id: string;
  user_name: string;
  storage_uuid: string;
}

// initial user ID type passed to Chat element
interface IInitUserId {
  user_id?: string;
  user_name?: string;
  user_admin?: boolean;
}

interface IAccessToken {
  user_id: string | undefined;
  user_admin: boolean | undefined;
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

// type to track async state
type TStateLiteral = "loading" | "success" | "error";

// type for typing Pusher event timeout
interface ITypingUserTimeout {
  id: string;
  timeout: NodeJS.Timeout;
}

// useIOUnreadMsgsArray interface for the debounced lastaccess update object
interface IIODebouncedEntry {
  message_id: string;
  entryTimestamp: number;
}

// additional optional parameters passed to Chat element
interface IChatProps extends IInitUserId {
  storage_uuid: string;
  pageLimit?: number;
}

// Pusher event
interface ITriggerEventData {
  id: string;
  info: IUserInfo;
}

// Pusher event load
interface IUserInfo {
  user_admin: boolean;
  user_name: string;
}

interface ITriggerEventData {
  id: string;
  info: IUserInfo;
}
