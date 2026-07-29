// TOGGLE MENU MOBILE 
document.addEventListener('DOMContentLoaded', function () {
    const toggle = document.getElementById('menu-toggle');
    const menu = document.getElementById('mobile-menu');

    if (toggle && menu) {
        toggle.addEventListener('click', function () {
            const expanded = this.getAttribute('aria-expanded') === 'true';
            menu.classList.toggle('open');
            this.setAttribute('aria-expanded', String(!expanded));
        });
    }

// EFEK KETIK HERO 
    const el = document.getElementById('typed-output');
    if (el) {
        const text = 'M Rafi Hibatulloh — Aspiring Web Developer';
        const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (prefersReduced) {
            el.textContent = text;
        } else {
            let i = 0;
            (function type() {
                if (i <= text.length) {
                    el.textContent = text.slice(0, i);
                    i++;
                    setTimeout(type, 45);
                }
            })();
        }
    }
});
