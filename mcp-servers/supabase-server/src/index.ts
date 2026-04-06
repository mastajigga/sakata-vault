#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  McpError,
  ErrorCode,
} from '@modelcontextprotocol/sdk/types.js';

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY!;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  throw new Error('SUPABASE_URL and SUPABASE_SERVICE_KEY environment variables are required');
}

const BASE_URL = `${SUPABASE_URL}/rest/v1`;

const isValidArgs = (args: any): args is Record<string, any> =>
  typeof args === 'object' && args !== null;

interface QueryArgs {
  table: string;
  select?: string;
  limit?: number;
  offset?: number;
  order?: string;
  order_desc?: boolean;
  filters?: Record<string, any>;
}

interface InsertArgs {
  table: string;
  data: Record<string, any> | Record<string, any>[];
}

interface UpdateArgs {
  table: string;
  data: Record<string, any>;
  filters: Record<string, any>;
}

interface DeleteArgs {
  table: string;
  filters: Record<string, any>;
}

interface RpcArgs {
  function_name: string;
  args?: Record<string, any>;
}

class SupabaseServer {
  private server: Server;

  constructor() {
    this.server = new Server(
      {
        name: 'supabase-mcp-server',
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
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new McpError(
        ErrorCode.InternalError,
        `Supabase API error: ${response.status} - ${error}`
      );
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return response.json();
    }
    return response.text();
  }

  private buildQueryString(filters?: Record<string, any>, select?: string, limit?: number, offset?: number, order?: string, orderDesc?: boolean): string {
    const params = new URLSearchParams();

    if (select) {
      params.set('select', select);
    } else {
      params.set('select', '*');
    }

    if (filters) {
      for (const [key, value] of Object.entries(filters)) {
        if (typeof value === 'object' && value !== null) {
          if (value.operator && value.value !== undefined) {
            params.set(key, `${value.operator}.${value.value}`);
          } else {
            params.set(key, `eq.${value}`);
          }
        } else {
          params.set(key, `eq.${value}`);
        }
      }
    }

    if (limit) {
      params.set('limit', String(limit));
    }
    if (offset) {
      params.set('offset', String(offset));
    }
    if (order) {
      params.set('order', `${order}${orderDesc ? '.desc' : '.asc'}`);
    }

    return params.toString();
  }

  private setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'query_table',
          description: 'Query a Supabase table with optional filters, sorting, and pagination',
          inputSchema: {
            type: 'object',
            properties: {
              table: {
                type: 'string',
                description: 'The table name to query',
              },
              select: {
                type: 'string',
                description: 'Columns to select (e.g., "id,name,created_at")',
              },
              filters: {
                type: 'object',
                description: 'Filter conditions as key-value pairs',
                additionalProperties: true,
              },
              limit: {
                type: 'number',
                description: 'Maximum number of rows to return',
              },
              offset: {
                type: 'number',
                description: 'Number of rows to skip',
              },
              order: {
                type: 'string',
                description: 'Column to order by',
              },
              order_desc: {
                type: 'boolean',
                description: 'Order descending (default: false)',
              },
            },
            required: ['table'],
          },
        },
        {
          name: 'insert_row',
          description: 'Insert one or more rows into a Supabase table',
          inputSchema: {
            type: 'object',
            properties: {
              table: {
                type: 'string',
                description: 'The table name',
              },
              data: {
                type: ['object', 'array'],
                description: 'Row data to insert (object for single, array for multiple)',
                additionalProperties: true,
              },
            },
            required: ['table', 'data'],
          },
        },
        {
          name: 'update_row',
          description: 'Update rows in a Supabase table matching filters',
          inputSchema: {
            type: 'object',
            properties: {
              table: {
                type: 'string',
                description: 'The table name',
              },
              data: {
                type: 'object',
                description: 'Data to update',
                additionalProperties: true,
              },
              filters: {
                type: 'object',
                description: 'Filter conditions to match rows',
                additionalProperties: true,
              },
            },
            required: ['table', 'data', 'filters'],
          },
        },
        {
          name: 'delete_row',
          description: 'Delete rows from a Supabase table matching filters',
          inputSchema: {
            type: 'object',
            properties: {
              table: {
                type: 'string',
                description: 'The table name',
              },
              filters: {
                type: 'object',
                description: 'Filter conditions to match rows',
                additionalProperties: true,
              },
            },
            required: ['table', 'filters'],
          },
        },
        {
          name: 'list_tables',
          description: 'List all tables in the Supabase database',
          inputSchema: {
            type: 'object',
            properties: {},
            required: [],
          },
        },
        {
          name: 'get_table_schema',
          description: 'Get the schema/columns information for a specific table',
          inputSchema: {
            type: 'object',
            properties: {
              table: {
                type: 'string',
                description: 'The table name',
              },
            },
            required: ['table'],
          },
        },
        {
          name: 'call_rpc',
          description: 'Call a Supabase RPC function',
          inputSchema: {
            type: 'object',
            properties: {
              function_name: {
                type: 'string',
                description: 'The RPC function name',
              },
              args: {
                type: 'object',
                description: 'Arguments to pass to the function',
                additionalProperties: true,
              },
            },
            required: ['function_name'],
          },
        },
      ],
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      try {
        switch (request.params.name) {
          case 'query_table': {
            if (!isValidArgs(request.params.arguments)) {
              throw new McpError(ErrorCode.InvalidParams, 'Invalid arguments');
            }
            const args = request.params.arguments as unknown as QueryArgs;
            const query = this.buildQueryString(
              args.filters,
              args.select,
              args.limit,
              args.offset,
              args.order,
              args.order_desc
            );
            const data = await this.apiRequest(`/${args.table}?${query}`);
            return {
              content: [{ type: 'text', text: JSON.stringify(data, null, 2) }],
            };
          }

          case 'insert_row': {
            if (!isValidArgs(request.params.arguments)) {
              throw new McpError(ErrorCode.InvalidParams, 'Invalid arguments');
            }
            const args = request.params.arguments as unknown as InsertArgs;
            const data = await this.apiRequest(`/${args.table}`, {
              method: 'POST',
              body: JSON.stringify(args.data),
            });
            return {
              content: [{ type: 'text', text: JSON.stringify(data, null, 2) }],
            };
          }

          case 'update_row': {
            if (!isValidArgs(request.params.arguments)) {
              throw new McpError(ErrorCode.InvalidParams, 'Invalid arguments');
            }
            const args = request.params.arguments as unknown as UpdateArgs;
            const query = this.buildQueryString(args.filters);
            const data = await this.apiRequest(`/${args.table}?${query}`, {
              method: 'PATCH',
              body: JSON.stringify(args.data),
            });
            return {
              content: [{ type: 'text', text: JSON.stringify(data, null, 2) }],
            };
          }

          case 'delete_row': {
            if (!isValidArgs(request.params.arguments)) {
              throw new McpError(ErrorCode.InvalidParams, 'Invalid arguments');
            }
            const args = request.params.arguments as unknown as DeleteArgs;
            const query = this.buildQueryString(args.filters);
            await this.apiRequest(`/${args.table}?${query}`, {
              method: 'DELETE',
            });
            return {
              content: [{ type: 'text', text: 'Rows deleted successfully' }],
            };
          }

          case 'list_tables': {
            const data = await this.apiRequest(
              '/rpc/get_tables?select=table_name,table_schema&table_schema=eq.public'
            );
            return {
              content: [{ type: 'text', text: JSON.stringify(data, null, 2) }],
            };
          }

          case 'get_table_schema': {
            if (!isValidArgs(request.params.arguments)) {
              throw new McpError(ErrorCode.InvalidParams, 'Invalid arguments');
            }
            const table = request.params.arguments.table;
            const data = await this.apiRequest(
              `/rpc/get_table_columns?select=column_name,data_type,is_nullable&table_name=eq.${table}`
            );
            return {
              content: [{ type: 'text', text: JSON.stringify(data, null, 2) }],
            };
          }

          case 'call_rpc': {
            if (!isValidArgs(request.params.arguments)) {
              throw new McpError(ErrorCode.InvalidParams, 'Invalid arguments');
            }
            const args = request.params.arguments as unknown as RpcArgs;
            const data = await this.apiRequest(`/rpc/${args.function_name}`, {
              method: 'POST',
              body: JSON.stringify(args.args || {}),
            });
            return {
              content: [{ type: 'text', text: JSON.stringify(data, null, 2) }],
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
    console.error('Supabase MCP server running on stdio');
  }
}

const server = new SupabaseServer();
server.run().catch(console.error);