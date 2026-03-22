import { describe, it, expect } from "vitest";
import { createSessionStore } from "./session-store.js";

describe("createSessionStore", () => {
  it("creates an empty store", () => {
    const store = createSessionStore();
    expect(store.values()).toHaveLength(0);
  });

  it("stores and retrieves a session by streamSid", () => {
    const store = createSessionStore();
    const session = { id: "s1", callerNumber: "+14155550100" };
    store.set("stream-abc", session);
    expect(store.get("stream-abc")).toBe(session);
  });

  it("returns null for unknown streamSid", () => {
    const store = createSessionStore();
    expect(store.get("unknown")).toBeNull();
  });

  it("deletes a session", () => {
    const store = createSessionStore();
    store.set("stream-abc", { id: "s1" });
    store.delete("stream-abc");
    expect(store.get("stream-abc")).toBeNull();
    expect(store.values()).toHaveLength(0);
  });

  it("lists all session values", () => {
    const store = createSessionStore();
    store.set("a", { id: "1" });
    store.set("b", { id: "2" });
    expect(store.values()).toHaveLength(2);
  });
});
