# claims-Online/mcp-zephyr-scale-fork

## 1. Purpose

Lifted the hard-coded single-project constraint from upstream's `mcp-zephyr-scale` so that one MCP server instance can serve all 7 Jira projects (CE, UI, COAGB, IL, MYH, TEST, ACOB) on our Atlassian site. `JIRA_PROJECT_KEY` becomes an optional default; agents pass `projectKey` per tool call to override it.

## 2. Upstream

- Repository: https://github.com/bun913/mcp-zephyr-scale  
- Forked from commit: `fc9d18f3025fa6fb59ea2268837188cebd0b66fc`  
- License: MIT

## 3. Delta

**What changed:**

- `src/shared/schemas/common.ts` (new) — shared `projectKeySchema`: optional, strict Zod regex `^[A-Z][A-Z0-9_]{1,9}$` (2–10 chars, uppercase, underscore allowed).
- All 8 schema files (`cases`, `cycles`, `plans`, `executions`, `folders`, `statuses`, `environments`, `priorities`) — replaced the hard-required `z.string()` `projectKey` fields with `projectKeySchema` (imported from `common.ts`).
- `src/server/api/utils.ts` — added `resolveProjectKey(perCall, default)` and `createMissingProjectKeyResponse()` helpers.
- All 8 API registration files (`cases`, `cycles`, `plans`, `executions`, `folders`, `statuses`, `environments`, `priorities`) — added `defaultProjectKey?: string` parameter; each tool that uses `projectKey` resolves it via `resolveProjectKey` and returns `createMissingProjectKeyResponse()` when neither is set.
- `src/server/api/index.ts` — `registerAllTools` accepts and passes down `defaultProjectKey?: string`.
- `src/index.ts` — `JIRA_PROJECT_KEY` is now an optional env var (only `ZEPHYR_API_TOKEN` remains required); `defaultProjectKey` is threaded through to `registerAllTools`.
- `test/projectKey.test.ts` (new) — 15 unit tests covering schema validation (valid/invalid keys, optional) and `resolveProjectKey` resolution logic (per-call override, BC fallback, null when absent).

**Backward compatibility:** setting `JIRA_PROJECT_KEY` env var continues to work exactly as before. The only breaking change for existing users is that a missing `JIRA_PROJECT_KEY` no longer fails at startup — it now fails gracefully per-call if `projectKey` is also absent.

## 4. Upstream relationship

Upstream PR: https://github.com/bun913/mcp-zephyr-scale/pull/15 — open, backward-compat variant, waiting for maintainer review.

## 5. Retirement criteria

When upstream PR #15 is merged and published in a release, bump `.mcp.json` references in agent configurations to the upstream npm package and archive this fork within 30 days.

## 6. Owner

**Kocak** (External Developer, ClaimsOnline d.o.o.) — responsible for rebasing, testing, and re-cutting releases.

## 7. Quarterly review log

| Date | Reviewer | Status | Action |
|------|----------|--------|--------|
| 2026-Q2 | Kocak | Active — upstream PR open | Monitor PR #15 for merge |

---

## Installation (fork variant)

Add to your `.mcp.json`, pinned to a SHA:

```json
{
  "mcpServers": {
    "zephyr-scale": {
      "command": "npx",
      "args": [
        "-y",
        "github:claims-Online/mcp-zephyr-scale-fork#<SHA>"
      ],
      "env": {
        "ZEPHYR_API_TOKEN": "your-api-token-here"
      }
    }
  }
}
```

Replace `<SHA>` with the commit SHA from this repo you want to pin to. `JIRA_PROJECT_KEY` is optional — set it for single-project mode (BC), omit it to require `projectKey` on every tool call.

**Multi-project example** (no env default, per-call projectKey):

```json
{
  "mcpServers": {
    "zephyr-scale": {
      "command": "npx",
      "args": ["-y", "github:claims-Online/mcp-zephyr-scale-fork#<SHA>"],
      "env": {
        "ZEPHYR_API_TOKEN": "your-api-token-here"
      }
    }
  }
}
```

Then call any tool with `projectKey: "CE"` or `projectKey: "UI"` etc.

## Development

```bash
npm install
npm run build
npm test
npm run check
```
