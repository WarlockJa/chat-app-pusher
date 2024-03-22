import crypto from "crypto";
export default function decrypt({
  data,
  key,
  iv,
}: {
  data: string;
  key: string;
  iv: Buffer;
}) {
  const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
  let decryptedData = decipher.update(data, "hex", "utf8");
  decryptedData += decipher.final("utf8");
  return decryptedData;
}
