(function () {
    'use strict';

    /* ─────────────────────────────────────────
       NAV SCROLL FILL
    ───────────────────────────────────────── */
    const nav = document.getElementById('nav');
    function updateNav() {
      if (window.scrollY > 40) {
        nav.classList.add('nav--fill');
        nav.classList.remove('nav--transparent');
      } else {
        nav.classList.remove('nav--fill');
        nav.classList.add('nav--transparent');
      }
    }
    updateNav();
    window.addEventListener('scroll', updateNav, { passive: true });


    /* ─────────────────────────────────────────
      COUNT-UP ANIMATION
    ───────────────────────────────────────── */
    function easeOutCubic(t) {
      return 1 - Math.pow(1 - t, 3);
    }

    function formatNumber(val, suffix, decimal) {
      let display;
      if (decimal) {
        display = (val / Math.pow(10, decimal)).toFixed(decimal);
      } else {
        display = Math.floor(val).toLocaleString('ko-KR');
      }
      return display + suffix;
    }

    function animateCount(el) {
      const target  = parseFloat(el.dataset.count);
      const suffix  = el.dataset.suffix || '';
      const decimal = parseInt(el.dataset.decimal || '0', 10);
      const dur     = 1400;
      let   start   = null;

      function step(ts) {
        if (!start) start = ts;
        const elapsed  = ts - start;
        const progress = Math.min(elapsed / dur, 1);
        const eased    = easeOutCubic(progress);
        const current  = eased * target;
        el.textContent = formatNumber(current, suffix, decimal);
        if (progress < 1) requestAnimationFrame(step);
      }

      requestAnimationFrame(step);
    }

    const countObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          countObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    document.querySelectorAll('[data-count]').forEach(function (el) {
      countObserver.observe(el);
    });




    /* ─────────────────────────────────────────
      SCROLL REVEAL
    ───────────────────────────────────────── */
    const rvObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('on');
          rvObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    document.querySelectorAll('.rv, .rv-left, .rv-right').forEach(function (el) {
      rvObserver.observe(el);
    });


    /* ─────────────────────────────────────────
      PROCESS LINE ANIMATION
    ───────────────────────────────────────── */
    function buildProcessSpine() {
      const stepsEl = document.getElementById('processSteps');
      const spineEl = document.getElementById('processSpine');
      if (!stepsEl || !spineEl) return;

      const steps = stepsEl.querySelectorAll('.p-step');
      if (!steps.length) return;

      // Wait for layout
      requestAnimationFrame(function () {
        const spineParent = spineEl.parentElement;
        const totalH      = stepsEl.offsetHeight;
        const nodeR       = 12;

        spineEl.setAttribute('width',  nodeR * 2 + 4);
        spineEl.setAttribute('height', totalH);
        spineEl.setAttribute('viewBox', '0 0 ' + (nodeR * 2 + 4) + ' ' + totalH);

        const cx = nodeR + 2;

        // Positions of nodes = vertical centre of each step's title
        const nodeY = [];
        steps.forEach(function (step) {
          const stepTop  = step.offsetTop;
          const titleEl  = step.querySelector('.p-step__title');
          const titleTop = titleEl ? titleEl.offsetTop : 16;
          const titleMid = titleEl ? titleEl.offsetHeight / 2 : 12;
          nodeY.push(stepTop + titleTop + titleMid);
        });

        const lineTop    = nodeY[0];
        const lineBottom = nodeY[nodeY.length - 1];
        const lineLen    = lineBottom - lineTop;

        // Vertical line
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', cx); line.setAttribute('y1', lineTop);
        line.setAttribute('x2', cx); line.setAttribute('y2', lineBottom);
        line.setAttribute('stroke', '#e5e7eb');
        line.setAttribute('stroke-width', '4');
        line.setAttribute('stroke-linecap', 'round');
        line.id = 'processLine';
        spineEl.appendChild(line);

        // Animated overlay line
        const animLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        animLine.setAttribute('x1', cx); animLine.setAttribute('y1', lineTop);
        animLine.setAttribute('x2', cx); animLine.setAttribute('y2', lineBottom);
        animLine.setAttribute('stroke', '#242424');
        animLine.setAttribute('stroke-width', '4');
        animLine.setAttribute('stroke-linecap', 'round');
        animLine.setAttribute('stroke-dasharray', lineLen);
        animLine.setAttribute('stroke-dashoffset', lineLen);
        animLine.id = 'processAnimLine';
        spineEl.appendChild(animLine);

        // Node circles
        const circles = [];
        nodeY.forEach(function (y) {
          const bg = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
          bg.setAttribute('cx', cx); bg.setAttribute('cy', y);
          bg.setAttribute('r',  nodeR);
          bg.setAttribute('fill', '#fafafa');
          bg.setAttribute('stroke', '#e5e7eb');
          bg.setAttribute('stroke-width', '4');
          spineEl.appendChild(bg);

          const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
          c.setAttribute('cx', cx); c.setAttribute('cy', y);
          c.setAttribute('r',  nodeR);
          c.setAttribute('fill', '#242424');
          c.setAttribute('stroke', '#242424');
          c.setAttribute('stroke-width', '4');
          c.style.transformOrigin = cx + 'px ' + y + 'px';
          c.style.transform       = 'scale(0)';
          c.style.transition      = 'transform 300ms cubic-bezier(0.34,1.56,0.64,1)';
          spineEl.appendChild(c);
          circles.push(c);
        });

        // Observe and animate
        let animated = false;
        const processObs = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting && !animated) {
              animated = true;

              const dur      = 2400;
              let   startTs  = null;

              function animStep(ts) {
                if (!startTs) startTs = ts;
                const elapsed  = ts - startTs;
                const progress = Math.min(elapsed / dur, 1);
                const eased    = easeOutCubic(progress);
                const offset   = lineLen * (1 - eased);

                animLine.setAttribute('stroke-dashoffset', offset);

                // Pop nodes at 25% intervals
                const thresholds = [0.25, 0.5, 0.75, 1.0];
                thresholds.forEach(function (th, i) {
                  if (eased >= th && circles[i]) {
                    circles[i].style.transform = 'scale(1)';
                  }
                });

                if (progress < 1) requestAnimationFrame(animStep);
              }

              requestAnimationFrame(animStep);
              processObs.unobserve(entry.target);
            }
          });
        }, { threshold: 0.2 });

        processObs.observe(document.getElementById('process'));
      });
    }

    document.addEventListener('DOMContentLoaded', function () {
      setTimeout(buildProcessSpine, 100);
    });


    /* ─────────────────────────────────────────
      TIMELINE CARDS REVEAL + SLIDESHOW
    ───────────────────────────────────────── */
    document.addEventListener('DOMContentLoaded', function () {
      /* 카드 순차 등장 */
      const cards = document.querySelectorAll('.t-card');
      const cardObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('on');
            cardObs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.2 });
      cards.forEach(function (c) { cardObs.observe(c); });

      /* 이미지 슬라이드쇼 공통 함수 */
      function initSlideshow(container, interval) {
        const slides = container.querySelectorAll('.timeline-slide');
        if (slides.length <= 1) return;
        let current = 0;
        setInterval(function () {
          slides[current].classList.remove('active');
          current = (current + 1) % slides.length;
          slides[current].classList.add('active');
        }, interval);
      }

      /* timeline 슬라이드쇼 */
      const timelineMedia = document.getElementById('timelineMedia');
      if (timelineMedia) initSlideshow(timelineMedia, 1600);

      /* mission 슬라이드쇼 */
      const missionMedia = document.getElementById('missionMedia');
      if (missionMedia) initSlideshow(missionMedia, 1600);
    });


    /* ─────────────────────────────────────────
      TIMELINE PROGRESS BAR
    ───────────────────────────────────────── */
    (function () {
      const sec   = document.getElementById('clinical');
      const fill  = document.getElementById('timelineFill');
      const dot   = document.getElementById('timelineDot');
      if (!sec || !fill || !dot) return;

      function updateProgress() {
        const rect     = sec.getBoundingClientRect();
        const secH     = sec.offsetHeight;
        const viewH    = window.innerHeight;
        /* 섹션이 화면에 진입한 시점부터 벗어나는 시점까지 0→1 */
        const progress = Math.min(Math.max(-rect.top / (secH - viewH), 0), 1);
        const pct      = (progress * 100).toFixed(2);
        fill.style.height = pct + '%';
        dot.style.top     = pct + '%';
      }

      updateProgress();
      window.addEventListener('scroll', updateProgress, { passive: true });
    })();


    /* ─────────────────────────────────────────
      SMOOTH ANCHOR SCROLL
    ───────────────────────────────────────── */
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        const target = document.querySelector(a.getAttribute('href'));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });

    /* ─────────────────────────────────────────
      MOBILE NAV TOGGLE
    ───────────────────────────────────────── */
    (function () {
      const burger = document.getElementById('navBurger');
      const mobile = document.getElementById('navMobile');
      if (!burger || !mobile) return;

      const lines = burger.querySelectorAll('svg line');
      const HAMBURGER = [
        { x1: 3,  y1: 6,  x2: 21, y2: 6  },
        { x1: 3,  y1: 12, x2: 21, y2: 12 },
        { x1: 3,  y1: 18, x2: 21, y2: 18 }
      ];
      const CLOSE = [
        { x1: 5,  y1: 5,  x2: 19, y2: 19 },
        { x1: 12, y1: 12, x2: 12, y2: 12 },
        { x1: 19, y1: 5,  x2: 5,  y2: 19 }
      ];
      const DUR = 300;

      function easeInOut(t) {
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      }

      function animateLines(from, to) {
        const start = performance.now();
        function step(now) {
          const t = Math.min((now - start) / DUR, 1);
          const e = easeInOut(t);
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
        animateLines(HAMBURGER, CLOSE);
        lines[1].style.opacity = '0';
        mobile.classList.add('open');
        document.body.style.overflow = 'hidden';
        burger.setAttribute('aria-label', '메뉴 닫기');
      }
      function closeMenu() {
        animateLines(CLOSE, HAMBURGER);
        lines[1].style.opacity = '1';
        mobile.classList.remove('open');
        document.body.style.overflow = '';
        burger.setAttribute('aria-label', '메뉴 열기');
      }

      burger.addEventListener('click', function () {
        mobile.classList.contains('open') ? closeMenu() : openMenu();
      });
      mobile.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', closeMenu);
      });
    })();

    /* ─────────────────────────────────────────
       RESEARCH CAROUSEL SCROLLBAR
    ───────────────────────────────────────── */
    (function () {
      const grid  = document.querySelector('.research__grid');
      const track = document.getElementById('researchScrollbar');
      const thumb = document.getElementById('researchScrollbarThumb');
      if (!grid || !track || !thumb) return;

      function updateThumb() {
        const maxScroll = grid.scrollWidth - grid.clientWidth;
        if (maxScroll <= 0) { thumb.style.transform = 'translateX(0)'; return; }
        const ratio    = grid.scrollLeft / maxScroll;
        const trackW   = track.clientWidth;
        const thumbW   = thumb.clientWidth;
        const maxMove  = trackW - thumbW;
        thumb.style.transform = 'translateX(' + (ratio * maxMove) + 'px)';
      }

      grid.addEventListener('scroll', updateThumb, { passive: true });
      window.addEventListener('resize', updateThumb);
      updateThumb();
    })();

  })();
