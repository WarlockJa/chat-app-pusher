import { format, isSameDay, isSameWeek } from "date-fns";

const dateFormatTable: string[] = ["yyyy-MM-dd", "EEE", "k:mm"];

export default function lastMsgFormatted(lastMsgTimestamp: Date) {
  const date = new Date();
  let dateIndex = 0;
  if (isSameWeek(lastMsgTimestamp, date)) dateIndex++;
  if (isSameDay(lastMsgTimestamp, date)) dateIndex++;

  return format(lastMsgTimestamp, dateFormatTable[dateIndex]);
}
