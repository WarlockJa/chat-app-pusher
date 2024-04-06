import { beforeEach } from "vitest";
import { mockDeep, mockReset } from "vitest-mock-extended";
import PusherServer from "pusher";

beforeEach(() => {
  mockReset(pusherServer);
});

const pusherServer = mockDeep<PusherServer>();
export { pusherServer };
