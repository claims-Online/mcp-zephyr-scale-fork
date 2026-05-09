/**
 * Test Case related MCP tools
 */
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { ZephyrV2Client } from "zephyr-api-client";
import {
	createSuccessResponse,
	createErrorResponse,
	resolveProjectKey,
	createMissingProjectKeyResponse,
} from "./utils.js";
import {
	listTestCasesSchema,
	createTestCaseSchema,
	getTestCaseSchema,
	updateTestCaseSchema,
	getTestCaseTestStepsSchema,
	createTestCaseTestStepsSchema,
	createTestCaseWebLinkSchema,
	createTestCaseIssueLinkSchema,
} from "../../shared/schemas/cases.js";

/**
 * Register all test case related tools
 */
export function registerTestCaseTools(
	server: McpServer,
	zephyrClient: ZephyrV2Client,
	defaultProjectKey?: string,
): void {
	// List test cases
	server.tool(
		"listTestCases",
		"List test cases in a project / プロジェクト内のテストケース一覧を取得します",
		listTestCasesSchema,
		async ({ projectKey, folderId, maxResults, startAt }) => {
			const effectiveKey = resolveProjectKey(projectKey, defaultProjectKey);
			if (!effectiveKey) return createMissingProjectKeyResponse();
			try {
				const result = await zephyrClient.testcases.listTestCases(
					{
						projectKey: effectiveKey,
						folderId,
						maxResults,
						startAt,
					},
					{},
				);

				const successResponse = createSuccessResponse(
					"Test cases retrieved successfully",
					{
						testCases: result.data,
					},
				);

				return {
					content: [{ type: "text", text: successResponse.text }],
				};
			} catch (error) {
				const errorResponse = createErrorResponse(
					`Error fetching test cases for project ${effectiveKey}`,
					error,
				);
				return {
					content: [{ type: "text", text: errorResponse.text }],
					isError: true,
				};
			}
		},
	);

	// Create test case
	server.tool(
		"createTestCase",
		"Create a new test case / 新しいテストケースを作成します",
		createTestCaseSchema,
		async ({
			projectKey,
			name,
			objective,
			precondition,
			estimatedTime,
			folderId,
			statusName,
			priorityName,
			labels,
			customFields,
		}) => {
			const effectiveKey = resolveProjectKey(projectKey, defaultProjectKey);
			if (!effectiveKey) return createMissingProjectKeyResponse();
			try {
				const result = await zephyrClient.testcases.createTestCase(
					{
						projectKey: effectiveKey,
						name,
						objective,
						precondition,
						estimatedTime,
						folderId,
						statusName,
						priorityName,
						labels,
						customFields,
					},
					{},
				);

				const successResponse = createSuccessResponse(
					"Test case created successfully",
					{
						testCase: result.data,
					},
				);

				return {
					content: [{ type: "text", text: successResponse.text }],
				};
			} catch (error) {
				const errorResponse = createErrorResponse(
					`Error creating test case: ${name}`,
					error,
				);
				return {
					content: [{ type: "text", text: errorResponse.text }],
					isError: true,
				};
			}
		},
	);

	// Get test case
	server.tool(
		"getTestCase",
		"Get details of a specific test case / 特定のテストケースの詳細を取得します",
		getTestCaseSchema,
		async ({ testCaseKey }) => {
			try {
				const result = await zephyrClient.testcases.getTestCase(
					testCaseKey,
					{},
				);

				const successResponse = createSuccessResponse(
					"Test case retrieved successfully",
					{
						testCase: result.data,
					},
				);

				return {
					content: [{ type: "text", text: successResponse.text }],
				};
			} catch (error) {
				const errorResponse = createErrorResponse(
					`Error fetching test case ${testCaseKey}`,
					error,
				);
				return {
					content: [{ type: "text", text: errorResponse.text }],
					isError: true,
				};
			}
		},
	);

	// Update test case
	server.tool(
		"updateTestCase",
		"Update an existing test case / 既存のテストケースを更新します",
		updateTestCaseSchema,
		async ({
			testCaseKey,
			name,
			objective,
			precondition,
			estimatedTime,
			labels,
			customFields,
		}) => {
			try {
				// First, get the existing test case to merge with updates
				const existingCase = await zephyrClient.testcases.getTestCase(
					testCaseKey,
					{},
				);

				// Merge existing data with updates (keep existing status and priority)
				const updateData = {
					...existingCase.data,
					...(name && { name }),
					...(objective && { objective }),
					...(precondition && { precondition }),
					...(estimatedTime && { estimatedTime }),
					...(labels && { labels }),
					...(customFields && { customFields }),
				};

				await zephyrClient.testcases.updateTestCase(
					testCaseKey,
					updateData,
					{},
				);

				const successResponse = createSuccessResponse(
					"Test case updated successfully",
					{
						testCaseKey,
					},
				);

				return {
					content: [{ type: "text", text: successResponse.text }],
				};
			} catch (error) {
				const errorResponse = createErrorResponse(
					`Error updating test case ${testCaseKey}`,
					error,
				);
				return {
					content: [{ type: "text", text: errorResponse.text }],
					isError: true,
				};
			}
		},
	);

	// Get test case test steps
	server.tool(
		"getTestCaseTestSteps",
		"Get test steps for a test case / テストケースのテストステップを取得します",
		getTestCaseTestStepsSchema,
		async ({ testCaseKey, maxResults, startAt }) => {
			try {
				const result = await zephyrClient.testcases.getTestCaseTestSteps(
					testCaseKey,
					{ maxResults, startAt },
					{},
				);

				const successResponse = createSuccessResponse(
					"Test steps retrieved successfully",
					{
						testSteps: result.data,
					},
				);

				return {
					content: [{ type: "text", text: successResponse.text }],
				};
			} catch (error) {
				const errorResponse = createErrorResponse(
					`Error fetching test steps for test case ${testCaseKey}`,
					error,
				);
				return {
					content: [{ type: "text", text: errorResponse.text }],
					isError: true,
				};
			}
		},
	);

	// Create test case test steps
	server.tool(
		"createTestCaseTestSteps",
		"Create or append test steps to a test case (supports APPEND/OVERWRITE modes). Tip: Use OVERWRITE mode for the first time to avoid unwanted empty placeholder steps / テストケースにテストステップを作成または追加します（APPENDとOVERWRITEモードをサポート）。ヒント：初回は不要な空のプレースホルダーステップを避けるため、OVERWRITEモードを使用してください",
		createTestCaseTestStepsSchema,
		async ({ testCaseKey, mode, items }) => {
			try {
				const result = await zephyrClient.testcases.createTestCaseTestSteps(
					testCaseKey,
					{
						mode,
						items,
					},
					{},
				);

				const successResponse = createSuccessResponse(
					"Test steps created successfully",
					{
						result: result.data,
					},
				);

				return {
					content: [{ type: "text", text: successResponse.text }],
				};
			} catch (error) {
				const errorResponse = createErrorResponse(
					`Error creating test steps for test case ${testCaseKey}`,
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
	 * Create a web link for a test case
	 */
	server.tool(
		"createTestCaseWebLink",
		"Create a web link for a test case / テストケースにWebリンクを作成します",
		createTestCaseWebLinkSchema,
		async ({ testCaseKey, url, description }) => {
			try {
				const result = await zephyrClient.testcases.createTestCaseWebLink(
					testCaseKey,
					{
						url,
						...(description && { description }),
					},
					{},
				);

				const successResponse = createSuccessResponse(
					"Web link created successfully",
					{
						link: result.data,
					},
				);

				return {
					content: [{ type: "text", text: successResponse.text }],
				};
			} catch (error) {
				const errorResponse = createErrorResponse(
					`Error creating web link for test case ${testCaseKey}`,
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
	 * Create an issue link for a test case
	 */
	server.tool(
		"createTestCaseIssueLink",
		"Create an issue link for a test case / テストケースにイシューリンクを作成します",
		createTestCaseIssueLinkSchema,
		async ({ testCaseKey, issueId }) => {
			try {
				const result = await zephyrClient.testcases.createTestCaseIssueLink(
					testCaseKey,
					{
						issueId,
					},
					{},
				);

				const successResponse = createSuccessResponse(
					"Issue link created successfully",
					{
						link: result.data,
					},
				);

				return {
					content: [{ type: "text", text: successResponse.text }],
				};
			} catch (error) {
				const errorResponse = createErrorResponse(
					`Error creating issue link for test case ${testCaseKey}`,
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
