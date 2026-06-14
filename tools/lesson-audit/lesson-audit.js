#!/usr/bin/env node

const fs = require('node:fs');
const http = require('node:http');
const os = require('node:os');
const path = require('node:path');
const { spawn } = require('node:child_process');

const REPO_ROOT = path.resolve(__dirname, '..', '..');
const LESSON_ROOT = path.join(REPO_ROOT, 'Lessons');
const EVENT_ATTR_RE = /\s(on[a-z]+)="([^"]*)"/gi;
const SCRIPT_RE = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
const CALL_RE = /\b([A-Za-z_$][\w$]*)\s*\(/g;
const FUNCTION_DECL_RE = /\bfunction\s+([A-Za-z_$][\w$]*)\s*\(/g;

const BUILT_IN_CALLS = new Set([
  'Array',
  'Boolean',
  'Date',
  'Error',
  'JSON',
  'Map',
  'Math',
  'Number',
  'Object',
  'Promise',
  'RegExp',
  'Set',
  'String',
  'Symbol',
  'alert',
  'clearInterval',
  'clearTimeout',
  'confirm',
  'decodeURIComponent',
  'encodeURIComponent',
  'escape',
  'eval',
  'fetch',
  'isFinite',
  'isNaN',
  'parseFloat',
  'parseInt',
  'prompt',
  'requestAnimationFrame',
  'setInterval',
  'setTimeout',
  'unescape',
]);

const RESERVED_WORDS = new Set([
  'break',
  'case',
  'catch',
  'class',
  'const',
  'continue',
  'debugger',
  'default',
  'delete',
  'do',
  'else',
  'export',
  'extends',
  'finally',
  'for',
  'function',
  'if',
  'import',
  'in',
  'instanceof',
  'let',
  'new',
  'return',
  'super',
  'switch',
  'this',
  'throw',
  'try',
  'typeof',
  'var',
  'void',
  'while',
  'with',
  'yield',
]);

function toPosix(filePath) {
  return filePath.split(path.sep).join('/');
}

function lineNumberForIndex(source, index) {
  return source.slice(0, index).split(/\r?\n/).length;
}

function findLessonFiles(root = LESSON_ROOT) {
  const files = [];
  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(fullPath);
      if (entry.isFile() && entry.name.toLowerCase().endsWith('.html')) files.push(fullPath);
    }
  }
  walk(root);
  return files.sort((a, b) => toPosix(a).localeCompare(toPosix(b)));
}

function classifyLessonFile(filePath, html) {
  const normalized = toPosix(filePath);
  if (normalized.includes('N5-Lessons/')) return 'n5-inline-checker';
  if (normalized.includes('N4-Lessons-Book 2/')) return 'n4-book2-interactive';
  if (normalized.includes('N4-Lessons-Book-1/')) return 'n4-book1-answer-card';
  if (/checkFillBlank|checkMC/.test(html)) return 'n5-inline-checker';
  if (/selectMC|checkQuiz/.test(html)) return 'n4-book2-interactive';
  return 'unknown';
}

function reportFilePath(filePath) {
  const absolutePath = path.resolve(filePath);
  if (absolutePath.startsWith(REPO_ROOT + path.sep)) {
    return toPosix(path.relative(REPO_ROOT, absolutePath));
  }
  return toPosix(filePath);
}

function compileSource(source) {
  try {
    new Function(source);
    return null;
  } catch (error) {
    return {
      message: error.message,
      name: error.name,
    };
  }
}

function collectScriptBlocks(html) {
  const blocks = [];
  SCRIPT_RE.lastIndex = 0;
  for (const match of html.matchAll(SCRIPT_RE)) {
    blocks.push({
      index: match.index,
      line: lineNumberForIndex(html, match.index),
      source: match[1],
    });
  }
  return blocks;
}

function collectDeclaredFunctionNames(scriptBlocks) {
  const names = new Set();
  for (const block of scriptBlocks) {
    FUNCTION_DECL_RE.lastIndex = 0;
    for (const match of block.source.matchAll(FUNCTION_DECL_RE)) {
      names.add(match[1]);
    }
  }
  return names;
}

function collectInlineHandlers(html) {
  const handlers = [];
  EVENT_ATTR_RE.lastIndex = 0;
  for (const match of html.matchAll(EVENT_ATTR_RE)) {
    handlers.push({
      attr: match[1].toLowerCase(),
      index: match.index,
      line: lineNumberForIndex(html, match.index),
      source: match[2],
    });
  }
  return handlers;
}

function maskStringAndCommentSegments(source) {
  const chars = source.split('');
  let index = 0;

  function maskRange(start, end) {
    for (let maskIndex = start; maskIndex < end; maskIndex++) chars[maskIndex] = ' ';
  }

  while (index < source.length) {
    const char = source[index];
    const next = source[index + 1];

    if (char === '/' && next === '/') {
      const start = index;
      index += 2;
      while (index < source.length && source[index] !== '\n') index++;
      maskRange(start, index);
      continue;
    }

    if (char === '/' && next === '*') {
      const start = index;
      index += 2;
      while (index < source.length && !(source[index] === '*' && source[index + 1] === '/')) index++;
      index = Math.min(source.length, index + 2);
      maskRange(start, index);
      continue;
    }

    if (char === "'" || char === '"' || char === '`') {
      const quote = char;
      const start = index;
      index++;
      while (index < source.length) {
        if (source[index] === '\\') {
          index += 2;
          continue;
        }
        if (source[index] === quote) {
          index++;
          break;
        }
        index++;
      }
      maskRange(start, index);
      continue;
    }

    index++;
  }

  return chars.join('');
}

function collectCalledFunctionNames(handlerSource) {
  const names = new Set();
  const callableSource = maskStringAndCommentSegments(handlerSource);
  CALL_RE.lastIndex = 0;
  for (const match of callableSource.matchAll(CALL_RE)) {
    const name = match[1];
    const previousChar = callableSource[match.index - 1];
    if (previousChar === '.') continue;
    if (BUILT_IN_CALLS.has(name) || RESERVED_WORDS.has(name)) continue;
    names.add(name);
  }
  return names;
}

function analyzeHtml(filePath, html) {
  const file = reportFilePath(filePath);
  const classification = classifyLessonFile(filePath, html);
  const scriptErrors = [];
  const inlineHandlerErrors = [];
  const missingHandlers = [];
  const scriptBlocks = collectScriptBlocks(html);
  const declaredFunctions = collectDeclaredFunctionNames(scriptBlocks);
  const inlineHandlers = collectInlineHandlers(html);
  const missingSeen = new Set();

  for (const block of scriptBlocks) {
    const error = compileSource(block.source);
    if (error) {
      scriptErrors.push({
        line: block.line,
        message: error.message,
        name: error.name,
      });
    }
  }

  for (const handler of inlineHandlers) {
    const error = compileSource(handler.source);
    if (error) {
      inlineHandlerErrors.push({
        attr: handler.attr,
        line: handler.line,
        message: error.message,
        name: error.name,
        source: handler.source,
      });
    }

    for (const name of collectCalledFunctionNames(handler.source)) {
      if (declaredFunctions.has(name)) continue;
      const key = `${handler.attr}:${name}:${handler.line}`;
      if (missingSeen.has(key)) continue;
      missingSeen.add(key);
      missingHandlers.push({
        attr: handler.attr,
        functionName: name,
        line: handler.line,
        source: handler.source,
      });
    }
  }

  return {
    file,
    classification,
    ok: scriptErrors.length === 0 && inlineHandlerErrors.length === 0 && missingHandlers.length === 0,
    scriptErrors,
    inlineHandlerErrors,
    missingHandlers,
    smokePlan: buildSmokePlan(filePath, html),
  };
}

function analyzeFile(filePath) {
  const html = fs.readFileSync(filePath, 'utf8');
  return analyzeHtml(filePath, html);
}

function firstMatchSelector(html, selectors) {
  for (const selector of selectors) {
    if (selector.pattern.test(html)) return selector.selector;
  }
  return selectors[0] ? selectors[0].selector : null;
}

function buildSmokePlan(filePath, html) {
  const classification = classifyLessonFile(filePath, html);
  if (classification === 'n4-book2-interactive') {
    return [
      {
        kind: 'select-option',
        selector: firstMatchSelector(html, [
          { pattern: /class=["'][^"']*\bmc-option\b/i, selector: '.mc-option' },
          { pattern: /onclick=["'][^"']*selectMC/i, selector: '[onclick*="selectMC"]' },
        ]),
      },
      {
        kind: 'click-check',
        selector: firstMatchSelector(html, [
          { pattern: /onclick=["'][^"']*checkQuiz/i, selector: '[onclick*="checkQuiz"]' },
          { pattern: /class=["'][^"']*\bcheck-btn\b/i, selector: '.check-btn' },
        ]),
      },
    ];
  }

  if (classification === 'n5-inline-checker') {
    return [
      {
        kind: 'fill-input',
        selector: firstMatchSelector(html, [
          { pattern: /class=["'][^"']*\bblank-input\b/i, selector: '.blank-input' },
          { pattern: /<input\b/i, selector: 'input' },
        ]),
      },
      {
        kind: 'click-check',
        selector: firstMatchSelector(html, [
          { pattern: /onclick=["'][^"']*checkFillBlank/i, selector: '[onclick*="checkFillBlank"]' },
          { pattern: /onclick=["'][^"']*checkMC/i, selector: '[onclick*="checkMC"]' },
          { pattern: /class=["'][^"']*\bcheck-btn\b/i, selector: '.check-btn' },
        ]),
      },
    ];
  }

  if (classification === 'n4-book1-answer-card') {
    return [
      {
        kind: 'click-next',
        selector: firstMatchSelector(html, [
          { pattern: /onclick=["'][^"']*nextSlide/i, selector: '[onclick*="nextSlide"]' },
          { pattern: /class=["'][^"']*\bcheck-btn\b/i, selector: '.check-btn' },
        ]),
      },
    ];
  }

  return [];
}

function findTagEnd(source, startIndex) {
  const end = source.indexOf('>', startIndex);
  return end === -1 ? source.length : end;
}

function isAttributeNameChar(char) {
  return /[^\s"'=<>`/]/.test(char);
}

function looksLikeAttributeTail(source) {
  let index = 0;
  let sawWhitespace = false;

  function skipWhitespace() {
    while (index < source.length && /\s/.test(source[index])) {
      sawWhitespace = true;
      index++;
    }
  }

  skipWhitespace();
  if (index >= source.length) return true;
  if (source[index] === '/') {
    index++;
    skipWhitespace();
    return index >= source.length;
  }
  if (!sawWhitespace) return false;

  while (index < source.length) {
    const nameStart = index;
    while (index < source.length && isAttributeNameChar(source[index])) index++;
    if (index === nameStart) return false;

    skipWhitespace();
    if (source[index] === '=') {
      index++;
      skipWhitespace();
      if (source[index] === '"' || source[index] === "'") {
        const quote = source[index];
        index++;
        while (index < source.length && source[index] !== quote) index++;
        if (source[index] !== quote) return false;
        index++;
      } else {
        const valueStart = index;
        while (index < source.length && !/[\s/]/.test(source[index])) index++;
        if (index === valueStart) return false;
      }
    }

    sawWhitespace = false;
    skipWhitespace();
    if (index >= source.length) return true;
    if (source[index] === '/') {
      index++;
      skipWhitespace();
      return index >= source.length;
    }
    if (!sawWhitespace) return false;
  }

  return true;
}

function encodeRawDoubleQuotes(source) {
  return source.replace(/\\?"/g, '&quot;');
}

function findOnclickClosingQuote(source, valueStart, tagEnd) {
  const candidates = [];
  for (let index = valueStart; index < tagEnd; index++) {
    if (source[index] === '"') candidates.push(index);
  }

  for (let index = candidates.length - 1; index >= 0; index--) {
    const candidate = candidates[index];
    const tail = source.slice(candidate + 1, tagEnd);
    if (!looksLikeAttributeTail(tail)) continue;
    const repairedHandler = encodeRawDoubleQuotes(source.slice(valueStart, candidate));
    if (!compileSource(repairedHandler)) return candidate;
  }

  return candidates.length > 0 ? candidates[candidates.length - 1] : -1;
}

function repairInlineOnclickQuotes(html) {
  let repaired = '';
  let cursor = 0;
  const needle = 'onclick="';

  while (cursor < html.length) {
    const lowerHtml = html.toLowerCase();
    const attrStart = lowerHtml.indexOf(needle, cursor);
    if (attrStart === -1) {
      repaired += html.slice(cursor);
      break;
    }

    const valueStart = attrStart + needle.length;
    const tagEnd = findTagEnd(html, valueStart);
    const closingQuote = findOnclickClosingQuote(html, valueStart, tagEnd);

    repaired += html.slice(cursor, valueStart);
    if (closingQuote === -1) {
      repaired += html.slice(valueStart, tagEnd);
      cursor = tagEnd;
      continue;
    }

    repaired += encodeRawDoubleQuotes(html.slice(valueStart, closingQuote));
    cursor = closingQuote;
  }

  return repaired;
}

function selectBatch(files, batchSize, batchIndex) {
  if (!batchSize) return files;
  const safeBatchSize = Math.max(1, Number(batchSize));
  const safeBatchIndex = batchIndex === 0 ? 0 : Math.max(0, Number(batchIndex || 1) - 1);
  const start = safeBatchIndex * safeBatchSize;
  return files.slice(start, start + safeBatchSize);
}

function runStaticAudit(options = {}) {
  const root = options.root || LESSON_ROOT;
  const files = selectBatch(findLessonFiles(root), options.batchSize, options.batchIndex);
  const results = files.map(analyzeFile);
  const failures = results.filter(result => !result.ok);
  return {
    generatedAt: new Date().toISOString(),
    mode: 'static',
    repoRoot: toPosix(REPO_ROOT),
    lessonRoot: toPosix(path.relative(REPO_ROOT, root) || root),
    batchSize: options.batchSize ? Number(options.batchSize) : null,
    batchIndex: options.batchIndex === undefined ? null : Number(options.batchIndex),
    scanned: results.length,
    staticFailures: failures.length,
    ok: failures.length === 0,
    failureFiles: failures.map(result => result.file),
    results,
  };
}

function runBrowserAudit(options = {}) {
  void http;
  void os;
  void spawn;
  return {
    generatedAt: new Date().toISOString(),
    mode: 'browser',
    ok: false,
    skipped: true,
    reason: 'Browser audit is not implemented by the static audit harness.',
    options,
  };
}

function parseArgs(argv) {
  const args = {
    mode: 'static',
  };

  for (let index = 0; index < argv.length; index++) {
    const arg = argv[index];
    if (!arg.startsWith('--')) continue;

    const eqIndex = arg.indexOf('=');
    const key = arg.slice(2, eqIndex === -1 ? undefined : eqIndex);
    const value = eqIndex === -1 ? argv[++index] : arg.slice(eqIndex + 1);

    if (key === 'mode') args.mode = value;
    else if (key === 'out') args.out = value;
    else if (key === 'batch-size') args.batchSize = Number(value);
    else if (key === 'batch-index') args.batchIndex = Number(value);
    else if (key === 'root') args.root = path.resolve(value);
    else throw new Error(`Unknown argument: --${key}`);
  }

  return args;
}

function writeReport(outPath, report) {
  const absolutePath = path.resolve(REPO_ROOT, outPath);
  fs.mkdirSync(path.dirname(absolutePath), { recursive: true });
  fs.writeFileSync(absolutePath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  return absolutePath;
}

function printStaticSummary(report, outPath) {
  console.log(`Scanned ${report.scanned} lesson file(s).`);
  console.log(`Static failures: ${report.staticFailures}.`);
  if (report.failureFiles.length > 0) {
    console.log('Failure files:');
    for (const file of report.failureFiles) console.log(`- ${file}`);
  }
  if (outPath) console.log(`Report written to ${toPosix(path.relative(REPO_ROOT, outPath))}`);
}

function runCli(argv = process.argv.slice(2)) {
  const args = parseArgs(argv);
  const report = args.mode === 'browser'
    ? runBrowserAudit(args)
    : runStaticAudit(args);
  const outPath = args.out ? writeReport(args.out, report) : null;

  if (report.mode === 'static') {
    printStaticSummary(report, outPath);
  } else {
    console.log(JSON.stringify(report, null, 2));
  }

  return report;
}

module.exports = {
  analyzeFile,
  analyzeHtml,
  buildSmokePlan,
  classifyLessonFile,
  findLessonFiles,
  repairInlineOnclickQuotes,
  runBrowserAudit,
  runCli,
  runStaticAudit,
};

if (require.main === module) {
  try {
    runCli();
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
