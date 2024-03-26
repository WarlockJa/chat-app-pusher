import getTypingUsersString from "@/app/components/Chat/OuterContextsWrapper/InnerContextsWrapper/ChatHeader/utils/getTypingUsersString";
import { describe, expect, it } from "vitest";

const testTypingUsersData = {
  name: "test room id",
  users: ["user 1", "user 2", "user 3"],
};

describe("Testing getTypingUsersString function", () => {
  it("Gets valid data and valid user_name and returns a string of typing users", () => {
    const testUserName = "user 3";

    const expectedResult = "user 1, user 2 are typing";

    const result = getTypingUsersString({
      data: testTypingUsersData,
      user_name: testUserName,
    });

    expect(result).toBe(expectedResult);
  });

  it("Gets invalid user_name and returns a string with all users", () => {
    const testUserName = "user udefined";

    const expectedResult = "user 1, user 2, user 3 are typing";

    const result = getTypingUsersString({
      data: testTypingUsersData,
      user_name: testUserName,
    });

    expect(result).toBe(expectedResult);
  });

  it("Gets a null user_name and returns a string with all users", () => {
    const testUserName = null;

    const expectedResult = "user 1, user 2, user 3 are typing";

    const result = getTypingUsersString({
      data: testTypingUsersData,
      // @ts-expect-error
      user_name: testUserName,
    });

    expect(result).toBe(expectedResult);
  });

  it("Gets an invalid TypingUsers data and returns undefined", () => {
    const testUserName = "user 1";

    const testData = {};

    const result = getTypingUsersString({
      // @ts-expect-error
      data: testData,
      user_name: testUserName,
    });

    expect(result).toBe(undefined);
  });

  it("Gets an invalid TypingUsers data without users array and returns undefined", () => {
    const testUserName = "user 1";

    const testData = {
      room_id: "test room id",
    };

    const result = getTypingUsersString({
      // @ts-expect-error
      data: testData,
      user_name: testUserName,
    });

    expect(result).toBe(undefined);
  });

  it("Gets an empty users array inside TypingUsers data and returns an empty string", () => {
    const testUserName = "user 1";

    const testData = {
      name: "test room id",
      users: [],
    };

    const result = getTypingUsersString({
      data: testData,
      user_name: testUserName,
    });

    expect(result).toBe("");
  });
});
