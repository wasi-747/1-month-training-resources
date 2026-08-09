/**
 * ==============================================================================================
 * 🚀 DevExplorer PRO v2.0 — GitHub Analytics & LocalStorage Bookmark Manager
 * ==============================================================================================
 * 📚 Week 1 Comprehensive Master Mini-Project
 * 🛠️ Concepts Used:
 *    1. ES6+ Classes & Private Fields (#)
 *    2. DOM Selection & Manipulation
 *    3. Event Delegation Pattern (1 Single Listener via event.target.closest)
 *    4. Asynchronous JavaScript (async / await, Promise.all Parallel Fetching)
 *    5. Higher-Order Array Methods (.reduce, .map, .filter, .find, .some)
 *    6. Browser LocalStorage API (JSON.stringify & JSON.parse)
 *    7. Immutability with Spread Operator (...)
 *    8. Optional Chaining (?.) & Fallback Operators
 * ==============================================================================================
 */

// 🏛️ ES6 Class: Pura application-er state ebong logic ke encapsulation korar jonno class use kora hoyeche
class DevExplorerApp {

  // 🔒 1. ES6 Private Class Fields (#):
  // '#' dewa mane ei variable gulo class-er baire theke keu direct change korte parbe na (Private Memory)
  #searchCache = new Map();                    // 🧠 In-Memory Map Cache: Eki user abar search korle API call chara instant load korar jonno
  #STORAGE_KEY = "devexplorer_pro_bookmarks_v2"; // 🔑 LocalStorage Key: Browser memory-te bookmark save korar unique identifier

  // 🏁 2. Constructor: Application start hole automatic shobar age run hoy
  constructor() {
    this.currentDev = null;                       // Current searched developer profile hold kore
    this.currentRepos = [];                       // Current developer-er shob repository list
    this.filteredRepos = [];                      // Filter/Search kora repository list
    this.bookmarks = this.#loadBookmarksFromStorage(); // LocalStorage theke ager saved bookmarks load kore
    this.activeTab = "explorer";                  // Active tab ("explorer" ba "bookmarks")

    // Component Methods Init:
    this.#initDOMReferences();     // Shob HTML elements ke JavaScript-e dhora
    this.#setupEventDelegation();  // Event Listeners setup kora (Event Delegation Pattern)
    this.#updateBookmarkBadgeUI(); // Navbar-er bookmark count badge update kora
  }

  // 🌳 3. DOM Selection: document.querySelector diye HTML elements ke dhora hoyeche
  #initDOMReferences() {
    // 🔍 Search Section Elements:
    this.searchForm = document.querySelector("#search-form");                 // Search form element
    this.usernameInput = document.querySelector("#username-input");           // Username input field
    this.quickTagsContainer = document.querySelector("#quick-tags-container"); // Quick developer tag buttons container

    // 👁️ Views & Banners:
    this.explorerView = document.querySelector("#explorer-view");             // Main Explorer Dashboard View
    this.bookmarksView = document.querySelector("#bookmarks-view");           // Saved Bookmarks View
    this.welcomeState = document.querySelector("#welcome-state");             // Initial Welcome empty screen
    this.feedbackBanner = document.querySelector("#feedback-banner");         // Error / Alert banner (404 / connection error)
    this.feedbackMessage = document.querySelector("#feedback-message");       // Error text message element
    this.toastContainer = document.querySelector("#toast-container");         // Floating Toast notification container

    // 📑 Navigation Tabs:
    this.tabExplorer = document.querySelector("#tab-explorer");               // Explorer Tab Button
    this.tabBookmarks = document.querySelector("#tab-bookmarks");             // Bookmarks Tab Button
    this.bookmarkBadgeCount = document.querySelector("#bookmark-badge-count"); // Number badge showing total saved bookmarks

    // 👤 Sidebar Profile Elements:
    this.userAvatar = document.querySelector("#user-avatar");                 // Profile picture <img>
    this.userName = document.querySelector("#user-name");                     // Developer Full Name <h2>
    this.userHandle = document.querySelector("#user-handle");                 // @username handle <p>
    this.userBio = document.querySelector("#user-bio");                       // Bio description <p>
    this.userLocation = document.querySelector("#user-location");             // Location tag
    this.userCompany = document.querySelector("#user-company");               // Company tag
    this.userBlog = document.querySelector("#user-blog");                     // Website / Portfolio link
    this.statRepos = document.querySelector("#stat-repos");                   // Public Repos count
    this.statFollowers = document.querySelector("#stat-followers");           // Followers count
    this.statFollowing = document.querySelector("#stat-following");           // Following count
    this.cacheBadge = document.querySelector("#cache-badge");                 // "Cached" green indicator badge
    this.profileGithubLink = document.querySelector("#profile-github-link");   // "View GitHub Profile" button link
    this.btnToggleBookmark = document.querySelector("#btn-toggle-bookmark");   // "Save to Bookmarks" action button

    // 📊 Analytics Cards Elements:
    this.metricTotalStars = document.querySelector("#metric-total-stars");   // Total Stars counter (.reduce calculation)
    this.metricTotalForks = document.querySelector("#metric-total-forks");   // Total Forks counter (.reduce calculation)
    this.metricTopLang = document.querySelector("#metric-top-lang");         // Dominant programming language

    // 📦 Repositories & Filter Elements:
    this.reposContainer = document.querySelector("#repos-container");         // Repository cards container grid
    this.bookmarksGrid = document.querySelector("#bookmarks-grid");           // Bookmarked developers grid
    this.repoFilterInput = document.querySelector("#repo-filter-input");     // Live repo keyword search input
    this.langFilterSelect = document.querySelector("#lang-filter");           // Language dropdown filter (<select>)
    this.sortSelect = document.querySelector("#sort-select");                 // Sort dropdown (Stars, Name, Updated)
    this.btnClearBookmarks = document.querySelector("#btn-clear-bookmarks"); // "Clear All Bookmarks" red button
  }

  // 🎯 4. Event Delegation & Event Handling Setup
  #setupEventDelegation() {
    
    // 📝 [A] Search Form Submit Event:
    // Optional Chaining (?.) use kora hoyeche jate element na thakle app crash na kore
    this.searchForm?.addEventListener("submit", (e) => {
      e.preventDefault(); // 🛑 event.preventDefault(): Form submit hole browser-er default page reload bondho kore!
      const username = this.usernameInput.value.trim(); // .trim() die faka space remove kora holo
      if (username) this.fetchDeveloperProfile(username); // API fetch call kora holo
    });

    // 🌊 [B] Quick Tags Event Delegation (Single Listener on Parent):
    // Shob tag button-e alada alada listener na boshiye, Parent '#quick-tags-container'-e 1 ta listener boshano hoyeche
    this.quickTagsContainer?.addEventListener("click", (e) => {
      // 🎯 event.target.closest(): User button-er icon ba text-e click korleo nearest '.tag-btn' khuje ber kore
      const tagBtn = e.target.closest(".tag-btn");
      if (tagBtn) {
        const username = tagBtn.dataset.user; // HTML attribute data-user="..." theke username nilam
        this.usernameInput.value = username;  // Input box-e boshalum
        this.fetchDeveloperProfile(username); // Instant profile fetch korlum
      }
    });

    // 📑 [C] Tab Switching:
    this.tabExplorer?.addEventListener("click", () => this.switchTab("explorer"));
    this.tabBookmarks?.addEventListener("click", () => this.switchTab("bookmarks"));

    // ⭐ [D] Bookmark Toggle Button:
    this.btnToggleBookmark?.addEventListener("click", () => {
      if (this.currentDev) {
        this.toggleBookmark(this.currentDev); // Current user ke bookmark add/remove korbe
      }
    });

    // 🗑️ [E] Clear All Bookmarks Button:
    this.btnClearBookmarks?.addEventListener("click", () => {
      if (confirm("Are you sure you want to delete all saved bookmarks?")) {
        this.bookmarks = [];                 // Array faka korlam
        this.#saveBookmarksToStorage();      // LocalStorage update korlam
        this.#updateBookmarkBadgeUI();       // Badge count 0 korlam
        this.renderBookmarksView();          // UI re-render korlam
        this.showToast("All bookmarks cleared", "info"); // Toast notification dilam
      }
    });

    // 🔍 [F] Live Repository Filters (Input & Change Events):
    this.repoFilterInput?.addEventListener("input", () => this.applyRepoFilters());  // User type korle live filter hoy
    this.langFilterSelect?.addEventListener("change", () => this.applyRepoFilters()); // Language change korle filter hoy
    this.sortSelect?.addEventListener("change", () => this.applyRepoFilters());       // Sorting change korle sort hoy

    // 🌊 [G] Bookmarks Grid Event Delegation:
    // Bookmarks grid-er bhitore dynamically 50+ card ashleo 1 ta listener diye Inspect & Delete handle hoy
    this.bookmarksGrid?.addEventListener("click", (e) => {
      const btnInspect = e.target.closest(".btn-inspect-dev");     // Inspect button capture
      const btnRemove = e.target.closest(".btn-remove-bookmark"); // Remove button capture

      if (btnInspect) {
        const username = btnInspect.dataset.user;
        this.fetchDeveloperProfile(username); // Re-inspect profile in explorer tab
      } else if (btnRemove) {
        const username = btnRemove.dataset.user;
        // .find() higher-order method die bookmark array theke matching user khujlam
        const devObj = this.bookmarks.find(b => b.login.toLowerCase() === username.toLowerCase());
        if (devObj) this.toggleBookmark(devObj); // Bookmark theke remove kore dilam
      }
    });
  }

  // 🚀 5. Asynchronous Architecture: Parallel API Fetching via Promise.all()
  async fetchDeveloperProfile(username) {
    this.switchTab("explorer");
    this.hideFeedback();

    const cleanUsername = username.toLowerCase(); // Case-insensitive clean string

    // 🧠 Step 1: Memory Cache Verification (Map.has)
    // Eki user age search kora thakle internet request chara instant memory theke load hobe (Zero latency!)
    if (this.#searchCache.has(cleanUsername)) {
      const cached = this.#searchCache.get(cleanUsername); // Map.get() theke data anlam
      this.currentDev = cached.user;
      this.currentRepos = cached.repos;
      this.renderProfileCard(cached.user, true);           // Profile card render
      this.computeAnalytics(cached.repos);                 // .reduce analytics render
      this.populateLanguageDropdown(cached.repos);         // Dropdown update
      this.applyRepoFilters();                             // Repo list render
      this.showToast(`Loaded ${cached.user.name || cached.user.login} from memory cache ⚡`, "info");
      return; // Execution stop
    }

    try {
      // ⚡ Step 2: Promise.all() Parallel Network Call
      // User Profile ebong Repositories 2 ta request eksathe parallelly chole -> Network wait time 50% kome jay!
      const [userRes, reposRes] = await Promise.all([
        fetch(`https://api.github.com/users/${encodeURIComponent(username)}`),
        fetch(`https://api.github.com/users/${encodeURIComponent(username)}/repos?per_page=100&sort=updated`)
      ]);

      // 🛑 Error Check (404 User Not Found):
      if (!userRes.ok) {
        if (userRes.status === 404) {
          this.showFeedback(`GitHub user "${username}" was not found.`);
        } else {
          this.showFeedback(`GitHub API Error (HTTP ${userRes.status}).`);
        }
        return;
      }

      // 🔄 Step 3: Stream Parsing (await .json())
      const userData = await userRes.json();
      const reposData = reposRes.ok ? await reposRes.json() : [];

      // 💾 Step 4: State Save & In-Memory Map Cache Store
      this.currentDev = userData;
      this.currentRepos = reposData;
      this.#searchCache.set(cleanUsername, { user: userData, repos: reposData }); // Map.set()

      // 🎨 Step 5: Trigger UI Render Pipeline
      this.renderProfileCard(userData, false);
      this.computeAnalytics(reposData);
      this.populateLanguageDropdown(reposData);
      this.applyRepoFilters();

    } catch (err) {
      // 🛡️ Error Boundary: Internet connection failure handle kore app crash theke bachay
      console.error("Fetch error:", err);
      this.showFeedback("Connection failed. Check your internet connection.");
    }
  }

  // 📊 6. Analytics Engine using .reduce() (Single-Pass Aggregation)
  computeAnalytics(repos) {
    if (!Array.isArray(repos) || repos.length === 0) {
      this.metricTotalStars.textContent = "0";
      this.metricTotalForks.textContent = "0";
      this.metricTopLang.textContent = "N/A";
      return;
    }

    // 🌟 Total Stars via .reduce(): Shob repo-r star 1-pass-e sum kore
    const totalStars = repos.reduce((acc, repo) => acc + (repo.stargazers_count || 0), 0);
    this.metricTotalStars.textContent = totalStars.toLocaleString();

    // 🍴 Total Forks via .reduce(): Shob repo-r fork count sum kore
    const totalForks = repos.reduce((acc, repo) => acc + (repo.forks_count || 0), 0);
    this.metricTotalForks.textContent = totalForks.toLocaleString();

    // 🔤 Top Language Frequency Counter via .reduce():
    // Object accumulator toiri kore: { JavaScript: 15, TypeScript: 8, Python: 3 }
    const langCounts = repos.reduce((acc, repo) => {
      if (repo.language) {
        acc[repo.language] = (acc[repo.language] || 0) + 1;
      }
      return acc;
    }, {});

    // Shobcheye beshi use kora language khuje ber kora:
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

  // 🗂️ 7. Language Dropdown Population (Set & Spread Operator)
  populateLanguageDropdown(repos) {
    // [...new Set()] diye duplicate language remove kore unique sorted array banalam
    const languages = [...new Set(repos.map(r => r.language).filter(Boolean))].sort();
    
    // .map() diye <option> tags toiri kore dropdown-e inject korlam
    this.langFilterSelect.innerHTML = `<option value="all">All Languages</option>` + 
      languages.map(l => `<option value="${l}">${l}</option>`).join("");
  }

  // 🔍 8. Live Filter & Sort Pipeline (.filter & .sort)
  applyRepoFilters() {
    const keyword = this.repoFilterInput?.value.toLowerCase().trim() || "";
    const selectedLang = this.langFilterSelect?.value || "all";
    const sortBy = this.sortSelect?.value || "stars";

    // 🧬 Spread operator (...) diye original array mutate na kore copy banalam (Immutability):
    let result = [...this.currentRepos];

    // 🔎 Step 1: Keyword Filtering via .filter()
    if (keyword) {
      result = result.filter(r => 
        r.name.toLowerCase().includes(keyword) || 
        (r.description && r.description.toLowerCase().includes(keyword))
      );
    }

    // 🌐 Step 2: Language Filtering via .filter()
    if (selectedLang !== "all") {
      result = result.filter(r => r.language === selectedLang);
    }

    // 📶 Step 3: Array Sorting via .sort()
    if (sortBy === "stars") {
      result.sort((a, b) => b.stargazers_count - a.stargazers_count); // Descending order (highest stars first)
    } else if (sortBy === "updated") {
      result.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at)); // Latest updated first
    } else if (sortBy === "name") {
      result.sort((a, b) => a.name.localeCompare(b.name)); // Alphabetical order A-Z
    }

    this.filteredRepos = result;
    this.renderReposGrid(result); // Filtered repos UI-te render korlam
  }

  // 👤 9. Profile Card Renderer (DOM Manipulation)
  renderProfileCard(user, isCached) {
    this.welcomeState.classList.add("hidden");        // Welcome banner hide
    this.explorerView.classList.remove("hidden");     // Explorer dashboard view show

    // DOM Properties update kora:
    this.userAvatar.src = user.avatar_url;
    this.userName.textContent = user.name || user.login; // Null fallback using ||
    this.userHandle.textContent = `@${user.login}`;
    this.userBio.textContent = user.bio || "No bio provided.";
    this.userLocation.textContent = user.location || "Worldwide";
    this.userCompany.textContent = user.company || "Independent";

    // Website link formatting:
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

    // Cache indicator badge toggle:
    if (isCached) {
      this.cacheBadge.classList.remove("hidden");
    } else {
      this.cacheBadge.classList.add("hidden");
    }

    this.updateBookmarkButtonUI();
  }

  // 📦 10. Repositories Grid Renderer (.map & Template Literals)
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

    // 🎨 .map() higher-order method diye protita repo theke HTML card banano holo:
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

  // 💾 11. LocalStorage Bookmarking Logic (State Persistence)
  toggleBookmark(user) {
    // .findIndex() diye check korlam user already bookmark-e ache kina:
    const existingIdx = this.bookmarks.findIndex(b => b.login.toLowerCase() === user.login.toLowerCase());

    if (existingIdx > -1) {
      // ❌ Already thakle REMOVE korlam:
      this.bookmarks.splice(existingIdx, 1);
      this.showToast(`Removed @${user.login} from bookmarks`, "info");
    } else {
      // ⭐ Na thakle notun Object ADD korlam:
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

    // 💾 Storage & UI Sync:
    this.#saveBookmarksToStorage();  // LocalStorage JSON.stringify save
    this.#updateBookmarkBadgeUI();   // Badge count update
    this.updateBookmarkButtonUI();   // Star button toggle (active/inactive)

    if (this.activeTab === "bookmarks") {
      this.renderBookmarksView();
    }
  }

  // ⭐ 12. Bookmark Button UI Synchronizer (.some() check)
  updateBookmarkButtonUI() {
    if (!this.currentDev || !this.btnToggleBookmark) return;

    // .some() check kore array-te kono matching user ache kina (Returns true/false)
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

  // 📑 13. Bookmarks View Renderer
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

    // Bookmarked profiles render kora:
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

  // 🔀 14. Tab Switcher
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

  // ⚠️ 15. Error Feedback Banner Controls
  showFeedback(msg) {
    this.feedbackMessage.textContent = msg;
    this.feedbackBanner.classList.remove("hidden");
  }

  hideFeedback() {
    this.feedbackBanner.classList.add("hidden");
  }

  // 🍞 16. Toast Notifications (Macrotask setTimeout)
  showToast(msg, type = "info") {
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.innerHTML = `<i class="fa-solid ${type === 'success' ? 'fa-circle-check text-green' : 'fa-circle-info text-blue'}"></i> ${msg}`;
    this.toastContainer.appendChild(toast);

    // ⏱️ Macrotask Queue (setTimeout): 3 seconds por toast automatic fade & remove hoy
    setTimeout(() => {
      toast.style.opacity = "0";
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  // 📥 17. LocalStorage Read (JSON.parse):
  // Saved string data-ke live JavaScript Array-te convert kore aney
  #loadBookmarksFromStorage() {
    try {
      const data = localStorage.getItem(this.#STORAGE_KEY);
      return data ? JSON.parse(data) : []; // String to Array conversion
    } catch (e) {
      console.error("LocalStorage error:", e);
      return [];
    }
  }

  // 📤 18. LocalStorage Write (JSON.stringify):
  // Live JavaScript Array-ke Text String-e serialize kore browser storage-e save kore
  #saveBookmarksToStorage() {
    try {
      localStorage.setItem(this.#STORAGE_KEY, JSON.stringify(this.bookmarks)); // Array to String
    } catch (e) {
      console.error("LocalStorage save error:", e);
    }
  }

  // 🔢 19. Badge Count Synchronizer
  #updateBookmarkBadgeUI() {
    if (this.bookmarkBadgeCount) {
      this.bookmarkBadgeCount.textContent = this.bookmarks.length;
    }
  }

  // 🛡️ 20. XSS Sanitization Helper (Security Protection)
  escapeHTML(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
}

// 🚀 21. Application Bootstrap: DOM Ready hole Application instantiate hoy
document.addEventListener("DOMContentLoaded", () => {
  window.app = new DevExplorerApp();
});
