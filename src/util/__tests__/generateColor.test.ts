import { generateColor } from "@/util/generateColor";
import { describe, expect, it } from "vitest";

describe("generateColor tests", () => {
  it("Takes a string and returns an rgb color string", () => {
    const inputString = "test string";

    const expectedResult = "rgb(95, 155, 253)";

    const result = generateColor(inputString);

    expect(result).toBe(expectedResult);
  });

  it("Takes an empty string and returns an rgb color string", () => {
    const inputString = "";

    const expectedResult = "rgb(0, 0, 0)";

    const result = generateColor(inputString);

    expect(result).toBe(expectedResult);
  });

  it("Takes a number and returns an rgb color string", () => {
    const inputString = 42;

    const expectedResult = "rgb(0, 0, 0)";

    // @ts-expect-error
    const result = generateColor(inputString);

    expect(result).toBe(expectedResult);
  });

  it("Takes a null and returns an rgb color string", () => {
    const inputString = null;

    const expectedResult = "rgb(0, 0, 0)";

    // @ts-expect-error
    const result = generateColor(inputString);

    expect(result).toBe(expectedResult);
  });

  it("Takes a boolean and returns an rgb color string", () => {
    const inputString = true;

    const expectedResult = "rgb(0, 0, 0)";

    // @ts-expect-error
    const result = generateColor(inputString);

    expect(result).toBe(expectedResult);
  });
});
