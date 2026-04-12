#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  McpError,
  ErrorCode,
} from '@modelcontextprotocol/sdk/types.js';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
if (!GITHUB_TOKEN) {
  throw new Error('GITHUB_TOKEN environment variable is required');
}

const BASE_URL = 'https://api.github.com';

const isValidArgs = (args: any): args is Record<string, any> =>
  typeof args === 'object' && args !== null;

class GithubServer {
  private server: Server;

  constructor() {
    this.server = new Server(
      {
        name: 'github-mcp-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();

    this.server.onerror = (error) => console.error('[MCP Error]', error);
    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  private async apiRequest(endpoint: string, options: RequestInit = {}) {
    const url = `${BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new McpError(
        ErrorCode.InternalError,
        `GitHub API error: ${response.status} - ${errorText}`
      );
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return response.json();
    }

    return response.text();
  }

  private buildQueryString(params: Record<string, unknown>) {
    const query = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value === undefined || value === null) continue;
      query.append(key, String(value));
    }
    const str = query.toString();
    return str ? `?${str}` : '';
  }

  private toNumber(value: unknown, fallback: number) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  private setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'list_repositories',
          description: 'List repositories owned by a user or organization',
          inputSchema: {
            type: 'object',
            properties: {
              owner: {
                type: 'string',
                description: 'GitHub username or organization',
              },
              type: {
                type: 'string',
                description: 'Type of repositories (owner, all, member)',
              },
              per_page: {
                type: 'number',
                description: 'Items per page (max 100)',
              },
              page: {
                type: 'number',
                description: 'Page number',
              },
            },
            required: ['owner'],
          },
        },
        {
          name: 'get_repository',
          description: 'Retrieve repository metadata',
          inputSchema: {
            type: 'object',
            properties: {
              owner: { type: 'string' },
              repo: { type: 'string' },
            },
            required: ['owner', 'repo'],
          },
        },
        {
          name: 'list_commits',
          description: 'List commits for a repository',
          inputSchema: {
            type: 'object',
            properties: {
              owner: { type: 'string' },
              repo: { type: 'string' },
              sha: { type: 'string' },
              path: { type: 'string' },
              per_page: { type: 'number' },
              page: { type: 'number' },
            },
            required: ['owner', 'repo'],
          },
        },
        {
          name: 'list_issues',
          description: 'List issues for a repository',
          inputSchema: {
            type: 'object',
            properties: {
              owner: { type: 'string' },
              repo: { type: 'string' },
              state: {
                type: 'string',
                description: 'Issue state (open, closed, all)',
              },
              labels: { type: 'string' },
              per_page: { type: 'number' },
              page: { type: 'number' },
            },
            required: ['owner', 'repo'],
          },
        },
        {
          name: 'create_issue',
          description: 'Create an issue in a repository',
          inputSchema: {
            type: 'object',
            properties: {
              owner: { type: 'string' },
              repo: { type: 'string' },
              title: { type: 'string' },
              body: { type: 'string' },
              labels: {
                type: ['string', 'array'],
                items: { type: 'string' },
              },
              assignees: {
                type: 'array',
                items: { type: 'string' },
              },
            },
            required: ['owner', 'repo', 'title'],
          },
        },
        {
          name: 'list_pull_requests',
          description: 'List pull requests for a repository',
          inputSchema: {
            type: 'object',
            properties: {
              owner: { type: 'string' },
              repo: { type: 'string' },
              state: {
                type: 'string',
                description: 'Pull request state (open, closed, all)',
              },
              per_page: { type: 'number' },
              page: { type: 'number' },
            },
            required: ['owner', 'repo'],
          },
        },
        {
          name: 'get_pull_request',
          description: 'Retrieve a single pull request',
          inputSchema: {
            type: 'object',
            properties: {
              owner: { type: 'string' },
              repo: { type: 'string' },
              pull_number: { type: 'number' },
            },
            required: ['owner', 'repo', 'pull_number'],
          },
        },
        {
          name: 'list_workflows',
          description: 'List GitHub Actions workflows for a repository',
          inputSchema: {
            type: 'object',
            properties: {
              owner: { type: 'string' },
              repo: { type: 'string' },
            },
            required: ['owner', 'repo'],
          },
        },
        {
          name: 'list_workflow_runs',
          description: 'List workflow runs for a GitHub Actions workflow',
          inputSchema: {
            type: 'object',
            properties: {
              owner: { type: 'string' },
              repo: { type: 'string' },
              workflow_id: { type: ['string', 'number'] },
              per_page: { type: 'number' },
              page: { type: 'number' },
            },
            required: ['owner', 'repo'],
          },
        },
      ],
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      try {
        switch (request.params.name) {
          case 'list_repositories': {
            if (!isValidArgs(request.params.arguments)) {
              throw new McpError(ErrorCode.InvalidParams, 'Invalid arguments');
            }
            const args = request.params.arguments as Record<string, any>;
            const owner = args.owner;
            const per_page = this.toNumber(args.per_page, 30);
            const page = this.toNumber(args.page, 1);
            const type = args.type || 'owner';
            const query = this.buildQueryString({
              per_page: Math.min(100, per_page),
              page,
              type,
            });
            const repos = await this.apiRequest(`/users/${owner}/repos${query}`);
            return {
              content: [{ type: 'text', text: JSON.stringify(repos, null, 2) }],
            };
          }

          case 'get_repository': {
            if (!isValidArgs(request.params.arguments)) {
              throw new McpError(ErrorCode.InvalidParams, 'Invalid arguments');
            }
            const { owner, repo } = request.params.arguments;
            const repository = await this.apiRequest(`/repos/${owner}/${repo}`);
            return {
              content: [{ type: 'text', text: JSON.stringify(repository, null, 2) }],
            };
          }

          case 'list_commits': {
            if (!isValidArgs(request.params.arguments)) {
              throw new McpError(ErrorCode.InvalidParams, 'Invalid arguments');
            }
            const args = request.params.arguments as Record<string, any>;
            const query = this.buildQueryString({
              sha: args.sha,
              path: args.path,
              per_page: this.toNumber(args.per_page, 30),
              page: this.toNumber(args.page, 1),
            });
            const commits = await this.apiRequest(
              `/repos/${args.owner}/${args.repo}/commits${query}`
            );
            return {
              content: [{ type: 'text', text: JSON.stringify(commits, null, 2) }],
            };
          }

          case 'list_issues': {
            if (!isValidArgs(request.params.arguments)) {
              throw new McpError(ErrorCode.InvalidParams, 'Invalid arguments');
            }
            const args = request.params.arguments as Record<string, any>;
            const query = this.buildQueryString({
              state: args.state || 'open',
              labels: args.labels,
              per_page: this.toNumber(args.per_page, 30),
              page: this.toNumber(args.page, 1),
            });
            const issues = await this.apiRequest(
              `/repos/${args.owner}/${args.repo}/issues${query}`
            );
            return {
              content: [{ type: 'text', text: JSON.stringify(issues, null, 2) }],
            };
          }

          case 'create_issue': {
            if (!isValidArgs(request.params.arguments)) {
              throw new McpError(ErrorCode.InvalidParams, 'Invalid arguments');
            }
            const args = request.params.arguments as Record<string, any>;
            const payload: Record<string, unknown> = {
              title: args.title,
            };
            if (args.body) payload.body = args.body;
            if (args.labels) {
              payload.labels = Array.isArray(args.labels)
                ? args.labels
                : String(args.labels)
                    .split(',')
                    .map((label) => label.trim())
                    .filter(Boolean);
            }
            if (args.assignees) {
              payload.assignees = args.assignees;
            }
            const issue = await this.apiRequest(
              `/repos/${args.owner}/${args.repo}/issues`,
              {
                method: 'POST',
                body: JSON.stringify(payload),
              }
            );
            return {
              content: [{ type: 'text', text: JSON.stringify(issue, null, 2) }],
            };
          }

          case 'list_pull_requests': {
            if (!isValidArgs(request.params.arguments)) {
              throw new McpError(ErrorCode.InvalidParams, 'Invalid arguments');
            }
            const args = request.params.arguments as Record<string, any>;
            const query = this.buildQueryString({
              state: args.state || 'open',
              per_page: this.toNumber(args.per_page, 30),
              page: this.toNumber(args.page, 1),
            });
            const pulls = await this.apiRequest(
              `/repos/${args.owner}/${args.repo}/pulls${query}`
            );
            return {
              content: [{ type: 'text', text: JSON.stringify(pulls, null, 2) }],
            };
          }

          case 'get_pull_request': {
            if (!isValidArgs(request.params.arguments)) {
              throw new McpError(ErrorCode.InvalidParams, 'Invalid arguments');
            }
            const { owner, repo, pull_number } = request.params.arguments;
            const pull = await this.apiRequest(
              `/repos/${owner}/${repo}/pulls/${pull_number}`
            );
            return {
              content: [{ type: 'text', text: JSON.stringify(pull, null, 2) }],
            };
          }

          case 'list_workflows': {
            if (!isValidArgs(request.params.arguments)) {
              throw new McpError(ErrorCode.InvalidParams, 'Invalid arguments');
            }
            const args = request.params.arguments as Record<string, any>;
            const workflows = await this.apiRequest(
              `/repos/${args.owner}/${args.repo}/actions/workflows`
            );
            return {
              content: [{ type: 'text', text: JSON.stringify(workflows, null, 2) }],
            };
          }

          case 'list_workflow_runs': {
            if (!isValidArgs(request.params.arguments)) {
              throw new McpError(ErrorCode.InvalidParams, 'Invalid arguments');
            }
            const args = request.params.arguments as Record<string, any>;
            const workflowSegment = args.workflow_id
              ? `/actions/workflows/${args.workflow_id}/runs`
              : '/actions/runs';
            const query = this.buildQueryString({
              per_page: this.toNumber(args.per_page, 30),
              page: this.toNumber(args.page, 1),
            });
            const runs = await this.apiRequest(
              `/repos/${args.owner}/${args.repo}${workflowSegment}${query}`
            );
            return {
              content: [{ type: 'text', text: JSON.stringify(runs, null, 2) }],
            };
          }

          default: {
            throw new McpError(
              ErrorCode.MethodNotFound,
              `Unknown tool: ${request.params.name}`
            );
          }
        }
      } catch (error) {
        if (error instanceof McpError) {
          throw error;
        }
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
          isError: true,
        };
      }
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('GitHub MCP server running on stdio');
  }
}

const server = new GithubServer();
server.run().catch(console.error);
