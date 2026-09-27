(function () {
      const v = document.querySelector('.hero-video-wrap video');
      if (v) v.playbackRate = 0.8;
    })();

    /* --------- Custom Cursor --------- */
    (function () {
      const cursor = document.getElementById('cursor');
      if (!cursor) return;

      let targetX = 0, targetY = 0;
      let currentX = 0, currentY = 0;
      let rafId;

      // 마우스 이동 추적 + 커서 항상 표시 보장
      cursor.style.opacity = '0'; // 첫 mousemove 전까지 숨김
      document.addEventListener('mousemove', (e) => {
        targetX = e.clientX;
        targetY = e.clientY;
        if (cursor.style.opacity !== '1') cursor.style.opacity = '1';
      }, { passive: true });

      // Lerp 부드러운 팔로우
      function lerp(a, b, t) { return a + (b - a) * t; }

      function tick() {
        currentX = lerp(currentX, targetX, 0.12);
        currentY = lerp(currentY, targetY, 0.12);
        cursor.style.left = currentX + 'px';
        cursor.style.top  = currentY + 'px';
        rafId = requestAnimationFrame(tick);
      }
      tick();

      // 인터랙티브 요소 감지 — 이벤트 위임
      const SELECTORS = 'a, button, input, textarea, select, [role="button"], [role="link"], .works-card, .cap-list, .cap-item, .values, .works-card, .contact-cta';

      document.addEventListener('mouseover', (e) => {
        if (e.target.closest(SELECTORS)) {
          cursor.classList.add('is-hover');
        }
      }, { passive: true });

      document.addEventListener('mouseout', (e) => {
        if (e.target.closest(SELECTORS)) {
          cursor.classList.remove('is-hover');
        }
      }, { passive: true });

      // 클릭 시 순간 수축 피드백
      document.addEventListener('mousedown', () => {
        cursor.classList.add('is-click');
      });
      document.addEventListener('mouseup', () => {
        cursor.classList.remove('is-click');
      });
    })();

    /* --------- Scroll progress bar --------- */
    const scrollBar = document.getElementById('scroll-bar');
    window.addEventListener('scroll', () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      scrollBar.style.width = (window.scrollY / max * 100) + '%';
    }, { passive: true });

    /* --------- Typing animation --------- */
    (function () {
      const target = document.getElementById('typing-target');
      const segments = [
        { text: '오차 없는 정밀,\n당신의 공정을 완성합니다.', bold: false },
      ];

      let segIdx = 0, charIdx = 0;
      let lastTs = null, nextDelay = 0;

      function charDelay(ch) {
        if (ch === '\n')           return 200;
        if (ch === ',' || ch === '.') return 150;
        if (ch === ' ')            return 60;
        return 50 + Math.random() * 40; // 한글 음절: 50–90ms
      }

      function typeNext(ts) {
        if (lastTs === null) { lastTs = ts; requestAnimationFrame(typeNext); return; }
        if (ts - lastTs < nextDelay) { requestAnimationFrame(typeNext); return; }
        lastTs = ts;

        if (segIdx >= segments.length) {
          target.classList.remove('typing-active');
          const grid = document.querySelector('.stats-grid');
          grid.classList.add('visible');
          setTimeout(() => {
            document.querySelectorAll('[data-stat]').forEach(el => el.classList.add('in-view'));
            document.querySelectorAll('[data-count]').forEach(el => {
              countUp(el, parseFloat(el.dataset.count));
            });
          }, 700);
          return;
        }

        const seg  = segments[segIdx];
        const char = seg.text[charIdx];
        nextDelay  = charDelay(char);

        if (char === '\n') {
          target.innerHTML += '<br>';
        } else if (seg.bold) {
          let boldSpan = target.querySelector('em.t-bold');
          if (!boldSpan) {
            boldSpan = document.createElement('em');
            boldSpan.className = 't-bold';
            boldSpan.style.cssText = 'font-style:normal;font-weight:700;color:var(--technical-white)';
            target.appendChild(boldSpan);
          }
          boldSpan.textContent += char;
        } else {
          target.appendChild(document.createTextNode(char));
        }

        charIdx++;
        if (charIdx >= seg.text.length) { segIdx++; charIdx = 0; }
        requestAnimationFrame(typeNext);
      }

      const heroText = document.querySelector('.stats');
      const typingObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          typingObserver.disconnect();
          setTimeout(() => {
            target.classList.add('typing-active');
            nextDelay = 0;
            requestAnimationFrame(typeNext);
          }, 300);
        }
      }, { threshold: 0.4 });
      typingObserver.observe(heroText);
    })();

    /* --------- NAV scroll --------- */
    const nav = document.getElementById('nav');
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });

    /* --------- Scroll reveal --------- */
    const revealEls = document.querySelectorAll('.reveal:not(.cap-item)');
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px 0px 0px' });

    revealEls.forEach(el => revealObserver.observe(el));

    /* --------- Values section: 스크롤 연동 텍스트 확장 → 카드 등장 --------- */
    (function () {
      var bgText  = document.querySelector('.values-bg-text');
      var cards   = Array.from(document.querySelectorAll('.value-card'));
      var section = document.querySelector('.values');
      if (!bgText || !section) return;

      if (window.innerWidth <= 768) {
        const cardObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
              cardObserver.unobserve(entry.target);
            }
          });
        }, {
          threshold: 0.2,
          rootMargin: '0px 0px -40px 0px'
        });

        cards.forEach(card => cardObserver.observe(card));
        return;
      }

      var cardsShown = false;
      var textLocked = false;

      function ease(t) { return t < 0.5 ? 2*t*t : -1+(4-2*t)*t; }

      function onScroll() {
        var rect     = section.getBoundingClientRect();
        var total    = section.offsetHeight - window.innerHeight;
        var progress = Math.max(0, Math.min(1, -rect.top / total));

        if (!textLocked) {
          var textP = Math.min(progress / 0.65, 1);
          var eased = ease(textP);
          var scale = 0.3 + eased * 0.7;
          bgText.style.transform = 'translate(-50%, -50%) scale(' + scale + ')';

          if (textP >= 1) {
            textLocked = true;
            bgText.style.transform = 'translate(-50%, -50%) scale(1)';
          }
        }

        if (progress >= 0.65 && !cardsShown) {
          cardsShown = true;
          cards.forEach(function (card, i) {
            setTimeout(function () { card.classList.add('visible'); }, i * 400);
          });
        }
      }

      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    })();

    /* --------- Cap-item reveal (staggered, 아래→위) --------- */
    const capItems = document.querySelectorAll('.cap-item');
    const capObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const idx = Array.from(capItems).indexOf(entry.target);
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, idx * 80);
          capObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    capItems.forEach(el => capObserver.observe(el));

    /* --------- Works-card reveal (staggered, 아래→위) --------- */
    const worksCards = document.querySelectorAll('.works-card');
    const worksObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const idx = Array.from(worksCards).indexOf(entry.target);
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, idx * 100);
          worksObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

    worksCards.forEach(el => worksObserver.observe(el));

    /* --------- Count-up animation (타이핑 종료 후 수동 트리거) --------- */
    function countUp(el, target, duration = 1800) {
      const suffixEl = el.nextElementSibling;
      let start = 0;
      const step = (timestamp) => {
        if (!start) start = timestamp;
        const progress = Math.min((timestamp - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target);
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = target;
          if (suffixEl && suffixEl.classList.contains('stat-suffix')) {
            suffixEl.classList.add('visible');
          }
        }
      };
      requestAnimationFrame(step);
    }

    /* --------- Hamburger (mobile) --------- */
    (function () {
      var hamburger = document.getElementById('hamburger');
      var navMobile = document.getElementById('nav-mobile');
      var svg = document.getElementById('hamburger-svg');
      var lines = Array.from(svg.querySelectorAll('line'));
      var isOpen = false;
      var DUR = 280;

      var HAMBURGER = [
        { x1: 3, y1: 6,  x2: 21, y2: 6  },
        { x1: 3, y1: 12, x2: 21, y2: 12 },
        { x1: 3, y1: 18, x2: 21, y2: 18 }
      ];
      var CLOSE = [
        { x1: 5,  y1: 5,  x2: 19, y2: 19 },
        { x1: 12, y1: 12, x2: 12, y2: 12 },
        { x1: 19, y1: 5,  x2: 5,  y2: 19 }
      ];

      function easeInOut(t) { return t < 0.5 ? 2*t*t : -1+(4-2*t)*t; }

      function animateLines(from, to) {
        var start = performance.now();
        function step(now) {
          var t = Math.min((now - start) / DUR, 1);
          var e = easeInOut(t);
          lines.forEach(function (line, i) {
            line.setAttribute('x1', from[i].x1 + (to[i].x1 - from[i].x1) * e);
            line.setAttribute('y1', from[i].y1 + (to[i].y1 - from[i].y1) * e);
            line.setAttribute('x2', from[i].x2 + (to[i].x2 - from[i].x2) * e);
            line.setAttribute('y2', from[i].y2 + (to[i].y2 - from[i].y2) * e);
          });
          if (t < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      }

      function openMenu() {
        isOpen = true;
        hamburger.setAttribute('aria-expanded', 'true');
        navMobile.setAttribute('aria-hidden', 'false');
        navMobile.classList.add('open');
        document.body.style.overflow = 'hidden';
        animateLines(HAMBURGER, CLOSE);
      }

      function closeMenu() {
        isOpen = false;
        hamburger.setAttribute('aria-expanded', 'false');
        navMobile.setAttribute('aria-hidden', 'true');
        navMobile.classList.remove('open');
        document.body.style.overflow = '';
        animateLines(CLOSE, HAMBURGER);
      }

      hamburger.addEventListener('click', function () {
        if (isOpen) closeMenu(); else openMenu();
      });

      document.querySelectorAll('.nav-mobile-link').forEach(function (link) {
        link.addEventListener('click', closeMenu);
      });
    })();
