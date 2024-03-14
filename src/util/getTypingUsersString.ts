import { IUsersTypingData } from "@/context/innerContexts/UsersTypingProvider";

export interface IGetTypingUsersData {
  data: IUsersTypingData;
  user_name: string;
}

export default function getTypingUsersString({
  data,
  user_name,
}: IGetTypingUsersData) {
  if (!data || !data.users) return;
  // forming output string
  const typingUsers: string = data.users
    .filter((user) => user !== user_name)
    .reduce(
      (users, user, index) =>
        users.concat(index === 0 ? `${user}` : `, ${user}`),
      ""
    );

  const content =
    typingUsers !== ""
      ? data.users.length === 1
        ? `${typingUsers} is typing`
        : `${typingUsers} are typing`
      : "";

  return content;
}
