/**
 * Day 3: DOM Manipulation, Event Architecture & LocalStorage Practice Snippets
 */

// 1. LocalStorage Helper Module (JSON Storage Wrapper)
const StorageManager = {
  get(key, defaultValue = []) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultValue;
    } catch (e) {
      console.error(`Error reading ${key} from localStorage:`, e);
      return defaultValue;
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error(`Error writing ${key} to localStorage:`, e);
      return false;
    }
  },

  remove(key) {
    localStorage.removeItem(key);
  }
};

// 2. Event Delegation Logic Pattern Example
function setupEventDelegation(containerSelector, itemSelector, callback) {
  const container = document.querySelector(containerSelector);
  if (!container) return;

  container.addEventListener("click", (event) => {
    const targetItem = event.target.closest(itemSelector);
    if (targetItem && container.contains(targetItem)) {
      callback(targetItem, event);
    }
  });
}

// 3. Dynamic Card Markup Renderer Helper
function renderUserCardMarkup(user, isBookmarked = false) {
  return `
    <div class="user-card bg-surface p-4 rounded-xl shadow-md border border-slate-700 hover:border-indigo-500 transition" data-username="${user.login}">
      <div class="flex items-center gap-4">
        <img src="${user.avatar_url}" alt="${user.login}" class="w-16 h-16 rounded-full border-2 border-indigo-400" />
        <div class="flex-1 min-w-0">
          <h3 class="font-bold text-lg text-white truncate">${user.name || user.login}</h3>
          <p class="text-sm text-slate-400">@${user.login}</p>
        </div>
        <button class="bookmark-btn p-2 rounded-lg ${isBookmarked ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-amber-400 hover:bg-slate-700'} transition" data-action="bookmark" data-username="${user.login}">
          ★
        </button>
      </div>
      <p class="mt-3 text-sm text-slate-300 line-clamp-2">${user.bio || "No bio available."}</p>
      <div class="mt-4 pt-3 border-t border-slate-800 flex justify-between text-xs text-slate-400">
        <span>Repos: <strong class="text-indigo-400">${user.public_repos || 0}</strong></span>
        <span>Followers: <strong class="text-indigo-400">${user.followers || 0}</strong></span>
      </div>
    </div>
  `;
}

// Verification log
console.log("Day 3 Practice Snippets Module Initialized Cleanly.");
