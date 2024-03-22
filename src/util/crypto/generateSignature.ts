import encrypt from "./encrypt";
import generateIv from "./generateIv";

const separatorArray = ["a", "b", "c", "d", "e", "f"];

// this is a cosmetic transformation that creates a string from IV Buffer
// that conceals difference between encrypted token and concatenated IV
const bufferToStringWithRandomSeparators = ({
  iv,
  separatorArray,
}: {
  iv: Buffer;
  separatorArray: string[];
}) => {
  return iv.reduce(
    (accumulator, current, index) =>
      index < iv.length - 1
        ? accumulator.concat(
            current.toString(),
            separatorArray[Math.floor(Math.random() * separatorArray.length)]
          )
        : accumulator.concat(current.toString()),
    ""
  );
};

export default function generateSignature({ key }: { key: string }) {
  const iv = generateIv();
  const encryptedToken = encrypt({
    data: key,
    iv,
    key,
  });

  return encryptedToken.concat(
    bufferToStringWithRandomSeparators({ iv, separatorArray })
  );
}
