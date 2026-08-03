# 🚀 DevExplorer JS — Day 2 Practice Mini-Project

A responsive, high-performance **GitHub Developer Explorer & Repository Analytics Dashboard** built with modern vanilla JavaScript, ES6+ features, and modern web design principles.

---

## 🎯 Concepts Demonstrated

### 🟨 Day 2 Concepts (Advanced JS & Async)
1. **ES6 Class Architecture**: `GitHubService` handles API communication and data processing.
2. **Private Map Cache (`#cache`)**: Uses ES2022 private class fields (`#cache = new Map()`) to store search results locally in memory. Repeat searches for the same username load instantly without hitting the GitHub network API again.
3. **Parallel Async Fetching (`Promise.all()`)**: Concurrently fetches the developer profile AND public repositories at the same time to eliminate sequential request bottlenecks.
4. **Closures**: `createNotificationManager()` encapsulates banner timer state and DOM feedback methods in a closure scope.
5. **Modern ES6 Collections (`Set`)**: Uses `Set` to filter unique programming languages from the repository list for the dropdown filter.

### 🎨 Day 1 Concepts (Web Design & ES6 Core)
1. **Semantic HTML5 Architecture**: Built with `<header>`, `<main>`, `<section>`, `<article>`, `<aside>`, and `<footer>`.
2. **Glassmorphism & CSS Grid/Flexbox**: Responsive dark mode design with glowing backdrop filters and card grids.
3. **Higher-Order Array Methods**:
   - **`.reduce()`**: Computes total stargazers count and total forks across all repositories.
   - **`.map()`**: Renders repository card elements dynamically into the DOM.
   - **`.filter()`**: Filters repositories by programming language.

---

## 💻 How to Run Locally

Open `index.html` directly in any web browser, or serve it using any local HTTP server (such as VS Code Live Server or `npx serve .`).
