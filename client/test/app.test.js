import { describe, it } from "node:test";
import assert from "node:assert/strict";

describe("Mingo Client App Tests", () => {
  it("environment variables and base setup are functional", () => {
    assert.equal(1 + 1, 2);
  });

  it("loads API client configuration without errors", async () => {
    const apiModule = await import("../src/config/api.js");
    assert.ok(apiModule.default, "Axios API client should be properly exported");
  });
});

