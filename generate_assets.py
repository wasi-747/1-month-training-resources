import os
import time
from playwright.sync_api import sync_playwright

os.makedirs("assets", exist_ok=True)
base_dir = os.path.dirname(os.path.abspath(__file__))

def render_html_to_image(page, html_content, output_path, width=800, height=650):
    page.set_viewport_size({"width": width, "height": height})
    page.set_content(html_content)
    page.wait_for_timeout(300)
    page.screenshot(path=output_path, scale="device") # High-DPI 2x scale
    print(f"Generated High-DPI asset: {output_path}")

def generate_all_diagrams():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(device_scale_factor=2)

        # 1. DevExplorer App Screenshot
        try:
            file_path = os.path.join(base_dir, 'Week-1-Web-Foundations-and-JS', 'Day-03-DOM-and-Mini-Project', 'mini-project', 'index.html')
            file_url = 'file:///' + file_path.replace('\\', '/')
            page.set_viewport_size({"width": 1280, "height": 820})
            page.goto(file_url)
            page.wait_for_timeout(500)
            
            search_input = page.locator('#username-input')
            if search_input.count() > 0:
                search_input.fill('torvalds')
                search_btn = page.locator('#search-btn, button[type="submit"]')
                if search_btn.count() > 0:
                    search_btn.first.click()
                    page.wait_for_timeout(2000)

            out_img = os.path.join(base_dir, 'assets', 'devexplorer_ui.png')
            page.screenshot(path=out_img)
            print(f"Captured UI screenshot: {out_img}")
        except Exception as e:
            print(f"Error capturing UI screenshot: {e}")

        # Shared CSS for Diagrams (Obsidian Gold & Matte Charcoal Theme)
        common_style = """
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&family=JetBrains+Mono:wght@500;600;700&display=swap');
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body {
            background-color: #121214;
            color: #FFFFFF;
            font-family: 'Plus Jakarta Sans', sans-serif;
            width: 800px;
            height: 650px;
            padding: 24px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          }
          .title-tag {
            font-size: 11px;
            font-weight: 800;
            color: #F59E0B;
            letter-spacing: 0.12em;
            text-transform: uppercase;
            margin-bottom: 4px;
          }
          .diagram-title {
            font-size: 18px;
            font-weight: 700;
            color: #FFFFFF;
          }
          .card {
            background: #1A1A1E;
            border: 1px solid #2A2A32;
            border-radius: 12px;
            padding: 16px 18px;
          }
          .card-gold {
            background: #1E1A14;
            border: 1px solid #F59E0B;
            border-radius: 12px;
            padding: 16px 18px;
          }
          .code-box {
            background: #0E0E10;
            border: 1px solid #222228;
            border-radius: 8px;
            padding: 12px 14px;
            font-family: 'JetBrains Mono', monospace;
            font-size: 12px;
            color: #FCD34D;
            line-height: 1.5;
          }
          .pill {
            background: #1A1A1E;
            border: 1px solid #F59E0B;
            color: #FCD34D;
            padding: 8px 14px;
            border-radius: 8px;
            font-size: 12px;
            font-weight: 700;
            text-align: center;
          }
        </style>
        """

        # 2. Git Feature Branching Diagram
        html_git = f"""
        <!DOCTYPE html>
        <html><head>{common_style}</head><body>
          <div>
            <div class="title-tag">VERSION CONTROL ARCHITECTURE</div>
            <div class="diagram-title">Git Feature-Branching & PR Merge Lifecycle</div>
          </div>

          <div style="display: flex; flex-direction: column; gap: 14px; flex: 1; justify-content: center;">
            <!-- Main Branch Line -->
            <div class="card" style="display: flex; align-items: center; justify-content: space-between; border-left: 4px solid #FFFFFF;">
              <div style="display: flex; align-items: center; gap: 12px;">
                <span style="background: #2A2A32; color: #FFFFFF; font-weight: 800; font-size: 11px; padding: 4px 10px; border-radius: 6px;">main</span>
                <span style="font-size: 13px; font-weight: 600; color: #E4E4E7;">Production Branch (Locked & Stable)</span>
              </div>
              <div style="display: flex; gap: 8px;">
                <span style="width: 14px; height: 14px; border-radius: 50%; background: #E4E4E7;"></span>
                <span style="width: 14px; height: 14px; border-radius: 50%; background: #E4E4E7;"></span>
                <span style="width: 14px; height: 14px; border-radius: 50%; background: #F59E0B; box-shadow: 0 0 10px #F59E0B;"></span>
              </div>
            </div>

            <!-- Branch Action Arrow -->
            <div style="display: flex; justify-content: center; align-items: center; gap: 8px; color: #F59E0B; font-size: 12px; font-weight: 700; font-family: 'JetBrains Mono', monospace;">
              <span>git checkout -b feature/async-fetch</span> ⬇️
            </div>

            <!-- Feature Branch Line -->
            <div class="card-gold" style="display: flex; flex-direction: column; gap: 10px;">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="background: #F59E0B; color: #000000; font-weight: 800; font-size: 11px; padding: 3px 8px; border-radius: 6px;">feature</span>
                <span style="font-size: 12px; color: #FCD34D; font-weight: 600;">Isolated Development Environment</span>
              </div>
              <div class="code-box">
                commit #1: feat: add GitHub user profile fetcher<br>
                commit #2: feat: implement .reduce() analytical counters
              </div>
            </div>

            <!-- PR Merge Card -->
            <div class="card" style="display: flex; justify-content: space-between; align-items: center; border-color: #F59E0B;">
              <div>
                <div style="font-size: 13px; font-weight: 700; color: #FCD34D;">Pull Request (PR) & Code Review</div>
                <div style="font-size: 11px; color: #A1A1AA;">Automated CI/CD checks pass • Peer review approved</div>
              </div>
              <span style="background: #F59E0B; color: #000000; font-weight: 800; font-size: 11px; padding: 6px 12px; border-radius: 8px;">Merged to Main ✔</span>
            </div>
          </div>

          <div class="pill">
            🛡️ Production Protection: Zero direct commits to main • Clean atomic commit history
          </div>
        </body></html>
        """
        render_html_to_image(page, html_git, os.path.join(base_dir, 'assets', 'git_branching_diagram.png'))

        # 3. JavaScript Event Loop Architecture Diagram
        html_event_loop = f"""
        <!DOCTYPE html>
        <html><head>{common_style}</head><body>
          <div>
            <div class="title-tag">CONCURRENCY & EXECUTION MODEL</div>
            <div class="diagram-title">JavaScript Single-Threaded Event Loop Engine</div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; flex: 1; align-items: stretch; margin: 12px 0;">
            <!-- Call Stack -->
            <div class="card" style="display: flex; flex-direction: column; justify-content: space-between;">
              <div>
                <div style="font-size: 13px; font-weight: 800; color: #FFFFFF; margin-bottom: 6px;">CALL STACK (V8)</div>
                <div style="font-size: 11px; color: #A1A1AA; margin-bottom: 10px;">Synchronous LIFO Execution</div>
              </div>
              <div class="code-box" style="flex: 1; display: flex; flex-direction: column; justify-content: center; gap: 6px;">
                <div style="background: #1E1A14; border: 1px solid #F59E0B; padding: 6px; border-radius: 4px; color: #FCD34D;">1. fetchUserData()</div>
                <div style="background: #1A1A1E; padding: 6px; border-radius: 4px; color: #E4E4E7;">2. renderCardUI()</div>
                <div style="background: #1A1A1E; padding: 6px; border-radius: 4px; color: #A1A1AA;">3. [Call Stack Clears]</div>
              </div>
            </div>

            <!-- Web APIs / Libuv -->
            <div class="card" style="display: flex; flex-direction: column; justify-content: space-between;">
              <div>
                <div style="font-size: 13px; font-weight: 800; color: #F59E0B; margin-bottom: 6px;">WEB APIs & LIBUV</div>
                <div style="font-size: 11px; color: #A1A1AA; margin-bottom: 10px;">Background Worker Threads</div>
              </div>
              <div class="code-box" style="flex: 1; display: flex; flex-direction: column; justify-content: center; gap: 6px;">
                <div style="color: #E4E4E7;">• fetch() Network I/O</div>
                <div style="color: #E4E4E7;">• fs.readFile() Disk I/O</div>
                <div style="color: #A1A1AA;">• setTimeout() Timers</div>
              </div>
            </div>

            <!-- Microtask Queue -->
            <div class="card-gold" style="grid-column: 1 / 2;">
              <div style="font-size: 12px; font-weight: 800; color: #FCD34D; margin-bottom: 4px;">MICROTASK QUEUE (VIP Priority)</div>
              <div style="font-size: 11px; color: #E4E4E7;">• Promises (async/await, .then())<br>⚡ Drains 100% immediately after Call Stack clears</div>
            </div>

            <!-- Macrotask Queue -->
            <div class="card" style="grid-column: 2 / 3;">
              <div style="font-size: 12px; font-weight: 800; color: #FFFFFF; margin-bottom: 4px;">MACROTASK QUEUE</div>
              <div style="font-size: 11px; color: #A1A1AA;">• setTimeout, setInterval, UI I/O<br>⏳ Executes only after all microtasks finish</div>
            </div>
          </div>

          <div class="pill">
            ⚡ Performance Win: Promise.all() parallel dispatch cuts total API network wait time by 50%
          </div>
        </body></html>
        """
        render_html_to_image(page, html_event_loop, os.path.join(base_dir, 'assets', 'event_loop_diagram.png'))

        # 4. DOM Event Delegation Diagram
        html_dom = f"""
        <!DOCTYPE html>
        <html><head>{common_style}</head><body>
          <div>
            <div class="title-tag">DOM PERFORMANCE PATTERNS</div>
            <div class="diagram-title">Event Delegation & LocalStorage Architecture</div>
          </div>

          <div style="display: flex; flex-direction: column; gap: 14px; flex: 1; justify-content: center;">
            <!-- Parent Container -->
            <div class="card-gold">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <span style="font-size: 13px; font-weight: 800; color: #FCD34D;">PARENT CONTAINER (#repo-grid)</span>
                <span style="background: #F59E0B; color: #000000; font-size: 11px; font-weight: 800; padding: 2px 8px; border-radius: 4px;">1 SINGLE LISTENER</span>
              </div>
              <div class="code-box">
                container.addEventListener('click', (e) => &#123;<br>
                &nbsp;&nbsp;const btn = e.target.closest('.bookmark-btn');<br>
                &nbsp;&nbsp;if (btn) toggleBookmark(btn.dataset.id);<br>
                &#125;);
              </div>
            </div>

            <!-- Bubbling Arrow -->
            <div style="display: flex; justify-content: center; align-items: center; gap: 8px; color: #F59E0B; font-size: 12px; font-weight: 700;">
              <span>⬆️ Event Bubbling: Clicks propagate upwards through DOM tree</span>
            </div>

            <!-- Dynamic Children Grid -->
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;">
              <div class="card" style="text-align: center; padding: 12px;">
                <div style="font-size: 12px; font-weight: 700; color: #FFFFFF;">Repo Card #1</div>
                <div style="font-size: 11px; color: #F59E0B; margin-top: 4px;">⭐ Bookmark Btn</div>
              </div>
              <div class="card" style="text-align: center; padding: 12px;">
                <div style="font-size: 12px; font-weight: 700; color: #FFFFFF;">Repo Card #2</div>
                <div style="font-size: 11px; color: #F59E0B; margin-top: 4px;">⭐ Bookmark Btn</div>
              </div>
              <div class="card" style="text-align: center; padding: 12px; border-style: dashed;">
                <div style="font-size: 12px; font-weight: 700; color: #A1A1AA;">50+ Dynamic Repos</div>
                <div style="font-size: 11px; color: #F59E0B; margin-top: 4px;">Auto-handled ✔</div>
              </div>
            </div>
          </div>

          <div class="pill">
            💡 Memory Optimization: 1 listener replaces 50+ individual handlers (O(1) memory footprint)
          </div>
        </body></html>
        """
        render_html_to_image(page, html_dom, os.path.join(base_dir, 'assets', 'dom_delegation_diagram.png'))

        # 5. Node.js Runtime Architecture Diagram
        html_node = f"""
        <!DOCTYPE html>
        <html><head>{common_style}</head><body>
          <div>
            <div class="title-tag">BACKEND RUNTIME ARCHITECTURE</div>
            <div class="diagram-title">Node.js V8 Engine & Asynchronous FileSystem</div>
          </div>

          <div style="display: flex; flex-direction: column; gap: 12px; flex: 1; justify-content: center;">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
              <!-- V8 Engine -->
              <div class="card-gold">
                <div style="font-size: 13px; font-weight: 800; color: #FCD34D; margin-bottom: 4px;">V8 ENGINE (C++)</div>
                <div style="font-size: 11px; color: #E4E4E7;">• Compiles JS directly to Machine Code<br>• Call Stack & Memory Heap</div>
              </div>

              <!-- Libuv -->
              <div class="card">
                <div style="font-size: 13px; font-weight: 800; color: #FFFFFF; margin-bottom: 4px;">LIBUV THREAD POOL</div>
                <div style="font-size: 11px; color: #A1A1AA;">• 4 Background Worker Threads<br>• Asynchronous File & Network I/O</div>
              </div>
            </div>

            <!-- Code Example Card -->
            <div class="card">
              <div style="font-size: 12px; font-weight: 700; color: #E4E4E7; margin-bottom: 6px;">Non-Blocking File Management (`fs/promises`):</div>
              <div class="code-box">
                const fs = require('fs/promises');<br>
                const path = require('path');<br><br>
                const logPath = path.join(__dirname, 'analytics.json');<br>
                await fs.writeFile(logPath, JSON.stringify(stats, null, 2));<br>
                const data = await fs.readFile(logPath, 'utf-8');
              </div>
            </div>

            <!-- OS Layer -->
            <div class="card" style="border-left: 4px solid #F59E0B; padding: 10px 16px;">
              <div style="font-size: 12px; font-weight: 700; color: #FCD34D;">OPERATING SYSTEM KERNEL</div>
              <div style="font-size: 11px; color: #A1A1AA;">Direct access to File System, TCP Sockets, and Hardware (outside browser sandbox)</div>
            </div>
          </div>

          <div class="pill">
            🟢 Backend Stability: Asynchronous I/O keeps the main Event Loop responsive to incoming requests
          </div>
        </body></html>
        """
        render_html_to_image(page, html_node, os.path.join(base_dir, 'assets', 'node_arch_diagram.png'))

        browser.close()

if __name__ == "__main__":
    generate_all_diagrams()
