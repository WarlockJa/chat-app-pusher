import decrypt from "./decrypt";

// this is a decipher function for the cosmetically transformed IV Buffer
// into a string of numbers separated by letters
function stringToByteArray(string: string) {
  const matches = string.match(/\d+/g);
  return Buffer.from(matches!.map(Number));
}

export default function decipherSignature({
  signature,
  key,
}: {
  signature: string;
  key: string;
}) {
  const encryptedData = signature.slice(0, signature.length - 64);
  const stringIv = signature.slice(signature.length - 64);
  const iv = stringToByteArray(stringIv);

  return decrypt({
    data: encryptedData,
    iv,
    key,
  });
}
