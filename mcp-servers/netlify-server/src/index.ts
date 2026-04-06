#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  McpError,
  ErrorCode,
} from '@modelcontextprotocol/sdk/types.js';

const NETLIFY_API_TOKEN = process.env.NETLIFY_API_TOKEN;
if (!NETLIFY_API_TOKEN) {
  throw new Error('NETLIFY_API_TOKEN environment variable is required');
}

const BASE_URL = 'https://api.netlify.com/api/v1';

interface NetlifySite {
  id: string;
  name: string;
  url: string;
  ssl_url: string;
  state: string;
  build_settings?: {
    repo_url?: string;
    cmd?: string;
    publish_dir?: string;
  };
}

interface NetlifyDeploy {
  id: string;
  state: string;
  url: string;
  deploy_url: string;
  created_at: string;
  published_at: string | null;
  branch: string;
  commit_ref: string;
  context: string;
}

interface NetlifyForm {
  id: string;
  name: string;
  path: string;
  submission_count: number;
}

interface NetlifySubmission {
  id: string;
  form_id: string;
  created_at: string;
  data: Record<string, any>;
}

interface NetlifyFunction {
  name: string;
  main_file: string;
  runtime: string;
}

const isValidArgs = (args: any): args is Record<string, any> =>
  typeof args === 'object' && args !== null;

class NetlifyServer {
  private server: Server;

  constructor() {
    this.server = new Server(
      {
        name: 'netlify-mcp-server',
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
        'Authorization': `Bearer ${NETLIFY_API_TOKEN}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new McpError(
        ErrorCode.InternalError,
        `Netlify API error: ${response.status} - ${error}`
      );
    }

    return response.json();
  }

  private setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'list_sites',
          description: 'List all Netlify sites in your account',
          inputSchema: {
            type: 'object',
            properties: {
              filter: {
                type: 'string',
                description: 'Optional filter to search sites by name',
              },
            },
            required: [],
          },
        },
        {
          name: 'get_site',
          description: 'Get details about a specific Netlify site',
          inputSchema: {
            type: 'object',
            properties: {
              site_id: {
                type: 'string',
                description: 'The site ID or site name (subdomain)',
              },
            },
            required: ['site_id'],
          },
        },
        {
          name: 'list_deploys',
          description: 'List recent deployments for a site',
          inputSchema: {
            type: 'object',
            properties: {
              site_id: {
                type: 'string',
                description: 'The site ID or site name',
              },
              per_page: {
                type: 'number',
                description: 'Number of deploys to return (default: 10)',
              },
            },
            required: ['site_id'],
          },
        },
        {
          name: 'get_deploy',
          description: 'Get details about a specific deployment',
          inputSchema: {
            type: 'object',
            properties: {
              deploy_id: {
                type: 'string',
                description: 'The deployment ID',
              },
            },
            required: ['deploy_id'],
          },
        },
        {
          name: 'create_deploy',
          description: 'Create a new draft deployment for a site',
          inputSchema: {
            type: 'object',
            properties: {
              site_id: {
                type: 'string',
                description: 'The site ID or site name',
              },
              branch: {
                type: 'string',
                description: 'Git branch to deploy from',
              },
            },
            required: ['site_id'],
          },
        },
        {
          name: 'list_forms',
          description: 'List all forms for a site',
          inputSchema: {
            type: 'object',
            properties: {
              site_id: {
                type: 'string',
                description: 'The site ID or site name',
              },
            },
            required: ['site_id'],
          },
        },
        {
          name: 'list_form_submissions',
          description: 'List form submissions for a specific form',
          inputSchema: {
            type: 'object',
            properties: {
              form_id: {
                type: 'string',
                description: 'The form ID',
              },
            },
            required: ['form_id'],
          },
        },
        {
          name: 'list_functions',
          description: 'List serverless functions for a site',
          inputSchema: {
            type: 'object',
            properties: {
              site_id: {
                type: 'string',
                description: 'The site ID or site name',
              },
            },
            required: ['site_id'],
          },
        },
        {
          name: 'get_site_build_settings',
          description: 'Get build settings for a site (repo, build command, publish directory)',
          inputSchema: {
            type: 'object',
            properties: {
              site_id: {
                type: 'string',
                description: 'The site ID or site name',
              },
            },
            required: ['site_id'],
          },
        },
      ],
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      try {
        switch (request.params.name) {
          case 'list_sites': {
            const args = request.params.arguments || {};
            const sites: NetlifySite[] = await this.apiRequest('/sites');
            const filtered = args.filter
              ? sites.filter((s) => s.name.includes(args.filter as string))
              : sites;
            return {
              content: [{ type: 'text', text: JSON.stringify(filtered, null, 2) }],
            };
          }

          case 'get_site': {
            if (!isValidArgs(request.params.arguments)) {
              throw new McpError(ErrorCode.InvalidParams, 'Invalid arguments');
            }
            const site_id = request.params.arguments.site_id;
            const site: NetlifySite = await this.apiRequest(`/sites/${site_id}`);
            return {
              content: [{ type: 'text', text: JSON.stringify(site, null, 2) }],
            };
          }

          case 'list_deploys': {
            if (!isValidArgs(request.params.arguments)) {
              throw new McpError(ErrorCode.InvalidParams, 'Invalid arguments');
            }
            const site_id = request.params.arguments.site_id;
            const per_page = request.params.arguments.per_page || 10;
            const deploys: NetlifyDeploy[] = await this.apiRequest(
              `/sites/${site_id}/deploys?per_page=${per_page}`
            );
            return {
              content: [{ type: 'text', text: JSON.stringify(deploys, null, 2) }],
            };
          }

          case 'get_deploy': {
            if (!isValidArgs(request.params.arguments)) {
              throw new McpError(ErrorCode.InvalidParams, 'Invalid arguments');
            }
            const deploy_id = request.params.arguments.deploy_id;
            const deploy: NetlifyDeploy = await this.apiRequest(`/deploys/${deploy_id}`);
            return {
              content: [{ type: 'text', text: JSON.stringify(deploy, null, 2) }],
            };
          }

          case 'create_deploy': {
            if (!isValidArgs(request.params.arguments)) {
              throw new McpError(ErrorCode.InvalidParams, 'Invalid arguments');
            }
            const site_id = request.params.arguments.site_id;
            const body: any = {};
            if (request.params.arguments.branch) {
              body.branch = request.params.arguments.branch;
            }
            const deploy: NetlifyDeploy = await this.apiRequest(
              `/sites/${site_id}/deploys`,
              {
                method: 'POST',
                body: JSON.stringify(body),
              }
            );
            return {
              content: [{ type: 'text', text: JSON.stringify(deploy, null, 2) }],
            };
          }

          case 'list_forms': {
            if (!isValidArgs(request.params.arguments)) {
              throw new McpError(ErrorCode.InvalidParams, 'Invalid arguments');
            }
            const site_id = request.params.arguments.site_id;
            const forms: NetlifyForm[] = await this.apiRequest(`/sites/${site_id}/forms`);
            return {
              content: [{ type: 'text', text: JSON.stringify(forms, null, 2) }],
            };
          }

          case 'list_form_submissions': {
            if (!isValidArgs(request.params.arguments)) {
              throw new McpError(ErrorCode.InvalidParams, 'Invalid arguments');
            }
            const form_id = request.params.arguments.form_id;
            const submissions: NetlifySubmission[] = await this.apiRequest(
              `/forms/${form_id}/submissions`
            );
            return {
              content: [{ type: 'text', text: JSON.stringify(submissions, null, 2) }],
            };
          }

          case 'list_functions': {
            if (!isValidArgs(request.params.arguments)) {
              throw new McpError(ErrorCode.InvalidParams, 'Invalid arguments');
            }
            const site_id = request.params.arguments.site_id;
            const functions: NetlifyFunction[] = await this.apiRequest(
              `/sites/${site_id}/functions`
            );
            return {
              content: [{ type: 'text', text: JSON.stringify(functions, null, 2) }],
            };
          }

          case 'get_site_build_settings': {
            if (!isValidArgs(request.params.arguments)) {
              throw new McpError(ErrorCode.InvalidParams, 'Invalid arguments');
            }
            const site_id = request.params.arguments.site_id;
            const site: NetlifySite = await this.apiRequest(`/sites/${site_id}`);
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(
                    {
                      repo_url: site.build_settings?.repo_url,
                      build_command: site.build_settings?.cmd,
                      publish_directory: site.build_settings?.publish_dir,
                    },
                    null,
                    2
                  ),
                },
              ],
            };
          }

          default:
            throw new McpError(
              ErrorCode.MethodNotFound,
              `Unknown tool: ${request.params.name}`
            );
        }
      } catch (error) {
        if (error instanceof McpError) {
          throw error;
        }
        return {
          content: [
            { type: 'text', text: `Error: ${error instanceof Error ? error.message : String(error)}` },
          ],
          isError: true,
        };
      }
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Netlify MCP server running on stdio');
  }
}

const server = new NetlifyServer();
server.run().catch(console.error);