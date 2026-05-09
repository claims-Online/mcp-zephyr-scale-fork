/**
 * Priority management tools for Zephyr Scale MCP
 */
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { ZephyrV2Client } from "../../clients/index.js";
import {
	createErrorResponse,
	createSuccessResponse,
	resolveProjectKey,
	createMissingProjectKeyResponse,
} from "./utils.js";
import { listPrioritiesSchema } from "../../shared/schemas/priorities.js";

/**
 * Register all priority-related tools with the MCP server
 */
export function registerPriorityTools(
	server: McpServer,
	zephyrClient: ZephyrV2Client,
	defaultProjectKey?: string,
): void {
	/**
	 * List priorities
	 */
	server.tool(
		"listPriorities",
		"List priorities / 優先度一覧を取得します",
		listPrioritiesSchema,
		async ({ projectKey, maxResults, startAt }) => {
			const effectiveKey = resolveProjectKey(projectKey, defaultProjectKey);
			if (!effectiveKey) return createMissingProjectKeyResponse();
			try {
				const result = await zephyrClient.priorities.listPriorities(
					{
						projectKey: effectiveKey,
						maxResults: maxResults ?? 10,
						startAt: startAt ?? 0,
					},
					{},
				);

				const response = createSuccessResponse(
					"Priorities retrieved successfully",
					{
						priorities: result.data,
					},
				);

				return {
					content: [{ type: "text", text: response.text }],
					isError: false,
				};
			} catch (error) {
				const errorResponse = createErrorResponse(
					`Error listing priorities for project: ${effectiveKey}`,
					error,
				);
				return {
					content: [{ type: "text", text: errorResponse.text }],
					isError: true,
				};
			}
		},
	);
}
