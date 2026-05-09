#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createZephyrClient } from "./clients/index.js";
import { registerAllTools } from "./server/api/index.js";
import { logger } from "./logger.js";

/**
 * Validate required environment variables.
 * JIRA_PROJECT_KEY is optional: omit it to require projectKey on every tool call,
 * or set it to enable backward-compatible single-project mode.
 */
function validateEnvironment(): {
	apiToken: string;
	defaultProjectKey: string | undefined;
} {
	const apiToken = process.env.ZEPHYR_API_TOKEN;

	if (!apiToken) {
		throw new Error("ZEPHYR_API_TOKEN must be set");
	}

	const defaultProjectKey = process.env.JIRA_PROJECT_KEY || undefined;
	return { apiToken, defaultProjectKey };
}

// Validate environment variables
const { apiToken, defaultProjectKey } = validateEnvironment();

// Initialize Zephyr client
const zephyrClient = createZephyrClient(apiToken);

// Create McpServer
const server = new McpServer({
	name: "Zephyr Scale MCP Server",
	version: "0.2.0",
});

// Register all MCP tools
registerAllTools(server, zephyrClient, defaultProjectKey);

// Main execution
const main = async () => {
	try {
		logger.info("Starting Zephyr Scale MCP Server (stdio mode)...");
		if (defaultProjectKey) {
			logger.info(`Default project key: ${defaultProjectKey}`);
		} else {
			logger.info("No default project key — projectKey must be supplied per tool call");
		}

		// Create and connect transport
		const transport = new StdioServerTransport();
		await server.connect(transport);

		logger.info("Zephyr Scale MCP Server connected via stdio");
	} catch (error) {
		logger.error("Error starting Zephyr Scale MCP Server:", error);
		process.exit(1);
	}
};

// Run the server
main();
