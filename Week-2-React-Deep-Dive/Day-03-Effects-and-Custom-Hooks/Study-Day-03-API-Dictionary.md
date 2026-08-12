# 📖 Study Reference: JS & React API Return Values & Code Mapping

**Curriculum Track:** 1-Month Web Development Training (Week 2 Study Reference)  
**Goal:** Understanding the exact technical Return Values, Types, and Architectural Reasons for JavaScript & React APIs used in Day 2 & Day 3.

---

## 🎮 Part 1: Day 02 Tic-Tac-Toe API Mapping

### 1. `Array(9).fill(null)`
* **Identity:** Global Array constructor combined with the prototype `.fill()` modifier method.
* **Return Value & Type:** A **New Array of length 9**, where each index contains `null` (e.g. `[null, null, ..., null]`).
* **Code Reference:** [`Day-02-React-State-and-Tic-Tac-Toe/practice-snippets.jsx: Line 156`](file:///d:/Study/Projects/1%20month%20training%20resources/Week-2-React-Deep-Dive/Day-02-React-State-and-Tic-Tac-Toe/practice-snippets.jsx#L156)
* **Architectural Reason:** Initializes the 3x3 Tic-Tac-Toe Board layout state where all 9 squares are empty.

### 2. `array.slice(start, end)`
* **Identity:** Array prototype method for extracting portions of an array.
* **Return Value & Type:** A **New Array** containing copy elements from index `start` up to (but not including) `end`.
* **Code Reference:** [`Day-02-React-State-and-Tic-Tac-Toe/practice-snippets.jsx: Line 166`](file:///d:/Study/Projects/1%20month%20training%20resources/Week-2-React-Deep-Dive/Day-02-React-State-and-Tic-Tac-Toe/practice-snippets.jsx#L166)
* **Architectural Reason:** Used in Time-Travel history management. If a player jumps back in time to move `n` and makes a new move, `.slice(0, currentMove + 1)` keeps history up to step `n` and discards all invalid future branch states.

### 3. `array.every(callback)`
* **Identity:** Array prototype logical validator method.
* **Return Value & Type:** A **Boolean (`true` or `false`)**.
* **Code Reference:** [`Day-02-React-State-and-Tic-Tac-Toe/practice-snippets.jsx: Line 118`](file:///d:/Study/Projects/1%20month%20training%20resources/Week-2-React-Deep-Dive/Day-02-React-State-and-Tic-Tac-Toe/practice-snippets.jsx#L118)
* **Architectural Reason:** Evaluates `squares.every(Boolean)` to detect if all 9 squares are filled with truthy values ('X' or 'O'). If all are filled and there is no winner, it declares a Draw state.

### 4. `array.map(callback)`
* **Identity:** Array prototype transformation method.
* **Return Value & Type:** A **New Array** of equal length containing items transformed by the callback function.
* **Code Reference:**
  1. [`Day-02-React-State-and-Tic-Tac-Toe/practice-snippets.jsx: Line 143`](file:///d:/Study/Projects/1%20month%20training%20resources/Week-2-React-Deep-Dive/Day-02-React-State-and-Tic-Tac-Toe/practice-snippets.jsx#L143)
  2. [`Day-02-React-State-and-Tic-Tac-Toe/practice-snippets.jsx: Line 186`](file:///d:/Study/Projects/1%20month%20training%20resources/Week-2-React-Deep-Dive/Day-02-React-State-and-Tic-Tac-Toe/practice-snippets.jsx#L186)
* **Architectural Reason:** Maps data arrays into JSX virtual DOM elements dynamically to render Board Squares and History Lists.

---

## 🔄 Part 2: Day 03 Effects & Custom Hooks API Mapping

### 1. `useEffect(effectCallback, dependencyArray)`
* **Identity:** Native React Hook for coordinating side effects.
* **Return Value & Type:** **`undefined`** (Nothing).
* **Code Reference:** [`Day-03-Effects-and-Custom-Hooks/practice-snippets.jsx: Line 21`](file:///d:/Study/Projects/1%20month%20training%20resources/Week-2-React-Deep-Dive/Day-03-Effects-and-Custom-Hooks/practice-snippets.jsx#L21)
* **Architectural Reason:** Synchronizes the component state with external systems (timers, Web APIs, servers) after layout paint cycles.

### 2. `setInterval(callback, delay)`
* **Identity:** Global Web API timing daemon.
* **Return Value & Type:** A positive **Integer (Interval ID)**.
* **Code Reference:** [`Day-03-Effects-and-Custom-Hooks/practice-snippets.jsx: Line 26`](file:///d:/Study/Projects/1%20month%20training%20resources/Week-2-React-Deep-Dive/Day-03-Effects-and-Custom-Hooks/practice-snippets.jsx#L26)
* **Architectural Reason:** Automatically updates timer state by scheduling execution cycles every 1000ms.

### 3. `clearInterval(intervalId)`
* **Identity:** Global Web API timer clearing method.
* **Return Value & Type:** **`undefined`** (Nothing).
* **Code Reference:** [`Day-03-Effects-and-Custom-Hooks/practice-snippets.jsx: Line 31`](file:///d:/Study/Projects/1%20month%20training%20resources/Week-2-React-Deep-Dive/Day-03-Effects-and-Custom-Hooks/practice-snippets.jsx#L31)
* **Architectural Reason:** Executed during the `useEffect` cleanup lifecycle. Cancels scheduled interval timers to prevent background memory leak processing.

### 4. `fetch(url)`
* **Identity:** Browser Promise-based HTTP request Web API.
* **Return Value & Type:** A **`Promise`** that resolves to an HTTP **`Response`** metadata object.
* **Code Reference:** [`Day-03-Effects-and-Custom-Hooks/practice-snippets.jsx: Line 74`](file:///d:/Study/Projects/1%20month%20training%20resources/Week-2-React-Deep-Dive/Day-03-Effects-and-Custom-Hooks/practice-snippets.jsx#L74)
* **Architectural Reason:** Initiates non-blocking network resource fetching asynchronously.

### 5. `response.json()`
* **Identity:** HTTP Response object stream decoder prototype method.
* **Return Value & Type:** A **`Promise`** that resolves to parsed **JavaScript objects or arrays**.
* **Code Reference:** [`Day-03-Effects-and-Custom-Hooks/practice-snippets.jsx: Line 76`](file:///d:/Study/Projects/1%20month%20training%20resources/Week-2-React-Deep-Dive/Day-03-Effects-and-Custom-Hooks/practice-snippets.jsx#L76)
* **Architectural Reason:** Decodes and parses raw incoming HTTP payload bodies asynchronously.

### 6. Functional State Updater (`setScores(prev => ({ ...prev, xWins: prev.xWins + 1 }))`)
* **Identity:** State updater callback pattern.
* **Return Value & Type:** **`undefined`** (Nothing). The callback itself returns a new **State Object**.
* **Code Reference:** [`Day-03-Effects-and-Custom-Hooks/practice-snippets.jsx: Line 212`](file:///d:/Study/Projects/1%20month%20training/resources/Week-2-React-Deep-Dive/Day-03-Effects-and-Custom-Hooks/practice-snippets.jsx#L212)
* **Architectural Reason:** Safely reads the most recent, up-to-date state values (`prev`) directly from the React queue. This prevents race conditions and stale closure issues when updating nested state object counts.

