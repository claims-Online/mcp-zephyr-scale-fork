/**
 * Folder management tools for Zephyr Scale MCP
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
	listFoldersSchema,
	createFolderSchema,
	getFolderSchema,
} from "../../shared/schemas/folders.js";

/**
 * Register all folder-related tools with the MCP server
 */
export function registerFolderTools(
	server: McpServer,
	zephyrClient: ZephyrV2Client,
	defaultProjectKey?: string,
): void {
	/**
	 * List folders in a project
	 */
	server.tool(
		"listFolders",
		"List folders in a project / プロジェクト内のフォルダー一覧を取得します",
		listFoldersSchema,
		async ({ projectKey, folderType, maxResults, startAt }) => {
			const effectiveKey = resolveProjectKey(projectKey, defaultProjectKey);
			if (!effectiveKey) return createMissingProjectKeyResponse();
			try {
				const result = await zephyrClient.folders.listFolders(
					{
						projectKey: effectiveKey,
						folderType,
						maxResults: maxResults ?? 50,
						startAt: startAt ?? 0,
					},
					{},
				);

				const response = createSuccessResponse(
					"Folders retrieved successfully",
					{
						folders: result.data,
					},
				);

				return {
					content: [{ type: "text", text: response.text }],
					isError: false,
				};
			} catch (error) {
				const errorResponse = createErrorResponse(
					`Error listing folders for project: ${effectiveKey}`,
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
	 * Create a new folder
	 */
	server.tool(
		"createFolder",
		"Create a new folder / 新しいフォルダーを作成します",
		createFolderSchema,
		async ({ projectKey, name, folderType, parentId }) => {
			const effectiveKey = resolveProjectKey(projectKey, defaultProjectKey);
			if (!effectiveKey) return createMissingProjectKeyResponse();
			try {
				const result = await zephyrClient.folders.createFolder(
					{
						projectKey: effectiveKey,
						name,
						folderType,
						...(parentId !== undefined && { parentId }),
					},
					{},
				);

				const response = createSuccessResponse("Folder created successfully", {
					folder: result.data,
				});

				return {
					content: [{ type: "text", text: response.text }],
					isError: false,
				};
			} catch (error) {
				const errorResponse = createErrorResponse(
					`Error creating folder: ${name}`,
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
	 * Get details of a specific folder
	 */
	server.tool(
		"getFolder",
		"Get details of a specific folder / 特定のフォルダーの詳細を取得します",
		getFolderSchema,
		async ({ folderId }) => {
			try {
				const result = await zephyrClient.folders.getFolder(folderId, {});

				const response = createSuccessResponse(
					"Folder retrieved successfully",
					{
						folder: result.data,
					},
				);

				return {
					content: [{ type: "text", text: response.text }],
					isError: false,
				};
			} catch (error) {
				const errorResponse = createErrorResponse(
					`Error retrieving folder ID: ${folderId}`,
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
