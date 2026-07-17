function renderMenu(activePage) {
  let currentTheme = 'dark';
  try { const saved = localStorage.getItem('egy_theme'); if (saved) currentTheme = saved; } catch (_) {}

  const themeIcon = currentTheme === 'dark' ? '🌙' : '☀️';
  const themeLabel = currentTheme === 'dark' ? 'Dark' : 'Light';

  const menuHTML = `
    <div class="menu-wrapper">
      <div class="menu-container" id="menuContainerInner">
        <nav class="menu-nav">
          <div class="menu-left">
            <a href="/legends-egy-calculator/" class="menu-link ${activePage === 'index' ? 'active' : ''}">
              <span class="menu-icon">🧮</span><span class="menu-label">Calculator</span>
            </a>
            <a href="/legends-egy-calculator/compare" class="menu-link ${activePage === 'compare' ? 'active' : ''}">
              <span class="menu-icon">📊</span><span class="menu-label">Compare</span>
            </a>
            <a href="/legends-egy-calculator/events" class="menu-link ${activePage === 'events' ? 'active' : ''}">
              <span class="menu-icon">📅</span><span class="menu-label">Events</span>
            </a>
          </div>
          <div class="menu-right">
            <button class="menu-theme-btn" id="menuThemeToggle">
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

    document.getElementById('menuThemeToggle')?.addEventListener('click', function(e) {
      e.stopPropagation();
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      const icon = this.querySelector('.theme-icon');
      const label = this.querySelector('.theme-label');
      if (icon) icon.textContent = newTheme === 'dark' ? '🌙' : '☀️';
      if (label) label.textContent = newTheme === 'dark' ? 'Dark' : 'Light';
      try { localStorage.setItem('egy_theme', newTheme); } catch (_) {}
    });
  }
}