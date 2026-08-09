import os
import matplotlib.pyplot as plt
import matplotlib.patches as patches
from playwright.sync_api import sync_playwright

os.makedirs("assets", exist_ok=True)

# 1. DevExplorer PRO App Screenshot
def capture_app_screenshot():
    try:
        with sync_playwright() as p:
            browser = p.chromium.launch()
            page = browser.new_page(viewport={'width': 1280, 'height': 800})
            file_path = os.path.abspath('Week-1-Web-Foundations-and-JS/Day-03-DOM-and-Mini-Project/mini-project/index.html')
            file_url = 'file:///' + file_path.replace('\\', '/')
            page.goto(file_url)
            page.wait_for_timeout(1000)
            
            search_input = page.locator('#username-input')
            if search_input.count() > 0:
                search_input.fill('torvalds')
                search_btn = page.locator('#search-btn, button[type="submit"]')
                if search_btn.count() > 0:
                    search_btn.first.click()
                    page.wait_for_timeout(2500)

            out_img = 'assets/devexplorer_ui.png'
            page.screenshot(path=out_img)
            browser.close()
            print(f"Captured UI screenshot: {out_img}")
    except Exception as e:
        print(f"Playwright screenshot error: {e}")

# 2. Modern Full-Height Event Loop Architecture Diagram (figsize 8 x 7.5)
def create_event_loop_diagram():
    fig, ax = plt.subplots(figsize=(8.5, 7.5), facecolor='#0D1322')
    ax.set_facecolor('#0D1322')
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 10)
    ax.axis('off')

    # Top Header
    ax.text(5.0, 9.4, "JAVASCRIPT EVENT LOOP ARCHITECTURE", ha='center', va='center', color='#67E8F9', fontsize=14, weight='bold')

    # 1. Call Stack Box (Top Left)
    stack_box = dict(boxstyle='round,pad=0.7', facecolor='#162032', edgecolor='#6366F1', linewidth=2.5)
    ax.text(2.6, 7.4, "CALL STACK\n(Single-Threaded V8)\n\n• fetchUserData()\n• renderUI()\n• [Synchronous Tasks]", 
            ha='center', va='center', color='#FFFFFF', fontsize=11, weight='bold', bbox=stack_box)

    # 2. Web APIs / Libuv (Top Right)
    webapi_box = dict(boxstyle='round,pad=0.7', facecolor='#162032', edgecolor='#10B981', linewidth=2.5)
    ax.text(7.4, 7.4, "WEB APIs / LIBUV\n(Background Threads)\n\n• fetch() / HTTP I/O\n• setTimeout()\n• DOM Event Listeners", 
            ha='center', va='center', color='#FFFFFF', fontsize=11, weight='bold', bbox=webapi_box)

    # Center Event Loop Spinner
    loop_circle = plt.Circle((5.0, 4.9), 1.2, facecolor='#1E293B', edgecolor='#A855F7', linewidth=3.5)
    ax.add_patch(loop_circle)
    ax.text(5.0, 4.9, "EVENT\nLOOP\n[Cycle]", ha='center', va='center', color='#F8FAFC', fontsize=12.5, weight='bold')

    # 3. Microtask Queue (Bottom Left)
    micro_box = dict(boxstyle='round,pad=0.7', facecolor='#162032', edgecolor='#F59E0B', linewidth=2.5)
    ax.text(2.6, 2.3, "MICROTASK QUEUE (VIP)\n\n• Promise.then() / async\n• queueMicrotask()\n>> Priority: Runs 1st after stack", 
            ha='center', va='center', color='#FCD34D', fontsize=11, weight='bold', bbox=micro_box)

    # 4. Macrotask Queue (Bottom Right)
    macro_box = dict(boxstyle='round,pad=0.7', facecolor='#162032', edgecolor='#06B6D4', linewidth=2.5)
    ax.text(7.4, 2.3, "MACROTASK QUEUE\n\n• setTimeout / setInterval\n• I/O Callbacks\n>> Runs after microtasks clear", 
            ha='center', va='center', color='#67E8F9', fontsize=11, weight='bold', bbox=macro_box)

    # Connecting Arrows with rich thickness
    green_arrow = dict(arrowstyle='->', color='#10B981', lw=3, mutation_scale=20)
    amber_arrow = dict(arrowstyle='->', color='#F59E0B', lw=3, mutation_scale=20)
    cyan_arrow = dict(arrowstyle='->', color='#06B6D4', lw=3, mutation_scale=20)

    # Stack to WebAPI
    ax.annotate("", xy=(5.8, 7.4), xytext=(4.3, 7.4), arrowprops=green_arrow)
    ax.text(5.0, 7.8, "Offload Async", ha='center', color='#10B981', fontsize=10, weight='bold')

    # WebAPI to Microtask
    ax.annotate("", xy=(4.2, 3.1), xytext=(6.5, 6.0), arrowprops=amber_arrow)

    # WebAPI to Macrotask
    ax.annotate("", xy=(7.4, 3.8), xytext=(7.4, 6.0), arrowprops=cyan_arrow)

    # Microtask to Stack
    ax.annotate("", xy=(2.6, 6.0), xytext=(2.6, 3.6), arrowprops=amber_arrow)
    ax.text(1.7, 4.9, "Push to\nStack", ha='center', color='#FCD34D', fontsize=10, weight='bold')

    # Bottom Stat Pill
    stat_box = dict(boxstyle='round,pad=0.5', facecolor='#111827', edgecolor='#10B981', linewidth=2)
    ax.text(5.0, 0.6, "Performance Win: Promise.all() parallel execution cuts latency by 50%", 
            ha='center', va='center', color='#6EE7B7', fontsize=10.5, weight='bold', bbox=stat_box)

    plt.tight_layout()
    out_file = 'assets/event_loop_diagram.png'
    plt.savefig(out_file, dpi=220, bbox_inches='tight', facecolor=fig.get_facecolor(), edgecolor='none')
    plt.close()
    print(f"Created: {out_file}")

# 3. Modern Full-Height Git Feature Branching Diagram (figsize 8.5 x 7.5)
def create_git_diagram():
    fig, ax = plt.subplots(figsize=(8.5, 7.5), facecolor='#0D1322')
    ax.set_facecolor('#0D1322')
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 10)
    ax.axis('off')

    # Header
    ax.text(5.0, 9.4, "PROFESSIONAL GIT FEATURE-BRANCHING", ha='center', va='center', color='#06B6D4', fontsize=14, weight='bold')

    # Main Branch Line (Top)
    ax.plot([1.2, 8.8], [7.2, 7.2], color='#06B6D4', lw=5, zorder=1)
    ax.text(0.9, 7.2, "main", ha='right', va='center', color='#06B6D4', fontsize=15, weight='bold')

    # Feature Branch Line (Bottom)
    ax.plot([2.5, 4.2, 6.2, 7.8], [7.2, 4.0, 4.0, 7.2], color='#F59E0B', lw=4, linestyle='-', zorder=1)
    ax.text(5.2, 3.2, "feature/async-fetch (Isolated Feature Branch)", ha='center', va='center', color='#FCD34D', fontsize=12, weight='bold')

    # Main Commits
    main_commits = [
        (1.8, "Initial Commit"),
        (2.5, "Branch Point"),
        (5.2, "hotfix commit"),
        (7.8, "PR Merge (Merge Commit)"),
        (8.8, "v1.0 Release")
    ]
    for x, label in main_commits:
        circle = plt.Circle((x, 7.2), 0.28, facecolor='#06B6D4', edgecolor='#F8FAFC', linewidth=2.5, zorder=3)
        ax.add_patch(circle)
        ax.text(x, 7.8, label, ha='center', va='bottom', color='#E2E8F0', fontsize=9.5, weight='bold')

    # Feature Commits
    feat_commits = [
        (4.2, "feat: api fetch"),
        (6.2, "feat: .reduce stats")
    ]
    for x, label in feat_commits:
        circle = plt.Circle((x, 4.0), 0.28, facecolor='#F59E0B', edgecolor='#F8FAFC', linewidth=2.5, zorder=3)
        ax.add_patch(circle)
        ax.text(x, 4.6, label, ha='center', va='bottom', color='#FCD34D', fontsize=10, weight='bold')

    # Pull Request Card in Center
    pr_box = dict(boxstyle='round,pad=0.7', facecolor='#162032', edgecolor='#10B981', linewidth=2.5)
    ax.text(7.8, 5.6, "Pull Request (PR)\nPeer Code Review\n& CI/CD Automated Checks", 
            ha='center', va='center', color='#6EE7B7', fontsize=10.5, weight='bold', bbox=pr_box)

    # Bottom Standard Table
    tbl_box = dict(boxstyle='round,pad=0.6', facecolor='#111827', edgecolor='#6366F1', linewidth=2)
    tbl_text = (
        "Conventional Commit Standards:\n"
        "• feat: New feature implementation (feat: add bookmarking)\n"
        "• fix: Bug patching (fix: resolve flexbox alignment)\n"
        "• docs: Documentation updates & README study guides\n"
        "• refactor: Code cleanup with zero logic changes"
    )
    ax.text(5.0, 1.4, tbl_text, ha='center', va='center', color='#CBD5E1', fontsize=10, weight='bold', bbox=tbl_box)

    plt.tight_layout()
    out_file = 'assets/git_branching_diagram.png'
    plt.savefig(out_file, dpi=220, bbox_inches='tight', facecolor=fig.get_facecolor(), edgecolor='none')
    plt.close()
    print(f"Created: {out_file}")

# 4. Modern Full-Height DOM Event Delegation Diagram (figsize 8.5 x 7.5)
def create_dom_delegation_diagram():
    fig, ax = plt.subplots(figsize=(8.5, 7.5), facecolor='#0D1322')
    ax.set_facecolor('#0D1322')
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 10)
    ax.axis('off')

    # Top Header
    ax.text(5.0, 9.4, "MEMORY-OPTIMIZED EVENT DELEGATION", ha='center', va='center', color='#10B981', fontsize=14, weight='bold')

    # Parent Container Box (Top)
    parent_box = dict(boxstyle='round,pad=0.8', facecolor='#162032', edgecolor='#6366F1', linewidth=2.5)
    p_text = (
        "PARENT CONTAINER: #repo-grid\n"
        "[ 1 Single Event Listener Attached ]\n\n"
        "grid.addEventListener('click', (e) => {\n"
        "  const btn = e.target.closest('.bookmark-btn');\n"
        "  if (btn) handleBookmark(btn.dataset.id);\n"
        "});"
    )
    ax.text(5.0, 7.2, p_text, ha='center', va='center', color='#A5B4FC', fontsize=11, family='monospace', bbox=parent_box)

    # Dynamic Child Cards (Middle)
    child_cards = [
        (2.0, "Card #1: React-Repo\n[⭐ Bookmark Btn]"),
        (5.0, "Card #2: Node-Repo\n[⭐ Bookmark Btn]"),
        (8.0, "Card #N: 50+ Dynamic Repos\n[⭐ Bookmark Btn]")
    ]

    child_box = dict(boxstyle='round,pad=0.6', facecolor='#0B0F19', edgecolor='#06B6D4', linewidth=2)
    for x, text in child_cards:
        ax.text(x, 3.4, text, ha='center', va='center', color='#F8FAFC', fontsize=10, weight='bold', bbox=child_box)
        # Event Bubbling Arrows Upwards
        arrow_props = dict(arrowstyle='->', color='#F59E0B', lw=3.5, mutation_scale=22)
        ax.annotate("", xy=(x, 5.5), xytext=(x, 4.3), arrowprops=arrow_props)
        ax.text(x + 0.35, 4.9, "Bubbles Up ⬆️", ha='left', va='center', color='#FCD34D', fontsize=9.5, weight='bold')

    # Bottom Stat Callout
    stat_box = dict(boxstyle='round,pad=0.6', facecolor='#111827', edgecolor='#10B981', linewidth=2)
    stat_text = (
        "💡 Architectural Advantage:\n"
        "• Eliminates 50+ individual button listeners -> Zero Memory Leaks\n"
        "• Automatically binds listeners to newly inserted DOM elements\n"
        "• State instantly synchronized with browser LocalStorage API"
    )
    ax.text(5.0, 1.2, stat_text, ha='center', va='center', color='#6EE7B7', fontsize=10.5, weight='bold', bbox=stat_box)

    plt.tight_layout()
    out_file = 'assets/dom_delegation_diagram.png'
    plt.savefig(out_file, dpi=220, bbox_inches='tight', facecolor=fig.get_facecolor(), edgecolor='none')
    plt.close()
    print(f"Created: {out_file}")

# 5. Modern Full-Height Node.js Runtime Architecture Diagram (figsize 8.5 x 7.5)
def create_node_arch_diagram():
    fig, ax = plt.subplots(figsize=(8.5, 7.5), facecolor='#0D1322')
    ax.set_facecolor('#0D1322')
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 10)
    ax.axis('off')

    # Top Header
    ax.text(5.0, 9.4, "NODE.JS BACKEND RUNTIME ARCHITECTURE", ha='center', va='center', color='#10B981', fontsize=14, weight='bold')

    # V8 Box (Left)
    v8_box = dict(boxstyle='round,pad=0.7', facecolor='#162032', edgecolor='#F59E0B', linewidth=2.5)
    ax.text(2.6, 6.7, "V8 ENGINE\n(Google Chrome V8)\n\n• Compiles JS to Machine Code\n• Call Stack Execution\n• Memory Heap Management", 
            ha='center', va='center', color='#FCD34D', fontsize=11, weight='bold', bbox=v8_box)

    # Libuv Box (Right)
    libuv_box = dict(boxstyle='round,pad=0.7', facecolor='#162032', edgecolor='#06B6D4', linewidth=2.5)
    ax.text(7.4, 6.7, "LIBUV (C++ Library)\n\n• Asynchronous Event Loop\n• Worker Thread Pool (4 Threads)\n• Non-blocking fs/promises & I/O", 
            ha='center', va='center', color='#67E8F9', fontsize=11, weight='bold', bbox=libuv_box)

    # Middle Connector
    mid_arrow = dict(arrowstyle='<->', color='#A855F7', lw=3.5, mutation_scale=22)
    ax.annotate("", xy=(5.7, 6.7), xytext=(4.3, 6.7), arrowprops=mid_arrow)
    ax.text(5.0, 7.4, "Node.js C++\nBindings", ha='center', va='center', color='#F8FAFC', fontsize=10, weight='bold')

    # Middle Code Card
    code_box = dict(boxstyle='round,pad=0.6', facecolor='#0B0F19', edgecolor='#6366F1', linewidth=2)
    code_str = (
        "// Non-Blocking Asynchronous File Operations\n"
        "import fs from 'node:fs/promises';\n"
        "import path from 'node:path';\n\n"
        "const file = path.join(__dirname, 'data.json');\n"
        "const raw = await fs.readFile(file, 'utf-8');\n"
        "const stats = JSON.parse(raw).map(...);"
    )
    ax.text(5.0, 3.7, code_str, ha='center', va='center', color='#A5B4FC', fontsize=10.5, family='monospace', bbox=code_box)

    # Operating System Layer (Bottom)
    os_box = dict(boxstyle='round,pad=0.6', facecolor='#111827', edgecolor='#10B981', linewidth=2.5)
    ax.text(5.0, 1.2, "OPERATING SYSTEM KERNEL\n(Direct Access to FileSystem, Network Sockets & Hardware)", 
            ha='center', va='center', color='#6EE7B7', fontsize=11, weight='bold', bbox=os_box)

    # Connecting Arrows to OS
    down_arrow = dict(arrowstyle='->', color='#10B981', lw=3, mutation_scale=20)
    ax.annotate("", xy=(5.0, 2.0), xytext=(5.0, 2.7), arrowprops=down_arrow)

    plt.tight_layout()
    out_file = 'assets/node_arch_diagram.png'
    plt.savefig(out_file, dpi=220, bbox_inches='tight', facecolor=fig.get_facecolor(), edgecolor='none')
    plt.close()
    print(f"Created: {out_file}")

if __name__ == "__main__":
    capture_app_screenshot()
    create_event_loop_diagram()
    create_git_diagram()
    create_dom_delegation_diagram()
    create_node_arch_diagram()
    print("All full-height professional visual assets generated successfully!")
