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
