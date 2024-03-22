import decrypt from "./decrypt";

// this is a decipher function for the cosmetically transformed IV Buffer
// into a string of numbers separated by a letter
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
  const encryptedData = signature.slice(0, 96);
  const iv = stringToByteArray(signature.slice(96));

  return decrypt({
    data: encryptedData,
    iv,
    key,
  });
}
