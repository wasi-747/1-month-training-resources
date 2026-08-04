/**
 * DevExplorer Pro v2.0 — GitHub Analytics & LocalStorage Bookmark Manager
 * Built with Vanilla JS ES6+, Event Delegation, Async REST API & LocalStorage
 */

class DevExplorerApp {

  // Private fields for encapsulation
  #searchCache = new Map();
  #STORAGE_KEY = "devexplorer_pro_bookmarks_v2";

  constructor() {
    this.currentDev = null;
    this.currentRepos = [];
    this.filteredRepos = [];
    this.bookmarks = this.#loadBookmarksFromStorage();
    this.activeTab = "explorer";

    this.#initDOMReferences();
    this.#setupEventDelegation();
    this.#updateBookmarkBadgeUI();
  }

  #initDOMReferences() {
    // Search elements
    this.searchForm = document.querySelector("#search-form");
    this.usernameInput = document.querySelector("#username-input");
    this.quickTagsContainer = document.querySelector("#quick-tags-container");

    // Views & Banners
    this.explorerView = document.querySelector("#explorer-view");
    this.bookmarksView = document.querySelector("#bookmarks-view");
    this.welcomeState = document.querySelector("#welcome-state");
    this.feedbackBanner = document.querySelector("#feedback-banner");
    this.feedbackMessage = document.querySelector("#feedback-message");
    this.toastContainer = document.querySelector("#toast-container");

    // Tabs
    this.tabExplorer = document.querySelector("#tab-explorer");
    this.tabBookmarks = document.querySelector("#tab-bookmarks");
    this.bookmarkBadgeCount = document.querySelector("#bookmark-badge-count");

    // Sidebar Profile elements
    this.userAvatar = document.querySelector("#user-avatar");
    this.userName = document.querySelector("#user-name");
    this.userHandle = document.querySelector("#user-handle");
    this.userBio = document.querySelector("#user-bio");
    this.userLocation = document.querySelector("#user-location");
    this.userCompany = document.querySelector("#user-company");
    this.userBlog = document.querySelector("#user-blog");
    this.statRepos = document.querySelector("#stat-repos");
    this.statFollowers = document.querySelector("#stat-followers");
    this.statFollowing = document.querySelector("#stat-following");
    this.cacheBadge = document.querySelector("#cache-badge");
    this.profileGithubLink = document.querySelector("#profile-github-link");
    this.btnToggleBookmark = document.querySelector("#btn-toggle-bookmark");

    // Analytics elements
    this.metricTotalStars = document.querySelector("#metric-total-stars");
    this.metricTotalForks = document.querySelector("#metric-total-forks");
    this.metricTopLang = document.querySelector("#metric-top-lang");

    // Repos & Bookmarks Containers
    this.reposContainer = document.querySelector("#repos-container");
    this.bookmarksGrid = document.querySelector("#bookmarks-grid");
    this.repoFilterInput = document.querySelector("#repo-filter-input");
    this.langFilterSelect = document.querySelector("#lang-filter");
    this.sortSelect = document.querySelector("#sort-select");
    this.btnClearBookmarks = document.querySelector("#btn-clear-bookmarks");
  }

  // Event Delegation Architecture
  #setupEventDelegation() {
    // 1. Form Submission
    this.searchForm?.addEventListener("submit", (e) => {
      e.preventDefault();
      const username = this.usernameInput.value.trim();
      if (username) this.fetchDeveloperProfile(username);
    });

    // 2. Quick Tags Event Delegation
    this.quickTagsContainer?.addEventListener("click", (e) => {
      const tagBtn = e.target.closest(".tag-btn");
      if (tagBtn) {
        const username = tagBtn.dataset.user;
        this.usernameInput.value = username;
        this.fetchDeveloperProfile(username);
      }
    });

    // 3. Tab Switching
    this.tabExplorer?.addEventListener("click", () => this.switchTab("explorer"));
    this.tabBookmarks?.addEventListener("click", () => this.switchTab("bookmarks"));

    // 4. Bookmark Button Click
    this.btnToggleBookmark?.addEventListener("click", () => {
      if (this.currentDev) {
        this.toggleBookmark(this.currentDev);
      }
    });

    // 5. Clear All Bookmarks
    this.btnClearBookmarks?.addEventListener("click", () => {
      if (confirm("Are you sure you want to delete all saved bookmarks?")) {
        this.bookmarks = [];
        this.#saveBookmarksToStorage();
        this.#updateBookmarkBadgeUI();
        this.renderBookmarksView();
        this.showToast("All bookmarks cleared", "info");
      }
    });

    // 6. Repositories Filter & Sort Listeners
    this.repoFilterInput?.addEventListener("input", () => this.applyRepoFilters());
    this.langFilterSelect?.addEventListener("change", () => this.applyRepoFilters());
    this.sortSelect?.addEventListener("change", () => this.applyRepoFilters());

    // 7. Event Delegation on Bookmarks Grid
    this.bookmarksGrid?.addEventListener("click", (e) => {
      const btnInspect = e.target.closest(".btn-inspect-dev");
      const btnRemove = e.target.closest(".btn-remove-bookmark");

      if (btnInspect) {
        const username = btnInspect.dataset.user;
        this.fetchDeveloperProfile(username);
      } else if (btnRemove) {
        const username = btnRemove.dataset.user;
        const devObj = this.bookmarks.find(b => b.login.toLowerCase() === username.toLowerCase());
        if (devObj) this.toggleBookmark(devObj);
      }
    });
  }

  // Async Parallel Fetching with Promise.all()
  async fetchDeveloperProfile(username) {
    this.switchTab("explorer");
    this.hideFeedback();

    const cleanUsername = username.toLowerCase();

    // Check In-Memory Map Cache
    if (this.#searchCache.has(cleanUsername)) {
      const cached = this.#searchCache.get(cleanUsername);
      this.currentDev = cached.user;
      this.currentRepos = cached.repos;
      this.renderProfileCard(cached.user, true);
      this.computeAnalytics(cached.repos);
      this.populateLanguageDropdown(cached.repos);
      this.applyRepoFilters();
      this.showToast(`Loaded ${cached.user.name || cached.user.login} from memory cache ⚡`, "info");
      return;
    }

    try {
      // Parallel API calls using Promise.all()
      const [userRes, reposRes] = await Promise.all([
        fetch(`https://api.github.com/users/${encodeURIComponent(username)}`),
        fetch(`https://api.github.com/users/${encodeURIComponent(username)}/repos?per_page=100&sort=updated`)
      ]);

      if (!userRes.ok) {
        if (userRes.status === 404) {
          this.showFeedback(`GitHub user "${username}" was not found.`);
        } else {
          this.showFeedback(`GitHub API Error (HTTP ${userRes.status}).`);
        }
        return;
      }

      const userData = await userRes.json();
      const reposData = reposRes.ok ? await reposRes.json() : [];

      this.currentDev = userData;
      this.currentRepos = reposData;

      // Save to In-Memory Map Cache
      this.#searchCache.set(cleanUsername, { user: userData, repos: reposData });

      // Render UI
      this.renderProfileCard(userData, false);
      this.computeAnalytics(reposData);
      this.populateLanguageDropdown(reposData);
      this.applyRepoFilters();

    } catch (err) {
      console.error("Fetch error:", err);
      this.showFeedback("Connection failed. Check your internet connection.");
    }
  }

  // Analytics using .reduce()
  computeAnalytics(repos) {
    if (!Array.isArray(repos) || repos.length === 0) {
      this.metricTotalStars.textContent = "0";
      this.metricTotalForks.textContent = "0";
      this.metricTopLang.textContent = "N/A";
      return;
    }

    // Total Stars via .reduce()
    const totalStars = repos.reduce((acc, repo) => acc + (repo.stargazers_count || 0), 0);
    this.metricTotalStars.textContent = totalStars.toLocaleString();

    // Total Forks via .reduce()
    const totalForks = repos.reduce((acc, repo) => acc + (repo.forks_count || 0), 0);
    this.metricTotalForks.textContent = totalForks.toLocaleString();

    // Top Language Frequency Map via .reduce()
    const langCounts = repos.reduce((acc, repo) => {
      if (repo.language) {
        acc[repo.language] = (acc[repo.language] || 0) + 1;
      }
      return acc;
    }, {});

    let topLang = "JavaScript";
    let maxCount = 0;
    for (const [lang, count] of Object.entries(langCounts)) {
      if (count > maxCount) {
        maxCount = count;
        topLang = lang;
      }
    }
    this.metricTopLang.textContent = topLang;
  }

  populateLanguageDropdown(repos) {
    const languages = [...new Set(repos.map(r => r.language).filter(Boolean))].sort();
    this.langFilterSelect.innerHTML = `<option value="all">All Languages</option>` + 
      languages.map(l => `<option value="${l}">${l}</option>`).join("");
  }

  applyRepoFilters() {
    const keyword = this.repoFilterInput?.value.toLowerCase().trim() || "";
    const selectedLang = this.langFilterSelect?.value || "all";
    const sortBy = this.sortSelect?.value || "stars";

    let result = [...this.currentRepos];

    // Keyword Filter
    if (keyword) {
      result = result.filter(r => r.name.toLowerCase().includes(keyword) || (r.description && r.description.toLowerCase().includes(keyword)));
    }

    // Language Filter
    if (selectedLang !== "all") {
      result = result.filter(r => r.language === selectedLang);
    }

    // Sorting
    if (sortBy === "stars") {
      result.sort((a, b) => b.stargazers_count - a.stargazers_count);
    } else if (sortBy === "updated") {
      result.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
    } else if (sortBy === "name") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    this.filteredRepos = result;
    this.renderReposGrid(result);
  }

  renderProfileCard(user, isCached) {
    this.welcomeState.classList.add("hidden");
    this.explorerView.classList.remove("hidden");

    this.userAvatar.src = user.avatar_url;
    this.userName.textContent = user.name || user.login;
    this.userHandle.textContent = `@${user.login}`;
    this.userBio.textContent = user.bio || "No bio provided.";
    this.userLocation.textContent = user.location || "Worldwide";
    this.userCompany.textContent = user.company || "Independent";

    if (user.blog) {
      const formattedBlog = user.blog.startsWith("http") ? user.blog : `https://${user.blog}`;
      this.userBlog.href = formattedBlog;
      this.userBlog.textContent = user.blog.replace(/^https?:\/\//, "");
      this.userBlog.parentElement.classList.remove("hidden");
    } else {
      this.userBlog.parentElement.classList.add("hidden");
    }

    this.statRepos.textContent = user.public_repos || 0;
    this.statFollowers.textContent = user.followers || 0;
    this.statFollowing.textContent = user.following || 0;

    this.profileGithubLink.href = user.html_url;

    if (isCached) {
      this.cacheBadge.classList.remove("hidden");
    } else {
      this.cacheBadge.classList.add("hidden");
    }

    this.updateBookmarkButtonUI();
  }

  renderReposGrid(repos) {
    if (!repos || repos.length === 0) {
      this.reposContainer.innerHTML = `
        <div class="glass-card" style="grid-column: 1/-1; padding: 2rem; text-align: center; color: var(--text-muted);">
          <i class="fa-solid fa-folder-open" style="font-size: 2rem; margin-bottom: 0.5rem;"></i>
          <p>No matching repositories found.</p>
        </div>
      `;
      return;
    }

    this.reposContainer.innerHTML = repos.map(r => `
      <article class="repo-card">
        <div class="repo-title">
          <a href="${r.html_url}" target="_blank" class="repo-name">${r.name}</a>
          <span class="badge-pro" style="font-size: 0.65rem;">${r.visibility || 'public'}</span>
        </div>
        <p class="repo-desc">${this.escapeHTML(r.description || "No description available.")}</p>
        <div class="repo-footer">
          <span><span class="lang-dot"></span> ${r.language || 'Plain'}</span>
          <span><i class="fa-solid fa-star text-amber"></i> ${r.stargazers_count}</span>
          <span><i class="fa-solid fa-code-fork text-blue"></i> ${r.forks_count}</span>
        </div>
      </article>
    `).join("");
  }

  // LocalStorage Bookmarking Logic
  toggleBookmark(user) {
    const existingIdx = this.bookmarks.findIndex(b => b.login.toLowerCase() === user.login.toLowerCase());

    if (existingIdx > -1) {
      // Remove
      this.bookmarks.splice(existingIdx, 1);
      this.showToast(`Removed @${user.login} from bookmarks`, "info");
    } else {
      // Add
      this.bookmarks.push({
        login: user.login,
        name: user.name || user.login,
        avatar_url: user.avatar_url,
        bio: user.bio || "",
        public_repos: user.public_repos || 0,
        followers: user.followers || 0,
        html_url: user.html_url
      });
      this.showToast(`Saved @${user.login} to bookmarks ⭐`, "success");
    }

    this.#saveBookmarksToStorage();
    this.#updateBookmarkBadgeUI();
    this.updateBookmarkButtonUI();

    if (this.activeTab === "bookmarks") {
      this.renderBookmarksView();
    }
  }

  updateBookmarkButtonUI() {
    if (!this.currentDev || !this.btnToggleBookmark) return;

    const isSaved = this.bookmarks.some(b => b.login.toLowerCase() === this.currentDev.login.toLowerCase());
    const icon = this.btnToggleBookmark.querySelector("i");
    const label = this.btnToggleBookmark.querySelector("span");

    if (isSaved) {
      this.btnToggleBookmark.classList.add("bookmarked");
      if (icon) icon.className = "fa-solid fa-star";
      if (label) label.textContent = "Bookmarked ⭐";
    } else {
      this.btnToggleBookmark.classList.remove("bookmarked");
      if (icon) icon.className = "fa-regular fa-star";
      if (label) label.textContent = "Save to Bookmarks";
    }
  }

  renderBookmarksView() {
    if (this.bookmarks.length === 0) {
      this.bookmarksGrid.innerHTML = `
        <div class="glass-card" style="grid-column: 1 / -1; padding: 3rem; text-align: center;">
          <i class="fa-solid fa-bookmark" style="font-size: 3rem; color: var(--text-muted); margin-bottom: 1rem;"></i>
          <h3>No Bookmarks Saved Yet</h3>
          <p class="subtitle">Search developers in the Explorer tab and click "Save to Bookmarks".</p>
        </div>
      `;
      return;
    }

    this.bookmarksGrid.innerHTML = this.bookmarks.map(b => `
      <article class="bookmark-card">
        <img src="${b.avatar_url}" alt="${b.login}" class="bookmark-avatar">
        <div class="bookmark-info">
          <h3 class="user-name" style="font-size: 1.1rem;">${this.escapeHTML(b.name)}</h3>
          <p class="user-handle">@${b.login}</p>
          <p class="user-bio" style="font-size: 0.8rem; margin: 0.4rem 0;">${b.public_repos} Repos • ${b.followers} Followers</p>
          <div style="display: flex; gap: 0.5rem; margin-top: 0.5rem;">
            <button class="btn btn-secondary btn-inspect-dev" data-user="${b.login}" style="padding: 0.3rem 0.6rem; font-size: 0.75rem;">
              <i class="fa-solid fa-magnifying-glass"></i> Inspect
            </button>
            <button class="btn btn-outline-danger btn-remove-bookmark" data-user="${b.login}" style="padding: 0.3rem 0.6rem; font-size: 0.75rem;">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </div>
      </article>
    `).join("");
  }

  switchTab(tabName) {
    this.activeTab = tabName;
    if (tabName === "explorer") {
      this.tabExplorer.classList.add("active");
      this.tabBookmarks.classList.remove("active");
      this.bookmarksView.classList.add("hidden");
      if (this.currentDev) {
        this.explorerView.classList.remove("hidden");
        this.welcomeState.classList.add("hidden");
      } else {
        this.explorerView.classList.add("hidden");
        this.welcomeState.classList.remove("hidden");
      }
    } else if (tabName === "bookmarks") {
      this.tabBookmarks.classList.add("active");
      this.tabExplorer.classList.remove("active");
      this.explorerView.classList.add("hidden");
      this.welcomeState.classList.add("hidden");
      this.bookmarksView.classList.remove("hidden");
      this.renderBookmarksView();
    }
  }

  showFeedback(msg) {
    this.feedbackMessage.textContent = msg;
    this.feedbackBanner.classList.remove("hidden");
  }

  hideFeedback() {
    this.feedbackBanner.classList.add("hidden");
  }

  showToast(msg, type = "info") {
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.innerHTML = `<i class="fa-solid ${type === 'success' ? 'fa-circle-check text-green' : 'fa-circle-info text-blue'}"></i> ${msg}`;
    this.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "0";
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  #loadBookmarksFromStorage() {
    try {
      const data = localStorage.getItem(this.#STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error("LocalStorage error:", e);
      return [];
    }
  }

  #saveBookmarksToStorage() {
    try {
      localStorage.setItem(this.#STORAGE_KEY, JSON.stringify(this.bookmarks));
    } catch (e) {
      console.error("LocalStorage save error:", e);
    }
  }

  #updateBookmarkBadgeUI() {
    if (this.bookmarkBadgeCount) {
      this.bookmarkBadgeCount.textContent = this.bookmarks.length;
    }
  }

  escapeHTML(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
}

// Instantiate application on DOM ready
document.addEventListener("DOMContentLoaded", () => {
  window.app = new DevExplorerApp();
});
