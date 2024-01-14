interface IMessageData {
  message: string;
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
}

interface IUserInfo {
  user_admin: boolean;
  user_name: string;
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
