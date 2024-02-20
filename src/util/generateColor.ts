function stringToRGB(inputString: string) {
  // Simple hashing function to generate a hash from the input string
  let hash = 0;
  for (let i = 0; i < inputString.length; i++) {
    hash = inputString.charCodeAt(i) + ((hash << 5) - hash);
  }

  // Convert the hash to RGB values
  const rgb = [
    hash & 0xff, // Red component
    (hash >> 8) & 0xff, // Green component
    (hash >> 16) & 0xff, // Blue component
  ];

  return rgb;
}

export function generateColor(inputString: string) {
  const stringToProcess = inputString ? inputString : "";
  const [red, green, blue] = stringToRGB(stringToProcess);
  return `rgb(${red}, ${green}, ${blue})`;
}
