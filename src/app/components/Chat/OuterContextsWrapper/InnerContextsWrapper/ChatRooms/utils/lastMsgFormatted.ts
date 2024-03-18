import { addDays, format, isSameDay } from "date-fns";

const dateFormatTable: string[] = ["yyyy-MM-dd", "EEE", "k:mm"];

export default function lastMsgFormatted(lastMsgTimestamp: string) {
  const date = new Date();
  let dateIndex = 0;
  if (addDays(lastMsgTimestamp, 6) > date) dateIndex++;
  if (isSameDay(lastMsgTimestamp, date)) dateIndex++;

  return format(lastMsgTimestamp, dateFormatTable[dateIndex]);
}
