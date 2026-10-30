/**
 * PROJECTS DIRECTORY CONTROLLER
 * M Rafi Hibatulloh | Portfolio Engineering System
 * 
 * Features:
 * 1. Instant Real-Time Search across titles, tags, and descriptions
 * 2. Category Filter Pills with dynamic active state
 * 3. Dynamic Result Count Tracker
 * 4. Empty State Handler with Reset Action
 * 5. URL Query Parameter Support (?category=...)
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.getElementById('project-search');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-item');
    const countIndicator = document.getElementById('project-count');
    const emptyState = document.getElementById('projects-empty-state');
    const resetBtn = document.getElementById('reset-filters-btn');

    if (!projectCards.length) return;

    let currentCategory = 'all';
    let currentSearchTerm = '';

    // URL Query Parameter check
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category');
    if (categoryParam) {
      currentCategory = categoryParam.toLowerCase();
      filterButtons.forEach(btn => {
        if (btn.dataset.category === currentCategory) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });
    }

    function applyFilters() {
      let visibleCount = 0;

      projectCards.forEach(card => {
        const title = (card.dataset.title || '').toLowerCase();
        const category = (card.dataset.category || '').toLowerCase();
        const tags = (card.dataset.tags || '').toLowerCase();
        const desc = (card.dataset.desc || '').toLowerCase();

        const matchesCategory = (currentCategory === 'all') || (category === currentCategory) || (tags.includes(currentCategory));
        const matchesSearch = !currentSearchTerm || 
                              title.includes(currentSearchTerm) || 
                              tags.includes(currentSearchTerm) || 
                              desc.includes(currentSearchTerm);

        if (matchesCategory && matchesSearch) {
          card.style.display = 'flex';
          card.classList.add('reveal', 'active');
          visibleCount++;
        } else {
          card.style.display = 'none';
        }
      });

      // Update count text
      if (countIndicator) {
        countIndicator.textContent = `Menampilkan ${visibleCount} dari ${projectCards.length} proyek`;
      }

      // Empty state display
      if (emptyState) {
        emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
      }
    }

    // Search input listener
    if (searchInput) {
      searchInput.addEventListener('input', function () {
        currentSearchTerm = this.value.toLowerCase().trim();
        applyFilters();
      });
    }

    // Filter button clicks
    filterButtons.forEach(btn => {
      btn.addEventListener('click', function () {
        filterButtons.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        currentCategory = (this.dataset.category || 'all').toLowerCase();
        applyFilters();
      });
    });

    // Reset button
    if (resetBtn) {
      resetBtn.addEventListener('click', function () {
        currentCategory = 'all';
        currentSearchTerm = '';
        if (searchInput) searchInput.value = '';
        filterButtons.forEach(b => {
          if (b.dataset.category === 'all') b.classList.add('active');
          else b.classList.remove('active');
        });
        applyFilters();
      });
    }

    // Initial run
    applyFilters();

    // --- 6. Project Quick-View Modal Controller ---
    const qvModal = document.getElementById('project-quickview-modal');
    const qvImg = document.getElementById('qv-modal-img');
    const qvBadge = document.getElementById('qv-modal-badge');
    const qvTitle = document.getElementById('qv-modal-title');
    const qvYear = document.getElementById('qv-modal-year');
    const qvDesc = document.getElementById('qv-modal-desc');
    const qvTags = document.getElementById('qv-modal-tags');
    const qvDemo = document.getElementById('qv-modal-demo');
    const qvGithub = document.getElementById('qv-modal-github');
    const qvClose = document.getElementById('qv-modal-close');
    const qvCloseBtn = document.getElementById('qv-modal-close-btn');

    function openQuickView(card) {
      if (!qvModal) return;

      const imgEl = card.querySelector('.project-thumb img');
      const titleEl = card.querySelector('.project-title');
      const descEl = card.querySelector('.project-desc');
      const badgeEl = card.querySelector('.project-meta .badge');
      const yearEl = card.querySelector('.project-meta .font-mono');
      const tagEls = card.querySelectorAll('.project-tags .badge');
      const links = card.querySelectorAll('.project-actions a');

      if (imgEl && qvImg) {
        qvImg.src = imgEl.src;
        qvImg.alt = imgEl.alt;
      }
      if (titleEl && qvTitle) qvTitle.textContent = titleEl.textContent;
      if (descEl && qvDesc) qvDesc.textContent = card.dataset.desc || descEl.textContent;
      if (badgeEl && qvBadge) {
        qvBadge.textContent = badgeEl.textContent;
        qvBadge.className = badgeEl.className;
      }
      if (yearEl && qvYear) qvYear.textContent = yearEl.textContent;

      if (qvTags) {
        qvTags.innerHTML = '';
        tagEls.forEach(tag => {
          const span = document.createElement('span');
          span.className = tag.className;
          span.textContent = tag.textContent;
          qvTags.appendChild(span);
        });
      }

      // Handle action links
      let foundDemo = false;
      let foundGithub = false;

      links.forEach(link => {
        const href = link.href;
        const text = link.textContent.toLowerCase();
        if (text.includes('kunjungi') || text.includes('web') || text.includes('demo')) {
          if (qvDemo) {
            qvDemo.href = href;
            qvDemo.style.display = 'inline-flex';
          }
          foundDemo = true;
        } else if (text.includes('github') || text.includes('repositori')) {
          if (qvGithub) qvGithub.href = href;
          foundGithub = true;
        }
      });

      if (!foundDemo && qvDemo) qvDemo.style.display = 'none';
      if (!foundGithub && qvGithub) qvGithub.href = 'https://github.com/Varraaa';

      qvModal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }

    function closeQuickView() {
      if (!qvModal) return;
      qvModal.classList.remove('open');
      document.body.style.overflow = '';
    }

    if (qvClose) qvClose.addEventListener('click', closeQuickView);
    if (qvCloseBtn) qvCloseBtn.addEventListener('click', closeQuickView);
    if (qvModal) {
      qvModal.addEventListener('click', function (e) {
        if (e.target === qvModal) closeQuickView();
      });
    }

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && qvModal && qvModal.classList.contains('open')) {
        closeQuickView();
      }
    });

    // Attach click to thumbnails & add zoom badge
    projectCards.forEach(card => {
      const thumb = card.querySelector('.project-thumb');
      if (thumb) {
        const zoomBadge = document.createElement('span');
        zoomBadge.className = 'project-thumb-zoom-badge';
        zoomBadge.textContent = '🔍 Pratinjau';
        thumb.appendChild(zoomBadge);

        thumb.addEventListener('click', function (e) {
          e.preventDefault();
          openQuickView(card);
        });
      }
    });
  });
})();
