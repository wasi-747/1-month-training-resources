/**
 * Day 4: Node.js Core Basics & File System (fs) Practice Snippets
 */

const fs = require('fs/promises');
const path = require('path');

// 1. Environment & Global Identifiers
console.log("--- 1. Node.js Environment & Globals ---");
console.log("Current Directory (__dirname):", __dirname);
console.log("Node Executable Path (process.execPath):", process.execPath);

// 2. Asynchronous File Operations Helper
async function runFileSystemDemo() {
  console.log("\n--- 2. File System (fs/promises) Operations ---");
  const logFilePath = path.join(__dirname, 'sample-log.txt');

  try {
    // Write new file
    await fs.writeFile(logFilePath, "Node.js File System Log Entry\nCreated at: " + new Date().toISOString() + "\n");
    console.log("✅ File written successfully to:", logFilePath);

    // Append entry
    await fs.appendFile(logFilePath, "Status: Training Day 4 Node.js Execution Active.\n");
    console.log("✅ Appended log entry.");

    // Read file
    const content = await fs.readFile(logFilePath, 'utf-8');
    console.log("📄 Read Log Content:\n", content);

    // Cleanup demo file
    await fs.unlink(logFilePath);
    console.log("🧹 Cleaned up sample log file.");

  } catch (error) {
    console.error("❌ File System Error:", error);
  }
}

// 3. JSON Data Persistence Helper
async function runJSONDataDemo() {
  console.log("\n--- 3. JSON Data Persistence ---");
  const jsonPath = path.join(__dirname, 'test-data.json');
  const sampleData = {
    intern: "Wasi",
    track: "1-Month Web Development",
    currentDay: 4,
    skills: ["HTML", "CSS", "JavaScript", "Node.js"]
  };

  try {
    await fs.writeFile(jsonPath, JSON.stringify(sampleData, null, 2));
    const raw = await fs.readFile(jsonPath, 'utf-8');
    const parsed = JSON.parse(raw);
    console.log("✅ Parsed JSON Data:", parsed);

    await fs.unlink(jsonPath);
    console.log("🧹 Cleaned up test JSON file.");
  } catch (err) {
    console.error("❌ JSON Error:", err);
  }
}

// Execute Snippets
(async () => {
  await runFileSystemDemo();
  await runJSONDataDemo();
})();
