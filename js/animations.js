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
      'M Rafi Hibatulloh',
      'Junior Full-Stack Web Developer & UI/UX Enthusiast',
      'Stack: Laravel • PHP • JS (ES6+) • Modern CSS3 • MySQL',
      'Status: Ready for impactful engineering projects 🚀'
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

})();
