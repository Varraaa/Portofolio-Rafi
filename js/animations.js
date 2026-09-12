/**
 * ANIMATIONS & MICRO-INTERACTIONS CONTROLLER
 * M Rafi Hibatulloh | Portfolio Engineering System
 * 
 * Features:
 * 1. IntersectionObserver for 60fps scroll reveal
 * 2. 3D Card Tilt & Dynamic Cursor Spotlight effect
 * 3. Hero Terminal interactive typing simulation
 */

(function () {
  'use strict';

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // --- 1. IntersectionObserver Scroll Reveal ---
  if (!prefersReduced && 'IntersectionObserver' in window) {
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Immediate display if reduced motion is requested
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('active'));
  }

  // --- 2. 3D Tilt & Spotlight Glow Effect ---
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
          const rotateX = ((y - centerY) / centerY) * -6; // max -6 to +6 deg
          const rotateY = ((x - centerX) / centerX) * 6;  // max -6 to +6 deg
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

  // --- 3. Terminal Typing Animation (Hero Section) ---
  const typedEl = document.getElementById('typed-output');
  if (typedEl) {
    const lines = [
      'Muhammad Rafi Hibatulloh',
      'Full-Stack Web Developer',
      'Stack: Laravel • PHP • JavaScript • Modern CSS • MySQL',
      'Status: Ready for impactful engineering projects'
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

  // --- 4. Interactive Counter Animation (Stats Strip) ---
  const statValues = document.querySelectorAll('.stat-value[data-counter-target]');
  if (statValues.length > 0) {
    function animateCounter(el) {
      if (el.dataset.animating === 'true') return;
      el.dataset.animating = 'true';
      el.classList.remove('stat-counted');

      const target = parseInt(el.getAttribute('data-counter-target'), 10) || 0;
      const suffix = el.getAttribute('data-counter-suffix') || '';
      const duration = target > 50 ? 1800 : 1200; // ms
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
          requestAnimationFrame(step);
        } else {
          el.textContent = target + suffix;
          el.dataset.animating = 'false';
          el.dataset.completed = 'true';
          el.classList.add('stat-counted');
        }
      }

      requestAnimationFrame(step);
    }

    if (!prefersReduced && 'IntersectionObserver' in window) {
      const statsObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.25
      });

      statValues.forEach(el => {
        const suffix = el.getAttribute('data-counter-suffix') || '';
        el.textContent = '0' + suffix;
        statsObserver.observe(el);
      });
    } else {
      statValues.forEach(el => {
        const target = el.getAttribute('data-counter-target');
        const suffix = el.getAttribute('data-counter-suffix') || '';
        el.textContent = target + suffix;
      });
    }

    // Interactive Re-trigger on Click with Tooltip Feedback
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

