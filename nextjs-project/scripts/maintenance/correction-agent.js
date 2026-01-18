#!/usr/bin/env node

/**
 * Knowledge base correction agent orchestrator.
 *
 * Usage examples:
 *   node scripts/correction-agent.js --input tmp/draft.json --output tmp/fixed.json
 *   cat tmp/draft.json | node scripts/correction-agent.js --allow-search > tmp/fixed.json
 *
 * Expected input JSON shape:
 * {
 *   "draft": { ... original payload ... },
 *   "issues": [
 *     { "code": "DUPLICATE_SUMMARY", "message": "summary and content overlap" }
 *   ],
 *   "context": { optional extra info },
 *   "search_queries": ["Microsoft Nvidia AI chips Omdia 2024"]
 * }
 */

const fs = require('fs');
const path = require('path');
try {
  require('dotenv').config({ path: path.resolve(__dirname, '../.env.local'), override: false });
} catch (error) {
  // dotenv is optional; ignore if not available
}
const { argv, stdin, stdout, exit } = process;
const fetch = global.fetch;
const DEFAULT_MODEL = process.env.CORRECTION_MODEL || 'gpt-5.1-nano';
const MAX_SEARCH_RESULTS = Number(process.env.CORRECTION_SEARCH_RESULTS || 3);
const SEARCH_ENDPOINT = process.env.CORRECTION_SEARCH_ENDPOINT || 'https://ddg-webapp-aagd.vercel.app/search';

function parseArgs(rawArgs) {
  const args = { allowSearch: false };
  for (let i = 2; i < rawArgs.length; i += 1) {
    const current = rawArgs[i];
    switch (current) {
      case '--input':
      case '-i':
        args.input = rawArgs[++i];
        break;
      case '--output':
      case '-o':
        args.output = rawArgs[++i];
        break;
      case '--model':
      case '-m':
        args.model = rawArgs[++i];
        break;
      case '--allow-search':
        args.allowSearch = true;
        break;
      case '--dry-run':
        args.dryRun = true;
        i -= 1; // no value
        break;
      case '--help':
      case '-h':
        printHelp();
        exit(0);
        break;
      default:
        console.error(`Unknown argument: ${current}`);
        printHelp();
        exit(1);
    }
  }
  return args;
}

function printHelp() {
  console.log(`Usage: correction-agent [options]\n\n` +
    `Options:\n` +
    `  -i, --input <file>        Read input JSON from file (default: stdin)\n` +
    `  -o, --output <file>       Write corrected JSON to file (default: stdout)\n` +
    `  -m, --model <model>       Override model (default: ${DEFAULT_MODEL})\n` +
    `      --allow-search        Allow one-shot web search if queries provided\n` +
    `      --dry-run             Skip LLM call; only run validation of input structure\n` +
    `  -h, --help                Show this help message\n`);
}

function readInput(inputPath) {
  if (inputPath) {
    return fs.readFileSync(path.resolve(inputPath), 'utf8');
  }
  if (stdin.isTTY) {
    console.error('No input provided. Specify --input <file> or pipe JSON via stdin.');
    exit(1);
  }
  let data = '';
  return new Promise((resolve, reject) => {
    stdin.setEncoding('utf8');
    stdin.on('data', (chunk) => {
      data += chunk;
    });
    stdin.on('end', () => resolve(data));
    stdin.on('error', reject);
  });
}

function ensureObject(obj, name) {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) {
    throw new Error(`${name} must be an object.`);
  }
}

function ensureArray(arr, name) {
  if (!Array.isArray(arr) || arr.length === 0) {
    throw new Error(`${name} must be a non-empty array.`);
  }
}

async function runSearch(queries, allowSearch) {
  if (!allowSearch || !queries || queries.length === 0) {
    return [];
  }

  const uniqueQueries = Array.from(new Set(queries.filter(Boolean))).slice(0, 2);
  const results = [];

  for (let i = 0; i < uniqueQueries.length; i += 1) {
    const query = uniqueQueries[i];
    try {
      const url = `${SEARCH_ENDPOINT}?q=${encodeURIComponent(query)}&max_results=${MAX_SEARCH_RESULTS}`;
      const response = await fetch(url, { method: 'GET' });
      if (!response.ok) {
        console.warn(`Search request failed (${response.status}): ${query}`);
        continue;
      }
      const payload = await response.json();
      if (Array.isArray(payload)) {
        results.push({ query, hits: payload.slice(0, MAX_SEARCH_RESULTS) });
      } else if (payload && Array.isArray(payload.results)) {
        results.push({ query, hits: payload.results.slice(0, MAX_SEARCH_RESULTS) });
      }
    } catch (error) {
      console.warn(`Search error for query "${query}":`, error.message);
    }
  }

  return results;
}

function buildPromptContent({ draft, issues, context, searchResults }) {
  return {
    instruction: 'Fix only the specified issues while preserving verified details. Do not invent facts.',
    draft,
    issues,
    context: context || {},
    search_results: searchResults || []
  };
}

async function callCorrectionAgent({ payload, model }) {
  const apiKey = process.env.OPENAI_API_KEY || process.env.OPENAI_APIKEY;
  if (!apiKey) {
    throw new Error('Missing OPENAI_API_KEY environment variable.');
  }

  const response = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      temperature: 0.2,
      max_output_tokens: Number(process.env.CORRECTION_MAX_TOKENS || 900),
      input: [
        {
          role: 'system',
          content: [
            {
              type: 'text',
              text:
                'You are a fact-checking correction agent. Revise the provided JSON so that every issue is resolved without fabricating data. ' +
                'Only change the fields implicated by the issues, maintain JSON structure, add citations when needed, and ensure dates are ISO formatted. ' +
                'If information cannot be verified from the draft or supplied search results, leave a clear TODO note instead of guessing.'
            }
          ]
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: JSON.stringify(payload)
            }
          ]
        }
      ],
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'CorrectionResponse',
          schema: {
            type: 'object',
            required: ['draft', 'changes', 'notes'],
            properties: {
              draft: { type: 'object' },
              changes: {
                type: 'array',
                items: {
                  type: 'object',
                  required: ['field', 'description'],
                  properties: {
                    field: { type: 'string' },
                    description: { type: 'string' }
                  }
                }
              },
              notes: {
                type: 'array',
                items: { type: 'string' }
              }
            }
          }
        }
      }
    })
  });

  if (!response.ok) {
    const errorPayload = await response.text();
    throw new Error(`Correction agent request failed (${response.status}): ${errorPayload}`);
  }

  const data = await response.json();
  const outputCandidates = data.output || data.outputs || [];
  let jsonText = null;

  for (const candidate of outputCandidates) {
    const content = candidate.content || [];
    for (const part of content) {
      if (part.type === 'output_text' || part.type === 'text') {
        jsonText = part.text;
        break;
      }
    }
    if (jsonText) break;
  }

  if (!jsonText && data.output_text) {
    jsonText = data.output_text;
  }

  if (!jsonText && Array.isArray(data.choices)) {
    jsonText = data.choices.map((c) => c.message?.content).filter(Boolean).join('\n');
  }

  if (!jsonText) {
    throw new Error('No textual output returned by correction agent.');
  }

  let parsed;
  try {
    parsed = JSON.parse(jsonText);
  } catch (error) {
    throw new Error(`Failed to parse agent response as JSON: ${error.message}\nRaw output: ${jsonText}`);
  }

  return parsed;
}

async function main() {
  const args = parseArgs(argv);
  const rawInput = await readInput(args.input);
  const input = typeof rawInput === 'string' ? rawInput : await rawInput;

  let data;
  try {
    data = JSON.parse(input);
  } catch (error) {
    console.error('Invalid JSON input:', error.message);
    exit(1);
  }

  try {
    ensureObject(data.draft, 'draft');
    ensureArray(data.issues, 'issues');
  } catch (error) {
    console.error(`Input validation error: ${error.message}`);
    exit(1);
  }

  const searchResults = await runSearch(data.search_queries, args.allowSearch);
  const payload = buildPromptContent({
    draft: data.draft,
    issues: data.issues,
    context: data.context,
    searchResults
  });

  if (args.dryRun) {
    const preview = {
      payload,
      meta: {
        model: args.model || DEFAULT_MODEL,
        search_results: searchResults.length,
        status: 'dry-run'
      }
    };
    if (args.output) {
      fs.writeFileSync(path.resolve(args.output), JSON.stringify(preview, null, 2));
    } else {
      stdout.write(JSON.stringify(preview, null, 2));
    }
    return;
  }

  try {
    const result = await callCorrectionAgent({
      payload,
      model: args.model || DEFAULT_MODEL
    });

    const enriched = {
      ...result,
      meta: {
        model: args.model || DEFAULT_MODEL,
        search_results: searchResults,
        timestamp: new Date().toISOString()
      }
    };

    if (args.output) {
      fs.writeFileSync(path.resolve(args.output), JSON.stringify(enriched, null, 2));
    } else {
      stdout.write(JSON.stringify(enriched, null, 2));
    }
  } catch (error) {
    console.error('Correction agent failed:', error.message);
    exit(1);
  }
}

main();
