import { Message } from "@prisma/client";

type TMessageDB = Omit<Message, "timestamp"> & { timestamp: { $date: Date } };
