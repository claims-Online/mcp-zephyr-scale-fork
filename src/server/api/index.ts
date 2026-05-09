/**
 * Central registry for all MCP tools
 */
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { ZephyrV2Client } from "zephyr-api-client";
import { registerTestCaseTools } from "./cases.js";
import { registerFolderTools } from "./folders.js";
import { registerTestPlanTools } from "./plans.js";
import { registerTestCycleTools } from "./cycles.js";
import { registerTestExecutionTools } from "./executions.js";
import { registerStatusTools } from "./statuses.js";
import { registerPriorityTools } from "./priorities.js";
import { registerEnvironmentTools } from "./environments.js";
import { registerLinkTools } from "./links.js";

/**
 * Register all Zephyr Scale MCP tools.
 * @param defaultProjectKey - Optional fallback when the tool call omits projectKey.
 *   Populated from JIRA_PROJECT_KEY env var for backward compatibility.
 */
export function registerAllTools(
	server: McpServer,
	zephyrClient: ZephyrV2Client,
	defaultProjectKey?: string,
): void {
	registerTestCaseTools(server, zephyrClient, defaultProjectKey);
	registerFolderTools(server, zephyrClient, defaultProjectKey);
	registerTestPlanTools(server, zephyrClient, defaultProjectKey);
	registerTestCycleTools(server, zephyrClient, defaultProjectKey);
	registerTestExecutionTools(server, zephyrClient, defaultProjectKey);
	registerStatusTools(server, zephyrClient, defaultProjectKey);
	registerPriorityTools(server, zephyrClient, defaultProjectKey);
	registerEnvironmentTools(server, zephyrClient, defaultProjectKey);
	registerLinkTools(server, zephyrClient);
}
