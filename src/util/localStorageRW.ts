export interface IUserLocalStorageData {
  user_id: string;
  user_name: string;
  storage_uuid: string;
}

// reads user data from the local storage
export function readLocalStorage(storage_uuid: string) {
  const storageString = localStorage.getItem(storage_uuid);
  if (!storageString) return;

  return JSON.parse(storageString);
}

// saves user data to the local storage
export function writeLocalStorage({
  user_id,
  user_name,
  storage_uuid,
}: IUserLocalStorageData) {
  if (!user_id) return;
  localStorage.setItem(
    storage_uuid,
    JSON.stringify({ user_id, user_name: user_name ? user_name : user_id })
  );
}
