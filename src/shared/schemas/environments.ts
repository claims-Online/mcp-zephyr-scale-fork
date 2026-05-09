import { z } from "zod";
import { projectKeySchema } from "./common.js";

/**
 * Schema for listing environments
 */
export const listEnvironmentsSchema = {
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
