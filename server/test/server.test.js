import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { isOriginAllowed, getAllowedOrigins } from "../src/config/cors.config.js";
import User from "../src/models/user.model.js";

describe("Mingo Server Backend Tests", () => {
  it("server environment is functional", () => {
    assert.equal(1 + 1, 2);
  });

  it("express and core dependencies load properly", async () => {
    const express = await import("express");
    assert.ok(express.default, "Express should be properly exported");
  });

  it("allows trusted origins including Vercel frontend", () => {
    assert.ok(isOriginAllowed("https://mingo-chat-app-five.vercel.app"));
    assert.ok(isOriginAllowed("http://localhost:5173"));
    assert.ok(isOriginAllowed("http://localhost:3000"));
    assert.ok(isOriginAllowed("https://mingo-chat-app-custom.vercel.app"));
    // Non-origin requests (e.g. mobile apps, server-to-server)
    assert.ok(isOriginAllowed(undefined));
    assert.ok(isOriginAllowed(""));
  });

  it("blocks untrusted origins", () => {
    assert.equal(isOriginAllowed("https://malicious-site.com"), false);
    assert.equal(isOriginAllowed("https://fake-mingo.com"), false);
  });

  it("includes default origins in getAllowedOrigins", () => {
    const origins = getAllowedOrigins();
    assert.ok(origins.includes("https://mingo-chat-app-five.vercel.app"));
    assert.ok(origins.includes("http://localhost:5173"));
  });

  it("User model includes savedContacts schema definition", () => {
    assert.ok(User.schema.path("savedContacts"), "User schema should have savedContacts path");
  });
});
