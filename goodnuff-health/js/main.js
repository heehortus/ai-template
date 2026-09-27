// GNB scroll + FAB
    const gnb = document.getElementById('gnb');
    const fabTop = document.getElementById('fab-top');
    let gnbLastY = window.scrollY;
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      gnb.classList.toggle('is-scrolled', y > 60);
      if (!gnb.classList.contains('menu-open')) {
        gnb.classList.toggle('is-hidden', y > gnbLastY && y > 60);
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

    // Expertise: split title + card rise + scale wheel + snap
    const expertiseSection = document.getElementById('expertise');
    const expertiseTitleLeft = document.getElementById('expertise-title-left');
    const expertiseTitleRight = document.getElementById('expertise-title-right');
    const expertiseCardsContainer = document.getElementById('expertise-cards-container');
    const expertiseCardEls = document.querySelectorAll('.expertise-card');
    const newReleaseSection = document.getElementById('new-release');
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
      if (entries[0].isIntersecting && lastScrollDir > 0 && !snapLocked && !expertiseLocked && !scrollingToTop) {
        snapLocked = true;
        document.body.style.overflow = 'hidden';
        expertiseSection.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => {
          snapLocked = false;
          lockExpertise();
        }, 800);
      }
    }, { threshold: 0.4 }).observe(document.getElementById('expertise-heading'));

    // 섹션 60% 진입 시 lock (헤딩 observer 누락 보완)
    new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !expertiseLocked && !scrollingToTop) {
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

    // Footer reveal — observe banner (element before footer)
    const footer = document.querySelector('.footer');
    const bannerSection = document.getElementById('banner');
    new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) footer.classList.add('is-revealed');
    }, { threshold: 0.6 }).observe(bannerSection);
