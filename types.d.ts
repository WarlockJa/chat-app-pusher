interface IMessageData {
  message: string;
}

interface IUserLocalStorageData {
  user_id: string;
  user_name: string;
  storage_uuid: string;
}

interface IUserId {
  user_id?: string;
  user_name?: string;
  user_admin?: boolean;
}

interface IChatProps extends IUserId {
  storage_uuid?: string;
}
