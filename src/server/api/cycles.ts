/**
 * Test Cycle management tools for Zephyr Scale MCP
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
	listTestCyclesSchema,
	createTestCycleSchema,
	getTestCycleSchema,
	updateTestCycleSchema,
	createTestCycleWebLinkSchema,
	createTestCycleIssueLinkSchema,
} from "../../shared/schemas/cycles.js";

/**
 * Register all test cycle-related tools with the MCP server
 */
export function registerTestCycleTools(
	server: McpServer,
	zephyrClient: ZephyrV2Client,
	defaultProjectKey?: string,
): void {
	/**
	 * List test cycles in a project
	 */
	server.tool(
		"listTestCycles",
		"List test cycles in a project / プロジェクト内のテストサイクル一覧を取得します",
		listTestCyclesSchema,
		async ({ projectKey, folderId, maxResults, startAt }) => {
			const effectiveKey = resolveProjectKey(projectKey, defaultProjectKey);
			if (!effectiveKey) return createMissingProjectKeyResponse();
			try {
				const result = await zephyrClient.testcycles.listTestCycles(
					{
						projectKey: effectiveKey,
						...(folderId !== undefined && { folderId }),
						maxResults: maxResults ?? 50,
						startAt: startAt ?? 0,
					},
					{},
				);

				const response = createSuccessResponse(
					"Test cycles retrieved successfully",
					{
						testCycles: result.data,
					},
				);

				return {
					content: [{ type: "text", text: response.text }],
					isError: false,
				};
			} catch (error) {
				const errorResponse = createErrorResponse(
					`Error listing test cycles for project: ${effectiveKey}`,
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
	 * Create a new test cycle
	 */
	server.tool(
		"createTestCycle",
		"Create a new test cycle / 新しいテストサイクルを作成します",
		createTestCycleSchema,
		async ({
			projectKey,
			name,
			description,
			plannedStartDate,
			plannedEndDate,
			statusName,
			folderId,
			customFields,
		}) => {
			const effectiveKey = resolveProjectKey(projectKey, defaultProjectKey);
			if (!effectiveKey) return createMissingProjectKeyResponse();
			try {
				const result = await zephyrClient.testcycles.createTestCycle(
					{
						projectKey: effectiveKey,
						name,
						...(description && { description }),
						...(plannedStartDate && { plannedStartDate }),
						...(plannedEndDate && { plannedEndDate }),
						...(statusName && { statusName }),
						...(folderId !== undefined && { folderId }),
						...(customFields && { customFields }),
					},
					{},
				);

				const response = createSuccessResponse(
					"Test cycle created successfully",
					{
						testCycle: result.data,
					},
				);

				return {
					content: [{ type: "text", text: response.text }],
					isError: false,
				};
			} catch (error) {
				const errorResponse = createErrorResponse(
					`Error creating test cycle: ${name}`,
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
	 * Get details of a specific test cycle
	 */
	server.tool(
		"getTestCycle",
		"Get details of a specific test cycle / 特定のテストサイクルの詳細を取得します",
		getTestCycleSchema,
		async ({ testCycleIdOrKey }) => {
			try {
				const result = await zephyrClient.testcycles.getTestCycle(
					testCycleIdOrKey,
					{},
				);

				const response = createSuccessResponse(
					"Test cycle retrieved successfully",
					{
						testCycle: result.data,
					},
				);

				return {
					content: [{ type: "text", text: response.text }],
					isError: false,
				};
			} catch (error) {
				const errorResponse = createErrorResponse(
					`Error retrieving test cycle: ${testCycleIdOrKey}`,
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
	 * Update an existing test cycle
	 */
	server.tool(
		"updateTestCycle",
		"Update an existing test cycle / 既存のテストサイクルを更新します",
		updateTestCycleSchema,
		async ({
			testCycleIdOrKey,
			name,
			description,
			plannedStartDate,
			plannedEndDate,
			statusName,
			customFields,
		}) => {
			try {
				// Get existing test cycle first
				const existingCycle = await zephyrClient.testcycles.getTestCycle(
					testCycleIdOrKey,
					{},
				);

				// Merge with updates
				const updateData = {
					...existingCycle.data,
					...(name && { name }),
					...(description !== undefined && { description }),
					...(plannedStartDate !== undefined && { plannedStartDate }),
					...(plannedEndDate !== undefined && { plannedEndDate }),
					...(statusName && { statusName }),
					...(customFields && { customFields }),
				};

				await zephyrClient.testcycles.updateTestCycle(
					testCycleIdOrKey,
					updateData,
					{},
				);

				const response = createSuccessResponse(
					"Test cycle updated successfully",
					{
						testCycleKey: testCycleIdOrKey,
					},
				);

				return {
					content: [{ type: "text", text: response.text }],
					isError: false,
				};
			} catch (error) {
				const errorResponse = createErrorResponse(
					`Error updating test cycle: ${testCycleIdOrKey}`,
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
	 * Create a web link for a test cycle
	 */
	server.tool(
		"createTestCycleWebLink",
		"Create a web link for a test cycle / テストサイクルにWebリンクを作成します",
		createTestCycleWebLinkSchema,
		async ({ testCycleIdOrKey, url, description }) => {
			try {
				await zephyrClient.testcycles.createTestCycleWebLink(
					testCycleIdOrKey,
					{
						url,
						...(description && { description }),
					},
					{},
				);

				const response = createSuccessResponse(
					"Web link created successfully",
					{
						testCycleKey: testCycleIdOrKey,
					},
				);

				return {
					content: [{ type: "text", text: response.text }],
					isError: false,
				};
			} catch (error) {
				const errorResponse = createErrorResponse(
					`Error creating web link for test cycle ${testCycleIdOrKey}`,
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
	 * Create an issue link for a test cycle
	 */
	server.tool(
		"createTestCycleIssueLink",
		"Create an issue link for a test cycle / テストサイクルにイシューリンクを作成します",
		createTestCycleIssueLinkSchema,
		async ({ testCycleIdOrKey, issueId }) => {
			try {
				await zephyrClient.testcycles.createTestCycleIssueLink(
					testCycleIdOrKey,
					{
						issueId,
					},
					{},
				);

				const response = createSuccessResponse(
					"Issue link created successfully",
					{
						testCycleKey: testCycleIdOrKey,
					},
				);

				return {
					content: [{ type: "text", text: response.text }],
					isError: false,
				};
			} catch (error) {
				const errorResponse = createErrorResponse(
					`Error creating issue link for test cycle ${testCycleIdOrKey}`,
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
