import {
  schemaApiDBPOST,
  schemaApiDBPUT,
  schemaPusherAuthPOST,
} from "@/lib/validators";
import { describe, expect, it } from "vitest";

// testing schemaPOST. POST request params validation
const testSchemaPusherAuthPost = (params: any) => {
  return schemaPusherAuthPOST.parse(params);
};

describe("Validating schemaPusherAuthPOST", () => {
  it("should return the parsed params when given a valid params object", () => {
    const params = {
      socket_id: "socket_id",
      channel_name: "channel_name",
      user_id: "abc123",
    };
    const result = testSchemaPusherAuthPost(params);
    expect(result).toEqual(params);
  });

  it("should throw an error when given an empty params object", () => {
    const params = {};
    expect(() => {
      testSchemaPusherAuthPost(params);
    }).toThrow();
  });

  it("should throw an error when given a params object without channel_name", () => {
    const params = {
      socket_id: "socket_id",
      user_id: "abc123",
    };
    expect(() => {
      testSchemaPusherAuthPost(params);
    }).toThrow();
  });

  it("should throw an error when given a params object without user_id", () => {
    const params = {
      socket_id: "socket_id",
      channel_name: "channel_name",
    };
    expect(() => {
      testSchemaPusherAuthPost(params);
    }).toThrow();
  });

  it("should throw an error when given a params object with special characters for user_id", () => {
    const params = {
      socket_id: "socket_id",
      channel_name: "channel_name",
      user_id: "abc@123",
    };
    expect(() => {
      testSchemaPusherAuthPost(params);
    }).toThrow();
  });

  it("should throw an error when given a params object with a user_id longer than 36 characters", () => {
    const params = {
      socket_id: "socket_id",
      channel_name: "channel_name",
      user_id: "a".repeat(37),
    };
    expect(() => {
      testSchemaPusherAuthPost(params);
    }).toThrow();
  });

  it("should throw an error when given a params object with an empty string for user_id", () => {
    const params = {
      userId: "",
      socket_id: "socket_id",
      channel_name: "channel_name",
    };
    expect(() => testSchemaPusherAuthPost(params)).toThrow();
  });
});

// testing schemaApiSBPOST. POST request body validation
const testSchemaApiDBPost = (body: any) => {
  return schemaApiDBPOST.parse(body);
};

describe("Validating request body tests", () => {
  it("should return the parsed body when given a valid body object", () => {
    const body = {
      room: "presence-abc123",
    };
    const result = testSchemaApiDBPost(body);
    expect(result).toEqual(body);
  });

  it("should throw an error when given an empty body object", () => {
    const body = {};
    expect(() => {
      testSchemaApiDBPost(body);
    }).toThrow();
  });

  it("should throw an error when given a body object with special characters for room", () => {
    const body = {
      room: "presence-room!",
    };
    expect(() => {
      testSchemaApiDBPost(body);
    }).toThrow();
  });

  it("should throw an error when given a body object with a room longer than 45 characters", () => {
    const body = {
      room: "presence-abc123presence-abc123presence-abc123presence-abc123presence-abc123presence-abc123presence-abc123presence-abc123presence-abc123presence-abc123presence-abc123presence-abc123presence-abc123presence-abc123presence-abc123presence-abc123presence-abc123presence-abc123presence-abc123presence-abc123presence-abc123presence-abc123presence-abc123presence-abc123presence-abc123",
    };
    expect(() => {
      testSchemaApiDBPost(body);
    }).toThrow();
  });

  it('should throw an error when given a body object with a room that does not start with "presence-"', () => {
    const body = {
      room: "room1",
    };
    expect(() => {
      testSchemaApiDBPost(body);
    }).toThrow();
  });

  it("should throw an error when given a body object with extra fields that are not part of the schema", () => {
    const body = {
      room: "presence-abc123",
      extraField: "extra",
    };
    expect(() => {
      testSchemaApiDBPost(body);
    }).toThrow();
  });
});

// testing schemaPOST. POST request body validation
const testSchemaApiDBPut = (body: any) => {
  return schemaApiDBPUT.parse(body);
};

describe("Validating request body test", () => {
  it("should return the parsed body when given a valid body object", () => {
    const body = {
      userId: "abc123",
      message: "message",
      room: "presence-abc123",
    };
    const result = testSchemaApiDBPut(body);
    expect(result).toEqual(body);
  });

  it("should throw an error when given an empty body object", () => {
    const body = {};
    expect(() => {
      testSchemaApiDBPut(body);
    }).toThrow();
  });

  it("should throw an error when given a body object without room", () => {
    const body = {
      userId: "abc123",
      message: "message",
    };
    expect(() => {
      testSchemaApiDBPut(body);
    }).toThrow();
  });

  it("should throw an error when given a body object without userId", () => {
    const body = {
      room: "presence-abc123",
      message: "message",
    };
    expect(() => {
      testSchemaApiDBPut(body);
    }).toThrow();
  });

  it("should throw an error when given a body object without message", () => {
    const body = {
      userId: "abc123",
      room: "presence-abc123",
    };
    expect(() => {
      testSchemaApiDBPut(body);
    }).toThrow();
  });

  it("should throw an error when given a body object with special characters for room", () => {
    const body = {
      userId: "abc123",
      room: "presence-room!",
      message: "message",
    };
    expect(() => {
      testSchemaApiDBPut(body);
    }).toThrow();
  });

  it("should throw an error when given a body object with special characters for userId", () => {
    const body = {
      userId: "abc@123",
      room: "presence-abc123",
      message: "message",
    };
    expect(() => testSchemaApiDBPut(body)).toThrow();
  });

  it("should throw an error when given a body object with a room longer than 45 characters", () => {
    const body = {
      userId: "abc123",
      room: "presence-abc123presence-abc123presence-abc123presence-abc123presence-abc123presence-abc123presence-abc123presence-abc123presence-abc123presence-abc123presence-abc123presence-abc123presence-abc123presence-abc123presence-abc123presence-abc123presence-abc123presence-abc123presence-abc123presence-abc123presence-abc123presence-abc123presence-abc123presence-abc123presence-abc123",
      message: "message",
    };
    expect(() => {
      testSchemaApiDBPut(body);
    }).toThrow();
  });

  it('should throw an error when given a body object with a room that does not start with "presence-"', () => {
    const body = {
      userId: "abc123",
      room: "room1",
      message: "message",
    };
    expect(() => {
      testSchemaApiDBPut(body);
    }).toThrow();
  });

  it("should throw an error when given a body object with a userId longer than 36 characters", () => {
    const body = {
      userId: "abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz",
      room: "presence-abc123",
      message: "message",
    };
    expect(() => {
      testSchemaApiDBPut(body);
    }).toThrow();
  });

  it("should throw an error when given a body object with an empty string for room", () => {
    const body = {
      userId: "abc123",
      room: "",
      message: "message",
    };
    expect(() => testSchemaApiDBPut(body)).toThrow();
  });

  it("should throw an error when given a body object with an empty string for userId", () => {
    const body = {
      userId: "",
      room: "presence-abc123",
      message: "message",
    };
    expect(() => testSchemaApiDBPut(body)).toThrow();
  });

  it("should throw an error when given a body object with an empty string for userId", () => {
    const body = {
      userId: "abc123",
      room: "presence-abc123",
      message: "",
    };
    expect(() => testSchemaApiDBPut(body)).toThrow();
  });

  it("should throw an error when given a body object with a message longer than 100 characters", () => {
    const body = {
      userId: "abc123",
      room: "presence-abc123",
      message: "a".repeat(401),
    };
    expect(() => {
      testSchemaApiDBPut(body);
    }).toThrow();
  });

  it("should throw an error when given a body object with extra fields that are not part of the schema", () => {
    const body = {
      userId: "abc123",
      room: "presence-abc123",
      message: "message",
      extraField: "extra",
    };
    expect(() => {
      testSchemaApiDBPut(body);
    }).toThrow();
  });
});
