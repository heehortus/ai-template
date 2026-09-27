/* ── Custom cursor (PC 전용) ── */
    const cursor = document.getElementById('customCursor');
    if (window.innerWidth > 640) {
      document.addEventListener('mousemove', e => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top  = e.clientY + 'px';
      }, { passive: true });

      const hoverTargets = 'a, button, .featured-item, [data-img]';
      document.addEventListener('mouseover', e => {
        if (e.target.closest(hoverTargets)) cursor.classList.add('hover');
      });
      document.addEventListener('mouseout', e => {
        if (e.target.closest(hoverTargets)) cursor.classList.remove('hover');
      });
    }

    /* ── Featured More 버튼 (모바일 전용) ── */
    (function () {
      if (window.innerWidth > 640) return;

      const wrap  = document.querySelector('.featured-list-wrap');
      const list  = document.querySelector('.featured-list');
      if (!list || !wrap) return;
      const items = Array.from(list.querySelectorAll('.featured-item'));
      const LIMIT = 5;
      if (items.length <= LIMIT) return;

      items.forEach(function (item, i) {
        if (i >= LIMIT) item.classList.add('hidden');
      });

      const btn = document.createElement('button');
      btn.className = 'featured-more';
      btn.textContent = 'More';
      wrap.after(btn);

      btn.addEventListener('click', function () {
        items.forEach(function (item, i) {
          if (i >= LIMIT) item.classList.remove('hidden');
        });
        wrap.classList.add('expanded');
        btn.remove();
      });
    })();

    /* ── Series hover popup ── */
    (function () {
      const popup    = document.getElementById('seriesPopup');
      const popupImg = document.getElementById('seriesPopupImg');
      const popupTag = document.getElementById('seriesPopupTag');
      const popupTitle = document.getElementById('seriesPopupTitle');

      let mouseX = -360, mouseY = -160;

      document.addEventListener('mousemove', e => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        if (popup.classList.contains('visible')) {
          popup.style.left = mouseX + 'px';
          popup.style.top  = mouseY + 'px';
        }
      });

      const isMobile = window.innerWidth <= 640;
      let autoCloseTimer = null;

      document.querySelectorAll('.featured-item[data-img]').forEach(item => {
        item.addEventListener('mouseenter', () => {
          if (isMobile) return;
          const img   = item.dataset.img;
          const title = item.querySelector('.featured-item-name').textContent;
          const tag   = item.querySelector('.featured-item-tag').textContent;

          popupImg.src           = img;
          popupTitle.textContent = title;
          popupTag.textContent   = tag;

          popup.style.left = mouseX + 'px';
          popup.style.top  = mouseY + 'px';
          popup.classList.add('visible');
          cursor.style.opacity = '0';
        });

        item.addEventListener('mouseleave', () => {
          if (isMobile) return;
          popup.classList.remove('visible');
          cursor.style.opacity = '1';
        });

        if (isMobile) {
          item.addEventListener('click', () => {
            const img   = item.dataset.img;
            const title = item.querySelector('.featured-item-name').textContent;
            const tag   = item.querySelector('.featured-item-tag').textContent;

            popupImg.src           = img;
            popupTitle.textContent = title;
            popupTag.textContent   = tag;
            popup.classList.add('visible');

            clearTimeout(autoCloseTimer);
            autoCloseTimer = setTimeout(() => {
              popup.classList.remove('visible');
            }, 1400);
          });
        }
      });

      if (isMobile) {
        popup.addEventListener('click', () => {
          popup.classList.remove('visible');
        });
      }
    })();

    /* hero → next section snap */
    (function () {
      const hero    = document.getElementById('hero');
      const nextSec = document.getElementById('studio');
      let locked    = false;

      function snapToNext() {
        if (locked) return;
        locked = true;
        nextSec.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => { locked = false; }, 1000);
      }

      window.addEventListener('wheel', e => {
        if (window.scrollY < hero.offsetHeight * 0.9 && e.deltaY > 0) {
          e.preventDefault();
          snapToNext();
        }
      }, { passive: false });

      window.addEventListener('touchstart', e => {
        if (window.scrollY < hero.offsetHeight * 0.9) {
          window._heroTouchY = e.touches[0].clientY;
        }
      }, { passive: true });

      window.addEventListener('touchend', e => {
        if (window.scrollY < hero.offsetHeight * 0.9 && window._heroTouchY != null) {
          const dy = window._heroTouchY - e.changedTouches[0].clientY;
          if (dy > 30) snapToNext();
          window._heroTouchY = null;
        }
      }, { passive: true });
    })();

    /* nav hide on scroll down */
    const nav = document.getElementById('nav');
    let lastY = 0;
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      nav.classList.toggle('hidden', y > lastY && y > 80);
      lastY = y;
    }, { passive: true });

    /* hamburger */
    const burger = document.getElementById('burger');
    const overlay = document.getElementById('navOverlay');
    burger.addEventListener('click', () => {
      const open = overlay.classList.toggle('open');
      burger.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    function closeNav() {
      overlay.classList.remove('open');
      burger.classList.remove('open');
      document.body.style.overflow = '';
    }

    /* hero headline line reveal */
    function heroReveal() {
      document.querySelectorAll('.hero-headline .line-inner').forEach(el => {
        const delay = parseInt(el.dataset.delay || 0);
        setTimeout(() => el.classList.add('in'), 200 + delay);
      });
      document.querySelectorAll('.hero .fade').forEach(el => {
        setTimeout(() => el.classList.add('in'), 600);
      });
      setTimeout(() => {
        document.querySelector('.hero-wordmark-of').classList.add('in');
        document.querySelector('.hero-wordmark-rule').classList.add('in');
      }, 600);
      setTimeout(() => {
        document.querySelector('.hero-wordmark-frame').classList.add('in');
      }, 720);
    }
    window.addEventListener('load', heroReveal);

    /* scroll reveal (general) */
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add('in');
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -32px 0px' });

    document.querySelectorAll('.reveal, .fade').forEach(el => {
      if (!el.closest('.hero')) io.observe(el);
    });

    /* ── Current 카드 auto-focus ── */
    (function () {
      const cards = document.querySelectorAll('.current-card');
      if (!cards.length) return;
      const cardObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('focused');
          } else {
            entry.target.classList.remove('focused');
          }
        });
      }, { threshold: 0.9 });
      cards.forEach(function (card) { cardObs.observe(card); });
    })();

    /* scroll-driven 글자 단위 reveal */
    (function () {
      const section = document.querySelector('.scroll-text-section');
      const lines   = document.querySelectorAll('.scroll-line');
      if (!section || !lines.length) return;

      /* 모바일: 글자 분리 없이 줄 단위 순차 reveal */
      if (window.innerWidth <= 640) {
        lines.forEach(function (line) {
          line.style.opacity    = '0';
          line.style.transform  = 'translateY(16px)';
          line.style.transition = 'opacity 700ms cubic-bezier(0.16,1,0.3,1), transform 700ms cubic-bezier(0.16,1,0.3,1)';
        });
        const sectionObs = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              lines.forEach(function (line, i) {
                setTimeout(function () {
                  line.style.opacity   = '1';
                  line.style.transform = 'none';
                }, i * 600);
              });
              sectionObs.unobserve(entry.target);
            }
          });
        }, { threshold: 0.3 });
        sectionObs.observe(section);
        return;
      }

      /* 1) 글자 단위 <span> 분리 (데스크톱) */
      const allChars = [];
      lines.forEach(line => {
        const text = line.textContent;
        line.textContent = '';
        [...text].forEach(ch => {
          const span = document.createElement('span');
          if (ch === ' ') {
            span.className = 'char char-space';
          } else {
            span.className = 'char';
            span.textContent = ch;
            allChars.push(span);
          }
          line.appendChild(span);
        });
      });

      const TOTAL         = allChars.length;
      const ANIM_DURATION = 560;

      let allDone      = false;
      let lastCharTime = null;
      let pendingDelta = 0;

      /* 2) 스크롤 진행률 → 글자 reveal */
      function onScroll() {
        const rect       = section.getBoundingClientRect();
        const sectionH   = section.offsetHeight;
        const vh         = window.innerHeight;
        const scrolled   = -rect.top;
        const scrollable = sectionH - vh;
        const progress   = Math.max(0, Math.min(1, scrolled / scrollable));

        const revealProgress = Math.min(progress / 0.8, 1);
        const visibleCount   = Math.floor(revealProgress * TOTAL);

        allChars.forEach((char, i) => {
          const shouldBeVisible = i < visibleCount;
          if (shouldBeVisible && !char.classList.contains('visible')) {
            char.classList.add('visible');
            if (i === TOTAL - 1) lastCharTime = Date.now();
          } else if (!shouldBeVisible) {
            char.classList.remove('visible');
            if (i === TOTAL - 1) { lastCharTime = null; allDone = false; }
          }
        });

        if (lastCharTime && !allDone) {
          if (Date.now() - lastCharTime >= ANIM_DURATION) {
            allDone = true;
            unlock();
          }
        }
      }

      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    })();
