import { z } from "zod";
import { projectKeySchema } from "./common.js";

/**
 * Schema for listing statuses
 */
export const listStatusesSchema = {
	projectKey: projectKeySchema,
	maxResults: z
		.number()
		.optional()
		.describe("Maximum number of results to return (default: 10)"),
	startAt: z
		.number()
		.optional()
		.describe("Index to start at for pagination (default: 0)"),
};

/**
 * Schema for creating a status
 */
export const createStatusSchema = {
	projectKey: projectKeySchema,
	name: z.string().describe("The status name"),
	type: z
		.enum(["TEST_CASE", "TEST_PLAN", "TEST_CYCLE", "TEST_EXECUTION"])
		.describe(
			'Valid values: "TEST_CASE", "TEST_PLAN", "TEST_CYCLE", "TEST_EXECUTION"',
		),
	description: z.string().optional().describe("The status description"),
	color: z
		.string()
		.optional()
		.describe("A color in hexadecimal format (e.g., '#FF5733')"),
};

/**
 * Schema for getting a status
 */
export const getStatusSchema = {
	statusId: z.number().describe("Status ID"),
};
