import { PusherConnectionProvider } from "@/context/outerContexts/PusherProvider";
import { UserIdProvider } from "@/context/outerContexts/UserIdProvider";
import OuterContextsWrapper from "./OuterContextsWrapper/OuterContextsWrapper";

export default function Chat() {
  return (
    <UserIdProvider>
      <PusherConnectionProvider>
        <OuterContextsWrapper
          storage_uuid={process.env.NEXT_PUBLIC_LOCAL_STORAGE_UUID}
          pageLimit={10}
        />
      </PusherConnectionProvider>
    </UserIdProvider>
  );
}
