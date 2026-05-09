import { z } from "zod";
import { projectKeySchema } from "./common.js";

/**
 * Schema for listing test plans
 */
export const listTestPlansSchema = {
	projectKey: projectKeySchema,
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
 * Schema for creating a test plan
 */
export const createTestPlanSchema = {
	projectKey: projectKeySchema,
	name: z.string().describe("Test plan name"),
	objective: z.string().optional().describe("A description of the objective"),
	statusName: z.string().optional().describe("Status name (e.g., 'Draft')"),
	folderId: z.number().optional().describe("Folder ID to organize test plan"),
	customFields: z
		.record(z.any())
		.optional()
		.describe(
			"Additional custom fields as key-value pairs. Multi-line text fields should denote a new line with the <br> syntax. Dates should be in the format 'yyyy-MM-dd'. Users should be provided by the user ID.",
		),
};

/**
 * Schema for getting a test plan
 */
export const getTestPlanSchema = {
	testPlanIdOrKey: z.string().describe("Test plan ID or key (e.g., 'KAN-P1')"),
};

/**
 * Schema for creating a test plan web link
 */
export const createTestPlanWebLinkSchema = {
	testPlanIdOrKey: z.string().describe("Test plan ID or key (e.g., 'KAN-P1')"),
	url: z.string().url().describe("The web link URL"),
	description: z
		.string()
		.describe("The link description (required for test plans)"),
};

/**
 * Schema for creating a test plan issue link
 */
export const createTestPlanIssueLinkSchema = {
	testPlanIdOrKey: z.string().describe("Test plan ID or key (e.g., 'KAN-P1')"),
	issueId: z.number().describe("The Jira issue ID"),
};

/**
 * Schema for creating a test plan test cycle link
 */
export const createTestPlanTestCycleLinkSchema = {
	testPlanIdOrKey: z.string().describe("Test plan ID or key (e.g., 'KAN-P1')"),
	testCycleIdOrKey: z
		.string()
		.describe("Test cycle ID or key (e.g., 'KAN-R1')"),
};
