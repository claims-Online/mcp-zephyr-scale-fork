import { describe, it, expect } from "vitest";
import { z } from "zod";
import { projectKeySchema } from "../src/shared/schemas/common.js";
import { resolveProjectKey } from "../src/server/api/utils.js";

// ── Schema validation ────────────────────────────────────────────────────────

describe("projectKeySchema", () => {
	const parse = (v: unknown) => z.object({ k: projectKeySchema }).safeParse({ k: v });

	it("accepts valid 2-char key", () => {
		expect(parse("CE").success).toBe(true);
	});

	it("accepts valid 3-char key", () => {
		expect(parse("KAN").success).toBe(true);
	});

	it("accepts valid 5-char key with underscore", () => {
		expect(parse("MY_PJ").success).toBe(true);
	});

	it("accepts valid 10-char key (max length)", () => {
		expect(parse("ABCDEFGHIJ").success).toBe(true);
	});

	it("accepts undefined (optional)", () => {
		expect(parse(undefined).success).toBe(true);
	});

	it("rejects lowercase key", () => {
		expect(parse("kan").success).toBe(false);
	});

	it("rejects key starting with digit", () => {
		expect(parse("1KAN").success).toBe(false);
	});

	it("rejects single-character key (too short)", () => {
		expect(parse("K").success).toBe(false);
	});

	it("rejects 11-character key (too long)", () => {
		expect(parse("ABCDEFGHIJK").success).toBe(false);
	});

	it("rejects key with space", () => {
		expect(parse("K AN").success).toBe(false);
	});

	it("rejects key with hyphen", () => {
		expect(parse("K-AN").success).toBe(false);
	});
});

// ── Resolution logic ─────────────────────────────────────────────────────────

describe("resolveProjectKey", () => {
	it("returns per-call key when both are set (override wins)", () => {
		expect(resolveProjectKey("CE", "KAN")).toBe("CE");
	});

	it("returns default key when per-call is undefined (BC mode)", () => {
		expect(resolveProjectKey(undefined, "KAN")).toBe("KAN");
	});

	it("returns per-call key when default is undefined", () => {
		expect(resolveProjectKey("CE", undefined)).toBe("CE");
	});

	it("returns null when neither is set", () => {
		expect(resolveProjectKey(undefined, undefined)).toBeNull();
	});
});
