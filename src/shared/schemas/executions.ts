import { z } from "zod";
import { projectKeySchema } from "./common.js";

/**
 * Schema for listing test executions
 */
export const listTestExecutionsSchema = {
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
 * Schema for creating a test execution
 */
export const createTestExecutionSchema = {
	projectKey: projectKeySchema,
	testCaseKey: z
		.string()
		.describe("Key of test case the execution applies to (e.g., 'KAN-T1')"),
	testCycleKey: z
		.string()
		.describe("Key of test cycle the execution applies to (e.g., 'KAN-R1')"),
	statusName: z.string().describe("The status name (e.g., 'Pass', 'Fail')"),
	environmentName: z
		.string()
		.optional()
		.describe("Environment assigned to the test case (e.g., 'Chrome Latest')"),
	actualEndDate: z
		.string()
		.optional()
		.describe("Actual end date. Format: yyyy-MM-dd'T'HH:mm:ss'Z'"),
	executionTime: z
		.number()
		.optional()
		.describe("Actual test execution time in milliseconds"),
	comment: z
		.string()
		.optional()
		.describe("Comment added against overall test case execution"),
	customFields: z
		.record(z.any())
		.optional()
		.describe(
			"Additional custom fields as key-value pairs. Multi-line text fields should denote a new line with the <br> syntax. Dates should be in the format 'yyyy-MM-dd'. Users should be provided by the user ID.",
		),
};

/**
 * Schema for getting a test execution
 */
export const getTestExecutionSchema = {
	testExecutionIdOrKey: z
		.string()
		.describe("Test execution ID or key (e.g., 'KAN-E1')"),
};

/**
 * Schema for creating a test execution issue link
 */
export const createTestExecutionIssueLinkSchema = {
	testExecutionIdOrKey: z
		.string()
		.describe("Test execution ID or key (e.g., 'KAN-E1')"),
	issueId: z.number().describe("The Jira issue ID"),
};
