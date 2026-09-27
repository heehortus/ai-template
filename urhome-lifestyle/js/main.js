/* ── Hero Video Speed ──────────────────────────────────── */
    (function () {
      const v = document.querySelector('.hero__video');
      if (v) v.playbackRate = 0.8;
    })();

    /* ── Custom Cursor ─────────────────────────────────────── */
    (function () {
      const dot  = document.getElementById('cursor-dot');
      const ring = document.getElementById('cursor-ring');
      let mx = window.innerWidth / 2, my = window.innerHeight / 2;
      let rx = mx, ry = my;

      document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

      const lerp = (a, b, t) => a + (b - a) * t;
      (function tick() {
        rx = lerp(rx, mx, 0.14);
        ry = lerp(ry, my, 0.14);
        dot.style.transform  = `translate(${mx}px,${my}px)`;
        ring.style.transform = `translate(${rx}px,${ry}px)`;
        requestAnimationFrame(tick);
      })();

      document.querySelectorAll('a, button, .product-card, .room-card, .material-card').forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
      });
    })();

    /* ── Nav hide / show ───────────────────────────────────── */
    (function () {
      const nav = document.getElementById('nav');
      let lastY = 0;
      window.addEventListener('scroll', () => {
        const y = window.scrollY;
        nav.classList.toggle('nav--hidden', y > lastY && y > 80);
        nav.classList.toggle('nav--scrolled', y > 80);
        lastY = y;
      }, { passive: true });
    })();

    /* ── Scroll reveal ─────────────────────────────────────── */
    (function () {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((e, i) => {
          if (e.isIntersecting) {
            setTimeout(() => e.target.classList.add('revealed'), i * 60);
            io.unobserve(e.target);
          }
        });
      }, { threshold: 0.12 });
      document.querySelectorAll('.reveal').forEach(el => io.observe(el));
    })();

    /* ── Counter animation ─────────────────────────────────── */
    (function () {
      const easeOutQuart = t => 1 - Math.pow(1 - t, 4);

      function animateCounter(el) {
        const target  = parseFloat(el.dataset.target);
        const suffix  = el.dataset.suffix || '';
        const decimal = parseInt(el.dataset.decimal || '0', 10);
        const dur = 1600;
        let start = null;
        (function step(ts) {
          if (!start) start = ts;
          const p   = Math.min((ts - start) / dur, 1);
          el.textContent = (target * easeOutQuart(p)).toFixed(decimal) + suffix;
          if (p < 1) requestAnimationFrame(step);
          else el.textContent = target.toFixed(decimal) + suffix;
        })(performance.now());
      }

      const io = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (e.isIntersecting) { animateCounter(e.target); io.unobserve(e.target); }
        });
      }, { threshold: 0.6 });
      document.querySelectorAll('[data-counter]').forEach(el => io.observe(el));
    })();

    /* ── Infinite auto-scroll carousel ────────────────────── */
    (function () {
      const outer  = document.getElementById('carousel');
      const track  = document.getElementById('carouselTrack');
      const dots   = document.querySelectorAll('#carouselDots .carousel-dot');
      const CARD_W = 260 + 24; // card width + gap
      const SPEED  = 0.6;      // px per frame

      // 카드 복제 → seamless loop
      const originals = Array.from(track.children);
      const COUNT = originals.length;
      originals.forEach(card => track.appendChild(card.cloneNode(true)));

      let x = 0;
      let paused = false;
      let rafId;

      function updateDots() {
        const idx = Math.round(x / CARD_W) % COUNT;
        dots.forEach((d, i) => d.classList.toggle('active', i === idx));
      }

      function tick() {
        if (!paused) {
          x += SPEED;
          // 원본 절반(COUNT개) 지나면 리셋 → seamless
          const loopWidth = CARD_W * COUNT;
          if (x >= loopWidth) x -= loopWidth;
          track.style.transform = `translateX(${-x}px)`;
          updateDots();
        }
        rafId = requestAnimationFrame(tick);
      }

      outer.addEventListener('mouseenter', () => { paused = true; });
      outer.addEventListener('mouseleave', () => { paused = false; });

      tick();
    })();

    /* ── Mobile Room Tab Switcher ─────────────────────────── */
    (function () {
      const tabs = document.querySelectorAll('.room-tab');
      const cards = document.querySelectorAll('.room-card');

      tabs.forEach(tab => {
        tab.addEventListener('click', () => {
          const targetIndex = tab.dataset.room;

          // 탭 활성화 상태 변경
          tabs.forEach(t => t.classList.toggle('active', t === tab));

          // 해당 카드만 활성화
          cards.forEach(card => {
            const isMatch = card.dataset.roomIndex === targetIndex;
            card.classList.toggle('active', isMatch);
          });
        });
      });
    })();
