import { TPrismaMessage } from "@/lib/prisma/prisma";

export default function getOldestTimestampFromMessagesArray(
  messages: TPrismaMessage[]
): string | null {
  return messages.length > 0
    ? messages.sort((a, b) => (a.timestamp < b.timestamp ? -1 : 1))[
        messages.length - 1
      ].timestamp
    : null;
}
