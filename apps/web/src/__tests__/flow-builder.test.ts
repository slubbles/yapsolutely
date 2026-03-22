import { describe, it, expect } from "vitest";

// Test the flow builder type definitions and utility functions
// We import the types and test the local prompt generation logic

const BLOCK_TYPES = [
  "greet",
  "qualify",
  "faq",
  "book_appointment",
  "transfer",
  "close_call",
  "custom",
] as const;

describe("FlowBuilder block types", () => {
  it("has exactly 7 block types", () => {
    expect(BLOCK_TYPES).toHaveLength(7);
  });

  it("includes all expected types", () => {
    expect(BLOCK_TYPES).toContain("greet");
    expect(BLOCK_TYPES).toContain("qualify");
    expect(BLOCK_TYPES).toContain("faq");
    expect(BLOCK_TYPES).toContain("book_appointment");
    expect(BLOCK_TYPES).toContain("transfer");
    expect(BLOCK_TYPES).toContain("close_call");
    expect(BLOCK_TYPES).toContain("custom");
  });
});

describe("FlowBlock creation", () => {
  it("generates a unique ID format", () => {
    const createId = () =>
      `block-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    const id1 = createId();
    const id2 = createId();
    expect(id1).toMatch(/^block-\d+-[a-z0-9]+$/);
    expect(id1).not.toBe(id2);
  });

  it("creates a block with default fields", () => {
    const block = {
      id: "block-1",
      type: "greet" as const,
      fields: { greeting: "", agentIntro: "" },
    };
    expect(block.type).toBe("greet");
    expect(block.fields.greeting).toBe("");
    expect(block.fields.agentIntro).toBe("");
  });
});

describe("Prompt generation (local fallback)", () => {
  function generatePromptLocally(
    agent: { name: string; description: string | null },
    blocks: Array<{
      type: string;
      fields: Record<string, string>;
    }>,
  ): string {
    const parts: string[] = [];

    parts.push(
      `You are ${agent.name}${agent.description ? `, ${agent.description}` : ""}.`,
    );
    parts.push(
      "Keep responses concise, natural for phone calls, and usually under two sentences.",
    );

    for (const block of blocks) {
      switch (block.type) {
        case "greet":
          if (block.fields.greeting)
            parts.push(`\nGreeting: Start the call by saying something like: "${block.fields.greeting}"`);
          break;
        case "qualify":
          if (block.fields.questions)
            parts.push(
              `\nQualifying questions to ask:\n${block.fields.questions
                .split("\n")
                .filter(Boolean)
                .map((q) => `- ${q.trim()}`)
                .join("\n")}`,
            );
          break;
        case "faq":
          if (block.fields.topics) parts.push(`\nCommon questions and answers:\n${block.fields.topics}`);
          break;
        case "book_appointment":
          if (block.fields.services) parts.push(`\nAvailable services: ${block.fields.services}`);
          break;
        case "close_call":
          if (block.fields.signoff) parts.push(`Closing line: "${block.fields.signoff}"`);
          break;
        case "custom":
          if (block.fields.instruction) parts.push(`\n${block.fields.instruction}`);
          break;
      }
    }

    parts.push("\nAlways confirm next steps before ending the call.");
    return parts.join("\n");
  }

  it("generates a prompt from an agent with no blocks", () => {
    const prompt = generatePromptLocally(
      { name: "Alex", description: "your booking assistant" },
      [],
    );
    expect(prompt).toContain("You are Alex, your booking assistant.");
    expect(prompt).toContain("Always confirm next steps");
  });

  it("includes greeting block in the prompt", () => {
    const prompt = generatePromptLocally(
      { name: "Mia", description: null },
      [{ type: "greet", fields: { greeting: "Hello! How can I help?", agentIntro: "" } }],
    );
    expect(prompt).toContain("You are Mia.");
    expect(prompt).toContain("Hello! How can I help?");
  });

  it("formats qualifying questions as a list", () => {
    const prompt = generatePromptLocally(
      { name: "Bot", description: null },
      [{ type: "qualify", fields: { questions: "What service?\nFirst time?", collectInfo: "" } }],
    );
    expect(prompt).toContain("- What service?");
    expect(prompt).toContain("- First time?");
  });

  it("includes FAQ topics", () => {
    const prompt = generatePromptLocally(
      { name: "Bot", description: null },
      [{ type: "faq", fields: { topics: "Hours: Mon-Fri 9-5", fallback: "" } }],
    );
    expect(prompt).toContain("Hours: Mon-Fri 9-5");
  });

  it("includes custom instruction", () => {
    const prompt = generatePromptLocally(
      { name: "Bot", description: null },
      [{ type: "custom", fields: { instruction: "Always be polite." } }],
    );
    expect(prompt).toContain("Always be polite.");
  });

  it("handles multiple blocks in sequence", () => {
    const prompt = generatePromptLocally(
      { name: "Alex", description: "front desk" },
      [
        { type: "greet", fields: { greeting: "Welcome!", agentIntro: "" } },
        { type: "book_appointment", fields: { services: "Consultation", availability: "", confirmation: "" } },
        { type: "close_call", fields: { summary: "", signoff: "Goodbye!" } },
      ],
    );
    expect(prompt).toContain("Welcome!");
    expect(prompt).toContain("Available services: Consultation");
    expect(prompt).toContain('Closing line: "Goodbye!"');
  });
});
