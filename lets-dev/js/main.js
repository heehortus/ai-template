/* NAV ───────────────────────────────────────────────── */
    (function () {
      const nav = document.getElementById('nav');
      let lastY = window.scrollY;
      window.addEventListener('scroll', () => {
        const y = window.scrollY;
        nav.classList.toggle('nav--fill', y > 80);
        if (window.innerWidth <= 640) {
          nav.classList.toggle('nav--hidden', y > lastY && y > 80);
        }
        lastY = y;
      }, { passive: true });
    })();

    /* SCROLL REVEAL ─────────────────────────────────────── */
    (function () {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((e, i) => {
          if (e.isIntersecting) {
            setTimeout(() => e.target.classList.add('on'), i * 70);
            io.unobserve(e.target);
          }
        });
      }, { threshold: 0.08 });
      document.querySelectorAll('.rv').forEach(el => io.observe(el));
    })();

    /* HERO MOUSE PARALLAX ───────────────────────────────── */
    (function () {
      const hero = document.querySelector('.hero');
      const bg   = document.querySelector('.hero__bg');
      if (!hero || !bg) return;

      // 현재 위치 (lerp 대상)
      let tx = 50, ty = 50;
      // 부드럽게 따라가는 현재 위치
      let cx = 50, cy = 50;
      let raf = null;

      function paint() {
        bg.style.background = `
          radial-gradient(circle 40vmin at ${cx}% ${cy}%, rgba(120,60,220,0.35) 0%, transparent 100%),
          radial-gradient(circle 60vmin at 50% 110%, rgba(80,30,180,0.12) 0%, transparent 100%)
        `;
      }

      function loop() {
        // lerp — 부드럽게 수렴
        cx += (tx - cx) * 0.04;
        cy += (ty - cy) * 0.04;
        paint();
        raf = requestAnimationFrame(loop);
      }

      let heroActive = true;
      document.addEventListener('mousemove', (e) => {
        if (!heroActive) return;
        tx = (e.clientX / window.innerWidth)  * 100;
        ty = (e.clientY / window.innerHeight) * 100;
      });

      // 히어로가 뷰포트에 있을 때만 rAF 실행
      const io = new IntersectionObserver((entries) => {
        heroActive = entries[0].isIntersecting;
        if (heroActive) {
          if (!raf) raf = requestAnimationFrame(loop);
        } else {
          cancelAnimationFrame(raf); raf = null;
        }
      });
      io.observe(hero);
    })();

    /* BG TRANSITION ─────────────────────────────────────── */
    (function () {
      const sections = document.querySelectorAll('[data-bg]');
      const ratios   = new Map();
      sections.forEach(s => ratios.set(s, 0));

      const thresholds = Array.from({ length: 21 }, (_, i) => i * 0.05);

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => ratios.set(entry.target, entry.intersectionRatio));

        let maxRatio = -1;
        let active   = null;
        ratios.forEach((ratio, section) => {
          if (ratio > maxRatio) { maxRatio = ratio; active = section; }
        });

        if (active && maxRatio > 0) {
          document.body.style.backgroundColor = active.dataset.bg;
          const isLight = active.dataset.theme === 'light';
          document.body.classList.toggle('theme-light', isLight);
        }
      }, { threshold: thresholds });

      sections.forEach(s => observer.observe(s));
    })();

    /* TESTIMONIAL CAROUSEL ──────────────────────────────── */
    (function () {
      const track  = document.getElementById('testiTrack');
      const dots   = [...document.querySelectorAll('#testiDots .testi__dot')];
      const prev   = document.getElementById('testiPrev');
      const next   = document.getElementById('testiNext');
      if (!track) return;

      const total = track.children.length;
      let cur = 0;
      let timer;

      function go(idx) {
        cur = (idx + total) % total;
        track.style.transform = `translateX(-${cur * 100}%)`;
        dots.forEach((d, i) => d.classList.toggle('testi__dot--active', i === cur));
      }

      function startAuto() {
        clearInterval(timer);
        timer = setInterval(() => go(cur + 1), 5000);
      }

      prev.addEventListener('click', () => { go(cur - 1); startAuto(); });
      next.addEventListener('click', () => { go(cur + 1); startAuto(); });
      dots.forEach((d, i) => d.addEventListener('click', () => { go(i); startAuto(); }));

      startAuto();
    })();

    /* SCROLL SNAP ───────────────────────────────────────── */
    (function () {
      const sections = [...document.querySelectorAll('[data-bg]')];
      const footer   = document.querySelector('.footer');
      const NAV_H    = 68;
      let isAnimating = false;

      function sectionTop(el) {
        return el.getBoundingClientRect().top + window.scrollY;
      }

      function smoothGo(y) {
        isAnimating = true;
        window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
        if ('onscrollend' in window) {
          window.addEventListener('scrollend', () => { isAnimating = false; }, { once: true });
        } else {
          setTimeout(() => { isAnimating = false; }, 900);
        }
      }

      function currentIdx() {
        const mid = window.scrollY + window.innerHeight / 2;
        let idx = 0, minDist = Infinity;
        sections.forEach((s, i) => {
          const sMid = s.getBoundingClientRect().top + window.scrollY + s.offsetHeight / 2;
          const d = Math.abs(mid - sMid);
          if (d < minDist) { minDist = d; idx = i; }
        });
        return idx;
      }

      function goNext() {
        const idx = currentIdx();
        if (idx < sections.length - 1) {
          smoothGo(sectionTop(sections[idx + 1]));
        } else {
          // 마지막 섹션 → 푸터로
          smoothGo(footer.getBoundingClientRect().top + window.scrollY);
        }
      }

      function goPrev() {
        const idx = currentIdx();
        if (idx > 0) smoothGo(sectionTop(sections[idx - 1]));
      }

      // 휠: 이벤트 하나당 한 섹션만 이동 (데스크탑만)
      let wheelLock = false;
      window.addEventListener('wheel', (e) => {
        if (window.innerWidth <= 640) return;
        e.preventDefault();
        if (isAnimating || wheelLock) return;
        wheelLock = true;
        setTimeout(() => { wheelLock = false; }, 120);
        if (e.deltaY > 0) goNext(); else goPrev();
      }, { passive: false });

      // 터치 (데스크탑만)
      let touchY = 0;
      let touchStartScrollY = 0;
      window.addEventListener('touchstart', e => {
        if (window.innerWidth <= 640) return;
        touchY = e.touches[0].clientY;
        touchStartScrollY = window.scrollY;
      }, { passive: true });
      window.addEventListener('touchend', e => {
        if (window.innerWidth <= 640) return;
        if (isAnimating) return;
        const dy = touchY - e.changedTouches[0].clientY;
        if (Math.abs(dy) < 40) return;
        if (dy > 0) goNext(); else goPrev();
      }, { passive: true });
    })();
