// Hero logo reveal (scroll-driven, lerp smoothing)
    const heroOuter       = document.getElementById('hero');
    const veloxCutout     = document.getElementById('velox-cutout');
    const heroTextContent = document.getElementById('hero-text-content');
    const heroMaskSvg     = document.getElementById('hero-mask-svg');

    // 페이지 항상 최상단에서 시작 — 브라우저 스크롤 복원 비활성화
    if (history.scrollRestoration) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);

    let heroTargetProgress = 0;
    let heroCurProgress = 0;
    let heroAnimDone = false;

    window.addEventListener('scroll', () => {
      const heroScrollRange = heroOuter.offsetHeight - window.innerHeight;
      const next = Math.min(Math.max(window.scrollY / heroScrollRange, 0), 1);
      heroTargetProgress = next;

      // 뒤로 스크롤 시 heroAnimDone 리셋
      if (heroAnimDone && next < 0.85) {
        heroAnimDone = false;
      }

      // 텍스트가 나타나기 시작하는 시점(0.88)부터 스크롤 잠금 + 애니메이션 완주 보장
      if (!heroAnimDone && heroTargetProgress >= 0.88) {
        document.body.style.overflow = 'hidden';
        heroTargetProgress = 1;
      }
    }, { passive: true });

    function heroTick() {
      heroCurProgress += (heroTargetProgress - heroCurProgress) * 0.07;
      const p = heroCurProgress;

      // ① 글자 구멍 확대 — 데스크톱: pivot (860, 560), 모바일: pivot (960, 560)
      const scale = 1 + p * 200;
      const pivotX = window.innerWidth <= 768 ? 960 : 860;
      veloxCutout.setAttribute('transform',
        `translate(${pivotX}, 560) scale(${scale}) translate(-${pivotX}, -560)`);

      // ② 검은 영역 최대 후 SVG 페이드아웃 (p 0.55→0.65)
      heroMaskSvg.style.opacity = p >= 0.55
        ? Math.max(0, 1 - (p - 0.55) / 0.10).toFixed(3)
        : '1';

      // ③ 텍스트 페이드인 (p 0.88→1.0)
      const textT = p > 0.88 ? Math.min((p - 0.88) / 0.12, 1) : 0;
      heroTextContent.style.opacity = textT;
      heroTextContent.style.pointerEvents = textT > 0.5 ? 'auto' : 'none';

      // ④ 텍스트 opacity 100% 완료 시 스크롤 잠금 해제
      if (!heroAnimDone && textT >= 0.99) {
        heroAnimDone = true;
        document.body.style.overflow = '';
      }

      requestAnimationFrame(heroTick);
    }
    heroTick();

    // GNB scroll + FAB
    const gnb = document.getElementById('gnb');
    const fabTop = document.getElementById('fab-top');
    let gnbLastY = 0;
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      gnb.classList.toggle('is-scrolled', y > 60);
      if (y > 80) {
        gnb.classList.toggle('is-hidden', y > gnbLastY);
      } else {
        gnb.classList.remove('is-hidden');
      }
      gnbLastY = y;
    }, { passive: true });

    // FAB click
    let scrollingToTop = false;
    function scrollToTop() {
      scrollingToTop = true;
      expertiseLocked = false;
      document.body.style.overflow = '';
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => { scrollingToTop = false; }, 1200);
    }
    fabTop.addEventListener('click', scrollToTop);
    fabTop.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') scrollToTop(); });

    // Hamburger
    // GNB 링크 클릭 시 expertise lock 해제 후 이동
    let gnbNavigating = false;
    document.querySelectorAll('.gnb-nav-link, .gnb-mobile-nav a').forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (!href || !href.startsWith('#')) return;
        const target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        expertiseLocked = false;
        document.body.style.overflow = '';
        gnbNavigating = true;
        // 모바일 메뉴 닫기
        hamburger.classList.remove('is-open');
        hamburger.setAttribute('aria-expanded', 'false');
        mobileNav.classList.remove('is-open');
        document.getElementById('gnb').classList.remove('menu-open');
        target.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => { gnbNavigating = false; }, 1200);
      });
    });

    const hamburger = document.getElementById('hamburger');
    const mobileNav = document.getElementById('mobile-nav');
    hamburger.addEventListener('click', () => {
      const open = hamburger.classList.toggle('is-open');
      hamburger.setAttribute('aria-expanded', open);
      mobileNav.classList.toggle('is-open', open);
      document.getElementById('gnb').classList.toggle('menu-open', open);
    });

    // Reveal on scroll
    const revealEls = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(el => observer.observe(el));

    // Drag cursor
    const dragCursor = document.getElementById('drag-cursor');
    const productCards = document.querySelectorAll('.product-card');

    productCards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        dragCursor.classList.add('is-visible');
        track.classList.add('hide-cursor');
      });
      card.addEventListener('mouseleave', () => {
        if (!isDragging) {
          dragCursor.classList.remove('is-visible');
          track.classList.remove('hide-cursor');
        }
      });
    });

    document.addEventListener('mousemove', e => {
      dragCursor.style.left = e.clientX + 'px';
      dragCursor.style.top = e.clientY + 'px';
    });

    // Icon draw-on: IntersectionObserver
    (() => {
      const track = document.getElementById('products-track');
      if (!track || !('IntersectionObserver' in window)) return;
      track.classList.add('js-draw');
      const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            track.classList.add('is-visible');
            io.disconnect();
          }
        });
      }, { threshold: 0.3 });
      io.observe(track);
    })();

    // Drag + Auto scroll
    const track = document.getElementById('products-track');
    let isDragging = false, isPaused = false, startX, scrollLeft;
    const autoSpeed = 0.6;
    let rafId;

    function autoScroll() {
      if (!isDragging && !isPaused) {
        track.scrollLeft += autoSpeed;
        if (track.scrollLeft >= track.scrollWidth - track.clientWidth) {
          track.scrollLeft = 0;
        }
      }
      rafId = requestAnimationFrame(autoScroll);
    }
    autoScroll();

    track.addEventListener('mouseenter', () => { isPaused = true; });
    track.addEventListener('mouseleave', () => { if (!isDragging) isPaused = false; });

    track.addEventListener('mousedown', e => {
      isDragging = true;
      isPaused = true;
      track.classList.add('is-dragging');
      dragCursor.classList.add('is-dragging');
      startX = e.pageX - track.offsetLeft;
      scrollLeft = track.scrollLeft;
    });

    document.addEventListener('mouseup', () => {
      isDragging = false;
      track.classList.remove('is-dragging');
      track.classList.remove('hide-cursor');
      dragCursor.classList.remove('is-dragging');
      dragCursor.classList.remove('is-visible');
    });

    track.addEventListener('mousemove', e => {
      if (!isDragging) return;
      e.preventDefault();
      const x = e.pageX - track.offsetLeft;
      track.scrollLeft = scrollLeft - (x - startX) * 1.5;
    });

    track.addEventListener('dragstart', e => e.preventDefault());

    // News track: drag + auto-scroll
    const newsTrack = document.getElementById('news-track');
    let newsIsDragging = false, newsIsPaused = false, newsStartX, newsScrollLeft;
    const newsAutoSpeed = 0.5;
    let newsRafId;

    function newsAutoScroll() {
      if (!newsIsDragging && !newsIsPaused) {
        newsTrack.scrollLeft += newsAutoSpeed;
        if (newsTrack.scrollLeft >= newsTrack.scrollWidth - newsTrack.clientWidth) newsTrack.scrollLeft = 0;
      }
      newsRafId = requestAnimationFrame(newsAutoScroll);
    }
    newsAutoScroll();

    const newsCards = document.querySelectorAll('.news-card');
    newsCards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        dragCursor.classList.add('is-visible');
        newsTrack.classList.add('hide-cursor');
      });
      card.addEventListener('mouseleave', () => {
        if (!newsIsDragging) {
          dragCursor.classList.remove('is-visible');
          newsTrack.classList.remove('hide-cursor');
        }
      });
    });

    newsTrack.addEventListener('mouseenter', () => { newsIsPaused = true; });
    newsTrack.addEventListener('mouseleave', () => { if (!newsIsDragging) newsIsPaused = false; });
    newsTrack.addEventListener('mousedown', e => {
      newsIsDragging = true; newsIsPaused = true;
      newsStartX = e.pageX - newsTrack.offsetLeft;
      newsScrollLeft = newsTrack.scrollLeft;
      newsTrack.classList.add('is-dragging');
      dragCursor.classList.add('is-dragging');
    });
    document.addEventListener('mousemove', e => {
      if (!newsIsDragging) return;
      const x = e.pageX - newsTrack.offsetLeft;
      newsTrack.scrollLeft = newsScrollLeft - (x - newsStartX);
    });
    document.addEventListener('mouseup', () => {
      if (!newsIsDragging) return;
      newsIsDragging = false; newsIsPaused = false;
      newsTrack.classList.remove('is-dragging');
      newsTrack.classList.remove('hide-cursor');
      dragCursor.classList.remove('is-dragging');
      dragCursor.classList.remove('is-visible');
    });
    newsTrack.addEventListener('dragstart', e => e.preventDefault());

    // Vision: split title + card rise + scale wheel + snap
    const expertiseSection = document.getElementById('vision');
    const expertiseTitleLeft = document.getElementById('expertise-title-left');
    const expertiseTitleRight = document.getElementById('expertise-title-right');
    const expertiseCardsContainer = document.getElementById('expertise-cards-container');
    const expertiseCardEls = document.querySelectorAll('.expertise-card');
    let lastScrollY = window.scrollY;
    let snapLocked = false;
    let expertiseSpreadLeft = 0;
    let expertiseSpreadRight = 0;
    let spreadDone = false;
    let riseDone = false;

    function measureExpertiseSpread() {
      expertiseTitleLeft.style.transform = '';
      expertiseTitleRight.style.transform = '';
      const headingEl = document.querySelector('.expertise-heading');
      const headingRect = headingEl.getBoundingClientRect();
      const leftRect = expertiseTitleLeft.getBoundingClientRect();
      const rightRect = expertiseTitleRight.getBoundingClientRect();
      const pl = parseFloat(getComputedStyle(headingEl).paddingLeft);
      const pr = parseFloat(getComputedStyle(headingEl).paddingRight);
      expertiseSpreadLeft = leftRect.left - (headingRect.left + pl);
      expertiseSpreadRight = (headingRect.right - pr) - rightRect.right;
    }

    function easeInOut(t) {
      return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    }

    function animateSpread() {
      if (spreadDone) return;
      const duration = 1200;
      const start = performance.now();
      function tick(now) {
        const t = Math.min(1, (now - start) / duration);
        const s = easeInOut(t);
        expertiseTitleLeft.style.transform = `translateX(-${s * expertiseSpreadLeft}px)`;
        expertiseTitleRight.style.transform = `translateX(${s * expertiseSpreadRight}px)`;
        if (t < 1) { requestAnimationFrame(tick); }
        else { spreadDone = true; animateRise(); }
      }
      requestAnimationFrame(tick);
    }

    function animateRise() {
      if (riseDone) return;
      riseDone = true;
      renderCards(0);
      riseDone = false;
      const duration = 900;
      const delay = 200;
      const start = performance.now() + delay;
      function tick(now) {
        if (now < start) { requestAnimationFrame(tick); return; }
        const t = Math.min(1, (now - start) / duration);
        const s = easeInOut(t);
        expertiseCardsContainer.style.transform = `translateY(${(1 - s) * 80}vh)`;
        expertiseCardsContainer.style.opacity = s.toFixed(4);
        if (t < 1) { requestAnimationFrame(tick); }
        else {
          riseDone = true;
          expertiseCardsContainer.style.pointerEvents = 'auto';
          renderCards(cardFloat);
        }
      }
      requestAnimationFrame(tick);
    }

    new IntersectionObserver((entries, obs) => {
      if (entries[0].isIntersecting) {
        animateSpread();
        obs.disconnect();
      }
    }, { threshold: 0.2 }).observe(expertiseSection);

    const totalCards = expertiseCardEls.length;
    let expertiseCardIndex = 0;
    let expertiseSnapLocked = false;
    let cardFloat = 0;
    let cardLoopId = null;

    function renderCards(float) {
      const isMobile = window.innerWidth <= 768;
      const maxScale = isMobile ? 1.0 : 1.14;
      const cardHeight = expertiseCardEls[0] ? expertiseCardEls[0].offsetHeight : 400;
      const gap = cardHeight * maxScale + 32;
      expertiseCardEls.forEach((card, i) => {
        const dist = i - float;
        const absDist = Math.abs(dist);
        const scale = Math.max(0.60, maxScale - absDist * 0.22);
        const translateY = dist * gap;
        const cardOpacity = Math.max(0, 1 - absDist * 0.4);
        card.style.transform = `translateY(calc(-50% + ${translateY}px)) scale(${scale.toFixed(4)})`;
        card.style.opacity = cardOpacity.toFixed(4);
        card.style.zIndex = Math.round(10 - absDist * 3);
        const video = card.querySelector('.expertise-card-video');
        if (video) {
          if (absDist < 0.4) { if (video.paused) video.play().catch(() => {}); }
          else { if (!video.paused) video.pause(); }
        }
      });
    }

    function cardLoop() {
      cardFloat += (expertiseCardIndex - cardFloat) * 0.12;
      renderCards(cardFloat);
      if (Math.abs(expertiseCardIndex - cardFloat) > 0.001) {
        cardLoopId = requestAnimationFrame(cardLoop);
      } else {
        cardFloat = expertiseCardIndex;
        renderCards(cardFloat);
        cardLoopId = null;
        expertiseSnapLocked = false;
      }
    }

    function animateToCard(index) {
      expertiseCardIndex = index;
      if (cardLoopId === null) cardLoopId = requestAnimationFrame(cardLoop);
    }

    let expertiseLocked = false;
    let lastScrollDir = 1;

    function lockExpertise() {
      expertiseLocked = true;
      window.scrollTo(0, expertiseSection.offsetTop);
      document.body.style.overflow = 'hidden';
    }

    function unlockExpertise(direction) {
      expertiseLocked = false;
      document.body.style.overflow = '';
      const isMobile = window.innerWidth <= 768;
      requestAnimationFrame(() => {
        if (direction > 0) {
          const next = expertiseSection.nextElementSibling;
          if (next) {
            if (isMobile) {
              window.scrollTo({ top: next.offsetTop, behavior: 'smooth' });
            } else {
              next.scrollIntoView({ behavior: 'smooth' });
            }
          }
        } else {
          const prev = expertiseSection.previousElementSibling;
          if (prev) {
            if (isMobile) {
              window.scrollTo({ top: prev.offsetTop, behavior: 'smooth' });
            } else {
              prev.scrollIntoView({ behavior: 'smooth' });
            }
          }
        }
      });
    }

    // 헤딩 텍스트 진입 시 snap + 즉시 scroll 잠금
    new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && lastScrollDir > 0 && !snapLocked && !expertiseLocked && !scrollingToTop && !gnbNavigating) {
        snapLocked = true;
        document.body.style.overflow = 'hidden';
        expertiseSection.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => {
          snapLocked = false;
          lockExpertise();
        }, 800);
      }
    }, { threshold: 0.4 }).observe(document.getElementById('expertise-heading'));

    // 섹션 60% 진입 시 lock
    new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !expertiseLocked && !scrollingToTop && !gnbNavigating) {
        const startIndex = lastScrollDir > 0 ? 0 : totalCards - 1;
        expertiseCardIndex = startIndex;
        cardFloat = startIndex;
        if (riseDone) renderCards(cardFloat);
        lockExpertise();
      }
    }, { threshold: 0.6 }).observe(expertiseSection);

    window.addEventListener('wheel', (e) => {
      if (!expertiseLocked) return;
      e.preventDefault();
      if (!riseDone || expertiseSnapLocked) return;

      const direction = e.deltaY > 0 ? 1 : -1;
      const nextIndex = expertiseCardIndex + direction;

      if (nextIndex < 0 || nextIndex >= totalCards) {
        unlockExpertise(direction);
        return;
      }

      expertiseSnapLocked = true;
      animateToCard(nextIndex);
    }, { passive: false });

    // 모바일 터치 스와이프
    let touchStartY = 0;
    window.addEventListener('touchstart', (e) => {
      touchStartY = e.touches[0].clientY;
    }, { passive: true });
    window.addEventListener('touchmove', (e) => {
      if (expertiseLocked) e.preventDefault();
    }, { passive: false });
    window.addEventListener('touchend', (e) => {
      if (!expertiseLocked || !riseDone || expertiseSnapLocked) return;
      const deltaY = touchStartY - e.changedTouches[0].clientY;
      if (Math.abs(deltaY) < 40) return;

      const direction = deltaY > 0 ? 1 : -1;
      const nextIndex = expertiseCardIndex + direction;

      if (nextIndex < 0 || nextIndex >= totalCards) {
        unlockExpertise(direction);
        return;
      }

      expertiseSnapLocked = true;
      animateToCard(nextIndex);
    }, { passive: true });

    window.addEventListener('scroll', () => {
      const currentY = window.scrollY;
      lastScrollDir = currentY > lastScrollY ? 1 : -1;
      lastScrollY = currentY;
    }, { passive: true });

    // Init on load
    measureExpertiseSpread();
    window.addEventListener('resize', () => { measureExpertiseSpread(); });

    // Scale: scroll-driven ring rotation + stats focus
    const scaleScrollOuter = document.getElementById('scale-scroll-outer');
    const scaleRing = document.getElementById('scale-circle-ring');
    const scaleStatsInner = document.getElementById('scale-stats-inner');
    const scaleStatEls = document.querySelectorAll('.scale-stat');

    let scaleTargetRot = 0, scaleCurRot = 0;
    let scaleTargetTY = 0, scaleCurTY = 0;

    (function scaleRAF() {
      scaleCurRot += (scaleTargetRot - scaleCurRot) * 0.08;
      scaleCurTY  += (scaleTargetTY  - scaleCurTY)  * 0.08;
      scaleRing.style.transform       = `rotate(${scaleCurRot}deg)`;
      scaleStatsInner.style.transform = `translateY(${scaleCurTY}px)`;
      requestAnimationFrame(scaleRAF);
    })();

    function updateScaleScroll() {
      const rect = scaleScrollOuter.getBoundingClientRect();
      const totalRange = scaleScrollOuter.offsetHeight - window.innerHeight;
      if (totalRange <= 0) return;
      const p = Math.max(0, Math.min(1, -rect.top / totalRange));

      scaleTargetRot = p * 360;
      scaleTargetTY  = -(p * 2.00 * window.innerHeight);

      const activeIdx = Math.min(Math.floor(p * 4), 3);
      scaleStatEls.forEach((el, i) => el.classList.toggle('is-active', i === activeIdx));
    }

    window.addEventListener('scroll', updateScaleScroll, { passive: true });
    updateScaleScroll();

    // Flow: sequential bar animation
    const flowGanttBody = document.getElementById('flow-gantt-body');
    const flowBars = document.querySelectorAll('.flow-bar');
    const flowBarDescs = document.querySelectorAll('.flow-bar-desc');
    const flowStepDescs = document.querySelectorAll('.flow-step-desc');
    let flowFired = false;
    const BAR_DURATION = 700;   // ms per bar fill
    const BAR_GAP     = 200;    // ms gap between bars

    new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !flowFired) {
        flowFired = true;
        flowBars.forEach((bar, i) => {
          const delay = i * (BAR_DURATION + BAR_GAP);
          setTimeout(() => {
            bar.classList.add('is-visible');
            setTimeout(() => {
              if (flowBarDescs[i]) flowBarDescs[i].classList.add('is-visible');
              if (flowStepDescs[i]) flowStepDescs[i].classList.add('is-visible');
            }, BAR_DURATION * 0.6);
          }, delay);
        });
      }
    }, { threshold: 0.2 }).observe(flowGanttBody);

    // Scale stat: 모바일 fade-in
    if (window.innerWidth <= 768) {
      const scaleStatRevealObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            scaleStatRevealObs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.2 });
      scaleStatEls.forEach(el => scaleStatRevealObs.observe(el));
    }

    // Footer reveal — observe banner
    const footer = document.querySelector('.footer');
    const bannerSection = document.getElementById('banner');
    new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) footer.classList.add('is-revealed');
    }, { threshold: 0.6 }).observe(bannerSection);
