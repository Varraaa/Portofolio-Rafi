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

  // --- 3. Dynamic Navbar Elevation, Scroll Progress & Active Link Detection ---
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    const navScrollLine = document.createElement('div');
    navScrollLine.className = 'scroll-progress-line';
    navbar.appendChild(navScrollLine);

    const handleNavbarScroll = function () {
      if (window.scrollY > 30) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }

      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
      navScrollLine.style.width = scrolled + '%';
    };

    window.addEventListener('scroll', handleNavbarScroll, { passive: true });
    handleNavbarScroll();
  }

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
  window.showToast = function (message, duration = 3000, icon = '✓') {
    let toast = document.getElementById('global-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'global-toast';
      toast.className = 'toast';
      document.body.appendChild(toast);
    }
    toast.innerHTML = `<span style="display:inline-flex; align-items:center; justify-content:center; width:20px; height:20px; border-radius:50%; background:rgba(16,185,129,0.2); color:var(--accent-emerald); font-size:11px; font-weight:bold; flex-shrink:0;">${icon}</span> <span>${message}</span>`;
    toast.classList.add('visible');

    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => {
      toast.classList.remove('visible');
    }, duration);
  };

  // --- 5. Command Palette (Ctrl + K / Cmd + K) ---
  const pIcon = {
    home: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>',
    about: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>',
    projects: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>',
    certificate: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>',
    contact: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>',
    github: '<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>',
    whatsapp: '<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662a11.835 11.835 0 005.711 1.455h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>',
    download: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>',
    copy: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>',
    scroll: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>'
  };

  const commandData = [
    { label: 'Halaman Utama (Home)', category: 'Navigasi', url: 'index.html', icon: pIcon.home },
    { label: 'Tentang Saya & Filosofi (About)', category: 'Navigasi', url: 'about.html', icon: pIcon.about },
    { label: 'Direktori Proyek (Projects)', category: 'Navigasi', url: 'projects.html', icon: pIcon.projects },
    { label: 'Sertifikat Resmi (Certificate)', category: 'Navigasi', url: 'certificate.html', icon: pIcon.certificate },
    { label: 'Hubungi Saya (Contact)', category: 'Navigasi', url: 'contact.html', icon: pIcon.contact },
    { label: 'Dicoding x DBS Foundation Certificate', category: 'Sertifikat', url: 'certificate.html', icon: pIcon.certificate },
    { label: 'Dicoding x PIJAK AI Fundamentals Certificate', category: 'Sertifikat', url: 'certificate.html', icon: pIcon.certificate },
    { label: 'Kantin Ambu POS Proyek', category: 'Proyek', url: 'projects.html', icon: pIcon.projects },
    { label: 'Clouds Flight Booking Proyek', category: 'Proyek', url: 'projects.html', icon: pIcon.projects },
    { label: 'Kunjungi GitHub (@Varraaa)', category: 'Tautan Eksternal', external: 'https://github.com/Varraaa', icon: pIcon.github },
    { label: 'Kirim WhatsApp (+62 812-9757-7567)', category: 'Tautan Eksternal', external: 'https://wa.me/6281297577567', icon: pIcon.whatsapp },
    { label: 'Unduh Resume / CV Resmi (PDF)', category: 'Aksi Cepat', url: 'assets/resume.pdf', icon: pIcon.download },
    { label: 'Salin Email ke Clipboard', category: 'Aksi Cepat', action: 'copy-email', icon: pIcon.copy },
    { label: 'Kembali ke Atas Halaman', category: 'Aksi Cepat', action: 'scroll-top', icon: pIcon.scroll }
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
            <span class="palette-icon-box" style="display:inline-flex; align-items:center; justify-content:center; width:26px; height:26px; border-radius:6px; background:rgba(255,255,255,0.04); color:var(--accent-emerald); flex-shrink:0;">${cmd.icon}</span>
            <span style="font-size:13.5px; font-weight:500;">${cmd.label}</span>
          </div>
          <span style="font-size:11px; color:var(--text-dim); font-family:var(--font-mono);">${cmd.action ? 'ACTION' : (cmd.external ? 'LINK ↗' : 'GOTO')}</span>
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
      } else if (cmd.action === 'scroll-top') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        window.showToast('Kembali ke puncak halaman');
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

  // Shortcut Listener: Ctrl+K / Cmd+K and ?
  document.addEventListener('keydown', function (e) {
    const isInput = ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName) || document.activeElement?.isContentEditable;
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (window.openCommandPalette) {
        window.openCommandPalette();
      }
    } else if (e.key === '?' && !isInput) {
      e.preventDefault();
      if (window.openCommandPalette) {
        window.openCommandPalette();
      }
    }
  });

  document.querySelectorAll('.cmd-k-trigger').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (window.openCommandPalette) {
        window.openCommandPalette();
      }
    });
  });

  // --- 6. Footer Local Clock (WIB / UTC+7) ---
  function updateFooterClock() {
    const timeEl = document.getElementById('footer-local-time');
    if (!timeEl) return;
    const now = new Date();
    const timeStr = now.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: 'Asia/Jakarta'
    });
    timeEl.textContent = `${timeStr} WIB`;
  }
  updateFooterClock();
  // Universal Clipboard Helper
  window.copyToClipboard = function (text, message = 'Berhasil disalin!') {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        window.showToast(message);
      }).catch(() => {
        window.showToast(`Salin: ${text}`);
      });
    } else {
      window.showToast(`Salin: ${text}`);
    }
  };

  // Global Quick Copy Email
  window.copyEmailToClipboard = function (email = 'mrafi.hiba@gmail.com') {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(email).then(() => {
        window.showToast(`Email ${email} berhasil disalin!`);
      }).catch(() => {
        window.showToast(`Email: ${email}`);
      });
    } else {
      window.showToast(`Email: ${email}`);
    }
  };

  // Global Terminal Output Copy
  window.copyTerminalOutput = function () {
    const termEl = document.getElementById('typed-output');
    if (termEl && navigator.clipboard && navigator.clipboard.writeText) {
      const cleanText = termEl.innerText.replace(/✓/g, '').replace(/visitor@rafi-dev:~\$ whoami --verbose/g, '').trim();
      navigator.clipboard.writeText(cleanText).then(() => {
        window.showToast('Data terminal berhasil disalin!');
      }).catch(() => {
        window.showToast('Data siap.');
      });
    } else {
      window.showToast('M Rafi Hibatulloh — Full-Stack Web Developer');
    }
  };

  // --- 7. Floating Back to Top Button Controller ---
  const backToTopBtn = document.getElementById('back-to-top');
  if (backToTopBtn) {
    const handleScroll = function () {
      if (window.scrollY > 300) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Check initial state
    handleScroll();

    backToTopBtn.addEventListener('click', function (e) {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // --- 8. Universal Smooth Scrolling for Anchor Links ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#' && targetId.length > 1) {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          const header = document.querySelector('.site-header');
          const headerOffset = header ? header.offsetHeight + 20 : 80;
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });

          // Update URL hash without abrupt jump
          if (history.pushState) {
            history.pushState(null, null, targetId);
          }
        }
      }
    });
  });

  // --- 9. Progressive Web App (PWA) Service Worker Registration ---
  if ('serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js').catch(() => {
        // Silently catch in dev
      });
    });
  }

})();
