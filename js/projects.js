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
  });
})();
