import { IUsersTypingData } from "@/context/innerContexts/UsersTypingProvider";

interface IGetTypingUsersData {
  data: IUsersTypingData;
  user_id: string;
}

export default function getTypingUsersString({
  data,
  user_id,
}: IGetTypingUsersData) {
  // forming output string
  const typingUsers: string = data.users.reduce(
    (users, user, index) =>
      user !== user_id
        ? users.concat(index === 0 ? `${user}` : `, ${user}`)
        : "",
    ""
  );

  const content =
    typingUsers !== ""
      ? data.users.length === 1
        ? `${typingUsers} is typing...`
        : `${typingUsers} are typing...`
      : "";

  return content;
}
