/**
 * Test Execution management tools for Zephyr Scale MCP
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
	listTestExecutionsSchema,
	createTestExecutionSchema,
	getTestExecutionSchema,
	createTestExecutionIssueLinkSchema,
} from "../../shared/schemas/executions.js";

/**
 * Register all test execution-related tools with the MCP server
 */
export function registerTestExecutionTools(
	server: McpServer,
	zephyrClient: ZephyrV2Client,
	defaultProjectKey?: string,
): void {
	/**
	 * List test executions in a project
	 */
	server.tool(
		"listTestExecutions",
		"List test executions in a project / プロジェクト内のテスト実行一覧を取得します",
		listTestExecutionsSchema,
		async ({ projectKey, maxResults, startAt }) => {
			const effectiveKey = resolveProjectKey(projectKey, defaultProjectKey);
			if (!effectiveKey) return createMissingProjectKeyResponse();
			try {
				const result = await zephyrClient.testexecutions.listTestExecutions(
					{
						projectKey: effectiveKey,
						maxResults: maxResults ?? 50,
						startAt: startAt ?? 0,
					},
					{},
				);

				const response = createSuccessResponse(
					"Test executions retrieved successfully",
					{
						testExecutions: result.data,
					},
				);

				return {
					content: [{ type: "text", text: response.text }],
					isError: false,
				};
			} catch (error) {
				const errorResponse = createErrorResponse(
					`Error listing test executions for project: ${effectiveKey}`,
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
	 * Create a new test execution
	 */
	server.tool(
		"createTestExecution",
		"Create a new test execution / 新しいテスト実行を作成します",
		createTestExecutionSchema,
		async ({
			projectKey,
			testCaseKey,
			testCycleKey,
			statusName,
			environmentName,
			actualEndDate,
			executionTime,
			comment,
			customFields,
		}) => {
			const effectiveKey = resolveProjectKey(projectKey, defaultProjectKey);
			if (!effectiveKey) return createMissingProjectKeyResponse();
			try {
				await zephyrClient.testexecutions.createTestExecution(
					{
						projectKey: effectiveKey,
						testCaseKey,
						testCycleKey,
						statusName,
						...(environmentName && { environmentName }),
						...(actualEndDate && { actualEndDate }),
						...(executionTime !== undefined && { executionTime }),
						...(comment && { comment }),
						...(customFields && { customFields }),
					},
					{},
				);

				const response = createSuccessResponse(
					"Test execution created successfully",
					{
						testCaseKey,
						testCycleKey,
					},
				);

				return {
					content: [{ type: "text", text: response.text }],
					isError: false,
				};
			} catch (error) {
				const errorResponse = createErrorResponse(
					`Error creating test execution for test case: ${testCaseKey}`,
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
	 * Get details of a specific test execution
	 */
	server.tool(
		"getTestExecution",
		"Get details of a specific test execution / 特定のテスト実行の詳細を取得します",
		getTestExecutionSchema,
		async ({ testExecutionIdOrKey }) => {
			try {
				const result = await zephyrClient.testexecutions.getTestExecution(
					testExecutionIdOrKey,
					{},
				);

				const response = createSuccessResponse(
					"Test execution retrieved successfully",
					{
						testExecution: result.data,
					},
				);

				return {
					content: [{ type: "text", text: response.text }],
					isError: false,
				};
			} catch (error) {
				const errorResponse = createErrorResponse(
					`Error retrieving test execution: ${testExecutionIdOrKey}`,
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
	 * Create an issue link for a test execution
	 */
	server.tool(
		"createTestExecutionIssueLink",
		"Create an issue link for a test execution / テスト実行にイシューリンクを作成します",
		createTestExecutionIssueLinkSchema,
		async ({ testExecutionIdOrKey, issueId }) => {
			try {
				await zephyrClient.testexecutions.createTestExecutionIssueLink(
					testExecutionIdOrKey,
					{
						issueId,
					},
					{},
				);

				const response = createSuccessResponse(
					"Issue link created successfully",
					{
						testExecutionKey: testExecutionIdOrKey,
					},
				);

				return {
					content: [{ type: "text", text: response.text }],
					isError: false,
				};
			} catch (error) {
				const errorResponse = createErrorResponse(
					`Error creating issue link for test execution ${testExecutionIdOrKey}`,
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
