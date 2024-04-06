import { schemaApiV1dbChannelOwnerGET } from "@/lib/validators/db/channel/owner/owner";
import { describe, expect, it } from "vitest";

describe("Validating schemaApiV1dbChannelOwnerGET", () => {
  const testSchemaApiV1dbChannelOwnerGET = (body: any) => {
    return schemaApiV1dbChannelOwnerGET.parse(body);
  };

  const mockValidParams = {
    channel_name: "presence-7f6bf857-1f52-40f6-b7c7-399b9b6702d4",
  };

  it("should return the parsed params when given a valid params object", () => {
    const result = testSchemaApiV1dbChannelOwnerGET(mockValidParams);
    expect(result).toEqual(mockValidParams);
  });

  it("should throw an error when given an empty params object", () => {
    const params = {};
    expect(() => {
      testSchemaApiV1dbChannelOwnerGET(params);
    }).toThrow();
  });

  it("should throw an error when given a params object without channel_name", () => {
    const params = {};
    expect(() => {
      testSchemaApiV1dbChannelOwnerGET(params);
    }).toThrow();
  });

  it("should throw an error when given a params object channel_name does not start with 'presence-'", () => {
    const params = {
      channel_name: "7f6bf857-1f52-40f6-b7c7-399b9b6702d4",
    };
    expect(() => {
      testSchemaApiV1dbChannelOwnerGET(params);
    }).toThrow();
  });

  it("should throw an error when given a params object channel_name is longer than 45 characters", () => {
    const params = {
      channel_name: mockValidParams.channel_name.concat(
        "A".repeat(46 - mockValidParams.channel_name.length)
      ),
    };
    expect(() => {
      testSchemaApiV1dbChannelOwnerGET(params);
    }).toThrow();
  });
});
