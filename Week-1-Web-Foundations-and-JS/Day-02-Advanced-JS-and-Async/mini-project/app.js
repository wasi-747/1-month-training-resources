/**
 * GitHub Developer Explorer — Advanced JavaScript Application Logic
 * Demonstrating: ES6 Classes, Private Map Cache (#cache), Promise.all() Parallel Fetching,
 * Closures (Notification Manager), and Array methods (.map, .filter, .reduce).
 */

// ==========================================
// 1. Closure Pattern: Notification Manager
// ==========================================
function createNotificationManager(bannerId, messageId) {
  const bannerEl = document.getElementById(bannerId);
  const messageEl = document.getElementById(messageId);
  let timerId = null;

  return {
    show(message, isError = true) {
      if (timerId) clearTimeout(timerId); // Reset existing timer

      messageEl.textContent = message;
      bannerEl.classList.remove("hidden");

      if (isError) {
        bannerEl.style.background = "rgba(239, 68, 68, 0.15)";
        bannerEl.style.borderColor = "rgba(239, 68, 68, 0.3)";
        bannerEl.style.color = "#fca5a5";
      } else {
        bannerEl.style.background = "rgba(16, 185, 129, 0.15)";
        bannerEl.style.borderColor = "rgba(16, 185, 129, 0.3)";
        bannerEl.style.color = "#6ee7b7";
      }

      // Auto hide after 4 seconds (Macrotask timer)
      timerId = setTimeout(() => {
        bannerEl.classList.add("hidden");
      }, 4000);
    },
    hide() {
      if (timerId) clearTimeout(timerId);
      bannerEl.classList.add("hidden");
    }
  };
}

const notifier = createNotificationManager("feedback-banner", "feedback-message");


// ==========================================
// 2. ES6 Class with Private Map Cache & Promise.all()
// ==========================================
class GitHubService {
  #cache = new Map(); // Private Field (ES2022) to store cached search results
  #apiBase = "https://api.github.com/users";

  async getDeveloperData(username) {
    const cleanUsername = username.trim().toLowerCase();

    // 1. Check ES6 Map Cache
    if (this.#cache.has(cleanUsername)) {
      console.log(`[Cache Hit] Serving data for '${cleanUsername}' from ES6 Map Cache`);
      return { ...this.#cache.get(cleanUsername), isCached: true };
    }

    console.log(`[API Fetch] Initiating parallel Promise.all() requests for '${cleanUsername}'...`);

    // 2. Parallel Async Execution using Promise.all()
    const userPromise = fetch(`${this.#apiBase}/${cleanUsername}`);
    const reposPromise = fetch(`${this.#apiBase}/${cleanUsername}/repos?sort=updated&per_page=30`);

    const [userRes, reposRes] = await Promise.all([userPromise, reposPromise]);

    if (!userRes.ok) {
      if (userRes.status === 404) {
        throw new Error(`Developer '@${cleanUsername}' not found on GitHub.`);
      }
      throw new Error(`GitHub API Error (Status: ${userRes.status})`);
    }

    const userData = await userRes.json();
    const reposData = await reposRes.json();

    const payload = { user: userData, repos: reposData, isCached: false };

    // 3. Save payload to Private Map Cache
    this.#cache.set(cleanUsername, payload);
    return payload;
  }
}

const apiService = new GitHubService();


// ==========================================
// 3. UI Controller & Data Processors (Array Methods)
// ==========================================
class AppUI {
  constructor() {
    this.currentRepos = [];
    this.initDOMReferences();
    this.bindEvents();
  }

  initDOMReferences() {
    this.searchForm = document.getElementById("search-form");
    this.usernameInput = document.getElementById("username-input");
    this.searchBtn = document.getElementById("search-btn");
    
    this.welcomeState = document.getElementById("welcome-state");
    this.dashboardView = document.getElementById("dashboard-view");

    // Profile elements
    this.avatarImg = document.getElementById("user-avatar");
    this.cacheBadge = document.getElementById("cache-badge");
    this.userName = document.getElementById("user-name");
    this.userHandle = document.getElementById("user-handle");
    this.userBio = document.getElementById("user-bio");
    this.userLocation = document.getElementById("user-location");
    this.userCompany = document.getElementById("user-company");
    this.userBlog = document.getElementById("user-blog");
    this.statRepos = document.getElementById("stat-repos");
    this.statFollowers = document.getElementById("stat-followers");
    this.statFollowing = document.getElementById("stat-following");
    this.githubLink = document.getElementById("profile-github-link");

    // Analytics elements
    this.totalStars = document.getElementById("metric-total-stars");
    this.totalForks = document.getElementById("metric-total-forks");
    this.topLang = document.getElementById("metric-top-lang");

    // Repo list & filters
    this.langFilter = document.getElementById("lang-filter");
    this.sortSelect = document.getElementById("sort-select");
    this.reposContainer = document.getElementById("repos-container");
  }

  bindEvents() {
    // Form Submit
    this.searchForm.addEventListener("submit", (e) => {
      e.preventDefault();
      this.handleSearch(this.usernameInput.value);
    });

    // Quick tag buttons
    document.querySelectorAll(".tag-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const username = btn.dataset.user;
        this.usernameInput.value = username;
        this.handleSearch(username);
      });
    });

    // Filters
    this.langFilter.addEventListener("change", () => this.filterAndRenderRepos());
    this.sortSelect.addEventListener("change", () => this.filterAndRenderRepos());
  }

  async handleSearch(username) {
    if (!username.trim()) return;

    this.setLoadingState(true);
    notifier.hide();

    try {
      const data = await apiService.getDeveloperData(username);
      
      this.renderProfile(data.user, data.isCached);
      this.processAnalytics(data.repos);
      this.currentRepos = data.repos;

      this.populateLanguageDropdown(data.repos);
      this.filterAndRenderRepos();

      this.welcomeState.classList.add("hidden");
      this.dashboardView.classList.remove("hidden");
    } catch (error) {
      notifier.show(error.message, true);
    } finally {
      this.setLoadingState(false);
    }
  }

  setLoadingState(isLoading) {
    if (isLoading) {
      this.searchBtn.disabled = true;
      this.searchBtn.querySelector("span").textContent = "Loading...";
    } else {
      this.searchBtn.disabled = false;
      this.searchBtn.querySelector("span").textContent = "Search";
    }
  }

  renderProfile(user, isCached) {
    this.avatarImg.src = user.avatar_url;
    this.userName.textContent = user.name || user.login;
    this.userHandle.textContent = `@${user.login}`;
    this.userBio.textContent = user.bio || "No bio available for this developer profile.";
    
    this.userLocation.textContent = user.location || "Not specified";
    this.userCompany.textContent = user.company || "Not specified";

    if (user.blog) {
      const formattedBlog = user.blog.startsWith("http") ? user.blog : `https://${user.blog}`;
      this.userBlog.href = formattedBlog;
      this.userBlog.textContent = user.blog;
      this.userBlog.parentElement.style.display = "flex";
    } else {
      this.userBlog.parentElement.style.display = "none";
    }

    this.statRepos.textContent = user.public_repos;
    this.statFollowers.textContent = user.followers;
    this.statFollowing.textContent = user.following;

    this.githubLink.href = user.html_url;

    // Show Cache Badge if retrieved from ES6 Map Cache
    if (isCached) {
      this.cacheBadge.classList.remove("hidden");
    } else {
      this.cacheBadge.classList.add("hidden");
    }
  }

  // Demonstration of Array.reduce() for analytics
  processAnalytics(repos) {
    // 1. Calculate Total Stars using Array.reduce()
    const starsSum = repos.reduce((acc, repo) => acc + repo.stargazers_count, 0);
    this.totalStars.textContent = starsSum.toLocaleString();

    // 2. Calculate Total Forks using Array.reduce()
    const forksSum = repos.reduce((acc, repo) => acc + repo.forks_count, 0);
    this.totalForks.textContent = forksSum.toLocaleString();

    // 3. Find Most Used Language using Map / Object Frequency Count
    const langCounts = {};
    repos.forEach((repo) => {
      if (repo.language) {
        langCounts[repo.language] = (langCounts[repo.language] || 0) + 1;
      }
    });

    let topLanguage = "N/A";
    let maxCount = 0;
    Object.entries(langCounts).forEach(([lang, count]) => {
      if (count > maxCount) {
        maxCount = count;
        topLanguage = lang;
      }
    });

    this.topLang.textContent = topLanguage;
  }

  populateLanguageDropdown(repos) {
    // Extract unique languages using Set (Day 2 concept)
    const languages = [...new Set(repos.map((r) => r.language).filter(Boolean))];
    
    this.langFilter.innerHTML = '<option value="all">All Languages</option>';
    languages.forEach((lang) => {
      const option = document.createElement("option");
      option.value = lang;
      option.textContent = lang;
      this.langFilter.appendChild(option);
    });
  }

  // Demonstration of Array.filter() and Array.sort()
  filterAndRenderRepos() {
    const selectedLang = this.langFilter.value;
    const sortBy = this.sortSelect.value;

    // 1. Filter using Array.filter()
    let filtered = this.currentRepos;
    if (selectedLang !== "all") {
      filtered = filtered.filter((repo) => repo.language === selectedLang);
    }

    // 2. Sort repos
    filtered.sort((a, b) => {
      if (sortBy === "stars") return b.stargazers_count - a.stargazers_count;
      if (sortBy === "updated") return new Date(b.updated_at) - new Date(a.updated_at);
      if (sortBy === "name") return a.name.localeCompare(b.name);
      return 0;
    });

    // 3. Render using Array.map()
    if (filtered.length === 0) {
      this.reposContainer.innerHTML = '<div class="glass-card" style="padding: 2rem; grid-column: 1/-1; text-align: center; color: var(--text-muted);">No repositories match the selected language filter.</div>';
      return;
    }

    this.reposContainer.innerHTML = filtered
      .map((repo) => `
        <article class="glass-card repo-card">
          <div>
            <div class="repo-header">
              <a href="${repo.html_url}" target="_blank" class="repo-name">${repo.name}</a>
              ${repo.fork ? '<span class="badge" style="font-size: 0.65rem;">Fork</span>' : ''}
            </div>
            <p class="repo-desc">${repo.description || "No description provided."}</p>
          </div>
          <div class="repo-footer">
            <span class="repo-lang">
              <span class="lang-dot"></span>
              ${repo.language || "Plain"}
            </span>
            <div class="repo-stats">
              <span><i class="fa-regular fa-star"></i> ${repo.stargazers_count}</span>
              <span><i class="fa-solid fa-code-fork"></i> ${repo.forks_count}</span>
            </div>
          </div>
        </article>
      `)
      .join("");
  }
}

// Initialize Application UI when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  new AppUI();
  console.log("GitHub Developer Explorer Initialized (Day 2 Practice Project)");
});
