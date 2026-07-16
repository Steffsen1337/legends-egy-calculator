// ============================================================
//  APP.JS - Hauptlogik der Anwendung
// ============================================================

// ============================================================
//  SAFE EXECUTION HELPER
// ============================================================
function safeExecute(fn, fallback = null) {
  try {
    return fn();
  } catch (e) {
    console.error('Error:', e);
    return fallback;
  }
}

// ============================================================
//  STATE
// ============================================================
const state = {
  tab: 'Nova/Egy A',
  selected: new Set(),
  searchTerm: '',
  theme: 'dark',
  
  get items() {
    return Object.values(ITEMS).filter(i => i.cat === this.tab);
  },
  
  get packages() {
    return Object.values(PACKAGES).filter(p => p.cat === this.tab);
  },
  
  get selectedItems() {
    return Object.values(ITEMS).filter(i => this.selected.has(i.id));
  },
  
  isSelected(id) { return this.selected.has(id); },
  
  toggle(id) {
    if (this.selected.has(id)) {
      this.selected.delete(id);
    } else {
      this.selected.add(id);
    }
    this._update();
  },
  
  toggleAll(itemIds) {
    const allSelected = itemIds.every(id => this.selected.has(id));
    if (allSelected) {
      itemIds.forEach(id => this.selected.delete(id));
    } else {
      itemIds.forEach(id => this.selected.add(id));
    }
    this._update();
  },
  
  clear() {
    this.selected.clear();
    this._update();
  },
  
  getPackageStatus(pkg) {
    const all = pkg.items.every(id => this.selected.has(id));
    const count = pkg.items.filter(id => this.selected.has(id)).length;
    return { all, count, total: pkg.items.length };
  },
  
  getItemsByGroup(group) {
    return this.items.filter(i => i.group === group);
  },
  
  _update() {
    safeExecute(() => {
      renderGroups();
      updateUI();
      saveState();
    });
  },
  
  saveTheme() {
    try { localStorage.setItem('egy_theme', this.theme); } catch (_) {}
  },
  
  loadTheme() {
    try {
      const theme = localStorage.getItem('egy_theme');
      if (theme) { this.theme = theme; return true; }
    } catch (_) {}
    return false;
  }
};

// ============================================================
//  UTILITY
// ============================================================
const formatter = new Intl.NumberFormat('de-DE');
const fmt = n => formatter.format(n || 0);

function getDisplayName(item) {
  if (item.upgradeFrom && item.upgradeTo) {
    return `${item.name} (${item.upgradeFrom} → ${item.upgradeTo})`;
  }
  if (item.setTag && item.setTag !== 'Upgrade') {
    return `${item.name} (${item.setTag})`;
  }
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

// ============================================================
//  STORAGE (with validation)
// ============================================================
function saveState() {
  try {
    localStorage.setItem('egy_state', JSON.stringify({
      tab: state.tab,
      selected: [...state.selected]
    }));
  } catch (_) {}
}

function loadState() {
  try {
    const raw = localStorage.getItem('egy_state');
    if (!raw) return false;
    const data = JSON.parse(raw);
    
    const validTabs = ['Nova/Egy A', 'Nova/Egy B', 'Upgrade Nova/Egy A → B'];
    if (data.tab && validTabs.includes(data.tab)) {
      state.tab = data.tab;
    }
    
    if (Array.isArray(data.selected)) {
      const validIds = new Set(Object.keys(ITEMS));
      const validSelected = data.selected.filter(id => validIds.has(id));
      state.selected = new Set(validSelected);
    }
    
    return true;
  } catch (_) { return false; }
}

// ============================================================
//  THEME
// ============================================================
function applyTheme() {
  document.documentElement.setAttribute('data-theme', state.theme);
}

// ============================================================
//  RENDER FUNCTIONS
// ============================================================
function renderGroups() {
  const container = document.getElementById('groupsContainer');
  container.innerHTML = '';

  if (state.tab === 'Nova/Egy B' || state.tab === 'Upgrade Nova/Egy A → B') {
    const info = document.createElement('div');
    info.className = 'info-box';
    info.innerHTML = `
      <span class="icon">⚠️</span>
      <span><strong>Weapon & Shield (Egy B)</strong> can only be obtained via <strong>FGW</strong> or <strong>LHWT</strong>. Direct purchase is not possible.</span>
    `;
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

    const filteredItems = searchTerm
      ? actualItems.filter(i => getDisplayName(i).toLowerCase().includes(searchTerm))
      : actualItems;

    const groupEl = document.createElement('div');
    groupEl.className = 'group';
    if (filteredItems.length === 0 && searchTerm) {
      groupEl.classList.add('hidden');
    }

    const selectedCount = filteredItems.filter(i => state.isSelected(i.id)).length;
    const totalCount = filteredItems.length;
    const progress = totalCount > 0 ? (selectedCount / totalCount) * 100 : 0;
    const allSelected = selectedCount === totalCount && totalCount > 0;

    const header = document.createElement('div');
    header.className = 'group-header';
    header.innerHTML = `
      <h3>${groupInfo.icon} ${groupInfo.label}</h3>
      <div class="progress-wrapper">
        <div class="progress-bar">
          <div class="progress-fill" style="width:${progress}%"></div>
        </div>
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
            ${priceParts.map(p => 
              `<span class="price ${p.cls || ''}"><span class="coin ${p.type}">${p.label}</span>${fmt(p.value)}</span>`
            ).join('')}
          </div>
        </div>
      `;

      const checkbox = row.querySelector('input');

      checkbox.addEventListener('change', (e) => {
        e.stopPropagation();
        state.toggle(item.id);
      });

      row.addEventListener('click', (e) => {
        if (e.target === checkbox) return;
        checkbox.checked = !checkbox.checked;
        checkbox.dispatchEvent(new Event('change'));
      });

      row.addEventListener('keydown', (e) => {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          checkbox.checked = !checkbox.checked;
          checkbox.dispatchEvent(new Event('change'));
        }
      });

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
      if (status.all) {
        pkg.items.forEach(id => state.selected.delete(id));
      } else {
        pkg.items.forEach(id => state.selected.add(id));
      }
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
          <div class="name">
            ${getDisplayName(item)}
            <span class="badge">${badge}</span>
          </div>
          <div class="meta">${item.cat} · ${GROUPS[item.group]?.label || item.group}</div>
          <div class="item-prices-compact">
            ${priceParts.map(p => 
              `<span class="price-tag"><span class="coin ${p.type}">${p.label}</span>${fmt(p.value)}</span>`
            ).join('')}
          </div>
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

  document.getElementById('totalGold').textContent = fmt(gold);
  document.getElementById('totalSC').textContent = fmt(sc);
  document.getElementById('totalLSC').textContent = fmt(lsc);
  document.getElementById('totalGC').textContent = fmt(gc);
  document.getElementById('totalLGC').textContent = fmt(lgc);

  document.getElementById('selCount').textContent = `${sel.length} selected`;
  document.getElementById('totalItemsCount').textContent = sel.length;
}

// ============================================================
//  TAB MANAGEMENT
// ============================================================
function setTab(tab) {
  state.tab = tab;
  document.querySelectorAll('.tab').forEach(t => {
    const isActive = t.dataset.tab === tab;
    t.classList.toggle('active', isActive);
    t.setAttribute('aria-selected', isActive ? 'true' : 'false');
  });
  state._update();
}

// ============================================================
//  KEYBOARD SHORTCUTS
// ============================================================
document.addEventListener('keydown', (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key === 'a') {
    e.preventDefault();
    state.toggleAll(state.items.map(i => i.id));
  }
  
  if (e.key === 'Escape') {
    e.preventDefault();
    state.clear();
  }
});

// ============================================================
//  EVENT LISTENERS
// ============================================================
document.querySelectorAll('.tab').forEach(btn => {
  btn.addEventListener('click', () => setTab(btn.dataset.tab));
});

document.getElementById('searchInput').addEventListener('input', (e) => {
  const raw = e.target.value;
  const sanitized = raw.replace(/[<>]/g, '');
  if (sanitized !== raw) {
    e.target.value = sanitized;
  }
  state.searchTerm = sanitized;
  renderGroups();
});

document.getElementById('clear').addEventListener('click', () => state.clear());

document.getElementById('selectAllTabs').addEventListener('click', () => {
  state.toggleAll(state.items.map(i => i.id));
});

document.getElementById('export').addEventListener('click', () => {
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
    a.download = 'egy_calculator.csv';
    a.click();
    URL.revokeObjectURL(url);
  } catch (e) {
    console.error('Export failed:', e);
    alert('Export failed. Please try again.');
  }
});

document.getElementById('exportJSON').addEventListener('click', () => {
  const sel = state.selectedItems;
  if (sel.length === 0) { alert('No items selected.'); return; }
  
  try {
    const data = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      tab: state.tab,
      selected: sel.map(i => i.id)
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'egy_calculator_profile.json';
    a.click();
    URL.revokeObjectURL(url);
  } catch (e) {
    console.error('Export failed:', e);
    alert('Export failed. Please try again.');
  }
});

// ============================================================
//  ERROR HANDLING
// ============================================================
window.addEventListener('error', (e) => {
  console.error('Global error:', e.message);
});

// ============================================================
//  INIT
// ============================================================
function init() {
  // Theme laden
  if (!state.loadTheme()) state.theme = 'dark';
  applyTheme();
  
  // State laden
  loadState();
  
  // Tabs aktualisieren
  document.querySelectorAll('.tab').forEach(t => {
    const isActive = t.dataset.tab === state.tab;
    t.classList.toggle('active', isActive);
    t.setAttribute('aria-selected', isActive ? 'true' : 'false');
  });
  
  // Render
  renderGroups();
  updateUI();
}

// App starten
safeExecute(init);