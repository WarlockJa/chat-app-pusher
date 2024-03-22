import crypto from "crypto";
export default function encrypt({
  data,
  key,
  iv,
}: {
  data: string;
  key: string;
  iv: Buffer;
}) {
  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
  let encryptedData = cipher.update(data, "utf8", "hex");
  encryptedData += cipher.final("hex");
  return encryptedData;

  // const encryptedData = crypto.subtle.encrypt()
}
