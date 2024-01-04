import { useUserIdContext } from "@/context/UserIdProvider";
import { readLocalStorage } from "@/util/localStorageRW";
import { useEffect, useState } from "react";

// populating state with user data from the parent for authenticated user
// or from localStorage for anonymous user if no user data provided
// further processing for the anonymous user is done in NoUserPlug
export default function useUserId({
  user_id,
  user_name,
  user_admin,
  storage_uuid,
}: IChatProps) {
  // anonymous user scenario processed in NoUserPlug
  const { setUserId } = useUserIdContext();
  // loading state during accessing localStorage
  const [loadingUserId, setLoadingUserId] = useState(true);
  // // chat rooms context
  // const { setRoomsList, setActiveRoom } = useChatRoomsContext();

  useEffect(() => {
    // saving user data to state
    if (user_id) {
      const userName = user_name ? user_name : user_id;
      // populating user data
      const userData: IUserId = {
        user_id,
        user_name: userName,
        user_admin: Boolean(user_admin),
      };
      setUserId(userData);
      // // assigning default rooms for the user
      // setRoomsList([
      //   { roomName: "presence-system", users: [userName] },
      //   { roomName: `presence-${user_id}`, users: [userName] },
      // ]);
      // setActiveRoom(`presence-${user_id}`);
    } else {
      // throwing error if neither authenticated user data(user_id)
      // nor localStorage name(storage_uuid) for anonymous user provided
      if (!storage_uuid)
        throw new Error(
          "No data provided. For authenticated user specify user_id. For anonymous user access specify storage_uuid"
        );
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
          user_admin: true, // TEST TODO replace with false
        };
        setUserId(userData);
        // assigning default rooms for the user
        // setRoomsList([
        //   { roomName: "presence-system", users: [localStorageUser.user_name] },
        //   {
        //     roomName: `presence-${localStorageUser.user_id}`,
        //     users: [localStorageUser.user_name],
        //   },
        // ]);
        // setActiveRoom(`presence-${localStorageUser.user_id}`);
      }
      // else
      // user data is not provided and not found in localStorage.
      // Anonymous user data will be collected in NoUserPlug.
    }

    // disabling loading flag so NoUserPlug can be displayed
    setLoadingUserId(false);
  }, [user_id, user_name, user_admin, storage_uuid]);

  return { loadingUserId };
}
