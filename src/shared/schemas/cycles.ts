import { z } from "zod";
import { projectKeySchema } from "./common.js";

/**
 * Schema for listing test cycles
 */
export const listTestCyclesSchema = {
	projectKey: projectKeySchema,
	folderId: z.number().optional().describe("Folder ID filter"),
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
 * Schema for creating a test cycle
 */
export const createTestCycleSchema = {
	projectKey: projectKeySchema,
	name: z.string().describe("Test cycle name"),
	description: z
		.string()
		.optional()
		.describe("Description outlining the scope"),
	plannedStartDate: z
		.string()
		.optional()
		.describe(
			"Planned start date of the test cycle. Format: yyyy-MM-dd'T'HH:mm:ss'Z'",
		),
	plannedEndDate: z
		.string()
		.optional()
		.describe(
			"Planned end date of the test cycle. Format: yyyy-MM-dd'T'HH:mm:ss'Z'",
		),
	statusName: z.string().optional().describe("Status name (e.g., 'Draft')"),
	folderId: z.number().optional().describe("Folder ID to organize test cycle"),
	customFields: z
		.record(z.any())
		.optional()
		.describe(
			"Additional custom fields as key-value pairs. Multi-line text fields should denote a new line with the <br> syntax. Dates should be in the format 'yyyy-MM-dd'. Users should be provided by the user ID.",
		),
};

/**
 * Schema for getting a test cycle
 */
export const getTestCycleSchema = {
	testCycleIdOrKey: z
		.string()
		.describe("Test cycle ID or key (e.g., 'KAN-R1')"),
};

/**
 * Schema for updating a test cycle
 */
export const updateTestCycleSchema = {
	testCycleIdOrKey: z
		.string()
		.describe("Test cycle ID or key (e.g., 'KAN-R1')"),
	name: z.string().optional().describe("Test cycle name"),
	description: z
		.string()
		.optional()
		.describe("Description outlining the scope"),
	plannedStartDate: z
		.string()
		.optional()
		.describe(
			"Planned start date of the test cycle. Format: yyyy-MM-dd'T'HH:mm:ss'Z'",
		),
	plannedEndDate: z
		.string()
		.optional()
		.describe(
			"Planned end date of the test cycle. Format: yyyy-MM-dd'T'HH:mm:ss'Z'",
		),
	statusName: z.string().optional().describe("Status name"),
	customFields: z.record(z.any()).optional().describe("Custom fields"),
};

/**
 * Schema for creating a test cycle web link
 */
export const createTestCycleWebLinkSchema = {
	testCycleIdOrKey: z
		.string()
		.describe("Test cycle ID or key (e.g., 'KAN-R1')"),
	url: z.string().url().describe("The web link URL"),
	description: z.string().optional().describe("The link description"),
};

/**
 * Schema for creating a test cycle issue link
 */
export const createTestCycleIssueLinkSchema = {
	testCycleIdOrKey: z
		.string()
		.describe("Test cycle ID or key (e.g., 'KAN-R1')"),
	issueId: z.number().describe("The Jira issue ID"),
};
