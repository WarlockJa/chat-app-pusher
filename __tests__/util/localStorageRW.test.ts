import { readLocalStorage, writeLocalStorage } from "@/util/localStorageRW";
import { afterEach, describe, expect, it, vi } from "vitest";

const TESTStorageUUID = "TESTstorageUUID-0813c685-ebcc-4aef-9d95-e7b171ce2c59";
const testUserData = {
  user_id: "1a377030-8254-4ab8-8aee-0e6b298e7161",
  user_name: "abc123",
};

describe("LocalStorage tests", () => {
  describe("readLocalStorage tests", () => {
    const getItemSpy = vi.spyOn(Storage.prototype, "getItem");

    afterEach(() => {
      getItemSpy.mockClear();
    });

    it("should read user data from local storage when storage_uuid is provided", async () => {
      const mockData_LocalStorage = `{"user_id":"${testUserData.user_id}","user_name":"${testUserData.user_name}"}`;
      getItemSpy.mockReturnValue(mockData_LocalStorage);

      const result = readLocalStorage({
        storage_uuid: TESTStorageUUID,
      });

      expect(result).toStrictEqual(testUserData);
      expect(getItemSpy).toHaveBeenCalledOnce();
      expect(getItemSpy).toHaveBeenCalledWith(TESTStorageUUID);
    });

    it("reading local storage when storage_uuid is provided return undefined for data not found", async () => {
      getItemSpy.mockReturnValue(null);

      const result = readLocalStorage({
        storage_uuid: TESTStorageUUID,
      });

      expect(result).toBe(undefined);
      expect(getItemSpy).toHaveBeenCalledOnce();
      expect(getItemSpy).toHaveBeenCalledWith(TESTStorageUUID);
    });

    it("should return undefined when storage_uuid is missing", async () => {
      // @ts-expect-error
      const result = readLocalStorage({});

      expect(result).toBe(undefined);
      expect(getItemSpy).toHaveBeenCalledTimes(0);
    });
  });

  describe("writeLocalStorage tests", () => {
    const setItemSpy = vi.spyOn(Storage.prototype, "setItem");

    afterEach(() => {
      setItemSpy.mockClear();
    });

    it("should save user data to local storage when storage_uuid, user_id, and user_name are provided", async () => {
      const mockData_setItem = JSON.stringify({
        user_id: testUserData.user_id,
        user_name: testUserData.user_name,
      });

      writeLocalStorage({
        storage_uuid: TESTStorageUUID,
        user_id: testUserData.user_id,
        user_name: testUserData.user_name,
      });

      expect(setItemSpy).toHaveBeenCalledOnce();
      expect(setItemSpy).toHaveBeenCalledWith(
        TESTStorageUUID,
        mockData_setItem
      );
    });

    it("should return undefined when storage_uuid is missing", async () => {
      // @ts-expect-error
      const result = writeLocalStorage({
        user_id: testUserData.user_id,
        user_name: testUserData.user_name,
      });

      expect(result).toBe(undefined);
      expect(setItemSpy).toHaveBeenCalledTimes(0);
    });

    it("should return undefined when user_id is missing", async () => {
      // @ts-expect-error
      const result = writeLocalStorage({
        storage_uuid: TESTStorageUUID,
        user_name: testUserData.user_name,
      });

      expect(result).toBe(undefined);
      expect(setItemSpy).toHaveBeenCalledTimes(0);
    });

    it("should return undefined when user_name is missing", async () => {
      // @ts-expect-error
      const result = writeLocalStorage({
        storage_uuid: TESTStorageUUID,
        user_id: testUserData.user_id,
      });

      expect(result).toBe(undefined);
      expect(setItemSpy).toHaveBeenCalledTimes(0);
    });
  });
});
