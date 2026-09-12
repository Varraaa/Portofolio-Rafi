/**
 * GLOBAL CONTROLLER - MAIN.JS
 * M Rafi Hibatulloh | Portfolio Engineering System
 * 
 * Responsibilities:
 * 1. Mobile Drawer Navigation & ARIA accessibility
 * 2. Active Link auto-detection
 * 3. Command Palette (Ctrl+K / Cmd+K) with keyboard navigation
 * 4. Toast Notification Utility
 * 5. Dynamic Year & Global interactions
 */

(function () {
  'use strict';

  // --- 1. Dynamic Footer Year ---
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // --- 2. Mobile Drawer Navigation ---
  const menuToggle = document.getElementById('menu-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');

  if (menuToggle && mobileDrawer) {
    menuToggle.addEventListener('click', function (e) {
      e.stopPropagation();
      const isOpen = mobileDrawer.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
      menuToggle.innerHTML = isOpen ? '&times;' : '&#9776;';
    });

    // Close on link click
    mobileDrawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.innerHTML = '&#9776;';
      });
    });

    // Close on outside click
    document.addEventListener('click', function (e) {
      if (!mobileDrawer.contains(e.target) && !menuToggle.contains(e.target)) {
        mobileDrawer.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.innerHTML = '&#9776;';
      }
    });
  }

  // --- 3. Active Link Auto-Detection ---
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-item, .mobile-nav-link');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // --- 4. Toast Notification Utility ---
  window.showToast = function (message, duration = 3000) {
    let toast = document.getElementById('global-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'global-toast';
      toast.className = 'toast';
      document.body.appendChild(toast);
    }
    toast.innerHTML = `<span>✨</span> <span>${message}</span>`;
    toast.classList.add('visible');

    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => {
      toast.classList.remove('visible');
    }, duration);
  };

  // --- 5. Command Palette (Ctrl + K / Cmd + K) ---
  const commandData = [
    { label: 'Halaman Utama (Home)', category: 'Navigasi', url: 'index.html', icon: '🏠' },
    { label: 'Direktori Proyek (Projects)', category: 'Navigasi', url: 'projects.html', icon: '💼' },
    { label: 'Studi Kasus Teknis (Case Study)', category: 'Navigasi', url: 'project-detail.html', icon: '📑' },
    { label: 'Tentang Saya & Filosofi (About)', category: 'Navigasi', url: 'about.html', icon: '👤' },
    { label: 'Hubungi Saya (Contact)', category: 'Navigasi', url: 'contact.html', icon: '✉️' },
    { label: 'Kantin Ambu POS Case Study', category: 'Proyek', url: 'project-detail.html?id=kantin-ambu', icon: '☕' },
    { label: 'Clouds Flight Booking Case Study', category: 'Proyek', url: 'project-detail.html?id=clouds-booking', icon: '✈️' },
    { label: 'Kunjungi GitHub (@Varraaa)', category: 'Tautan Eksternal', external: 'https://github.com/Varraaa', icon: '🐙' },
    { label: 'Kirim WhatsApp (+62 812-9757-7567)', category: 'Tautan Eksternal', external: 'https://wa.me/6281297577567', icon: '💬' },
    { label: 'Salin Email ke Clipboard', category: 'Aksi Cepat', action: 'copy-email', icon: '📋' }
  ];

  function createCommandPalette() {
    if (document.getElementById('cmd-palette-overlay')) return;

    const overlay = document.createElement('div');
    overlay.id = 'cmd-palette-overlay';
    overlay.className = 'palette-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');

    overlay.innerHTML = `
      <div class="palette-modal" id="cmd-palette-modal">
        <div class="palette-input-wrap">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input type="text" id="palette-search" class="palette-search-input" placeholder="Ketik perintah atau cari halaman... (Esc untuk batal)" autocomplete="off">
          <span class="cmd-k-kbd">ESC</span>
        </div>
        <ul class="palette-list" id="palette-results"></ul>
        <div class="palette-footer">
          <span>Tekan <kbd class="cmd-k-kbd">↑</kbd> <kbd class="cmd-k-kbd">↓</kbd> untuk memilih</span>
          <span><kbd class="cmd-k-kbd">Enter</kbd> untuk membuka</span>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    const input = document.getElementById('palette-search');
    const resultsList = document.getElementById('palette-results');
    let selectedIndex = 0;
    let filteredCommands = [...commandData];

    function renderResults() {
      resultsList.innerHTML = '';
      if (filteredCommands.length === 0) {
        resultsList.innerHTML = `<li style="padding:16px; text-align:center; color:var(--text-dim); font-size:13px;">Tidak ada perintah yang sesuai.</li>`;
        return;
      }

      let currentCategory = '';
      filteredCommands.forEach((cmd, idx) => {
        if (cmd.category !== currentCategory) {
          currentCategory = cmd.category;
          const catLabel = document.createElement('li');
          catLabel.className = 'palette-category-label';
          catLabel.textContent = currentCategory;
          resultsList.appendChild(catLabel);
        }

        const item = document.createElement('li');
        item.className = `palette-item ${idx === selectedIndex ? 'active' : ''}`;
        item.innerHTML = `
          <div style="display:flex; align-items:center; gap:10px;">
            <span>${cmd.icon}</span>
            <span>${cmd.label}</span>
          </div>
          <span style="font-size:11px; color:var(--text-dim);">${cmd.url || cmd.category}</span>
        `;

        item.addEventListener('click', () => executeCommand(cmd));
        resultsList.appendChild(item);
      });
    }

    function executeCommand(cmd) {
      closePalette();
      if (cmd.action === 'copy-email') {
        navigator.clipboard.writeText('mrafi.hiba@gmail.com').then(() => {
          window.showToast('Email mrafi.hiba@gmail.com disalin ke clipboard!');
        });
      } else if (cmd.external) {
        window.open(cmd.external, '_blank', 'noopener,noreferrer');
      } else if (cmd.url) {
        window.location.href = cmd.url;
      }
    }

    function openPalette() {
      overlay.classList.add('open');
      input.value = '';
      filteredCommands = [...commandData];
      selectedIndex = 0;
      renderResults();
      setTimeout(() => input.focus(), 50);
    }

    function closePalette() {
      overlay.classList.remove('open');
    }

    // Input filtering
    input.addEventListener('input', function () {
      const q = this.value.toLowerCase().trim();
      filteredCommands = commandData.filter(cmd => 
        cmd.label.toLowerCase().includes(q) || cmd.category.toLowerCase().includes(q)
      );
      selectedIndex = 0;
      renderResults();
    });

    // Keyboard navigation
    input.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        selectedIndex = (selectedIndex + 1) % filteredCommands.length;
        renderResults();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        selectedIndex = (selectedIndex - 1 + filteredCommands.length) % filteredCommands.length;
        renderResults();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          executeCommand(filteredCommands[selectedIndex]);
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        closePalette();
      }
    });

    // Close on backdrop click
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) {
        closePalette();
      }
    });

    // Global triggers
    window.openCommandPalette = openPalette;
    window.closeCommandPalette = closePalette;
  }

  createCommandPalette();

  // Shortcut Listener: Ctrl+K / Cmd+K
  document.addEventListener('keydown', function (e) {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (window.openCommandPalette) {
        window.openCommandPalette();
      }
    }
  });

  // Attach button triggers
  document.querySelectorAll('.cmd-k-trigger').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (window.openCommandPalette) {
        window.openCommandPalette();
      }
    });
  });

})();
