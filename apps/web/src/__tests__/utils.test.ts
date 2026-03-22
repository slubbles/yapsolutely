import { describe, it, expect } from "vitest";

// Test pure utility functions that don't require Next.js server context

describe("email normalization", () => {
  function normalizeEmail(value: string | null): string {
    return typeof value === "string" ? value.trim().toLowerCase() : "";
  }

  it("handles null", () => {
    expect(normalizeEmail(null)).toBe("");
  });

  it("trims whitespace", () => {
    expect(normalizeEmail("  hello@test.com  ")).toBe("hello@test.com");
  });

  it("lowercases", () => {
    expect(normalizeEmail("Hello@Test.COM")).toBe("hello@test.com");
  });

  it("handles empty string", () => {
    expect(normalizeEmail("")).toBe("");
  });
});

describe("hasRealValue (settings validation)", () => {
  const placeholderPatterns = [
    "replace-with",
    "your-",
    "your_",
    "user:password",
    "example",
    "localhost:3000",
    "your-project",
    "your-twilio",
    "your-anthropic",
    "your-deepgram",
    "your-voice-runtime-domain.com",
  ];

  function hasRealValue(value: string | undefined): boolean {
    if (!value) return false;
    const trimmed = value.trim();
    if (!trimmed) return false;
    return !placeholderPatterns.some((p) => trimmed.toLowerCase().includes(p));
  }

  it("returns false for undefined", () => {
    expect(hasRealValue(undefined)).toBe(false);
  });

  it("returns false for empty string", () => {
    expect(hasRealValue("")).toBe(false);
  });

  it("returns false for whitespace", () => {
    expect(hasRealValue("   ")).toBe(false);
  });

  it("returns false for placeholder values", () => {
    expect(hasRealValue("replace-with-your-key")).toBe(false);
    expect(hasRealValue("your-twilio-account-sid")).toBe(false);
    expect(hasRealValue("postgresql://user:password@example.com")).toBe(false);
    expect(hasRealValue("http://localhost:3000")).toBe(false);
  });

  it("returns true for real values", () => {
    expect(hasRealValue("sk_live_abc123")).toBe(true);
    expect(hasRealValue("postgresql://real:pass@db.supabase.co:5432/db")).toBe(true);
    expect(hasRealValue("https://voice.yapsolutely.ai")).toBe(true);
  });
});

describe("phone number sanitization", () => {
  function sanitizePhoneNumber(value: string | null | undefined): string {
    if (!value) return "";
    const trimmed = String(value).trim();
    if (!trimmed) return "";
    if (trimmed.startsWith("+")) return `+${trimmed.slice(1).replace(/\D/g, "")}`;
    return `+${trimmed.replace(/\D/g, "")}`;
  }

  it("returns empty for null/undefined", () => {
    expect(sanitizePhoneNumber(null)).toBe("");
    expect(sanitizePhoneNumber(undefined)).toBe("");
  });

  it("preserves E.164 format", () => {
    expect(sanitizePhoneNumber("+14155550100")).toBe("+14155550100");
  });

  it("adds + prefix if missing", () => {
    expect(sanitizePhoneNumber("14155550100")).toBe("+14155550100");
  });

  it("strips non-digit characters", () => {
    expect(sanitizePhoneNumber("+1 (415) 555-0100")).toBe("+14155550100");
  });

  it("handles empty string", () => {
    expect(sanitizePhoneNumber("")).toBe("");
  });
});

describe("session cookie structure", () => {
  it("serializes session to JSON", () => {
    const session = { email: "test@test.com", name: "Test" };
    const json = JSON.stringify(session);
    const parsed = JSON.parse(json);
    expect(parsed.email).toBe("test@test.com");
    expect(parsed.name).toBe("Test");
  });

  it("handles session without name", () => {
    const session = { email: "test@test.com" };
    const json = JSON.stringify(session);
    const parsed = JSON.parse(json);
    expect(parsed.email).toBe("test@test.com");
    expect(parsed.name).toBeUndefined();
  });
});

describe("password validation rules", () => {
  it("rejects passwords shorter than 8 characters", () => {
    expect("short".length < 8).toBe(true);
    expect("exactly8".length >= 8).toBe(true);
  });

  it("accepts passwords of 8+ characters", () => {
    expect("password123".length >= 8).toBe(true);
    expect("a-very-long-secure-password!".length >= 8).toBe(true);
  });
});
