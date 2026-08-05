# 📖 Day 4: Node.js Core Basics, File System (fs) & Asynchronous Server-Side Execution

**Date:** Wednesday (Week 1, Day 4)  
**Curriculum Track:** 1-Month Web Development Training  
**Author:** Intern Developer  

---

## 📚 Table of Contents
1. [Node.js Runtime Architecture](#1-nodejs-runtime-architecture)
2. [Global Objects & Environment](#2-global-objects--environment)
3. [File System (fs) Module: Async & Sync](#3-file-system-fs-module-async--sync)
4. [Working with JSON & Stream Buffers](#4-working-with-json--stream-buffers)
5. [Basic HTTP Server Creation](#5-basic-http-server-creation)

---

## 1. Node.js Runtime Architecture

Node.js is an open-source, cross-platform JavaScript runtime built on Chrome's V8 engine that executes JavaScript code outside the browser.

* **Single-Threaded Event Loop**: Handles concurrent I/O operations non-blockingly via `libuv`.
* **Non-Blocking I/O**: Heavy tasks (file reading, network queries) are delegated to worker threads, returning via callbacks/Promises.

---

## 2. Global Objects & Environment

Unlike browser JavaScript which uses `window`, Node.js uses `global`:

* **`process`**: Provides information about current process execution.
  * `process.argv`: Command-line arguments.
  * `process.env`: Environment variables.
* **`__dirname`**: Absolute path of the directory containing the currently executing file.
* **`__filename`**: Absolute path of the currently executing file.

---

## 3. File System (fs) Module: Async & Sync

The native `fs` module provides methods for reading, writing, updating, and deleting files.

### A. Modern Promise-Based Async (`fs/promises`) — Recommended
```javascript
const fs = require('fs/promises');

async function manageFiles() {
  try {
    // 1. Write file
    await fs.writeFile('log.txt', 'Day 4 Node.js File System Log\n');
    
    // 2. Append data
    await fs.appendFile('log.txt', 'Appended log entry at ' + new Date().toISOString());

    // 3. Read file
    const content = await fs.readFile('log.txt', 'utf-8');
    console.log('File Content:\n', content);
  } catch (err) {
    console.error('File Error:', err);
  }
}
```

---

## 4. Working with JSON & Stream Buffers

When reading files without specifying encoding (`utf-8`), Node returns a raw `Buffer` of binary bytes.

```javascript
const fs = require('fs/promises');

async function readJSONData() {
  const rawData = await fs.readFile('data.json', 'utf-8');
  const parsedData = JSON.parse(rawData);
  console.log('Parsed Object:', parsedData);
}
```

---

## 5. Basic HTTP Server Creation

Node.js includes a built-in `http` module to handle web requests:

```javascript
const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ message: "Hello from Node.js Server!" }));
});

server.listen(3000, () => {
  console.log('Node.js HTTP Server running on http://localhost:3000');
});
```
