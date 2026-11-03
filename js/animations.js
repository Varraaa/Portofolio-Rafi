/**
 * ANIMATIONS & MODERN UX CONTROLLER (60 FPS PERFORMANCE TUNED)
 * M Rafi Hibatulloh | Modern Portfolio Engineering System
 * 
 * Features:
 * 1. Global Viewport Scroll Progress Bar
 * 2. IntersectionObserver for dynamic scroll-triggered reveals (sections, text, images, cards)
 * 3. 3D Card Tilt & Dynamic Cursor Spotlight effect
 * 4. Interactive Hero Terminal typing simulation
 * 5. Interactive Stat Counter animation with easeOutExpo
 */

(function () {
  'use strict';

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // --- 1. Top Reading Scroll Progress Bar ---
  if (!prefersReduced) {
    let progressBar = document.getElementById('scroll-progress-bar');
    if (!progressBar) {
      progressBar = document.createElement('div');
      progressBar.id = 'scroll-progress-bar';
      progressBar.className = 'scroll-progress-bar';
      progressBar.setAttribute('aria-hidden', 'true');
      document.body.prepend(progressBar);
    }

    let ticking = false;
    function updateScrollProgress() {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight > 0) {
        const scrolled = (window.scrollY / scrollHeight) * 100;
        progressBar.style.width = Math.min(Math.max(scrolled, 0), 100) + '%';
      }
      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollProgress);
        ticking = true;
      }
    }, { passive: true });
    updateScrollProgress();
  }

  // --- 2. Kinetic IntersectionObserver Scroll Reveal ---
  if (!prefersReduced && 'IntersectionObserver' in window) {
    const revealTargets = document.querySelectorAll(
      '.reveal, .reveal-scale, .reveal-left, .reveal-right, .reveal-stagger, .img-reveal, .project-card, .feat-card, .service-card, .stat-item, .contact-channel-card, .timeline-item, .editorial-cta-card, .footer-cta-card, .about-portrait-frame, .section-heading, .editorial-card'
    );

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          
          // If the element has child images or items, activate them smoothly
          const images = entry.target.querySelectorAll('img');
          images.forEach(img => img.classList.add('active'));

          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -36px 0px'
    });

    revealTargets.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback: immediate display if reduced motion is requested or unsupported
    document.querySelectorAll(
      '.reveal, .reveal-scale, .reveal-left, .reveal-right, .reveal-stagger, .img-reveal, .project-card, .feat-card, .service-card, .stat-item, .contact-channel-card, .timeline-item, .editorial-cta-card, .footer-cta-card, .about-portrait-frame, .section-heading, .editorial-card'
    ).forEach(el => el.classList.add('active'));
  }

  // --- 3. 3D Tilt & Spotlight Glow Effect ---
  if (!prefersReduced && window.innerWidth > 768) {
    const cards = document.querySelectorAll('.tilt-card, .spotlight-card');

    cards.forEach(card => {
      card.addEventListener('mousemove', function (e) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Spotlight variable injection
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);

        // 3D tilt calculation
        if (card.classList.contains('tilt-card')) {
          const centerX = rect.width / 2;
          const centerY = rect.height / 2;
          const rotateX = ((y - centerY) / centerY) * -5; // subtle -5 to +5 deg
          const rotateY = ((x - centerX) / centerX) * 5;  // subtle -5 to +5 deg
          card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`;
        }
      });

      card.addEventListener('mouseleave', function () {
        if (card.classList.contains('tilt-card')) {
          card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
        }
      });
    });
  }

  // --- 4. Terminal Typing Animation (Hero Section) ---
  const typedEl = document.getElementById('typed-output');
  if (typedEl) {
    const lines = [
      'Muhammad Rafi Hibatulloh',
      'Full-Stack Web Developer',
      'Stack: Laravel • PHP • JavaScript • Modern CSS • MySQL',
      'Status: Terbuka untuk magang & proyek web'
    ];

    if (prefersReduced) {
      typedEl.innerHTML = lines.map(line => `<div><span class="prompt-emerald">✓</span> ${line}</div>`).join('');
    } else {
      let lineIndex = 0;
      let charIndex = 0;

      function typeNextChar() {
        if (lineIndex < lines.length) {
          const currentLine = lines[lineIndex];
          if (charIndex === 0) {
            const lineDiv = document.createElement('div');
            lineDiv.id = `term-line-${lineIndex}`;
            lineDiv.innerHTML = `<span class="prompt-emerald">✓</span> `;
            typedEl.appendChild(lineDiv);
          }

          const lineDiv = document.getElementById(`term-line-${lineIndex}`);
          if (charIndex < currentLine.length) {
            lineDiv.innerHTML += currentLine.charAt(charIndex);
            charIndex++;
            setTimeout(typeNextChar, 28);
          } else {
            lineIndex++;
            charIndex = 0;
            setTimeout(typeNextChar, 200);
          }
        } else {
          // Completed typing: append blinking cursor prompt
          const cursorDiv = document.createElement('div');
          cursorDiv.style.marginTop = '10px';
          cursorDiv.innerHTML = `<span class="prompt-cyan">visitor@rafi-dev:~$</span> <span class="cursor-blink"></span>`;
          typedEl.appendChild(cursorDiv);
        }
      }

      setTimeout(typeNextChar, 400);
    }
  }

  // --- 5. Interactive Counter Animation (Automatic On Load & On Scroll) ---
  const statValues = document.querySelectorAll('.stat-value[data-counter-target]');
  if (statValues.length > 0) {
    const animTimers = new Map();

    function animateCounter(el) {
      const target = parseInt(el.getAttribute('data-counter-target'), 10) || 0;
      const suffix = el.getAttribute('data-counter-suffix') || '';
      const duration = target > 50 ? 1500 : 1000; // ms

      // Cancel any ongoing animation frame for this specific element
      if (animTimers.has(el)) {
        cancelAnimationFrame(animTimers.get(el));
      }

      el.dataset.animating = 'true';
      el.classList.remove('stat-counted');
      let startTime = null;

      function step(timestamp) {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // easeOutExpo curve for elegant, smooth deceleration
        const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        const current = Math.floor(ease * target);

        el.textContent = current + suffix;

        if (progress < 1) {
          const rafId = requestAnimationFrame(step);
          animTimers.set(el, rafId);
        } else {
          el.textContent = target + suffix;
          el.dataset.animating = 'false';
          el.classList.add('stat-counted');
          animTimers.delete(el);
        }
      }

      const initialRaf = requestAnimationFrame(step);
      animTimers.set(el, initialRaf);
    }

    // 1. Trigger automatically when page initially loads
    setTimeout(() => {
      statValues.forEach(el => animateCounter(el));
    }, 300);

    // 2. Trigger automatically whenever user scrolls into the section
    if (!prefersReduced && 'IntersectionObserver' in window) {
      const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
          } else {
            // Reset to 0 when scrolled out of view so next scroll animates smoothly
            const suffix = entry.target.getAttribute('data-counter-suffix') || '';
            entry.target.textContent = '0' + suffix;
          }
        });
      }, {
        threshold: 0.2,
        rootMargin: '0px 0px -20px 0px'
      });

      statValues.forEach(el => {
        statsObserver.observe(el);
      });
    }

    // 3. Interactive Re-trigger on Click with Tooltip Feedback
    statValues.forEach(el => {
      const parentCard = el.closest('.stat-item');
      if (parentCard) {
        parentCard.style.cursor = 'pointer';
        parentCard.setAttribute('title', 'Klik untuk mengulang animasi');
        parentCard.addEventListener('click', () => {
          animateCounter(el);
        });
      }
    });
  }

})();
