import crypto from "crypto";

export default function generateIv() {
  return crypto.randomBytes(16);
}
