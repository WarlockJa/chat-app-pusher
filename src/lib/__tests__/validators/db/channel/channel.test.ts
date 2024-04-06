import {
  schemaApiV1dbChannelDELETE,
  schemaApiV1dbChannelPOST,
} from "@/lib/validators/db/channel/channel";
import { TSchemaApiV1dbChannelPOST } from "@/lib/validators/db/channel/generatedTypes";
import { describe, expect, it } from "vitest";

describe("Validating DB channel", () => {
  describe("Validating schemaApiV1dbChannelDELETE", () => {
    const testSchemaApiV1dbChannelDELETE = (body: any) => {
      return schemaApiV1dbChannelDELETE.parse(body);
    };

    const mockValidParams = {
      channel_name: "presence-7f6bf857-1f52-40f6-b7c7-399b9b6702d4",
    };

    it("should return the parsed params when given a valid params object", () => {
      const result = testSchemaApiV1dbChannelDELETE(mockValidParams);
      expect(result).toEqual(mockValidParams);
    });

    it("should throw an error when given an empty params object", () => {
      const params = {};
      expect(() => {
        testSchemaApiV1dbChannelDELETE(params);
      }).toThrow();
    });

    it("should throw an error when given a params object without channel_name", () => {
      const params = {};
      expect(() => {
        testSchemaApiV1dbChannelDELETE(params);
      }).toThrow();
    });

    it("should throw an error when given a params object channel_name does not start with 'presence-'", () => {
      const params = {
        channel_name: "7f6bf857-1f52-40f6-b7c7-399b9b6702d4",
      };
      expect(() => {
        testSchemaApiV1dbChannelDELETE(params);
      }).toThrow();
    });

    it("should throw an error when given a params object channel_name is longer than 45 characters", () => {
      const params = {
        channel_name: mockValidParams.channel_name.concat(
          "A".repeat(46 - mockValidParams.channel_name.length)
        ),
      };
      expect(() => {
        testSchemaApiV1dbChannelDELETE(params);
      }).toThrow();
    });
  });

  describe("Validating schemaApiV1dbChannelPOST", () => {
    const testSchemaApiV1dbChannelPOST = (body: any) => {
      return schemaApiV1dbChannelPOST.parse(body);
    };

    const mockValidParams: TSchemaApiV1dbChannelPOST = {
      user_id: "7f6bf857-1f52-40f6-b7c7-399b9b6702d4",
      channel_name: "presence-7f6bf857-1f52-40f6-b7c7-399b9b6702d4",
      user_admin: false,
      user_name: "Test User",
    };

    it("should return the parsed params when given a valid params object", () => {
      const result = testSchemaApiV1dbChannelPOST(mockValidParams);
      expect(result).toEqual(mockValidParams);
    });

    it("should return the parsed params when given a valid params object", () => {
      const params = {
        ...mockValidParams,
        user_admin: "0",
      };

      const result = testSchemaApiV1dbChannelPOST(params);
      expect(result).toEqual(mockValidParams);
    });
    it("should return the parsed params when given a valid params object", () => {
      const params = {
        ...mockValidParams,
        user_admin: "false",
      };

      const result = testSchemaApiV1dbChannelPOST(params);
      expect(result).toEqual(mockValidParams);
    });

    it("should return the parsed params when given a valid params object", () => {
      const params = {
        ...mockValidParams,
        user_admin: "true",
      };

      const expectedResult = {
        ...mockValidParams,
        user_admin: true,
      };

      const result = testSchemaApiV1dbChannelPOST(params);
      expect(result).toEqual(expectedResult);
    });

    it("should throw an error when given a params object without channel_name", () => {
      const params = {
        user_id: mockValidParams.user_id,
        user_admin: mockValidParams.user_admin,
        user_name: mockValidParams.user_name,
      };
      expect(() => {
        testSchemaApiV1dbChannelPOST(params);
      }).toThrow();
    });

    it("should throw an error when given a params object channel_name does not start with 'presence-'", () => {
      const params = {
        channel_name: "7f6bf857-1f52-40f6-b7c7-399b9b6702d4",
        user_id: mockValidParams.user_id,
        user_admin: mockValidParams.user_admin,
        user_name: mockValidParams.user_name,
      };
      expect(() => {
        testSchemaApiV1dbChannelPOST(params);
      }).toThrow();
    });

    it("should throw an error when given a params object channel_name is longer than 45 characters", () => {
      const params = {
        channel_name: mockValidParams.channel_name.concat(
          "A".repeat(46 - mockValidParams.channel_name.length)
        ),
        user_id: mockValidParams.user_id,
        user_admin: mockValidParams.user_admin,
        user_name: mockValidParams.user_name,
      };
      expect(() => {
        testSchemaApiV1dbChannelPOST(params);
      }).toThrow();
    });

    it("should throw an error when given a params object without user_id", () => {
      const params = {
        user_admin: mockValidParams.user_admin,
        channel_name: mockValidParams.channel_name,
        user_name: mockValidParams.user_name,
      };
      expect(() => {
        testSchemaApiV1dbChannelPOST(params);
      }).toThrow();
    });

    it("should throw an error when given a params object with user_id not UUIDv4", () => {
      const params = {
        user_id: "user_id",
        user_admin: mockValidParams.user_admin,
        channel_name: mockValidParams.channel_name,
        user_name: mockValidParams.user_name,
      };
      expect(() => {
        testSchemaApiV1dbChannelPOST(params);
      }).toThrow();
    });

    it("should throw an error when given a params object without user_name", () => {
      const params = {
        user_id: mockValidParams.user_id,
        user_admin: mockValidParams.user_admin,
        channel_name: mockValidParams.channel_name,
      };
      expect(() => {
        testSchemaApiV1dbChannelPOST(params);
      }).toThrow();
    });

    it("should throw an error when user_name is less than 3 characters", () => {
      const params = {
        user_name: "Ab",
        user_id: mockValidParams.user_id,
        user_admin: mockValidParams.user_admin,
        channel_name: mockValidParams.channel_name,
      };
      expect(() => {
        testSchemaApiV1dbChannelPOST(params);
      }).toThrow();
    });

    it("should throw an error when user_name is longer than 36 characters", () => {
      const params = {
        user_name: "A".repeat(37),
        user_id: mockValidParams.user_id,
        user_admin: mockValidParams.user_admin,
        channel_name: mockValidParams.channel_name,
      };
      expect(() => {
        testSchemaApiV1dbChannelPOST(params);
      }).toThrow();
    });
  });
});
