import { regexAlphanumericWithDash, regexDigitsWithDot } from "@/util/regExes";
import { describe, expect, it } from "vitest";

describe("Testing regexes found in regExes util file", () => {
  describe("Testing regexAlphanumericWithDash", () => {
    it("Takes a set of valid alphanumeric with dashes strings and returns true", () => {
      const testStrings = [
        "Abc123-",
        "123Abc-",
        "abC123-",
        "abc123-",
        "ABC123-",
        "123-Abc",
        "123-aBC",
        "123-ABC",
        "123-abc",
        "-Abc123",
        "-ABC123",
        "-abC123",
        "-abc123",
        "---abc123",
      ];

      const testData = testStrings.map((testString) =>
        regexAlphanumericWithDash.test(testString)
      );

      const result = testData.findIndex(
        (stringTestResult) => stringTestResult === false
      );

      expect(result).toBe(-1);
    });

    it("Takes a set of invalid strings and returns false", () => {
      const testStrings = ["!Abc123-", "123Abс-", "abС123-"];

      const testData = testStrings.map((testString) =>
        regexAlphanumericWithDash.test(testString)
      );

      const result = testData.findIndex(
        (stringTestResult) => stringTestResult === true
      );

      expect(result).toBe(-1);
    });
  });

  describe("Testing regexDigitsWithDot", () => {
    it("Takes a set of valid digits with dots strings and returns true", () => {
      const testStrings = [
        "123.",
        "123..",
        ".123",
        "..123",
        "...",
        "1234567890",
      ];

      const testData = testStrings.map((testString) =>
        regexDigitsWithDot.test(testString)
      );

      const result = testData.findIndex(
        (stringTestResult) => stringTestResult === false
      );

      expect(result).toBe(-1);
    });
  });

  it("Takes a set of invalid strings and returns false", () => {
    const testStrings = ["Abc.123", "!.123", "123.с", "С.123-"];

    const testData = testStrings.map((testString) =>
      regexDigitsWithDot.test(testString)
    );

    const result = testData.findIndex(
      (stringTestResult) => stringTestResult === true
    );

    expect(result).toBe(-1);
  });
});
