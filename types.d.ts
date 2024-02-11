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

interface IChatRoom {
  roomId: string;
  users: IUserId[];
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

type TChatDataStateLiteral = "loading" | "success" | "error";

interface IScrollPosition {
  currentPosition: number;
  isPreviousBottom: boolean; // move up from scrollPosition
  previousUnreadMsgCount: number;
}

interface ICurrentRoomScrollData {
  currentRoom: string;
  scrollPosition: IScrollPosition;
}

interface IChatDataPagination {
  historyLoadedState: TChatDataStateLiteral; // states for fetching history page
  limit: number; // amount to fetch per page
  hasMore: boolean; // flag for data availability
}
