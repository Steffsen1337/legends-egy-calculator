function renderMenu(activePage) {
  let currentTheme = 'dark';
  try { const saved = localStorage.getItem('egy_theme'); if (saved) currentTheme = saved; } catch (_) {}
  // Ensure the saved theme is applied globally so all pages load with same theme
  try { document.documentElement.setAttribute('data-theme', currentTheme); } catch (_) {}

  const themeIcon = currentTheme === 'dark' ? '🌙' : '☀️';
  const themeLabel = currentTheme === 'dark' ? 'Dark' : 'Light';

  const menuHTML = `
    <div class="menu-wrapper">
      <div class="menu-container" id="menuContainerInner">
        <nav class="menu-nav">
          <div class="menu-left">
            <a href="/legends-egy-calculator/" class="menu-link ${activePage === 'index' ? 'active' : ''}" data-page="calculator">
              <span class="menu-icon">🧮</span><span class="menu-label">Calculator</span>
            </a>
            <a href="/legends-egy-calculator/compare" class="menu-link ${activePage === 'compare' ? 'active' : ''}" data-page="compare">
              <span class="menu-icon">📊</span><span class="menu-label">Compare</span>
            </a>
            <a href="/legends-egy-calculator/events" class="menu-link ${activePage === 'events' ? 'active' : ''}" data-page="events">
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
      try { localStorage.setItem('egy_theme', newTheme); if (typeof state !== 'undefined') state.theme = newTheme; } catch (_) {}
    });

    container.querySelectorAll('.menu-link').forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        const page = this.dataset.page;
        const base = '/legends-egy-calculator/';
        const target = page === 'compare'
          ? `${base}compare`
          : page === 'events'
            ? `${base}events`
            : base;

        window.location.assign(target);
      });
    });
  }
}