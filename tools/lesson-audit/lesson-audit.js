#!/usr/bin/env node

const fs = require('node:fs');
const http = require('node:http');
const Module = require('node:module');
const os = require('node:os');
const path = require('node:path');
const { spawn } = require('node:child_process');
const { pathToFileURL } = require('node:url');

const REPO_ROOT = path.resolve(__dirname, '..', '..');
const LESSON_ROOT = path.join(REPO_ROOT, 'Lessons');
const EVENT_ATTR_RE = /\s(on[a-z]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'<>`=]+))/gi;
const SCRIPT_RE = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
const CALL_RE = /\b([A-Za-z_$][\w$]*)\s*\(/g;
const FUNCTION_DECL_RE = /\bfunction\s+([A-Za-z_$][\w$]*)\s*\(/g;
const BROWSER_LAUNCH_ARGS = [
  '--disable-gpu',
  '--single-process',
  '--in-process-gpu',
  '--disable-dev-shm-usage',
  '--no-first-run',
  '--no-default-browser-check',
];
const PLAYWRIGHT_LAUNCH_ARGS = ['--disable-gpu'];

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
  let tagStart = 0;

  while ((tagStart = html.indexOf('<', tagStart)) !== -1) {
    const nextChar = html[tagStart + 1];
    if (!nextChar || nextChar === '/' || nextChar === '!' || nextChar === '?') {
      tagStart++;
      continue;
    }

    const tagEnd = findTagEnd(html, tagStart + 1);
    const tagSource = html.slice(tagStart, tagEnd + 1);
    let cursor = 1;

    while (cursor < tagSource.length - 1 && !/[\s/>]/.test(tagSource[cursor])) cursor++;

    while (cursor < tagSource.length - 1) {
      while (cursor < tagSource.length - 1 && /\s/.test(tagSource[cursor])) cursor++;
      if (cursor >= tagSource.length - 1 || tagSource[cursor] === '/') break;

      const attrStart = cursor;
      while (cursor < tagSource.length - 1 && isAttributeNameChar(tagSource[cursor])) cursor++;
      if (cursor === attrStart) {
        cursor++;
        continue;
      }

      const attr = tagSource.slice(attrStart, cursor);
      while (cursor < tagSource.length - 1 && /\s/.test(tagSource[cursor])) cursor++;

      let source = '';
      if (tagSource[cursor] === '=') {
        cursor++;
        while (cursor < tagSource.length - 1 && /\s/.test(tagSource[cursor])) cursor++;

        if (tagSource[cursor] === '"' || tagSource[cursor] === "'") {
          const quote = tagSource[cursor];
          const valueStart = ++cursor;
          while (cursor < tagSource.length - 1 && tagSource[cursor] !== quote) cursor++;
          source = tagSource.slice(valueStart, cursor);
          if (tagSource[cursor] === quote) cursor++;
        } else {
          const valueStart = cursor;
          while (cursor < tagSource.length - 1 && !/\s|>/.test(tagSource[cursor])) cursor++;
          source = tagSource.slice(valueStart, cursor);
        }
      }

      if (/^on[a-z]+$/i.test(attr)) {
        const index = tagStart + attrStart;
        handlers.push({
          attr: attr.toLowerCase(),
          index,
          line: lineNumberForIndex(html, index),
          source,
        });
      }
    }

    tagStart = tagEnd + 1;
  }

  return handlers;
}

function decodeHtmlEntities(source) {
  return source
    .replace(/&quot;/gi, '"')
    .replace(/&#34;/gi, '"')
    .replace(/&#x22;/gi, '"')
    .replace(/&apos;/gi, "'")
    .replace(/&#39;/gi, "'")
    .replace(/&#x27;/gi, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&amp;/gi, '&');
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
    const handlerSource = decodeHtmlEntities(handler.source);
    const error = compileSource(handlerSource);
    if (error) {
      inlineHandlerErrors.push({
        attr: handler.attr,
        line: handler.line,
        message: error.message,
        name: error.name,
        source: handlerSource,
      });
    }

    for (const name of collectCalledFunctionNames(handlerSource)) {
      if (declaredFunctions.has(name)) continue;
      const key = `${handler.attr}:${name}:${handler.line}`;
      if (missingSeen.has(key)) continue;
      missingSeen.add(key);
      missingHandlers.push({
        attr: handler.attr,
        functionName: name,
        line: handler.line,
        source: handlerSource,
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
        kind: 'fill-input',
        selector: '.blank-input, input[id$="-input"], textarea',
        scope: 'all',
      },
      {
        kind: 'select-option',
        selector: '.mc-option, [onclick*="selectMC"]',
        scope: 'all',
      },
      {
        kind: 'click-check',
        selector: '[onclick*="checkQuiz"], .check-btn',
        scope: 'all',
      },
    ];
  }

  if (classification === 'n5-inline-checker') {
    const actions = [
      {
        kind: 'fill-input',
        selector: '.blank-input, input[id$="-input"], textarea',
        scope: 'all',
      },
      {
        kind: 'click-check',
        selector: '[onclick*="checkFillBlank"], [onclick*="checkDoubleBlank"], .check-btn',
        scope: 'all',
      },
    ];
    if (/\bcheckMC\s*\(/.test(html)) {
      actions.push({
        kind: 'click-choice',
        selector: '.mc-option, .choice-btn, [onclick*="checkMC"]',
        scope: 'all',
      });
    }
    return actions;
  }

  if (classification === 'n4-book1-answer-card') {
    return [
      {
        kind: 'click-check',
        selector: '[onclick*="nextSlide"], .check-btn',
        scope: 'all',
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

function repairReportFilePath(root, filePath) {
  const absolutePath = path.resolve(filePath);
  if (absolutePath.startsWith(REPO_ROOT + path.sep)) return reportFilePath(absolutePath);
  return toPosix(path.relative(root, absolutePath));
}

function repairLessonFiles(options = {}) {
  const root = options.root || LESSON_ROOT;
  const dryRun = Boolean(options.dryRun);
  const files = selectBatch(findLessonFiles(root), options.batchSize, options.batchIndex);
  const results = [];

  for (const filePath of files) {
    const source = fs.readFileSync(filePath, 'utf8');
    const before = analyzeHtml(filePath, source);
    const repaired = repairInlineOnclickQuotes(source);
    const changed = repaired !== source;
    const after = changed ? analyzeHtml(filePath, repaired) : before;

    if (changed && !dryRun) {
      fs.writeFileSync(filePath, repaired, 'utf8');
    }

    results.push({
      file: repairReportFilePath(root, filePath),
      changed,
      staticOkBefore: before.ok,
      staticOkAfter: after.ok,
      inlineHandlerErrorsBefore: before.inlineHandlerErrors.length,
      inlineHandlerErrorsAfter: after.inlineHandlerErrors.length,
      scriptErrorsBefore: before.scriptErrors.length,
      scriptErrorsAfter: after.scriptErrors.length,
      missingHandlersBefore: before.missingHandlers.length,
      missingHandlersAfter: after.missingHandlers.length,
    });
  }

  const changedResults = results.filter(result => result.changed);
  return {
    generatedAt: new Date().toISOString(),
    mode: 'repair-inline-onclick-quotes',
    repoRoot: toPosix(REPO_ROOT),
    lessonRoot: toPosix(path.relative(REPO_ROOT, root) || root),
    dryRun,
    batchSize: options.batchSize ? Number(options.batchSize) : null,
    batchIndex: options.batchIndex === undefined ? null : Number(options.batchIndex),
    scanned: results.length,
    changed: changedResults.length,
    changedFiles: changedResults.map(result => result.file),
    ok: results.every(result => result.staticOkAfter),
    results,
  };
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

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function findChromeExecutable() {
  const candidates = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  ];
  return candidates.find(candidate => fs.existsSync(candidate)) || null;
}

function waitForDevToolsUrl(child, timeoutMs = 10000) {
  return new Promise((resolve, reject) => {
    let stderr = '';
    const timer = setTimeout(() => {
      cleanup();
      reject(new Error(`Timed out waiting for DevTools websocket URL. Chrome stderr: ${stderr.trim()}`));
    }, timeoutMs);

    function cleanup() {
      clearTimeout(timer);
      child.stderr.off('data', onData);
      child.off('exit', onExit);
      child.off('error', onError);
    }

    function onData(chunk) {
      stderr += chunk.toString();
      const match = stderr.match(/DevTools listening on (ws:\/\/[^\s]+)/);
      if (match) {
        cleanup();
        resolve(match[1]);
      }
    }

    function onExit(code, signal) {
      cleanup();
      reject(new Error(`Chrome exited before DevTools was ready. code=${code} signal=${signal} stderr=${stderr.trim()}`));
    }

    function onError(error) {
      cleanup();
      reject(error);
    }

    child.stderr.on('data', onData);
    child.on('exit', onExit);
    child.on('error', onError);
  });
}

async function launchChrome() {
  const executable = findChromeExecutable();
  if (!executable) {
    throw new Error('No supported Chrome or Edge executable found.');
  }

  const userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'lesson-audit-chrome-'));
  const child = spawn(executable, [
    '--headless=new',
    '--remote-debugging-port=0',
    `--user-data-dir=${userDataDir}`,
    ...BROWSER_LAUNCH_ARGS,
    'about:blank',
  ], {
    stdio: ['ignore', 'ignore', 'pipe'],
    windowsHide: true,
  });

  const wsUrl = await waitForDevToolsUrl(child);
  return { child, executable, userDataDir, wsUrl };
}

class CdpClient {
  constructor(socket) {
    this.socket = socket;
    this.nextId = 1;
    this.pending = new Map();
    this.eventHandlers = new Set();

    socket.addEventListener('message', event => {
      const data = typeof event.data === 'string' ? event.data : event.data.toString();
      const message = JSON.parse(data);
      if (message.id && this.pending.has(message.id)) {
        const { resolve, reject, timer } = this.pending.get(message.id);
        clearTimeout(timer);
        this.pending.delete(message.id);
        if (message.error) reject(new Error(message.error.message || JSON.stringify(message.error)));
        else resolve(message);
        return;
      }

      for (const handler of this.eventHandlers) handler(message);
    });

    socket.addEventListener('close', () => {
      for (const { reject, timer } of this.pending.values()) {
        clearTimeout(timer);
        reject(new Error('Chrome DevTools websocket closed.'));
      }
      this.pending.clear();
    });
  }

  static connect(wsUrl, timeoutMs = 10000) {
    if (typeof WebSocket !== 'function') {
      return Promise.reject(new Error('This Node runtime does not expose a global WebSocket implementation.'));
    }

    return new Promise((resolve, reject) => {
      const socket = new WebSocket(wsUrl);
      let settled = false;
      const timer = setTimeout(() => finish(new Error(`Timed out connecting to Chrome DevTools at ${wsUrl}`)), timeoutMs);

      function finish(error, client) {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        if (error) reject(error);
        else resolve(client);
      }

      socket.addEventListener('open', () => finish(null, new CdpClient(socket)));
      socket.addEventListener('error', () => finish(new Error(`Unable to connect to Chrome DevTools at ${wsUrl}`)));
      socket.addEventListener('close', () => finish(new Error(`Chrome DevTools websocket closed before connection opened: ${wsUrl}`)));
    });
  }

  send(method, params = {}, sessionId = null, timeoutMs = 10000) {
    const id = this.nextId++;
    const message = { id, method, params };
    if (sessionId) message.sessionId = sessionId;

    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this.pending.delete(id);
        reject(new Error(`Timed out waiting for Chrome DevTools response to ${method}.`));
      }, timeoutMs);
      this.pending.set(id, { resolve, reject, timer });
      this.socket.send(JSON.stringify(message));
    });
  }

  onEvent(handler) {
    this.eventHandlers.add(handler);
    return () => this.eventHandlers.delete(handler);
  }

  close() {
    this.socket.close();
  }
}

function waitForCdpEvent(client, predicate, timeoutMs = 5000) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      unsubscribe();
      reject(new Error('Timed out waiting for Chrome DevTools event.'));
    }, timeoutMs);
    const unsubscribe = client.onEvent(message => {
      if (!predicate(message)) return;
      clearTimeout(timer);
      unsubscribe();
      resolve(message);
    });
  });
}

function formatException(exceptionDetails) {
  if (!exceptionDetails) return 'Unknown runtime exception';
  if (exceptionDetails.exception?.description) return exceptionDetails.exception.description;
  if (exceptionDetails.text) return exceptionDetails.text;
  return JSON.stringify(exceptionDetails);
}

function browserSmokeExpression(smokePlan) {
  return `
    (async () => {
      const smokePlan = ${JSON.stringify(smokePlan)};
      const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
      const actionResults = [];
      const describeElement = element => {
        if (!element) return '';
        const id = element.id ? '#' + element.id : '';
        const classes = typeof element.className === 'string' && element.className.trim()
          ? '.' + element.className.trim().split(/\\s+/).slice(0, 3).join('.')
          : '';
        return element.tagName.toLowerCase() + id + classes;
      };
      const elementsFor = selector => {
        if (!selector) return [];
        try {
          return Array.from(document.querySelectorAll(selector));
        } catch (error) {
          actionResults.push({ kind: 'invalid-selector', selector, ok: false, error: error.message });
          return [];
        }
      };
      let plannedCheckControls = 0;

      for (const action of smokePlan) {
        const elements = elementsFor(action.selector);
        if (action.kind === 'click-check') plannedCheckControls += elements.length;
        if (action.kind === 'fill-input') {
          if (elements.length === 0) {
            actionResults.push({ kind: action.kind, selector: action.selector, index: -1, ok: false, error: 'No matching input controls' });
          }
          elements.forEach((input, index) => {
            input.value = action.value || input.value || 'test';
            input.dispatchEvent(new Event('input', { bubbles: true }));
            input.dispatchEvent(new Event('change', { bubbles: true }));
            actionResults.push({ kind: action.kind, selector: action.selector, index, target: describeElement(input), ok: true });
          });
        } else {
          if (elements.length === 0) {
            actionResults.push({ kind: action.kind, selector: action.selector, index: -1, ok: false, error: 'No matching clickable controls' });
          }
          elements.forEach((element, index) => {
            try {
              element.click();
              actionResults.push({ kind: action.kind, selector: action.selector, index, target: describeElement(element), ok: true });
            } catch (error) {
              actionResults.push({ kind: action.kind, selector: action.selector, index, target: describeElement(element), ok: false, error: error.message });
            }
          });
        }
        await wait(30);
      }

      await wait(120);
      const clickedCheckCount = actionResults.filter(action => action.kind === 'click-check' && action.ok).length;
      return {
        title: document.title,
        checkButtons: plannedCheckControls,
        candidateCheckButtons: document.querySelectorAll('.check-btn, button[onclick*="check"], button[onclick*="nextSlide"], button[onclick*="cQ"]').length,
        clickedCheckCount,
        clickedCheck: clickedCheckCount > 0,
        clickedChoiceCount: actionResults.filter(action => (action.kind === 'click-choice' || action.kind === 'select-option') && action.ok).length,
        clickedChoice: actionResults.some(action => (action.kind === 'click-choice' || action.kind === 'select-option') && action.ok),
        allActionsOk: actionResults.every(action => action.ok),
        actionResults,
        feedbackText: Array.from(document.querySelectorAll('[id$="-feedback"], [id$="-fb"], .feedback, .feedback-area, .mini-quiz-feedback, .result, .score, .answer-card'))
          .map(node => node.textContent.trim())
          .filter(Boolean)
          .slice(0, 5)
      };
    })()
  `;
}

function loadPlaywrightCore() {
  const errors = [];

  try {
    return require('playwright-core');
  } catch (error) {
    errors.push(`playwright-core: ${error.message}`);
  }

  const bundledNodeModules = path.join(
    os.homedir(),
    '.cache',
    'codex-runtimes',
    'codex-primary-runtime',
    'dependencies',
    'node',
    'node_modules',
    '.pnpm',
    'node_modules'
  );

  if (fs.existsSync(path.join(bundledNodeModules, 'playwright-core'))) {
    const currentNodePath = process.env.NODE_PATH || '';
    const nodePathEntries = currentNodePath.split(path.delimiter).filter(Boolean);
    if (!nodePathEntries.includes(bundledNodeModules)) {
      process.env.NODE_PATH = [bundledNodeModules, ...nodePathEntries].join(path.delimiter);
      Module._initPaths();
    }

    try {
      return require('playwright-core');
    } catch (error) {
      errors.push(`${bundledNodeModules}: ${error.message}`);
    }
  } else {
    errors.push(`${bundledNodeModules}: not found`);
  }

  throw new Error(`Unable to load playwright-core. Attempts: ${errors.join(' | ')}`);
}

async function auditFileWithPlaywright(browser, filePath) {
  const html = fs.readFileSync(filePath, 'utf8');
  const file = reportFilePath(filePath);
  const classification = classifyLessonFile(filePath, html);
  const smokePlan = buildSmokePlan(filePath, html);
  const pageErrors = [];
  const consoleErrors = [];
  let page = null;
  let evaluation = null;
  let evaluationError = null;

  try {
    page = await browser.newPage();
    page.on('pageerror', error => pageErrors.push(error.message));
    page.on('console', message => {
      if (message.type() === 'error') consoleErrors.push(message.text());
    });

    await page.goto(pathToFileURL(filePath).href, {
      waitUntil: 'domcontentloaded',
      timeout: 15000,
    });
    evaluation = await page.evaluate(browserSmokeExpression(smokePlan));
  } catch (error) {
    evaluationError = error.message;
  } finally {
    if (page) await page.close().catch(() => {});
  }

  const allActionsOk = evaluation ? evaluation.allActionsOk !== false : false;
  const hasRequiredCheckClick = evaluation
    ? evaluation.checkButtons === 0 || evaluation.clickedCheckCount >= evaluation.checkButtons
    : false;
  const ok = pageErrors.length === 0
    && consoleErrors.length === 0
    && !evaluationError
    && allActionsOk
    && hasRequiredCheckClick;

  return {
    file,
    classification,
    ok,
    title: evaluation?.title || '',
    checkButtons: evaluation?.checkButtons || 0,
    candidateCheckButtons: evaluation?.candidateCheckButtons || 0,
    clickedCheckCount: evaluation?.clickedCheckCount || 0,
    clickedCheck: Boolean(evaluation?.clickedCheck),
    clickedChoiceCount: evaluation?.clickedChoiceCount || 0,
    clickedChoice: Boolean(evaluation?.clickedChoice),
    allActionsOk,
    actionResults: evaluation?.actionResults || [],
    feedbackText: evaluation?.feedbackText || [],
    pageErrors,
    consoleErrors,
    evaluationError,
    smokePlan,
  };
}

async function createPlaywrightBackend(options = {}) {
  const { chromium } = loadPlaywrightCore();
  const executable = options.browserExecutable || findChromeExecutable();
  if (!executable) {
    throw new Error('No supported Chrome or Edge executable found.');
  }

  const browser = await chromium.launch({
    executablePath: executable,
    headless: true,
    args: PLAYWRIGHT_LAUNCH_ARGS,
    timeout: options.launchTimeoutMs || 15000,
  });

  return {
    name: 'playwright-core',
    executable,
    async auditFile(filePath) {
      return auditFileWithPlaywright(browser, filePath);
    },
    async close() {
      await browser.close();
    },
  };
}

function devToolsHttpOrigin(wsUrl) {
  return wsUrl.replace(/^ws:/, 'http:').replace(/\/devtools\/browser\/.+$/, '');
}

async function createPageTarget(origin) {
  const response = await fetch(`${origin}/json/new?${encodeURIComponent('about:blank')}`, { method: 'PUT' });
  if (!response.ok) {
    throw new Error(`Unable to create Chrome page target: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

async function closePageTarget(origin, targetId) {
  if (!targetId) return;
  await fetch(`${origin}/json/close/${targetId}`).catch(() => {});
}

async function auditFileInBrowser(origin, filePath) {
  const html = fs.readFileSync(filePath, 'utf8');
  const file = reportFilePath(filePath);
  const classification = classifyLessonFile(filePath, html);
  const smokePlan = buildSmokePlan(filePath, html);
  const pageErrors = [];
  const consoleErrors = [];
  let target = null;
  let client = null;
  let targetId = null;
  let evaluation = null;
  let evaluationError = null;

  try {
    target = await createPageTarget(origin);
    targetId = target.id;
    client = await CdpClient.connect(target.webSocketDebuggerUrl);

    const unsubscribe = client.onEvent(message => {
      if (message.method === 'Runtime.exceptionThrown') {
        pageErrors.push(formatException(message.params.exceptionDetails));
      }
      if (message.method === 'Log.entryAdded' && message.params.entry?.level === 'error') {
        consoleErrors.push(message.params.entry.text || JSON.stringify(message.params.entry));
      }
    });

    try {
      await client.send('Runtime.enable');
      await client.send('Page.enable');
      await client.send('Log.enable');

      const loadEvent = waitForCdpEvent(
        client,
        message => message.method === 'Page.loadEventFired',
        8000
      ).catch(error => ({ timeout: error.message }));

      await client.send('Page.navigate', { url: pathToFileURL(filePath).href });
      await loadEvent;
      await wait(100);

      const result = await client.send('Runtime.evaluate', {
        expression: browserSmokeExpression(smokePlan),
        awaitPromise: true,
        returnByValue: true,
      });

      if (result.result.exceptionDetails) {
        evaluationError = formatException(result.result.exceptionDetails);
      } else {
        evaluation = result.result.result.value;
      }
    } finally {
      unsubscribe();
    }
  } catch (error) {
    evaluationError = error.message;
  } finally {
    if (client) client.close();
    if (targetId) {
      await closePageTarget(origin, targetId);
    }
  }

  const allActionsOk = evaluation ? evaluation.allActionsOk !== false : false;
  const hasRequiredCheckClick = evaluation
    ? evaluation.checkButtons === 0 || evaluation.clickedCheckCount >= evaluation.checkButtons
    : false;
  const ok = pageErrors.length === 0
    && consoleErrors.length === 0
    && !evaluationError
    && allActionsOk
    && hasRequiredCheckClick;

  return {
    file,
    classification,
    ok,
    title: evaluation?.title || '',
    checkButtons: evaluation?.checkButtons || 0,
    candidateCheckButtons: evaluation?.candidateCheckButtons || 0,
    clickedCheckCount: evaluation?.clickedCheckCount || 0,
    clickedCheck: Boolean(evaluation?.clickedCheck),
    clickedChoiceCount: evaluation?.clickedChoiceCount || 0,
    clickedChoice: Boolean(evaluation?.clickedChoice),
    allActionsOk,
    actionResults: evaluation?.actionResults || [],
    feedbackText: evaluation?.feedbackText || [],
    pageErrors,
    consoleErrors,
    evaluationError,
    smokePlan,
  };
}

async function runBrowserAudit(options = {}) {
  const root = options.root || LESSON_ROOT;
  const files = selectBatch(findLessonFiles(root), options.batchSize, options.batchIndex);
  let backend = null;

  try {
    backend = options.browserBackend || await createPlaywrightBackend(options);
    const results = [];

    for (const file of files) {
      results.push(await backend.auditFile(file));
    }

    const failures = results.filter(result => !result.ok);
    return {
      generatedAt: new Date().toISOString(),
      mode: 'browser',
      repoRoot: toPosix(REPO_ROOT),
      lessonRoot: toPosix(path.relative(REPO_ROOT, root) || root),
      browserBackend: backend.name || 'custom',
      browserExecutable: backend.executable || null,
      chromeExecutable: backend.executable || null,
      batchSize: options.batchSize ? Number(options.batchSize) : null,
      batchIndex: options.batchIndex === undefined ? null : Number(options.batchIndex),
      scanned: results.length,
      browserFailures: failures.length,
      ok: failures.length === 0,
      failureFiles: failures.map(result => result.file),
      results,
    };
  } catch (error) {
    return {
      generatedAt: new Date().toISOString(),
      mode: 'browser',
      repoRoot: toPosix(REPO_ROOT),
      lessonRoot: toPosix(path.relative(REPO_ROOT, root) || root),
      browserBackend: backend?.name || null,
      browserExecutable: backend?.executable || null,
      chromeExecutable: backend?.executable || null,
      batchSize: options.batchSize ? Number(options.batchSize) : null,
      batchIndex: options.batchIndex === undefined ? null : Number(options.batchIndex),
      scanned: files.length,
      browserFailures: files.length,
      ok: false,
      environmentError: error.message,
      failureFiles: files.map(reportFilePath),
      results: files.map(file => ({
        file: reportFilePath(file),
        classification: classifyLessonFile(file, fs.readFileSync(file, 'utf8')),
        ok: false,
        title: '',
        checkButtons: 0,
        candidateCheckButtons: 0,
        clickedCheckCount: 0,
        clickedCheck: false,
        clickedChoiceCount: 0,
        clickedChoice: false,
        allActionsOk: false,
        actionResults: [],
        feedbackText: [],
        pageErrors: [],
        consoleErrors: [],
        evaluationError: error.message,
        smokePlan: buildSmokePlan(file, fs.readFileSync(file, 'utf8')),
      })),
    };
  } finally {
    if (backend?.close) await backend.close().catch(() => {});
  }
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
    if (key === 'fix-inline-onclick-quotes') {
      args.fixInlineOnclickQuotes = true;
      continue;
    }
    if (key === 'dry-run') {
      args.dryRun = true;
      continue;
    }

    const value = eqIndex === -1 ? argv[++index] : arg.slice(eqIndex + 1);

    if (key === 'mode') args.mode = value;
    else if (key === 'out') args.out = value;
    else if (key === 'batch-size') args.batchSize = Number(value);
    else if (key === 'batch-index') args.batchIndex = Number(value);
    else if (key === 'root') args.root = path.resolve(value);
    else if (key === 'browser-executable') args.browserExecutable = path.resolve(value);
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

function printBrowserSummary(report, outPath) {
  console.log(`Scanned ${report.scanned} lesson file(s).`);
  console.log(`Browser failures: ${report.browserFailures}.`);
  if (report.environmentError) console.log(`Browser environment error: ${report.environmentError}`);
  if (report.failureFiles.length > 0) {
    console.log('Failure files:');
    for (const file of report.failureFiles) console.log(`- ${file}`);
  }
  if (outPath) console.log(`Report written to ${toPosix(path.relative(REPO_ROOT, outPath))}`);
}

function printRepairSummary(report, outPath) {
  console.log(`Scanned ${report.scanned} lesson file(s).`);
  console.log(`Inline onclick quote repair ${report.dryRun ? 'previewed' : 'applied'} for ${report.changed} file(s).`);
  if (report.changedFiles.length > 0) {
    console.log('Changed files:');
    for (const file of report.changedFiles) console.log(`- ${file}`);
  }
  if (outPath) console.log(`Report written to ${toPosix(path.relative(REPO_ROOT, outPath))}`);
}

async function runCli(argv = process.argv.slice(2)) {
  const args = parseArgs(argv);
  let report;
  if (args.fixInlineOnclickQuotes) {
    report = repairLessonFiles(args);
  } else if (args.mode === 'browser') {
    report = await runBrowserAudit(args);
  } else {
    report = runStaticAudit(args);
  }
  const outPath = args.out ? writeReport(args.out, report) : null;

  if (report.mode === 'static') {
    printStaticSummary(report, outPath);
  } else if (report.mode === 'browser') {
    printBrowserSummary(report, outPath);
  } else {
    printRepairSummary(report, outPath);
  }

  return report;
}

module.exports = {
  analyzeFile,
  analyzeHtml,
  buildSmokePlan,
  classifyLessonFile,
  findLessonFiles,
  repairLessonFiles,
  repairInlineOnclickQuotes,
  runBrowserAudit,
  runCli,
  runStaticAudit,
};

if (require.main === module) {
  runCli().catch(error => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
