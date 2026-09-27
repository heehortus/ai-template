(function () {
    'use strict';

    /* ── Header: hide on scroll-down, show on scroll-up ── */
    const header = document.getElementById('siteHeader');
    let prevScrollY = 0;

    window.addEventListener('scroll', () => {
        const y = window.scrollY;

        // 흰 배경은 최상단 벗어났을 때만
        header.classList.toggle('is-scrolled', y > 30);

        // 최상단 근처엔 항상 표시
        if (y < 80) {
            header.classList.remove('is-hidden');
        } else if (y > prevScrollY) {
            // 아래로 스크롤 → 숨김
            header.classList.add('is-hidden');
        } else {
            // 위로 스크롤 → 표시
            header.classList.remove('is-hidden');
        }

        prevScrollY = y;
    }, { passive: true });

    /* ── Philosophy scroll-driven animation ── */
    const philSection = document.getElementById('philosophy');
    const philBg      = document.getElementById('philBg');
    const philTitle   = document.getElementById('philTitle');
    const philBody    = document.getElementById('philBody');

    let philMaxP = 0;

    function updatePhilosophy() {
        if (!philSection || !philBg) return;
        const rect       = philSection.getBoundingClientRect();
        const sectionH   = philSection.offsetHeight;
        const viewH      = window.innerHeight;
        const scrolled   = -rect.top;
        const scrollable = sectionH - viewH;
        const raw = Math.max(0, Math.min(1, scrolled / scrollable));
        philMaxP  = Math.max(philMaxP, raw);  // 최대값만 기록
        const p   = philMaxP;

        // Phase 1 (0%→35%): clip-path inset 12%/18% → 0%/0%
        const scaleP = Math.min(1, p / 0.35);
        const tb = (50 * (1 - scaleP)).toFixed(2);
        const lr = (50 * (1 - scaleP)).toFixed(2);
        philBg.style.clipPath = `inset(${tb}% ${lr}%)`;

        // Phase 2 (40%): title appear
        if (p >= 0.40 && philTitle) philTitle.classList.add('is-visible');

        // Phase 3 (55%): body text appears
        if (p >= 0.55 && philBody)  philBody.classList.add('is-visible');
    }

    window.addEventListener('scroll', updatePhilosophy, { passive: true });
    updatePhilosophy();

    /* ── Hero slider ── */
    const slides  = document.querySelectorAll('.hero__slide');
    const dots    = document.querySelectorAll('.hero__dot');
    const progress = document.getElementById('heroProgress');
    let current   = 0;
    let timer;

    function goTo(idx) {
        slides[current].classList.remove('is-active');
        dots[current].classList.remove('is-active');
        dots[current].setAttribute('aria-selected', 'false');
        current = idx;
        slides[current].classList.add('is-active');
        dots[current].classList.add('is-active');
        dots[current].setAttribute('aria-selected', 'true');
        // restart progress
        progress.classList.remove('is-running');
        void progress.offsetWidth; // force reflow
        progress.classList.add('is-running');
    }

    function next() { goTo((current + 1) % slides.length); }

    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            clearInterval(timer);
            goTo(parseInt(dot.dataset.idx, 10));
            timer = setInterval(next, 5000);
        });
    });

    // Start
    progress.classList.add('is-running');
    timer = setInterval(next, 5000);

    /* ── Scroll reveal ── */
    const revealEls = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('visible');
                io.unobserve(e.target);
            }
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

    revealEls.forEach(el => io.observe(el));

    /* ── Process: scroll-driven 수평 카루젤 (lerp RAF) ── */
    const drag           = document.getElementById('processDrag');
    const indicatorFill  = document.getElementById('processIndicatorFill');
    const processSection = document.querySelector('.process');

    if (drag && processSection) {
        let maxHScroll    = 0;
        let targetH       = 0;   // 목표 scrollLeft
        let currentH      = 0;   // 현재 애니메이션 중인 scrollLeft
        let rafId         = null;
        let isDragging    = false;

        /* ── 섹션 높이 동적 설정 ── */
        function setProcessHeight() {
            maxHScroll = drag.scrollWidth - drag.clientWidth;
            processSection.style.height = (window.innerHeight + maxHScroll) + 'px';
        }

        /* ── 인디케이터 업데이트 (currentH 기준) ── */
        function updateIndicator() {
            if (!indicatorFill || maxHScroll <= 0) return;
            indicatorFill.style.width = ((currentH / maxHScroll) * 100).toFixed(2) + '%';
        }

        /* ── RAF lerp 루프 ── */
        function tick() {
            const diff = targetH - currentH;
            if (Math.abs(diff) < 0.4) {
                currentH = targetH;
                drag.scrollLeft = currentH;
                updateIndicator();
                rafId = null;
                return;
            }
            currentH += diff * 0.09;   // lerp 계수: 작을수록 더 부드럽게
            drag.scrollLeft = currentH;
            updateIndicator();
            rafId = requestAnimationFrame(tick);
        }

        function startTick() {
            if (!rafId) rafId = requestAnimationFrame(tick);
        }

        /* ── 페이지 스크롤 → targetH 갱신 ── */
        function onScroll() {
            if (isDragging) return;
            const rect     = processSection.getBoundingClientRect();
            const scrolled = -rect.top;
            const scrollable = processSection.offsetHeight - window.innerHeight;
            if (scrolled < 0 || scrolled > scrollable) return;
            targetH = (scrolled / scrollable) * maxHScroll;
            startTick();
        }

        /* ── 드래그 → 페이지 스크롤 역동기화 ── */
        let dragStartX = 0, dragStartH = 0;

        drag.addEventListener('mousedown', (e) => {
            isDragging   = true;
            dragStartX   = e.pageX;
            dragStartH   = currentH;
            if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
            drag.classList.add('is-dragging');
        });

        const endDrag = () => {
            if (!isDragging) return;
            isDragging = false;
            drag.classList.remove('is-dragging');
            const sectionScrollable = processSection.offsetHeight - window.innerHeight;
            const p = maxHScroll > 0 ? currentH / maxHScroll : 0;
            window.scrollTo(0, processSection.offsetTop + p * sectionScrollable);
        };

        drag.addEventListener('mouseup',    endDrag);
        drag.addEventListener('mouseleave', endDrag);

        drag.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            const moved = (dragStartX - e.pageX) * 1.2;
            currentH = Math.max(0, Math.min(maxHScroll, dragStartH + moved));
            targetH  = currentH;
            drag.scrollLeft = currentH;
            updateIndicator();
        });

        /* 초기화 */
        setProcessHeight();
        window.addEventListener('resize', () => { setProcessHeight(); onScroll(); });
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

    /* ── GNB 활성 섹션 하이라이트 ── */
    (function () {
        const navLinks = document.querySelectorAll('.nav__link[data-section]');
        const sections = ['hero', 'philosophy', 'process', 'esg', 'experience', 'news'];

        function setActive(id) {
            navLinks.forEach(a => {
                a.classList.toggle('is-active', a.dataset.section === id);
            });
        }

        const sectionEls = sections.map(id => document.getElementById(id)).filter(Boolean);

        const navHeight = 90;
        const io = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                if (e.isIntersecting) setActive(e.target.id);
            });
        }, { rootMargin: `-${navHeight}px 0px -55% 0px`, threshold: 0 });

        sectionEls.forEach(el => io.observe(el));
        setActive('hero');
    })();

    /* ── CTA Banner Ken Burns ── */
    (function () {
        const banner = document.getElementById('ctaBanner');
        if (!banner) return;
        const obs = new IntersectionObserver((entries) => {
            entries.forEach(e => banner.classList.toggle('in-view', e.isIntersecting));
        }, { threshold: 0.1 });
        obs.observe(banner);
    })();

    /* ── Hamburger / Drawer ── */
    (function () {
        const hamburger  = document.getElementById('navHamburger');
        const drawer     = document.getElementById('navDrawer');
        const overlay    = document.getElementById('navOverlay');
        const closeBtn   = document.getElementById('navDrawerClose');
        const drawerLinks = drawer.querySelectorAll('.nav__drawer-link');

        function open() {
            hamburger.classList.add('is-open');
            hamburger.setAttribute('aria-expanded', 'true');
            drawer.classList.add('is-open');
            drawer.setAttribute('aria-hidden', 'false');
            overlay.classList.add('is-open');
            overlay.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        }

        function close() {
            hamburger.classList.remove('is-open');
            hamburger.setAttribute('aria-expanded', 'false');
            drawer.classList.remove('is-open');
            drawer.setAttribute('aria-hidden', 'true');
            overlay.classList.remove('is-open');
            overlay.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        }

        hamburger.addEventListener('click', () => {
            drawer.classList.contains('is-open') ? close() : open();
        });
        closeBtn.addEventListener('click', close);
        overlay.addEventListener('click', close);
        drawerLinks.forEach(link => link.addEventListener('click', close));
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
    })();

    /* ── ESG 카드 뷰포트 중앙 도달 시 하이라이트 (모바일 전용) ── */
    (function () {
        if (window.innerWidth > 768) return;   // 데스크탑에서는 실행하지 않음

        const esgGrid  = document.querySelector('.esg__grid');
        const esgCards = document.querySelectorAll('.esg__card');
        if (!esgGrid || !esgCards.length) return;

        const centerObs = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                e.target.classList.toggle('is-highlight', e.isIntersecting);
            });
            const any = [...esgCards].some(c => c.classList.contains('is-highlight'));
            esgGrid.classList.toggle('has-highlight', any);
        }, { rootMargin: '-35% 0px -35% 0px', threshold: 0 });

        esgCards.forEach(card => centerObs.observe(card));
    })();

    /* ── Hero → Philosophy snap ── */
    const heroEl    = document.querySelector('.hero');
    let heroSnapping = false;

    function snapToPhil() {
        if (heroSnapping) return;
        heroSnapping = true;
        philSection.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => { heroSnapping = false; }, 1200);
    }

    // Wheel
    window.addEventListener('wheel', function (e) {
        if (window.scrollY < heroEl.offsetHeight && e.deltaY > 0) {
            e.preventDefault();
            snapToPhil();
        }
    }, { passive: false });

    // Touch
    let touchStartY = 0;
    window.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
    }, { passive: true });

    window.addEventListener('touchend', (e) => {
        const dy = touchStartY - e.changedTouches[0].clientY;
        if (window.scrollY < heroEl.offsetHeight && dy > 30) {
            snapToPhil();
        }
    }, { passive: true });

}());
