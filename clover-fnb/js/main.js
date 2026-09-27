/* ── Nav scroll state ── */
    const nav = document.getElementById('mainNav');
    let lastScrollY = window.scrollY;
    window.addEventListener('scroll', () => {
      const currentY = window.scrollY;
      nav.classList.toggle('scrolled', currentY > 48);
      if (currentY > lastScrollY && currentY > 80) {
        nav.classList.add('nav-hidden');
      } else {
        nav.classList.remove('nav-hidden');
      }
      lastScrollY = currentY;
    }, { passive: true });

    /* ── Hero 스크롤 잠금 ── */
    function preventScroll(e) { e.preventDefault(); }
    window.addEventListener('wheel',      preventScroll, { passive: false });
    window.addEventListener('touchmove',  preventScroll, { passive: false });

    let heroScrollUnlocked = false;
    function unlockHeroScroll() {
      if (heroScrollUnlocked) return;
      heroScrollUnlocked = true;
      window.removeEventListener('wheel',     preventScroll);
      window.removeEventListener('touchmove', preventScroll);
    }

    // Start Scrolling 애니메이션 완료 후 자동 해제 (2.8s 등장 + 0.6s 애니메이션)
    setTimeout(unlockHeroScroll, 3500);

    /* ── Start Scrolling 버튼 → philosophy 부드럽게 이동 ── */
    const philSection = document.getElementById('philosophy');
    const scrollBtn   = document.querySelector('.scroll-indicator');

    scrollBtn.addEventListener('click', e => {
      e.preventDefault();
      unlockHeroScroll();
      firstScrollDone = true;
      requestAnimationFrame(() => {
        window.scrollTo({ top: philSection.offsetTop, behavior: 'smooth' });
      });
    });

    /* ── 첫 자연 스크롤도 philosophy로 스냅 ── */
    let firstScrollDone = false;
    window.addEventListener('wheel', function firstWheelHandler(e) {
      if (!heroScrollUnlocked) return;
      if (firstScrollDone) { window.removeEventListener('wheel', firstWheelHandler); return; }
      if (e.deltaY > 0 && window.scrollY < philSection.offsetTop - 10) {
        firstScrollDone = true;
        e.preventDefault();
        window.scrollTo({ top: philSection.offsetTop, behavior: 'smooth' });
      } else {
        firstScrollDone = true;
      }
    }, { passive: false });

    /* ── Philosophy 스크롤 드리븐 텍스트 전환 ── */
    const philLines   = philSection.querySelectorAll('.phil-line');
    const philDots    = philSection.querySelectorAll('.phil-dot');
    const philCircles = philSection.querySelectorAll('.phil-circle');
    let currentPhilIndex = -1;

    function updatePhilosophy() {
      const rect    = philSection.getBoundingClientRect();
      const scrolled = -rect.top;

      if (scrolled < 0) {
        if (currentPhilIndex !== -1) {
          philLines.forEach(l => l.classList.remove('visible', 'exited'));
          philCircles.forEach(c => c.classList.remove('open'));
          currentPhilIndex = -1;
        }
        return;
      }

      philCircles.forEach(c => c.classList.add('open'));

      const maxScroll = philSection.offsetHeight - window.innerHeight;
      const progress  = Math.min(scrolled / maxScroll, 1);
      const n         = philLines.length;
      const newIndex  = Math.min(Math.floor(progress * n), n - 1);

      if (newIndex !== currentPhilIndex) {
        currentPhilIndex = newIndex;
        philLines.forEach((line, i) => {
          if (i < newIndex) {
            line.classList.remove('visible');
            line.classList.add('exited');
          } else if (i === newIndex) {
            line.classList.remove('exited');
            line.classList.add('visible');
          } else {
            line.classList.remove('visible', 'exited');
          }
        });
        philDots.forEach((dot, i) => dot.classList.toggle('active', i === newIndex));
      }
    }

    window.addEventListener('scroll', updatePhilosophy, { passive: true });
    updatePhilosophy();

    /* ── Philosophy 마지막 텍스트 → Products 스냅 ── */
    let philExitCooldown = false;
    let philLastLineReady = false;
    let philLastLineTimer = null;

    const origUpdatePhil = updatePhilosophy;
    window.removeEventListener('scroll', updatePhilosophy);
    function updatePhilosophyWithDelay() {
      origUpdatePhil();
      if (currentPhilIndex === philLines.length - 1 && !philLastLineReady && !philLastLineTimer) {
        philLastLineTimer = setTimeout(() => { philLastLineReady = true; }, 1500);
      }
      if (currentPhilIndex < philLines.length - 1) {
        philLastLineReady = false;
        clearTimeout(philLastLineTimer);
        philLastLineTimer = null;
      }
    }
    window.addEventListener('scroll', updatePhilosophyWithDelay, { passive: true });

    window.addEventListener('wheel', (e) => {
      if (e.deltaY <= 0 || philExitCooldown) return;
      if (currentPhilIndex !== philLines.length - 1) return;
      if (!philLastLineReady) { e.preventDefault(); return; }

      const rect      = philSection.getBoundingClientRect();
      const scrolled  = -rect.top;
      const maxScroll = philSection.offsetHeight - window.innerHeight;
      if (scrolled >= maxScroll) return;

      e.preventDefault();
      philExitCooldown = true;
      window.scrollTo({ top: document.getElementById('products').offsetTop, behavior: 'smooth' });
      setTimeout(() => { philExitCooldown = false; }, 1200);
    }, { passive: false });

    /* ── Products 스크롤 드리븐 슬라이더 ── */
    const productSection = document.getElementById('products');
    const productsSlider = document.getElementById('productsSlider');
    const productTabs    = document.querySelectorAll('.product-tab');
    let currentProduct   = -1;

    const productsSticky = document.querySelector('.products-sticky');
    const productSlides  = document.querySelectorAll('.product-slide');

    function goToProduct(index) {
      if (index === currentProduct) return;
      currentProduct = index;
      productsSlider.style.transform = `translateX(-${index * 100}%)`;
      productTabs.forEach((tab, i) => tab.classList.toggle('active', i === index));
      // 슬라이드 배경색 전환
      const bg = productSlides[index].dataset.bg;
      if (bg) productsSticky.style.background = bg;
      // 섹션이 뷰포트에 있을 때만 탭 scrollIntoView 실행 (새로고침 시 자동 스크롤 방지)
      const r = productSection.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) {
        productTabs[index].scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
      }
    }

    function updateProductsSlider() {
      const rect     = productSection.getBoundingClientRect();
      const scrolled = -rect.top;
      if (scrolled < 0) { goToProduct(0); return; }
      const maxScroll = productSection.offsetHeight - window.innerHeight;
      const progress  = Math.min(scrolled / maxScroll, 1);
      const n         = productTabs.length;
      goToProduct(Math.min(Math.floor(progress * n), n - 1));
    }

    // 탭 클릭 → 해당 슬라이드 위치로 페이지 스크롤
    productTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const index     = Number(tab.dataset.index);
        const maxScroll = productSection.offsetHeight - window.innerHeight;
        const targetY   = productSection.offsetTop + (index / productTabs.length) * maxScroll;
        window.scrollTo({ top: targetY, behavior: 'smooth' });
      });
    });

    window.addEventListener('scroll', updateProductsSlider, { passive: true });

    updateProductsSlider();

    /* ── Products 마지막 슬라이드 → FAQ 스냅 ── */
    let productExitCooldown = false;
    window.addEventListener('wheel', (e) => {
      if (e.deltaY <= 0 || productExitCooldown) return;
      if (currentProduct !== productTabs.length - 1) return;

      const faqTop = document.getElementById('faq').offsetTop;
      if (window.scrollY >= faqTop - 10) return;

      const rect      = productSection.getBoundingClientRect();
      const scrolled  = -rect.top;
      const maxScroll = productSection.offsetHeight - window.innerHeight;
      if (scrolled < maxScroll - 10) return;

      e.preventDefault();
      productExitCooldown = true;
      window.scrollTo({ top: faqTop, behavior: 'smooth' });
      setTimeout(() => { productExitCooldown = false; }, 1200);
    }, { passive: false });

    /* ── Scroll reveal ── */
    const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          observer.unobserve(e.target);
        }
      });
    }, { threshold: 0.2, rootMargin: '0px 0px -48px 0px' });
    revealEls.forEach(el => observer.observe(el));

    /* ── Cursor glow ── */
    const glow = document.getElementById('cursorGlow');
    document.addEventListener('mousemove', e => {
      glow.style.left = e.clientX + 'px';
      glow.style.top  = e.clientY + 'px';
    }, { passive: true });

    /* ── CTA bounce-in ── */
    const ctaBlock = document.querySelector('.cta-block');
    new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        ctaBlock.classList.add('visible');
      }
    }, { threshold: 0.3 }).observe(ctaBlock);

    /* ── FAQ accordion ── */
    document.querySelectorAll('.faq-q').forEach(btn => {
      btn.addEventListener('click', () => {
        const item = btn.closest('.faq-item');
        const isOpen = item.classList.contains('open');
        document.querySelectorAll('.faq-item.open').forEach(el => {
          el.classList.remove('open');
          el.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
        });
        if (!isOpen) {
          item.classList.add('open');
          btn.setAttribute('aria-expanded', 'true');
        }
      });
    });
