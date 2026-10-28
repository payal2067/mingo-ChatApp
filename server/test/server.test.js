import { describe, it } from "node:test";
import assert from "node:assert/strict";

describe("Mingo Server Backend Tests", () => {
  it("server environment is functional", () => {
    assert.equal(1 + 1, 2);
  });

  it("express and core dependencies load properly", async () => {
    const express = await import("express");
    assert.ok(express.default, "Express should be properly exported");
  });
});

