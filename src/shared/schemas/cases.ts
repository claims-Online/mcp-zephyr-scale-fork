/**
 * Zod schemas for Test Case operations
 */
import { z } from "zod";
import { projectKeySchema } from "./common.js";

/**
 * Schema for listing test cases
 */
export const listTestCasesSchema = {
	projectKey: projectKeySchema,
	folderId: z
		.number()
		.optional()
		.describe("Optional folder ID to filter test cases"),
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
 * Schema for creating a test case
 */
export const createTestCaseSchema = {
	projectKey: projectKeySchema,
	name: z.string().describe("Test case name"),
	objective: z.string().optional().describe("Test objective description"),
	precondition: z.string().optional().describe("Preconditions for the test"),
	estimatedTime: z
		.number()
		.optional()
		.describe("Estimated time in milliseconds"),
	folderId: z.number().optional().describe("Folder ID to organize test case"),
	statusName: z.string().optional().describe("Status name (e.g., 'Draft')"),
	priorityName: z.string().optional().describe("Priority name (e.g., 'High')"),
	labels: z.array(z.string()).optional().describe("Array of labels"),
	customFields: z
		.record(z.any())
		.optional()
		.describe(
			"Additional custom fields as key-value pairs. Multi-line text fields should denote a new line with the <br> syntax. Dates should be in the format 'yyyy-MM-dd'. Users should be provided by the user ID.",
		),
};

/**
 * Schema for getting a test case
 */
export const getTestCaseSchema = {
	testCaseKey: z.string().describe("Test case key (e.g., 'KAN-T1')"),
};

/**
 * Schema for updating a test case
 * Note: status and priority cannot be updated via this endpoint (use existing values)
 */
export const updateTestCaseSchema = {
	testCaseKey: z.string().describe("Test case key (e.g., 'KAN-T1')"),
	name: z.string().optional().describe("Test case name"),
	objective: z.string().optional().describe("Test objective description"),
	precondition: z.string().optional().describe("Preconditions for the test"),
	estimatedTime: z
		.number()
		.optional()
		.describe("Estimated time in milliseconds"),
	labels: z.array(z.string()).optional().describe("Array of labels"),
	customFields: z
		.record(z.any())
		.optional()
		.describe(
			"Additional custom fields as key-value pairs. Multi-line text fields should denote a new line with the <br> syntax. Dates should be in the format 'yyyy-MM-dd'. Users should be provided by the user ID.",
		),
};

/**
 * Schema for getting test steps
 */
export const getTestCaseTestStepsSchema = {
	testCaseKey: z.string().describe("Test case key (e.g., 'KAN-T1')"),
	maxResults: z.number().optional().describe("Maximum number of results"),
	startAt: z.number().optional().describe("Index to start at for pagination"),
};

/**
 * Schema for creating test steps
 */
export const createTestCaseTestStepsSchema = {
	testCaseKey: z.string().describe("Test case key (e.g., 'KAN-T1')"),
	mode: z
		.enum(["APPEND", "OVERWRITE"])
		.describe("Mode: APPEND to add steps, OVERWRITE to replace all steps"),
	items: z
		.array(
			z.object({
				inline: z.object({
					description: z.string().describe("Step description"),
					testData: z.string().optional().describe("Test data for this step"),
					expectedResult: z.string().describe("Expected result"),
				}),
			}),
		)
		.describe("Array of test steps to add"),
};

/**
 * Schema for creating a test case web link
 */
export const createTestCaseWebLinkSchema = {
	testCaseKey: z.string().describe("Test case key (e.g., 'KAN-T1')"),
	url: z.string().url().describe("The web link URL"),
	description: z.string().optional().describe("The link description"),
};

/**
 * Schema for creating a test case issue link
 */
export const createTestCaseIssueLinkSchema = {
	testCaseKey: z.string().describe("Test case key (e.g., 'KAN-T1')"),
	issueId: z.number().describe("The Jira issue ID"),
};

// Create Zod objects from each schema
export const ListTestCasesInput = z.object(listTestCasesSchema);
export const CreateTestCaseInput = z.object(createTestCaseSchema);
export const GetTestCaseInput = z.object(getTestCaseSchema);
export const UpdateTestCaseInput = z.object(updateTestCaseSchema);
export const GetTestCaseTestStepsInput = z.object(getTestCaseTestStepsSchema);
export const CreateTestCaseTestStepsInput = z.object(
	createTestCaseTestStepsSchema,
);

// Extract input types
export type ListTestCasesInputType = z.infer<typeof ListTestCasesInput>;
export type CreateTestCaseInputType = z.infer<typeof CreateTestCaseInput>;
export type GetTestCaseInputType = z.infer<typeof GetTestCaseInput>;
export type UpdateTestCaseInputType = z.infer<typeof UpdateTestCaseInput>;
export type GetTestCaseTestStepsInputType = z.infer<
	typeof GetTestCaseTestStepsInput
>;
export type CreateTestCaseTestStepsInputType = z.infer<
	typeof CreateTestCaseTestStepsInput
>;
