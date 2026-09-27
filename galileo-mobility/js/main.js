/* ── Counter Animation ─────────────────────────────────────
       easeOutQuart: rapid rise, gentle settle at the target.
       Triggered once via IntersectionObserver when the stat row
       enters the viewport. Respects prefers-reduced-motion.    */

    function animateCounter(el) {
      const target  = parseFloat(el.dataset.target);
      const suffix  = el.dataset.suffix  || '';
      const decimal = parseInt(el.dataset.decimal || '0', 10);
      const dur     = 1800;
      const start   = performance.now();

      function tick(now) {
        const t = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - t, 4); // easeOutQuart
        el.textContent = (eased * target).toFixed(decimal) + suffix;
        if (t < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }

    const statEls = document.querySelectorAll('[data-counter]');

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      // Show final values immediately — no animation
      statEls.forEach(el => {
        const target  = parseFloat(el.dataset.target);
        const suffix  = el.dataset.suffix  || '';
        const decimal = parseInt(el.dataset.decimal || '0', 10);
        el.textContent = target.toFixed(decimal) + suffix;
      });
    } else {
      const statObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });

      statEls.forEach(el => statObserver.observe(el));
    }

    /* ── Usecase Visual Motion ─────────────────────────────────
       Adds .is-visible to each .usecase__visual when it scrolls
       into view. CSS picks up from there.                       */

    const visualEls = document.querySelectorAll('.usecase__visual');

    const visualObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    visualEls.forEach(el => visualObserver.observe(el));

    /* ── Hamburger Menu ─────────────────────────────────────────── */
    const nav         = document.querySelector('.nav');
    const hamburger   = document.getElementById('navHamburger');
    const drawerLinks = document.querySelectorAll('.nav__drawer-link');

    function toggleMenu(force) {
      const isOpen = force !== undefined ? force : !nav.classList.contains('nav--open');
      nav.classList.toggle('nav--open', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen);
    }

    hamburger.addEventListener('click', () => toggleMenu());
    hamburger.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleMenu(); }
    });

    drawerLinks.forEach(link => {
      link.addEventListener('click', () => toggleMenu(false));
    });

    document.addEventListener('click', e => {
      if (!nav.contains(e.target) && !document.getElementById('navDrawer').contains(e.target)) {
        toggleMenu(false);
      }
    });
