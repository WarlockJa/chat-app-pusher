import { useUserIdContext } from "@/context/outerContexts/UserIdProvider";
import { readLocalStorage } from "@/util/localStorageRW";
import { useEffect, useState } from "react";

// populating state with user data from the parent for authenticated user
// or from localStorage for anonymous user if no user data provided
// further processing for the anonymous user is done in NoUserPlug
export default function useUserId({ storage_uuid }: IChatProps) {
  // anonymous user scenario processed in NoUserPlug
  const { setUserId, userId } = useUserIdContext();
  // loading state during accessing localStorage
  const [loadingUserId, setLoadingUserId] = useState(true);

  useEffect(() => {
    // throwing error if neither authenticated user data(user_id)
    // nor localStorage name(storage_uuid) for anonymous user provided
    if (!storage_uuid)
      throw new Error(
        "No data provided. For authenticated user specify user_id. For anonymous user access specify storage_uuid"
      );

    if (!userId) {
      // user is not authenticated. Checking localStorage for temporary user data
      const localStorageUser: IUserLocalStorageData = readLocalStorage({
        storage_uuid,
      });

      // localStorage data found
      if (localStorageUser) {
        // populating user data state
        const userData: IUserId = {
          user_id: localStorageUser.user_id,
          user_name: localStorageUser.user_name
            ? localStorageUser.user_name
            : localStorageUser.user_id,
          user_admin: false,
        };
        // saving user data to state
        setUserId(userData);
      }
    }
    // if user data is not provided and not found in localStorage.
    // Anonymous user data will be collected in NoUserPlug.

    // disabling loading flag so NoUserPlug can be displayed
    setLoadingUserId(false);
  }, [storage_uuid]);

  return { loadingUserId };
}
