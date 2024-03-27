import encrypt from "./encrypt";
import generateIv from "./generateIv";

const separatorArray = ["a", "b", "c", "d", "e", "f"];

const generatePadding = (length: number, separatorArray: string[]) => {
  return Array.from({ length }).reduce(
    (accumulator: string) =>
      accumulator.concat(
        separatorArray[Math.floor(Math.random() * separatorArray.length)]
      ),
    ""
  );
};

// this is a cosmetic transformation that creates a string from IV Buffer
// that conceals difference between encrypted token and concatenated IV
const bufferToStringWithRandomSeparators = ({
  iv,
  separatorArray,
}: {
  iv: Buffer;
  separatorArray: string[];
}) => {
  return iv.reduce((accumulator, current) => {
    const currentAsString = current.toString();
    const currentPadding = generatePadding(
      4 - currentAsString.length,
      separatorArray
    );
    return accumulator.concat(currentPadding, currentAsString);
  }, "");
};

export default function generateSignature({ key }: { key: string }) {
  const iv = generateIv();
  const stringIv = bufferToStringWithRandomSeparators({ iv, separatorArray });

  const encryptedToken = encrypt({
    data: new Date().toISOString(),
    iv,
    key,
  });

  return encryptedToken.concat(stringIv);
}
