import {
  TSchemaApiV1dbMessagesNewGET,
  TSchemaApiV1dbMessagesNewPOST,
} from "@/lib/validators/db/messages/generatedTypes";
import {
  schemaApiV1dbMessagesNewGET,
  schemaApiV1dbMessagesNewPOST,
} from "@/lib/validators/db/messages/new";
import { describe, expect, it } from "vitest";

describe("Validating DB Messages new", () => {
  describe("Validating schemaApiV1dbMessagesNewGET", () => {
    const testSchemaApiV1dbMessagesNewGET = (body: any) => {
      return schemaApiV1dbMessagesNewGET.parse(body);
    };

    const mockValidParams: TSchemaApiV1dbMessagesNewGET = {
      user_id: "7f6bf857-1f52-40f6-b7c7-399b9b6702d4",
      channel_name: "presence-7f6bf857-1f52-40f6-b7c7-399b9b6702d4",
    };

    it("should return the parsed params when given a valid params object", () => {
      const result = testSchemaApiV1dbMessagesNewGET(mockValidParams);
      expect(result).toEqual(mockValidParams);
    });

    it("should throw an error when given an empty params object", () => {
      const params = {};
      expect(() => {
        testSchemaApiV1dbMessagesNewGET(params);
      }).toThrow();
    });

    it("should throw an error when given a params object without channel_name", () => {
      const params = {
        user_id: mockValidParams.user_id,
      };
      expect(() => {
        testSchemaApiV1dbMessagesNewGET(params);
      }).toThrow();
    });

    it("should throw an error when given a params object channel_name does not start with 'presence-'", () => {
      const params = {
        channel_name: "7f6bf857-1f52-40f6-b7c7-399b9b6702d4",
        user_id: mockValidParams.user_id,
      };
      expect(() => {
        testSchemaApiV1dbMessagesNewGET(params);
      }).toThrow();
    });

    it("should throw an error when given a params object channel_name is longer than 45 characters", () => {
      const params = {
        channel_name: mockValidParams.channel_name.concat(
          "A".repeat(46 - mockValidParams.channel_name.length)
        ),
        user_id: mockValidParams.user_id,
      };
      expect(() => {
        testSchemaApiV1dbMessagesNewGET(params);
      }).toThrow();
    });

    it("should throw an error when given a params object without user_id", () => {
      const params = {
        channel_name: mockValidParams.channel_name,
      };
      expect(() => {
        testSchemaApiV1dbMessagesNewGET(params);
      }).toThrow();
    });

    it("should throw an error when given a params object with user_id not UUIDv4", () => {
      const params = {
        user_id: "user_id",
        channel_name: mockValidParams.channel_name,
      };
      expect(() => {
        testSchemaApiV1dbMessagesNewGET(params);
      }).toThrow();
    });
  });

  describe("Validating schemaApiV1dbMessagesNewPOST", () => {
    const testSchemaApiV1dbMessagesNewPOST = (params: any) => {
      return schemaApiV1dbMessagesNewPOST.parse(params);
    };

    const mockValidParams: TSchemaApiV1dbMessagesNewPOST = {
      author: "7f6bf857-1f52-40f6-b7c7-399b9b6702d4",
      channel_name: "presence-7f6bf857-1f52-40f6-b7c7-399b9b6702d4",
      message_text: "Test message",
      message_id: "c781f6fe-0764-495d-8771-ef50e88170d3",
    };
    it("should return the parsed params when given a valid params object", () => {
      const result = testSchemaApiV1dbMessagesNewPOST(mockValidParams);
      expect(result).toEqual(mockValidParams);
    });

    it("should throw an error when given an empty params object", () => {
      const params = {};
      expect(() => {
        testSchemaApiV1dbMessagesNewPOST(params);
      }).toThrow();
    });

    it("should throw an error when given a params object without channel_name", () => {
      const params = {
        author: mockValidParams.author,
        message_text: mockValidParams.message_text,
        message_id: mockValidParams.message_id,
      };
      expect(() => {
        testSchemaApiV1dbMessagesNewPOST(params);
      }).toThrow();
    });

    it("should throw an error when given a params object channel_name does not start with 'presence-'", () => {
      const params = {
        channel_name: "7f6bf857-1f52-40f6-b7c7-399b9b6702d4",
        author: mockValidParams.author,
        message_text: mockValidParams.message_text,
        message_id: mockValidParams.message_id,
      };
      expect(() => {
        testSchemaApiV1dbMessagesNewPOST(params);
      }).toThrow();
    });

    it("should throw an error when given a params object channel_name is longer than 45 characters", () => {
      const params = {
        channel_name: mockValidParams.channel_name.concat(
          "A".repeat(46 - mockValidParams.channel_name.length)
        ),
        author: mockValidParams.author,
        message_text: mockValidParams.message_text,
        message_id: mockValidParams.message_id,
      };
      expect(() => {
        testSchemaApiV1dbMessagesNewPOST(params);
      }).toThrow();
    });

    it("should throw an error when given a params object without author", () => {
      const params = {
        channel_name: mockValidParams.channel_name,
        message_text: mockValidParams.message_text,
        message_id: mockValidParams.message_id,
      };
      expect(() => {
        testSchemaApiV1dbMessagesNewPOST(params);
      }).toThrow();
    });

    it("should throw an error when given a params object with author not UUIDv4", () => {
      const params = {
        author: "author_id",
        channel_name: mockValidParams.channel_name,
        message_text: mockValidParams.message_text,
        message_id: mockValidParams.message_id,
      };
      expect(() => {
        testSchemaApiV1dbMessagesNewPOST(params);
      }).toThrow();
    });

    it("should throw an error when given a params object without message_text", () => {
      const params = {
        author: mockValidParams.author,
        channel_name: mockValidParams.channel_name,
        message_id: mockValidParams.message_id,
      };
      expect(() => {
        testSchemaApiV1dbMessagesNewPOST(params);
      }).toThrow();
    });

    it("should throw an error when given a params object with message shorter than 1 character", () => {
      const params = {
        author: mockValidParams.author,
        channel_name: mockValidParams.channel_name,
        message_text: "",
        message_id: mockValidParams.message_id,
      };
      expect(() => {
        testSchemaApiV1dbMessagesNewPOST(params);
      }).toThrow();
    });

    it("should throw an error when given a params object with message_text longer than 400 characters", () => {
      const params = {
        author: mockValidParams.author,
        channel_name: mockValidParams.message_text,
        message_text: "A".repeat(401),
        message_id: mockValidParams.message_id,
      };
      expect(() => {
        testSchemaApiV1dbMessagesNewPOST(params);
      }).toThrow();
    });

    it("should throw an error when given a params object without message_id", () => {
      const params = {
        author: mockValidParams.author,
        channel_name: mockValidParams.channel_name,
        message_text: mockValidParams.message_text,
      };
      expect(() => {
        testSchemaApiV1dbMessagesNewPOST(params);
      }).toThrow();
    });
  });
});
