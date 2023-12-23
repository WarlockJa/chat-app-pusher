"use client";
import { IUserId, roomsListAtom, userIdAtom } from "@/lib/localState";
import { readLocalStorage } from "@/util/localStorageRW";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";

// populating state with user data from the parent for authenticated user
// or from localStorage for anonymous user if no user data provided
// further processing for the anonymous user is done in NoUserPlug
export default function useUserId({
  user_id,
  user_name,
  user_admin,
  storage_uuid,
}: {
  user_id?: string;
  user_name?: string;
  user_admin?: boolean;
  storage_uuid: string;
}) {
  // using jotai atom for user data storage in order to accomodate
  // anonymous user scenario processed in NoUserPlug
  const [userId, setUserId] = useAtom(userIdAtom);
  // roomsList state to assing default rooms for the user
  const [, setRoomsList] = useAtom(roomsListAtom);
  // loading state during accessing localStorage
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // saving user data to state
    if (user_id) {
      // populating user data
      const userData: IUserId = {
        user_id,
        user_name: user_name ? user_name : user_id,
        user_admin,
      };
      setUserId(userData);
      // assigning default rooms for the user
      setRoomsList(["presence-system", `presence-${user_id}`]);
    } else {
      // user is not authenticated. Checking localStorage for temporary user data
      const localStorageUser: IUserLocalStorageData =
        readLocalStorage(storage_uuid);

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
        setUserId(userData);
        // assigning default rooms for the user
        setRoomsList([
          "presence-system",
          `presence-${localStorageUser.user_id}`,
        ]);
      }
      // else
      // user data is not provided and not found in localStorage.
      // Anonymous user data will be collected in NoUserPlug.

      // disabling loading flag so NoUserPlug can be displayed
      setLoading(false);
    }
  }, [user_id, user_name, user_admin, storage_uuid]);

  return { userId, loading };
}
