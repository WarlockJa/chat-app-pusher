import { PusherConnectionProvider } from "@/context/outerContexts/PusherProvider";
import { UserIdProvider } from "@/context/outerContexts/UserIdProvider";
import OuterContextsWrapper from "./OuterContextsWrapper/OuterContextsWrapper";
import { TSchemaChatProps } from "@/lib/validators/chatprops/generatedTypes";
import { schemaChatProps } from "@/lib/validators/chatprops/chatprops";
import { z } from "zod";

export default function Chat(props: IChatProps) {
  // data validation
  let userIdToken: IUserId | null = null;

  try {
    const data: TSchemaChatProps | z.ZodError = schemaChatProps.parse({
      user_id: props.user_id,
      user_name: props.user_name,
      user_admin: props.user_admin,
    });

    userIdToken = data;
  } catch (error) {
    // console.log(error)
  }

  return (
    <UserIdProvider userIdToken={userIdToken}>
      <PusherConnectionProvider>
        <OuterContextsWrapper
          storage_uuid={props.storage_uuid}
          pageLimit={props.pageLimit}
        />
      </PusherConnectionProvider>
    </UserIdProvider>
  );
}
