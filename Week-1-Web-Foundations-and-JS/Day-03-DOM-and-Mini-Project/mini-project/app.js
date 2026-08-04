/**
 * GitHub Explorer & Bookmark Manager (Vanilla JS + Async/Await + LocalStorage)
 */

document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements
  const searchForm = document.querySelector("#search-form");
  const searchInput = document.querySelector("#search-input");
  const tabSearch = document.querySelector("#tab-search");
  const tabBookmarks = document.querySelector("#tab-bookmarks");
  const bookmarkCountBadge = document.querySelector("#bookmark-count");

  // State Containers
  const loadingState = document.querySelector("#loading-state");
  const errorState = document.querySelector("#error-state");
  const welcomeState = document.querySelector("#welcome-state");
  const errorTitle = document.querySelector("#error-title");
  const errorMessage = document.querySelector("#error-message");
  const resultsContainer = document.querySelector("#results-container");
  const bookmarksContainer = document.querySelector("#bookmarks-container");

  // State Variables
  const BOOKMARKS_STORAGE_KEY = "github_explorer_bookmarks";
  let activeTab = "search"; // 'search' or 'bookmarks'
  let currentSearchResult = null;
  let bookmarkedUsers = loadBookmarksFromStorage();

  // Initialize App
  updateBookmarkCountUI();
  setupEventListeners();

  // ==========================================
  // Event Listeners Setup
  // ==========================================
  function setupEventListeners() {
    // Form Submit
    searchForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const username = searchInput.value.trim();
      if (username) {
        fetchGitHubUser(username);
      }
    });

    // Tab Navigation
    tabSearch.addEventListener("click", () => switchTab("search"));
    tabBookmarks.addEventListener("click", () => switchTab("bookmarks"));

    // Quick Suggestion Chips (Event Delegation)
    document.addEventListener("click", (e) => {
      const chip = e.target.closest(".suggestion-chip");
      if (chip) {
        const username = chip.dataset.user;
        searchInput.value = username;
        fetchGitHubUser(username);
      }
    });

    // Bookmark Toggling via Event Delegation
    document.addEventListener("click", (e) => {
      const bookmarkBtn = e.target.closest(".bookmark-btn");
      if (bookmarkBtn) {
        const username = bookmarkBtn.dataset.username;
        toggleBookmarkUser(username);
      }
    });
  }

  // ==========================================
  // API Operations (Async/Await)
  // ==========================================
  async function fetchGitHubUser(username) {
    switchTab("search");
    showState("loading");

    try {
      const response = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}`);

      if (!response.ok) {
        if (response.status === 404) {
          showError("User Not Found", `No GitHub user found matching "${username}".`);
        } else {
          showError("API Error", `GitHub API returned status code ${response.status}.`);
        }
        return;
      }

      const userData = await response.json();
      currentSearchResult = userData;
      renderSearchResultCard(userData);
      showState("results");
    } catch (error) {
      console.error("Fetch Error:", error);
      showError("Connection Error", "Failed to connect to GitHub API. Please check your internet connection.");
    }
  }

  // ==========================================
  // UI Rendering & State Control
  // ==========================================
  function showState(stateName) {
    loadingState.classList.add("hidden");
    errorState.classList.add("hidden");
    welcomeState.classList.add("hidden");
    resultsContainer.classList.add("hidden");
    bookmarksContainer.classList.add("hidden");

    if (stateName === "loading") loadingState.classList.remove("hidden");
    if (stateName === "error") errorState.classList.remove("hidden");
    if (stateName === "welcome") welcomeState.classList.remove("hidden");
    if (stateName === "results") resultsContainer.classList.remove("hidden");
    if (stateName === "bookmarks") bookmarksContainer.classList.remove("hidden");
  }

  function showError(title, message) {
    errorTitle.textContent = title;
    errorMessage.textContent = message;
    showState("error");
  }

  function switchTab(tabName) {
    activeTab = tabName;
    if (tabName === "search") {
      tabSearch.classList.add("active");
      tabBookmarks.classList.remove("active");

      if (currentSearchResult) {
        showState("results");
      } else {
        showState("welcome");
      }
    } else if (tabName === "bookmarks") {
      tabBookmarks.classList.add("active");
      tabSearch.classList.remove("active");
      renderBookmarksGrid();
      showState("bookmarks");
    }
  }

  function createCardHTML(user) {
    const isBookmarked = bookmarkedUsers.some(b => b.login.toLowerCase() === user.login.toLowerCase());

    return `
      <div class="user-card" data-username="${user.login}">
        <div class="card-header">
          <img src="${user.avatar_url}" alt="${user.login}" class="avatar" />
          <div class="user-info">
            <h3 class="user-name">${escapeHTML(user.name || user.login)}</h3>
            <p class="user-login">@${user.login}</p>
          </div>
          <button 
            class="bookmark-btn ${isBookmarked ? 'bookmarked' : ''}" 
            data-username="${user.login}"
            title="${isBookmarked ? 'Remove Bookmark' : 'Add Bookmark'}"
          >
            ★
          </button>
        </div>

        <p class="user-bio">${escapeHTML(user.bio || "No bio provided.")}</p>

        <div class="stats-row">
          <div class="stat-item">
            <div class="stat-num">${user.public_repos || 0}</div>
            <div class="stat-label">Repositories</div>
          </div>
          <div class="stat-item">
            <div class="stat-num">${user.followers || 0}</div>
            <div class="stat-label">Followers</div>
          </div>
          <div class="stat-item">
            <div class="stat-num">${user.following || 0}</div>
            <div class="stat-label">Following</div>
          </div>
        </div>

        <a href="${user.html_url}" target="_blank" rel="noopener noreferrer" class="btn-github-link">
          View Profile on GitHub ↗
        </a>
      </div>
    `;
  }

  function renderSearchResultCard(user) {
    resultsContainer.innerHTML = createCardHTML(user);
  }

  function renderBookmarksGrid() {
    if (bookmarkedUsers.length === 0) {
      bookmarksContainer.innerHTML = `
        <div class="state-container" style="grid-column: 1 / -1;">
          <div class="welcome-icon">⭐</div>
          <h3>No Bookmarks Saved Yet</h3>
          <p>Search for developers and click the star icon to save them here for quick access.</p>
        </div>
      `;
      return;
    }

    bookmarksContainer.innerHTML = bookmarkedUsers.map(user => createCardHTML(user)).join("");
  }

  // ==========================================
  // Bookmark LocalStorage Operations
  // ==========================================
  function toggleBookmarkUser(username) {
    const existingIndex = bookmarkedUsers.findIndex(b => b.login.toLowerCase() === username.toLowerCase());

    if (existingIndex > -1) {
      // Remove bookmark
      bookmarkedUsers.splice(existingIndex, 1);
    } else {
      // Add bookmark
      let userToBookmark = currentSearchResult;
      if (!userToBookmark || userToBookmark.login.toLowerCase() !== username.toLowerCase()) {
        userToBookmark = { login: username, avatar_url: `https://github.com/${username}.png`, name: username, bio: "Bookmarked Profile", public_repos: 0, followers: 0, following: 0, html_url: `https://github.com/${username}` };
      }
      bookmarkedUsers.push(userToBookmark);
    }

    saveBookmarksToStorage(bookmarkedUsers);
    updateBookmarkCountUI();

    // Re-render UI
    if (currentSearchResult) {
      renderSearchResultCard(currentSearchResult);
    }
    if (activeTab === "bookmarks") {
      renderBookmarksGrid();
    }
  }

  function updateBookmarkCountUI() {
    bookmarkCountBadge.textContent = bookmarkedUsers.length;
  }

  function loadBookmarksFromStorage() {
    try {
      const data = localStorage.getItem(BOOKMARKS_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error("LocalStorage load error:", e);
      return [];
    }
  }

  function saveBookmarksToStorage(bookmarks) {
    try {
      localStorage.setItem(BOOKMARKS_STORAGE_KEY, JSON.stringify(bookmarks));
    } catch (e) {
      console.error("LocalStorage save error:", e);
    }
  }

  function escapeHTML(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
});
