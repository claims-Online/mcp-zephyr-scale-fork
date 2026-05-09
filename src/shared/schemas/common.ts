import { z } from "zod";

export const projectKeySchema = z
	.string()
	.regex(
		/^[A-Z][A-Z0-9_]{1,9}$/,
		"Project key must be 2–10 uppercase alphanumeric/underscore characters starting with a letter (e.g. 'CE', 'KAN')",
	)
	.optional()
	.describe(
		"Jira project key (e.g. 'CE'). When omitted, falls back to the JIRA_PROJECT_KEY environment variable.",
	);
