/**
 * Status management tools for Zephyr Scale MCP
 */
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { ZephyrV2Client } from "../../clients/index.js";
import {
	createErrorResponse,
	createSuccessResponse,
	resolveProjectKey,
	createMissingProjectKeyResponse,
} from "./utils.js";
import {
	listStatusesSchema,
	createStatusSchema,
	getStatusSchema,
} from "../../shared/schemas/statuses.js";

/**
 * Register all status-related tools with the MCP server
 */
export function registerStatusTools(
	server: McpServer,
	zephyrClient: ZephyrV2Client,
	defaultProjectKey?: string,
): void {
	/**
	 * List statuses
	 */
	server.tool(
		"listStatuses",
		"List statuses / ステータス一覧を取得します",
		listStatusesSchema,
		async ({ projectKey, maxResults, startAt }) => {
			const effectiveKey = resolveProjectKey(projectKey, defaultProjectKey);
			if (!effectiveKey) return createMissingProjectKeyResponse();
			try {
				const result = await zephyrClient.statuses.listStatuses(
					{
						projectKey: effectiveKey,
						maxResults: maxResults ?? 10,
						startAt: startAt ?? 0,
					},
					{},
				);

				const response = createSuccessResponse(
					"Statuses retrieved successfully",
					{
						statuses: result.data,
					},
				);

				return {
					content: [{ type: "text", text: response.text }],
					isError: false,
				};
			} catch (error) {
				const errorResponse = createErrorResponse(
					`Error listing statuses for project: ${effectiveKey}`,
					error,
				);
				return {
					content: [{ type: "text", text: errorResponse.text }],
					isError: true,
				};
			}
		},
	);

	/**
	 * Create a new status
	 */
	server.tool(
		"createStatus",
		"Create a new status / 新しいステータスを作成します",
		createStatusSchema,
		async ({ projectKey, name, type, description, color }) => {
			const effectiveKey = resolveProjectKey(projectKey, defaultProjectKey);
			if (!effectiveKey) return createMissingProjectKeyResponse();
			try {
				const result = await zephyrClient.statuses.createStatus(
					{
						projectKey: effectiveKey,
						name,
						type,
						...(description && { description }),
						...(color && { color }),
					},
					{},
				);

				const response = createSuccessResponse("Status created successfully", {
					status: result.data,
				});

				return {
					content: [{ type: "text", text: response.text }],
					isError: false,
				};
			} catch (error) {
				const errorResponse = createErrorResponse(
					`Error creating status: ${name}`,
					error,
				);
				return {
					content: [{ type: "text", text: errorResponse.text }],
					isError: true,
				};
			}
		},
	);

	/**
	 * Get details of a specific status
	 */
	server.tool(
		"getStatus",
		"Get details of a specific status / 特定のステータスの詳細を取得します",
		getStatusSchema,
		async ({ statusId }) => {
			try {
				const result = await zephyrClient.statuses.getStatus(statusId, {});

				const response = createSuccessResponse(
					"Status retrieved successfully",
					{
						status: result.data,
					},
				);

				return {
					content: [{ type: "text", text: response.text }],
					isError: false,
				};
			} catch (error) {
				const errorResponse = createErrorResponse(
					`Error retrieving status ID: ${statusId}`,
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
