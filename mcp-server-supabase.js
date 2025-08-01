#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createClient } from '@supabase/supabase-js';

const server = new Server(
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

// Configurar cliente de Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY son requeridos');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Herramienta para consultar datos
server.setRequestHandler('tools/call', async (request) => {
  const { name, arguments: args } = request.params;

  switch (name) {
    case 'query_data':
      try {
        const { table, select = '*', where = '', limit = 100 } = args;
        let query = supabase.from(table).select(select);
        
        if (where) {
          query = query.eq(where.field, where.value);
        }
        
        if (limit) {
          query = query.limit(limit);
        }
        
        const { data, error } = await query;
        
        if (error) {
          return {
            content: [{ type: 'text', text: `Error: ${error.message}` }],
          };
        }
        
        return {
          content: [{ 
            type: 'text', 
            text: `Datos de ${table}:\n${JSON.stringify(data, null, 2)}` 
          }],
        };
      } catch (error) {
        return {
          content: [{ type: 'text', text: `Error: ${error.message}` }],
        };
      }
      
    case 'list_tables':
      try {
        const { data, error } = await supabase
          .from('information_schema.tables')
          .select('table_name')
          .eq('table_schema', 'public');
          
        if (error) {
          return {
            content: [{ type: 'text', text: `Error: ${error.message}` }],
          };
        }
        
        const tables = data.map(row => row.table_name);
        return {
          content: [{ 
            type: 'text', 
            text: `Tablas disponibles:\n${tables.join('\n')}` 
          }],
        };
      } catch (error) {
        return {
          content: [{ type: 'text', text: `Error: ${error.message}` }],
        };
      }
      
    default:
      return {
        content: [{ type: 'text', text: `Herramienta '${name}' no encontrada` }],
      };
  }
});

// Listar herramientas disponibles
server.setRequestHandler('tools/list', async () => {
  return {
    tools: [
      {
        name: 'query_data',
        description: 'Consultar datos de una tabla específica',
        inputSchema: {
          type: 'object',
          properties: {
            table: { type: 'string', description: 'Nombre de la tabla' },
            select: { type: 'string', description: 'Campos a seleccionar', default: '*' },
            where: { type: 'object', description: 'Condiciones WHERE' },
            limit: { type: 'number', description: 'Límite de resultados', default: 100 }
          },
          required: ['table']
        }
      },
      {
        name: 'list_tables',
        description: 'Listar todas las tablas disponibles',
        inputSchema: {
          type: 'object',
          properties: {}
        }
      }
    ]
  };
});

const transport = new StdioServerTransport();
await server.connect(transport); 