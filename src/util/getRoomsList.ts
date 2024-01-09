interface IChannelsResult {
  channels: { [roomName: string]: {} };
}

export const getRoomsList = (callback: (rooms: string[]) => void) => {
  fetch("/api/v1/pusher/channels", { cache: "no-store" })
    .then((response) => response.json())
    .then((result: IChannelsResult) => {
      callback(Object.keys(result.channels));
    });
};
