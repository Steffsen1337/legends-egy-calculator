// ============================================================
//  MODERN MENU COMPONENT
// ============================================================

function renderMenu(activePage) {
  let currentTheme = 'dark';
  try {
    const saved = localStorage.getItem('egy_theme');
    if (saved) currentTheme = saved;
  } catch (_) {}

  const themeIcon = currentTheme === 'dark' ? '🌙' : '☀️';
  const themeLabel = currentTheme === 'dark' ? 'Dark' : 'Light';

  const menuHTML = `
    <div class="menu-wrapper">
      <div class="menu-container" id="menuContainerInner">
        <nav class="menu-nav" role="navigation" aria-label="Main navigation">
          <div class="menu-left">
            <a href="/legends-egy-calculator/" class="menu-link ${activePage === 'index' ? 'active' : ''}" data-page="calculator">
              <span class="menu-icon">🧮</span>
              <span class="menu-label">Calculator</span>
            </a>
            <a href="/legends-egy-calculator/compare" class="menu-link ${activePage === 'compare' ? 'active' : ''}" data-page="compare">
              <span class="menu-icon">📊</span>
              <span class="menu-label">Compare</span>
            </a>
          </div>
          <div class="menu-right">
            <button class="menu-theme-btn" id="menuThemeToggle" aria-label="Toggle theme">
              <span class="theme-icon">${themeIcon}</span>
              <span class="theme-label">${themeLabel}</span>
            </button>
          </div>
        </nav>
      </div>
    </div>
  `;

  const container = document.getElementById('menuContainer');
  if (container) {
    container.innerHTML = menuHTML;

    const themeBtn = document.getElementById('menuThemeToggle');
    if (themeBtn) {
      themeBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleThemeFromMenu();
      });
    }

    container.querySelectorAll('.menu-link').forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        const page = this.dataset.page;
        if (page === 'compare') {
          navigateTo('compare');
        } else {
          navigateTo('calculator');
        }
      });
    });
  }
}

// ===== NAVIGATION HELPER =====
function navigateTo(page) {
  const base = '/legends-egy-calculator/';
  if (page === 'compare') {
    window.history.pushState({ page: 'compare' }, '', base + 'compare');
  } else {
    window.history.pushState({ page: 'calculator' }, '', base);
  }
  // Render page via global function from app.js
  if (typeof renderPage === 'function') {
    renderPage(page);
  }
}

// ===== THEME TOGGLE =====
function toggleThemeFromMenu() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  
  document.documentElement.setAttribute('data-theme', newTheme);
  
  const themeBtn = document.getElementById('menuThemeToggle');
  if (themeBtn) {
    const icon = themeBtn.querySelector('.theme-icon');
    const label = themeBtn.querySelector('.theme-label');
    if (icon) icon.textContent = newTheme === 'dark' ? '🌙' : '☀️';
    if (label) label.textContent = newTheme === 'dark' ? 'Dark' : 'Light';
  }
  
  try {
    localStorage.setItem('egy_theme', newTheme);
    if (typeof state !== 'undefined') {
      state.theme = newTheme;
    }
  } catch (_) {}
}