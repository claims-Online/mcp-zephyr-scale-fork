import { z } from "zod";
import { projectKeySchema } from "./common.js";

/**
 * Schema for listing folders
 */
export const listFoldersSchema = {
	projectKey: projectKeySchema,
	folderType: z
		.enum(["TEST_CASE", "TEST_PLAN", "TEST_CYCLE"])
		.optional()
		.describe('Folder type filter: "TEST_CASE", "TEST_PLAN", or "TEST_CYCLE"'),
	maxResults: z
		.number()
		.optional()
		.describe("Maximum number of results to return (default: 50)"),
	startAt: z
		.number()
		.optional()
		.describe("Index to start at for pagination (default: 0)"),
};

/**
 * Schema for creating a folder
 */
export const createFolderSchema = {
	projectKey: projectKeySchema,
	name: z.string().min(1).max(255).describe("Folder name (1-255 characters)"),
	folderType: z
		.enum(["TEST_CASE", "TEST_PLAN", "TEST_CYCLE"])
		.describe('Folder type: "TEST_CASE", "TEST_PLAN", or "TEST_CYCLE"'),
	parentId: z
		.number()
		.optional()
		.describe("Parent folder ID. Omit or set to null for root folders"),
};

/**
 * Schema for getting a folder
 */
export const getFolderSchema = {
	folderId: z.number().describe("Folder ID"),
};
