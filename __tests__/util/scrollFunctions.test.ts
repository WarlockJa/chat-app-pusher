import { isScrolledBottom, isScrolledTop } from "@/util/scrollFunctions";
import { describe, expect, it } from "vitest";

describe("Testing util scroll functions", () => {
  describe("Testing isScrolledBottom function", () => {
    it("Takes valid data for scroll position not at the bottom and returns false", () => {
      const mockTestElement = {
        scrollHeight: 1000,
        scrollTop: 500,
        clientHeight: 400,
      } as HTMLDivElement;

      const result = isScrolledBottom(mockTestElement);

      expect(result).toBe(false);
    });

    it("Takes valid data for scroll position at the bottom and returns true", () => {
      const mockTestElement = {
        scrollHeight: 1000,
        scrollTop: 500,
        clientHeight: 500,
      } as HTMLDivElement;

      const result = isScrolledBottom(mockTestElement);

      expect(result).toBe(true);
    });

    it("Takes undefined element and returns undefined", () => {
      const mockTestElement = undefined;

      // @ts-expect-error
      const result = isScrolledBottom(mockTestElement);

      expect(result).toBe(undefined);
    });
  });

  describe("Testing isScrolledTop function", () => {
    it("Takes valid data for scroll position not at the top and returns false", () => {
      const mockTestElement = {
        scrollTop: 500,
      } as HTMLDivElement;

      const result = isScrolledTop(mockTestElement);

      expect(result).toBe(false);
    });

    it("Takes valid data for scroll position at the top and returns true", () => {
      const mockTestElement = {
        scrollTop: 0,
      } as HTMLDivElement;

      const result = isScrolledTop(mockTestElement);

      expect(result).toBe(true);
    });

    it("Takes undefined element and returns undefined", () => {
      const mockTestElement = undefined;

      // @ts-expect-error
      const result = isScrolledTop(mockTestElement);

      expect(result).toBe(undefined);
    });
  });
});
