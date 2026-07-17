// ============================================================
//  APP.JS - NUR FÜR CALCULATOR
// ============================================================

// ===== TEMPLATE =====
function getCalculatorHTML() {
  return `
    <header class="hero">
      <div class="hero-left">
        <h1>Egy Calculator</h1>
        <p class="lead">Choose between <strong>Nova/Egy A</strong>, <strong>Nova/Egy B</strong>, and <strong>Upgrade Nova/Egy A → Nova/Egy B</strong>.</p>
        <span class="note-badge">⚠️ Weapon & Shield (Egy B) only via FGW / LHWT</span>
      </div>
      <div class="hero-actions">
        <div class="pill" id="selCount" aria-live="polite">0 selected</div>
      </div>
    </header>
    <div class="grid">
      <section class="panel">
        <div class="panel-head">
          <div>
            <h2>Selection <span class="keyboard-hint">⌘A = Select All · ESC = Reset</span></h2>
            <div class="sub">Grouped items – packages automatically select all associated parts.</div>
          </div>
        </div>
        <div class="panel-body">
          <div class="search-box">
            <span class="icon">🔍</span>
            <input type="text" id="searchInput" placeholder="Search items..." />
          </div>
          <nav class="tabs">
            <button class="tab active" data-tab="Nova/Egy A">Nova/Egy A</button>
            <button class="tab" data-tab="Nova/Egy B">Nova/Egy B</button>
            <button class="tab" data-tab="Upgrade Nova/Egy A → B">Upgrade Nova/Egy A → B</button>
          </nav>
          <div id="groupsContainer"></div>
          <div class="actions">
            <button id="clear" class="ghost">✕ Reset</button>
            <button id="export" class="ghost">📊 Export CSV</button>
            <button id="selectAllTabs" class="ghost">☑ Select All</button>
          </div>
        </div>
      </section>
      <aside class="right">
        <section class="summary">
          <h2>💰 Total Sum</h2>
          <div class="total-main">
            <span class="coin gold">G</span>
            <span class="amount" id="totalGold">0</span>
            <span class="label">Total Gold</span>
          </div>
          <div class="total-currencies">
            <div class="currency-item"><span class="coin sc">SC</span><span class="currency-label">Silver Coins</span><span class="value" id="totalSC">0</span></div>
            <div class="currency-item"><span class="coin lsc">LSC</span><span class="currency-label">Legend Silver Coins</span><span class="value" id="totalLSC">0</span></div>
            <div class="currency-item"><span class="coin gc">GC</span><span class="currency-label">Gold Coins</span><span class="value" id="totalGC">0</span></div>
            <div class="currency-item"><span class="coin lgc">LGC</span><span class="currency-label">Legend Gold Coins</span><span class="value" id="totalLGC">0</span></div>
          </div>
        </section>
        <section class="summary">
          <h2>📋 Selected Items <span style="font-size:12px;font-weight:400;color:var(--muted);"><span id="totalItemsCount">0</span> items</span></h2>
          <div class="selected-list" id="selectedList"><div class="small">Nothing selected yet.</div></div>
        </section>
      </aside>
    </div>
  `;
}

// ===== STATE =====
const state = {
  tab: 'Nova/Egy A',
  selected: new Set(),
  searchTerm: '',
  theme: 'dark',
  get items() { return Object.values(ITEMS).filter(i => i.cat === this.tab); },
  get packages() { return Object.values(PACKAGES).filter(p => p.cat === this.tab); },
  get selectedItems() { return Object.values(ITEMS).filter(i => this.selected.has(i.id)); },
  isSelected(id) { return this.selected.has(id); },
  toggle(id) { this.selected.has(id) ? this.selected.delete(id) : this.selected.add(id); this._update(); },
  toggleAll(ids) {
    const all = ids.every(id => this.selected.has(id));
    all ? ids.forEach(id => this.selected.delete(id)) : ids.forEach(id => this.selected.add(id));
    this._update();
  },
  clear() { this.selected.clear(); this._update(); },
  getPackageStatus(pkg) {
    const all = pkg.items.every(id => this.selected.has(id));
    const count = pkg.items.filter(id => this.selected.has(id)).length;
    return { all, count, total: pkg.items.length };
  },
  getItemsByGroup(group) { return this.items.filter(i => i.group === group); },
  _update() { renderGroups(); updateUI(); saveState(); },
  saveTheme() { try { localStorage.setItem('egy_theme', this.theme); } catch (_) {} },
  loadTheme() { try { const t = localStorage.getItem('egy_theme'); if (t) { this.theme = t; return true; } } catch (_) {} return false; }
};

// ===== UTILITY =====
const fmt = n => new Intl.NumberFormat('de-DE').format(n || 0);

function getDisplayName(item) {
  if (item.upgradeFrom && item.upgradeTo) return `${item.name} (${item.upgradeFrom} → ${item.upgradeTo})`;
  if (item.setTag && item.setTag !== 'Upgrade') return `${item.name} (${item.setTag})`;
  return item.name;
}

function getPriceParts(item) {
  const parts = [];
  if (item.gold) parts.push({ type: 'gold', label: 'G', value: item.gold, cls: 'gold-price' });
  if (item.sc) parts.push({ type: 'sc', label: 'SC', value: item.sc });
  if (item.lsc) parts.push({ type: 'lsc', label: 'LSC', value: item.lsc });
  if (item.gc) parts.push({ type: 'gc', label: 'GC', value: item.gc });
  if (item.lgc) parts.push({ type: 'lgc', label: 'LGC', value: item.lgc });
  return parts;
}

// ===== STORAGE =====
function saveState() {
  try { localStorage.setItem('egy_state', JSON.stringify({ tab: state.tab, selected: [...state.selected] })); } catch (_) {}
}

function loadState() {
  try {
    const raw = localStorage.getItem('egy_state');
    if (!raw) return false;
    const data = JSON.parse(raw);
    const validTabs = ['Nova/Egy A', 'Nova/Egy B', 'Upgrade Nova/Egy A → B'];
    if (data.tab && validTabs.includes(data.tab)) state.tab = data.tab;
    if (Array.isArray(data.selected)) {
      const validIds = new Set(Object.keys(ITEMS));
      state.selected = new Set(data.selected.filter(id => validIds.has(id)));
    }
    return true;
  } catch (_) { return false; }
}

// ===== THEME =====
function applyTheme() { document.documentElement.setAttribute('data-theme', state.theme); }

// ===== RENDER FUNCTIONS =====
function renderGroups() {
  const container = document.getElementById('groupsContainer');
  if (!container) return;
  container.innerHTML = '';

  if (state.tab === 'Nova/Egy B' || state.tab === 'Upgrade Nova/Egy A → B') {
    const info = document.createElement('div');
    info.className = 'info-box';
    info.innerHTML = `<span class="icon">⚠️</span><span><strong>Weapon & Shield (Egy B)</strong> can only be obtained via <strong>FGW</strong> or <strong>LHWT</strong>. Direct purchase is not possible.</span>`;
    container.appendChild(info);
  }

  const searchTerm = state.searchTerm.toLowerCase().trim();
  const groupsMap = {};
  state.items.forEach(item => {
    if (!groupsMap[item.group]) groupsMap[item.group] = [];
    groupsMap[item.group].push(item);
  });

  state.packages.forEach(pkg => {
    const firstItem = ITEMS[pkg.items[0]];
    if (firstItem) {
      const group = firstItem.group;
      if (!groupsMap[group]) groupsMap[group] = [];
      if (!groupsMap[group]._packages) groupsMap[group]._packages = [];
      groupsMap[group]._packages.push(pkg);
    }
  });

  for (const [groupKey, groupData] of Object.entries(groupsMap)) {
    const groupInfo = GROUPS[groupKey] || { label: groupKey, icon: '📦' };
    const pkgList = groupData._packages || [];
    const actualItems = groupData.filter(i => i.id);
    const filteredItems = searchTerm ? actualItems.filter(i => getDisplayName(i).toLowerCase().includes(searchTerm)) : actualItems;

    const groupEl = document.createElement('div');
    groupEl.className = 'group';
    if (filteredItems.length === 0 && searchTerm) groupEl.classList.add('hidden');

    const selectedCount = filteredItems.filter(i => state.isSelected(i.id)).length;
    const totalCount = filteredItems.length;
    const progress = totalCount > 0 ? (selectedCount / totalCount) * 100 : 0;
    const allSelected = selectedCount === totalCount && totalCount > 0;

    const header = document.createElement('div');
    header.className = 'group-header';
    header.innerHTML = `
      <h3>${groupInfo.icon} ${groupInfo.label}</h3>
      <div class="progress-wrapper">
        <div class="progress-bar"><div class="progress-fill" style="width:${progress}%"></div></div>
        <span class="progress-text">${selectedCount}/${totalCount}</span>
      </div>
      <div class="group-actions">
        ${pkgList.map(pkg => {
          const status = state.getPackageStatus(pkg);
          const label = status.all ? '✓ ' + pkg.name : pkg.name;
          const cls = status.all ? 'complete' : '';
          return `<button class="${cls}" data-pkg="${pkg.id}">${label}</button>`;
        }).join('')}
        <button class="select-all" data-select-group="${groupKey}">${allSelected ? '✕ None' : '☑ All'}</button>
      </div>
    `;
    groupEl.appendChild(header);

    const itemsContainer = document.createElement('div');
    itemsContainer.className = 'group-items';

    filteredItems.forEach(item => {
      const row = document.createElement('div');
      row.className = 'item-row' + (state.isSelected(item.id) ? ' selected' : '');
      row.dataset.itemId = item.id;
      row.tabIndex = 0;
      row.setAttribute('role', 'checkbox');
      row.setAttribute('aria-checked', state.isSelected(item.id) ? 'true' : 'false');

      const checked = state.isSelected(item.id);
      const priceParts = getPriceParts(item);

      row.innerHTML = `
        <input type="checkbox" ${checked ? 'checked' : ''} aria-hidden="true" />
        <div class="item-info">
          <span class="item-name">${getDisplayName(item)}</span>
          <div class="item-prices">
            ${priceParts.map(p => `<span class="price ${p.cls || ''}"><span class="coin ${p.type}">${p.label}</span>${fmt(p.value)}</span>`).join('')}
          </div>
        </div>
      `;

      const checkbox = row.querySelector('input');
      checkbox.addEventListener('change', (e) => { e.stopPropagation(); state.toggle(item.id); });
      row.addEventListener('click', (e) => { if (e.target === checkbox) return; checkbox.checked = !checkbox.checked; checkbox.dispatchEvent(new Event('change')); });
      row.addEventListener('keydown', (e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); checkbox.checked = !checkbox.checked; checkbox.dispatchEvent(new Event('change')); } });

      itemsContainer.appendChild(row);
    });

    groupEl.appendChild(itemsContainer);
    container.appendChild(groupEl);
  }

  container.querySelectorAll('[data-pkg]').forEach(btn => {
    btn.addEventListener('click', () => {
      const pkg = PACKAGES[btn.dataset.pkg];
      if (!pkg) return;
      const status = state.getPackageStatus(pkg);
      status.all ? pkg.items.forEach(id => state.selected.delete(id)) : pkg.items.forEach(id => state.selected.add(id));
      state._update();
    });
  });

  container.querySelectorAll('[data-select-group]').forEach(btn => {
    btn.addEventListener('click', () => {
      const groupKey = btn.dataset.selectGroup;
      const items = state.getItemsByGroup(groupKey);
      state.toggleAll(items.map(i => i.id));
    });
  });
}

function updateUI() {
  const sel = state.selectedItems;
  let gold = 0, sc = 0, lsc = 0, gc = 0, lgc = 0;

  const list = document.getElementById('selectedList');
  if (!list) return;
  list.innerHTML = '';

  if (sel.length === 0) {
    list.innerHTML = '<div class="small">Nothing selected yet.</div>';
  } else {
    sel.forEach((item, index) => {
      gold += item.gold || 0;
      sc += item.sc || 0;
      lsc += item.lsc || 0;
      gc += item.gc || 0;
      lgc += item.lgc || 0;

      const row = document.createElement('div');
      row.className = 'selected-item';
      const priceParts = getPriceParts(item);
      let badge = '↑';
      if (item.cat === 'Nova/Egy A') badge = 'A';
      else if (item.cat === 'Nova/Egy B') badge = 'B';

      row.innerHTML = `
        <span class="order-number">${index + 1}</span>
        <div class="item-icon">${GROUP_ICONS[item.group] || '📦'}</div>
        <div class="item-details">
          <div class="name">${getDisplayName(item)}<span class="badge">${badge}</span></div>
          <div class="meta">${item.cat} · ${GROUPS[item.group]?.label || item.group}</div>
          <div class="item-prices-compact">${priceParts.map(p => `<span class="price-tag"><span class="coin ${p.type}">${p.label}</span>${fmt(p.value)}</span>`).join('')}</div>
        </div>
        <div class="item-actions">
          <button class="remove-btn" data-remove="${item.id}">✕ Remove</button>
          <span class="group-label">${GROUPS[item.group]?.label || item.group}</span>
        </div>
      `;
      list.appendChild(row);
    });
  }

  list.querySelectorAll('.remove-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      state.selected.delete(btn.dataset.remove);
      state._update();
    });
  });

  const ids = ['totalGold', 'totalSC', 'totalLSC', 'totalGC', 'totalLGC', 'selCount', 'totalItemsCount'];
  const values = [fmt(gold), fmt(sc), fmt(lsc), fmt(gc), fmt(lgc), `${sel.length} selected`, sel.length];
  ids.forEach((id, i) => { const el = document.getElementById(id); if (el) el.textContent = values[i]; });
}

// ===== TAB MANAGEMENT =====
function setTab(tab) {
  state.tab = tab;
  document.querySelectorAll('.tab').forEach(t => {
    const isActive = t.dataset.tab === tab;
    t.classList.toggle('active', isActive);
    t.setAttribute('aria-selected', isActive ? 'true' : 'false');
  });
  state._update();
}

// ===== CALCULATOR INIT =====
function initCalculator() {
  document.querySelectorAll('.tab').forEach(btn => btn.addEventListener('click', () => setTab(btn.dataset.tab)));

  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const raw = e.target.value;
      const sanitized = raw.replace(/[<>]/g, '');
      if (sanitized !== raw) e.target.value = sanitized;
      state.searchTerm = sanitized;
      renderGroups();
    });
  }

  document.getElementById('clear')?.addEventListener('click', () => state.clear());
  document.getElementById('selectAllTabs')?.addEventListener('click', () => state.toggleAll(state.items.map(i => i.id)));

  document.getElementById('export')?.addEventListener('click', () => {
    const sel = state.selectedItems;
    if (sel.length === 0) { alert('No items selected.'); return; }
    try {
      const headers = ['Category', 'Group', 'Name', 'Set', 'Upgrade From', 'Upgrade To', 'Gold', 'SC', 'LSC', 'GC', 'LGC'];
      const rows = sel.map(i => [
        i.cat, i.group, i.name, i.setTag || '', i.upgradeFrom || '', i.upgradeTo || '',
        i.gold || 0, i.sc || 0, i.lsc || 0, i.gc || 0, i.lgc || 0
      ]);
      const csv = [headers.join(';'), ...rows.map(r => r.join(';'))].join('\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'egy_calculator_export.csv';
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Export failed:', e);
      alert('Export failed. Please try again.');
    }
  });

  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'a') { e.preventDefault(); state.toggleAll(state.items.map(i => i.id)); }
    if (e.key === 'Escape') { e.preventDefault(); state.clear(); }
  });

  if (!state.loadTheme()) state.theme = 'dark';
  applyTheme();
  loadState();

  document.querySelectorAll('.tab').forEach(t => {
    const isActive = t.dataset.tab === state.tab;
    t.classList.toggle('active', isActive);
    t.setAttribute('aria-selected', isActive ? 'true' : 'false');
  });

  const container = document.getElementById('appContent');
  if (container) {
    container.innerHTML = getCalculatorHTML();
  }

  renderGroups();
  updateUI();
}

// ===== START =====
document.addEventListener('DOMContentLoaded', function() {
  if (typeof renderMenu === 'function') {
    renderMenu('index');
  }
  initCalculator();
});