# 📖 Day 3: DOM Manipulation, Event Architecture & Responsive Async Mini-Project

**Date:** Tuesday (Week 1, Day 3)  
**Curriculum Track:** 1-Month Web Development Training  
**Author:** Intern Developer  

---

## 📚 Table of Contents
1. [DOM Selection & Traversal](#1-dom-selection--traversal)
2. [Dynamic DOM Mutation](#2-dynamic-dom-mutation)
3. [Event Architecture & Delegation](#3-event-architecture--delegation)
4. [Async UI State Management](#4-async-ui-state-management)
5. [Browser LocalStorage API](#5-browser-localstorage-api)
6. [Mini-Project Architecture](#6-mini-project-architecture)

---

## 1. DOM Selection & Traversal

The Document Object Model (DOM) is the browser's tree representation of HTML.

* **Selecting Elements**:
  * `document.querySelector(".class-name")`: Returns the first matching element.
  * `document.querySelectorAll("[data-target]")`: Returns a static `NodeList` of all matching elements.
* **Traversing the Tree**:
  * `element.parentElement`: Navigates up to the parent element.
  * `element.children` / `element.firstElementChild`: Navigates down to child elements.
  * `element.closest(".card")`: Searches up the DOM tree for the nearest ancestor matching the selector (crucial for event delegation).

---

## 2. Dynamic DOM Mutation

Instead of constantly re-rendering whole containers with `innerHTML`, modern vanilla JS uses targeted mutation:

* **Creating & Inserting**:
  ```javascript
  const card = document.createElement("div");
  card.className = "card bg-surface p-4 rounded-lg";
  card.innerHTML = `<h3 class="title">Card Title</h3>`;
  container.appendChild(card);
  ```
* **Performance Alternative (`insertAdjacentHTML`)**:
  ```javascript
  container.insertAdjacentHTML("beforeend", `<div class="card">...</div>`);
  ```
* **Manipulating Classes & Datasets**:
  ```javascript
  element.classList.toggle("active");
  element.dataset.userId = "12345"; // Reads/writes data-user-id attribute
  ```

---

## 3. Event Architecture & Delegation

### Event Delegation Pattern
Rather than attaching event listeners to hundreds of individual list items or buttons, attach **one single event listener** to a common parent container and inspect `event.target` using `.closest()`:

```javascript
const userList = document.querySelector("#user-list");

userList.addEventListener("click", (event) => {
  const bookmarkBtn = event.target.closest(".bookmark-btn");
  if (bookmarkBtn) {
    const userId = bookmarkBtn.dataset.id;
    toggleBookmark(userId);
  }
});
```

### Event Control Methods
* `event.preventDefault()`: Prevents browser defaults (e.g. form submission page refresh).
* `event.stopPropagation()`: Stops event bubbling up the DOM parent tree.

---

## 4. Async UI State Management

When fetching remote server data via `async/await`, the user interface must communicate 3 distinct states:

1. **Loading State**: Show a loading spinner / skeleton loader while `fetch` is pending.
2. **Success State**: Render the dynamic HTML cards/table with received data.
3. **Empty / Error State**: Display a clear user-friendly error message if the query fails or returns no results.

---

## 5. Browser LocalStorage API

Persisting client-side data across page reloads:

```javascript
// Saving data (Objects must be JSON stringified)
const favorites = ["wasi-747", "octocat"];
localStorage.setItem("github_bookmarks", JSON.stringify(favorites));

// Reading data
const saved = JSON.parse(localStorage.getItem("github_bookmarks")) || [];

// Removing item
localStorage.removeItem("github_bookmarks");
```

---

## 6. Mini-Project Architecture

The **GitHub Explorer & Bookmark Manager** (`mini-project/`) demonstrates:
- **Modular JavaScript (`app.js`)**: Clean separation of state, API calls, event handlers, and DOM rendering functions.
- **Modern Responsive CSS (`styles.css`)**: Glassmorphism aesthetic, dark mode tokens, CSS Grid cards, loading keyframes.
- **HTML5 (`index.html`)**: Semantic markup, search bar, filter tabs, bookmark section.
