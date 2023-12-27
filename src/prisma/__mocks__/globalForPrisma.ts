import { PrismaClient } from "@prisma/client";
import { beforeEach } from "node:test";
import { mockReset, mockDeep } from "vitest-mock-extended";

beforeEach(() => {
  mockReset(prisma);
});

const prisma = mockDeep<PrismaClient>();
export default prisma;
