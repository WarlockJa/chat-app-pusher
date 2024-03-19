import {
  IUsersTypingAddTypingUser,
  IUsersTypingRemoveTypingUser,
} from "@/context/innerContexts/UsersTypingProvider";
import { TSchemaApiV1PusherTypingPost } from "@/lib/validators/pusher/generatedTypes";
import { PresenceChannel } from "pusher-js";

interface IBindTypingProps {
  newChannel: PresenceChannel;
  typingUsers: ITypingUserTimeout[];
  dispatchUsersTyping: (
    action: IUsersTypingAddTypingUser | IUsersTypingRemoveTypingUser
  ) => void;
}

export default function bindTyping({
  newChannel,
  typingUsers,
  dispatchUsersTyping,
}: IBindTypingProps) {
  newChannel.bind(
    "typing",
    async function (data: Omit<TSchemaApiV1PusherTypingPost, "activeRoom">) {
      // sending typing information to the chatData
      dispatchUsersTyping({
        type: "addTypingUser",
        roomName: newChannel.name,
        user: data.author,
      });

      // creating/refreshing typing notification for the user in the room
      // creating id for the author based on the name and the channel
      const authorId = newChannel.name.concat(data.author);
      // clearing timeout from the typingUsers arra for the author, if already exists
      clearTimeout(typingUsers.find((user) => user.id === authorId)?.timeout);

      // creating a new timeout object
      const typingUser: ITypingUserTimeout = {
        id: authorId,
        timeout: setTimeout(
          () =>
            dispatchUsersTyping({
              type: "removeTypingUser",
              roomName: newChannel.name,
              user: data.author,
            }),
          1000
        ),
      };

      // removing previous timeout object, if present, and writing a new one
      typingUsers = [
        ...typingUsers.filter((user) => user.id !== authorId),
        typingUser,
      ];
    }
  );
}
