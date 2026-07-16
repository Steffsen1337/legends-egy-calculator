// ============================================================
//  FIXED MENU COMPONENT (bleibt immer oben)
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
            <a href="index.html" class="menu-link ${activePage === 'index' ? 'active' : ''}" data-page="index">
              <span class="menu-icon">🧮</span>
              <span class="menu-label">Calculator</span>
            </a>
            <a href="compare.html" class="menu-link ${activePage === 'compare' ? 'active' : ''}" data-page="compare">
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

    // ===== THEME TOGGLE IM MENU =====
    const themeBtn = document.getElementById('menuThemeToggle');
    if (themeBtn) {
      themeBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleThemeFromMenu();
      });
    }

    // ===== SCROLL LISTENER für Schatten-Effekt =====
    const menuEl = document.getElementById('menuContainerInner');
    if (menuEl) {
      // Initial prüfen
      checkScroll(menuEl);
      
      let ticking = false;
      window.addEventListener('scroll', () => {
        if (!ticking) {
          window.requestAnimationFrame(() => {
            checkScroll(menuEl);
            ticking = false;
          });
          ticking = true;
        }
      });
    }
  }
}

// ===== Hilfsfunktion für Schatten-Effekt beim Scrollen =====
function checkScroll(menuEl) {
  if (!menuEl) return;
  const isScrolled = window.scrollY > 20;
  menuEl.classList.toggle('scrolled', isScrolled);
}

// ===== Theme Toggle Funktion =====
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