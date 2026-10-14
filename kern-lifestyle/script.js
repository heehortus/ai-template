/* =============================================
   KERN — script.js
   ============================================= */

(function () {
  'use strict';

  /* ────────────────────────────────────────────
     PRODUCT DATA
  ──────────────────────────────────────────── */
  const PRODUCTS = [
    { name: '솔리튜드 롱 코트',      type: 'coat',  color: '#C8C2B6', desc: '오가닉 린넨 소재의 구조적 롱 코트. 봄의 여백을 담은 실루엣으로 입을수록 몸에 길들여진다.',       material: 'Organic Linen 100%',       img: 'asset/product-image-4.png' },
    { name: '린넨 플레어 드레스',    type: 'dress', color: '#D0CAC4', desc: '빛을 머금은 린넨 소재의 A라인 드레스. 소매 없는 구조로 계절의 공기를 담는다.',                    material: 'Organic Linen 100%',       img: 'asset/product-image-5.png' },
    { name: '와이드 워시드 팬츠',    type: 'pants', color: '#B8B2AC', desc: '넉넉한 실루엣의 와이드 팬츠. 오가닉 코튼 소재를 워시드 처리해 부드러운 질감을 더했다.',            material: 'Organic Cotton 100%',      img: 'asset/product-image-6.png' },
    { name: '스퀘어 박스 탑',        type: 'top',   color: '#C4BEB8', desc: '정사각형에 가까운 실루엣의 박스핏 탑. 어깨선의 여백이 봄바람처럼 넉넉하다.',                        material: 'Organic Cotton 100%',      img: 'asset/product-image-7.png' },
    { name: '오버 린넨 셔츠',        type: 'shirt', color: '#CCC6C0', desc: '오버사이즈 핏의 린넨 셔츠. 소재 본연의 텍스처를 살린 워시드 가공이 독특한 표정을 만든다.',          material: 'Organic Linen 100%',       img: 'asset/product-image-1.png' },
    { name: '미디엄 니트 베스트',    type: 'vest',  color: '#B0AAA4', desc: '미디엄 게이지 니트 베스트. 핵심 레이어링 피스.',                                                    material: 'Wool 80% Cotton 20%',      img: 'asset/product-image-3.png' },
    { name: '오버 코튼 니트',        type: 'top',   color: '#D4CEC8', desc: '오버사이즈 핏의 코튼 니트. 부드러운 질감과 편안한 착용감.',                                         material: 'Organic Cotton 100%',      img: 'asset/product-image-2.png' },
    { name: '울-캐시미어 크롭 재킷', type: 'coat',  color: '#846454', desc: '울-캐시미어 혼방 크롭 재킷. 흙의 거친 질감을 소재로 표현했다.',                                     material: 'Wool 80% Cashmere 20%',    img: 'asset/product-image-8.png' },
    { name: '미네랄 오버코트',       type: 'coat',  color: '#3C3C38', desc: '더블 페이스 울 소재의 오버핏 코트. 광물의 견고함을 형태로 옮긴 겨울의 외피.',                       material: 'Wool 100%',              img: 'asset/product-image-9.png' },
    { name: '쉬폰 롱 드레스',        type: 'dress', color: '#4C4C48', desc: '스카프 타이 넥라인의 미디 쉬폰 드레스. 미네랄 시즌에 스며든 한 줄기 빛.',                          material: 'Polyester Chiffon 100%', img: 'asset/product-image-10.png' },
    { name: '헤비 울 와이드 팬츠',   type: 'pants', color: '#2E2E2A', desc: '헤비웨이트 울 블렌드 와이드 팬츠. 겨울을 버티는 무게감과 보온성.',                                  material: 'Wool 70% Polyester 30%', img: 'asset/product-image-11.png' },
    { name: '패딩 크롭 재킷',        type: 'top',   color: '#5A5A56', desc: '숄더 패딩이 들어간 크롭 재킷.',                                                                      material: 'Wool 60% Linen 40%',     img: 'asset/product-image-12.png' },
    { name: '파인 울 터틀넥',        type: 'shirt', color: '#444440', desc: '파인 게이지 울 터틀넥. 피부에 닿는 부드러움.',                                                       material: 'Merino Wool 100%',        img: 'asset/product-image-13.png' },
    { name: '리브 니트 스커트',      type: 'skirt', color: '#383834', desc: '미니 길이 니트 플리츠 스커트. 레이스 장식이 귀여운 분위기를 연출한다.',                              material: 'Wool 85% Cotton 15%',    img: 'asset/product-image-14.png' },
    { name: '세미-리지드 숄더백',    type: 'bag',   color: '#4A4A46', desc: '세미-리지드 구조의 숄더백. 소가죽, 무광 금속 클래스프.',                                            material: '소가죽 100%',             img: 'asset/product-image-15.png' },
    { name: '오리진 트렌치코트',     type: 'coat',  color: '#8C7060', desc: '면-울 혼방 소재의 구조적 트렌치코트. 모든 것의 시작점.',                                             material: 'Cotton 60% Wool 40%',    img: 'asset/product-image-1.png' },
  ];

  /* ────────────────────────────────────────────
     PAGE TRANSITION
  ──────────────────────────────────────────── */
  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
    link.addEventListener('click', e => {
      e.preventDefault();
      document.body.classList.add('is-leaving');
      setTimeout(() => { window.location.href = href; }, 360);
    });
  });

  /* ────────────────────────────────────────────
     ACTIVE NAV
  ──────────────────────────────────────────── */
  const currentPage = document.body.dataset.page || '';
  document.querySelectorAll('.gnb__item[data-page]').forEach(item => {
    if (item.dataset.page === currentPage) item.classList.add('is-active');
  });

  /* ────────────────────────────────────────────
     COLLAPSIBLE NAV
  ──────────────────────────────────────────── */
  const gnbWrap   = document.getElementById('gnbWrap');
  const gnbToggle = gnbWrap ? gnbWrap.querySelector('.gnb__toggle') : null;

  if (gnbWrap && gnbToggle) {
    const toggleNav = () => {
      const open = gnbWrap.classList.toggle('is-open');
      gnbToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    };
    gnbToggle.addEventListener('click', toggleNav);
    gnbToggle.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') toggleNav();
    });
    document.addEventListener('click', e => {
      if (gnbWrap.classList.contains('is-open') && !gnbWrap.contains(e.target)) {
        gnbWrap.classList.remove('is-open');
        gnbToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ────────────────────────────────────────────
     TOAST
  ──────────────────────────────────────────── */
  const toastEl = document.getElementById('toast');
  let toastTimer = null;
  function showToast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add('is-show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('is-show'), 3000);
  }

  /* ────────────────────────────────────────────
     COLLECTIONS CANVAS (index page only)
  ──────────────────────────────────────────── */
  const canvasWrap   = document.getElementById('canvasWrap');
  const canvasScaler = document.getElementById('canvasScaler');
  const canvasInner  = document.getElementById('canvasInner');

  if (canvasWrap && canvasScaler && canvasInner) {

    const isMobile = window.innerWidth < 768;
    let wrapScale = isMobile ? 1.0 : 1.4;

    /* ── Grid layout ── */
    const ITEM_H       = 300;
    const ROW_GAP      = isMobile ?  60 : 120;
    const CANVAS_PAD_V = isMobile ?  0 : 120;
    const COLS         = 4;

    const allProducts = PRODUCTS;

    const CANVAS_W = isMobile ? canvasWrap.clientWidth * 2 : canvasWrap.clientWidth;
    const COL_W = CANVAS_W / COLS;
    const TOTAL_ROWS = Math.ceil(allProducts.length / COLS);
    const CANVAS_H = TOTAL_ROWS * ITEM_H + (TOTAL_ROWS - 1) * ROW_GAP + CANVAS_PAD_V * 2;

    canvasInner.style.width  = CANVAS_W + 'px';
    canvasInner.style.height = CANVAS_H + 'px';

    /* ── Generate product elements ── */
    allProducts.forEach((p, i) => {
        const col = i % COLS;
        const row = Math.floor(i / COLS);
        const x = (col + 0.5) * COL_W;
        const y = CANVAS_PAD_V + row * (ITEM_H + ROW_GAP) + ITEM_H / 2;
        const el = document.createElement('div');
        const imgs = p.imgs && p.imgs.length ? p.imgs : (p.img ? [p.img] : []);
        el.className = `col-item${imgs.length ? ' col-item--image' : ` col-item--${p.type}`}`;
        el.dataset.name     = p.name;
        el.dataset.desc     = p.desc;
        el.dataset.material = p.material;
        el.dataset.color    = p.color;
        if (imgs.length) el.dataset.imgs = JSON.stringify(imgs);
        el.style.left       = x + 'px';
        el.style.top        = y + 'px';
        el.setAttribute('role', 'button');
        el.setAttribute('tabindex', '0');
        el.setAttribute('aria-label', `${p.name} 보기`);

        const shadow = document.createElement('div');
        shadow.className = 'col-item__shadow';
        el.appendChild(shadow);

        let swatch;
        if (imgs.length) {
          swatch = document.createElement('img');
          swatch.className = 'col-item__swatch';
          swatch.src = imgs[0];
          swatch.alt = p.name;
          swatch.draggable = false;
        } else {
          swatch = document.createElement('div');
          swatch.className = 'col-item__swatch';
          swatch.style.background = p.color;
        }
        el.appendChild(swatch);
        canvasInner.appendChild(el);
    });

    /* ── Pan state ── */
    let panX = 0, panY = 0;
    let targetPanX = 0, targetPanY = 0;
    let velX = 0, velY = 0;

    function _clamp(v, lo, hi) { return Math.min(hi, Math.max(lo, v)); }

function clampTarget() {
      const vw = canvasWrap.clientWidth;
      const vh = canvasWrap.clientHeight;
      const s  = wrapScale;
      targetPanX = (vw / s >= CANVAS_W) ? (vw - CANVAS_W) / 2 : _clamp(targetPanX, vw*(1+1/s)/2 - CANVAS_W, vw*(1-1/s)/2);
      targetPanY = (vh / s >= CANVAS_H) ? (vh - CANVAS_H) / 2 : _clamp(targetPanY, vh*(1+1/s)/2 - CANVAS_H, vh*(1-1/s)/2);
    }

    function initPan() {
      targetPanX = isMobile ? -canvasWrap.clientWidth / 2 : 0;
      targetPanY = 0;
      clampTarget();
      panX = targetPanX; panY = targetPanY;
      canvasInner.style.transition = 'none';
      canvasInner.style.transform  = `translate(${panX}px, ${panY}px)`;
    }

    /* ── Smooth lerp loop ── */
    (function smoothLoop() {
      panX += (targetPanX - panX) * 0.10;
      panY += (targetPanY - panY) * 0.10;
      canvasInner.style.transform = `translate(${panX}px, ${panY}px)`;
      requestAnimationFrame(smoothLoop);
    })();

    initPan();
    window.addEventListener('resize', initPan);

    /* ── Drag to pan ── */
    let dragging = false, lastMX = 0, lastMY = 0;

    canvasWrap.addEventListener('mousedown', e => {
      if (e.target.closest('.col-item')) return;
      dragging = true;
      velX = 0; velY = 0;
      lastMX = e.clientX;
      lastMY = e.clientY;
      canvasWrap.classList.add('is-dragging');
    });

    window.addEventListener('mousemove', e => {
      if (!dragging) return;
      const dx = (e.clientX - lastMX) / wrapScale;
      const dy = (e.clientY - lastMY) / wrapScale;
      velX = dx; velY = dy;
      targetPanX += dx; targetPanY += dy;
      lastMX = e.clientX; lastMY = e.clientY;
      clampTarget();
    });

    window.addEventListener('mouseup', () => {
      if (!dragging) return;
      dragging = false;
      canvasWrap.classList.remove('is-dragging');
      (function momentum() {
        velX *= 0.88; velY *= 0.88;
        if (Math.abs(velX) > 0.2 || Math.abs(velY) > 0.2) {
          targetPanX += velX; targetPanY += velY;
          clampTarget();
          requestAnimationFrame(momentum);
        }
      })();
    });

    /* Touch drag */
    let touchStartX = 0, touchStartY = 0;
    canvasWrap.addEventListener('touchstart', e => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    }, { passive: true });
    canvasWrap.addEventListener('wheel', e => {
      e.preventDefault();
      targetPanY -= e.deltaY / wrapScale * 0.8;
      clampTarget();
    }, { passive: false });

    canvasWrap.addEventListener('touchmove', e => {
      targetPanX += (e.touches[0].clientX - touchStartX) / wrapScale;
      targetPanY += (e.touches[0].clientY - touchStartY) / wrapScale;
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      clampTarget();
    }, { passive: true });

    /* ── Custom cursor (desktop only) ── */
    const cursor      = isMobile ? null : document.getElementById('cursor');
    const cursorLabel = isMobile ? null : document.getElementById('cursorLabel');
    let mx = 0, my = 0, cx = 0, cy = 0;

    if (!isMobile) {
      document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
      (function tick() {
        cx += (mx - cx) * 0.18;
        cy += (my - cy) * 0.18;
        if (cursor) cursor.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
        requestAnimationFrame(tick);
      })();
    }

    function cursorShow(label) {
      if (!cursor || !cursorLabel) return;
      cursorLabel.textContent = '+ ' + label;
      cursor.classList.add('is-active');
    }
    function cursorHide() {
      if (cursor) cursor.classList.remove('is-active');
    }

    /* ── Panel ── */
    const panel        = document.getElementById('panel');
    const panelOverlay = document.getElementById('panelOverlay');
    const panelClose   = document.getElementById('panelClose');
    const panelName    = document.getElementById('panelName');
    const panelFeat    = document.getElementById('panelFeatured');
    const panelDesc    = document.getElementById('panelDesc');
    const panelMat     = document.getElementById('panelMaterial');

    const panelImgThumbs = document.getElementById('panelImgThumbs');

    function openPanel(el) {
      const name     = el.dataset.name;
      const desc     = el.dataset.desc;
      const material = el.dataset.material;
      const color    = el.dataset.color;
      const imgs     = el.dataset.imgs ? JSON.parse(el.dataset.imgs) : [];

      panelName.textContent = name;
      panelDesc.textContent = desc;
      panelMat.textContent  = material;

      if (imgs.length) {
        panelFeat.innerHTML = `<img class="panel__featured-img" src="${imgs[0]}" alt="${name}">`;
      } else {
        panelFeat.innerHTML = `<div class="panel__featured-inner" style="background:${color}"></div>`;
      }

      panelImgThumbs.innerHTML = '';
      if (imgs.length > 1) {
        const featImg = panelFeat.querySelector('.panel__featured-img');
        imgs.forEach((src, i) => {
          const thumb = document.createElement('img');
          thumb.className = 'panel__img-thumb' + (i === 0 ? ' is-active' : '');
          thumb.src = src;
          thumb.alt = `${name} ${i + 1}`;
          thumb.draggable = false;
          thumb.addEventListener('click', () => {
            panelImgThumbs.querySelectorAll('.panel__img-thumb').forEach(t => t.classList.remove('is-active'));
            thumb.classList.add('is-active');
            featImg.src = src;
          });
          panelImgThumbs.appendChild(thumb);
        });
      }

      panel.classList.add('is-open');
      panel.setAttribute('aria-hidden', 'false');
      panelOverlay.classList.add('is-open');
    }

    function closePanel() {
      panel.classList.remove('is-open');
      panel.setAttribute('aria-hidden', 'true');
      panelOverlay.classList.remove('is-open');
    }

    panelClose.addEventListener('click', closePanel);
    panelClose.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') closePanel(); });
    panelOverlay.addEventListener('click', closePanel);

    /* ── Item interactions ── */
    function bindItems() {
      document.querySelectorAll('.col-item').forEach(item => {
        item.addEventListener('mouseenter', () => cursorShow(item.dataset.name));
        item.addEventListener('mouseleave', cursorHide);
        item.addEventListener('click', () => openPanel(item));
        item.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') openPanel(item); });
      });
    }
    bindItems();

    /* Initial reveal: items stagger left-to-right */
    canvasInner.querySelectorAll('.col-item').forEach((item, i) => {
      setTimeout(() => item.classList.add('is-visible'), 80 + i * 40);
    });

    document.addEventListener('keydown', e => { if (e.key === 'Escape') closePanel(); });

    /* ── Intro sequence ── */
    canvasScaler.style.transition = 'none';
    canvasScaler.style.transform  = `scale(${isMobile ? 0.9 : 1.2})`;

    setTimeout(() => {
      canvasScaler.style.transition = 'transform 0.9s cubic-bezier(0.16, 1, 0.3, 1)';
      canvasScaler.style.transform  = `scale(${wrapScale})`;
    }, 700);

    setTimeout(() => {
      if (gnbWrap) gnbWrap.classList.add('is-revealed');
      const canvasHint = document.getElementById('canvasHint');
      if (canvasHint) { canvasHint.classList.add('is-revealed'); canvasHint.removeAttribute('aria-hidden'); }
    }, 900);

    /* ── Zoom controls ── */
    const zoomInBtn  = document.getElementById('zoomIn');
    const zoomOutBtn = document.getElementById('zoomOut');

    function setZoom(s) {
      wrapScale = Math.max(0.9, Math.min(1.9, s));
      clampTarget();
      canvasScaler.style.transition = 'transform 0.32s var(--ease)';
      canvasScaler.style.transform  = `scale(${wrapScale})`;
    }

    if (zoomInBtn)  zoomInBtn.addEventListener('click',   () => setZoom(wrapScale + 0.25));
    if (zoomOutBtn) zoomOutBtn.addEventListener('click',  () => setZoom(wrapScale - 0.25));
    if (zoomInBtn)  zoomInBtn.addEventListener('keydown', e => (e.key === 'Enter' || e.key === ' ') && setZoom(wrapScale + 0.25));
    if (zoomOutBtn) zoomOutBtn.addEventListener('keydown', e => (e.key === 'Enter' || e.key === ' ') && setZoom(wrapScale - 0.25));
  } else {
    /* Non-canvas pages — Lenis smooth scroll */
    let lenis = null;
    if (typeof Lenis !== 'undefined') {
      lenis = new Lenis({
        duration: 1.2,
        easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      });
      (function lenisRaf(time) {
        lenis.raf(time);
        requestAnimationFrame(lenisRaf);
      }(0));
    }

    const aboutSplash = document.getElementById('aboutSplash');
    if (aboutSplash) {
      /* 스플래시 이미지 전부 흩어지기 전까지 스크롤 잠금 */
      if (lenis) lenis.stop();

      /* ── About splash animation ── */
      const BRAND_IMGS = [
        'asset/about-brand-01.png',
        'asset/about-brand-02.png',
        'asset/about-brand-03.png',
        'asset/about-brand-04.png',
        'asset/about-brand-05.png',
        'asset/about-brand-06.png',
      ];

      const isMobileSplash = window.innerWidth < 768;
      const SCATTER_POS = isMobileSplash ? [
        { x: 22, y: 20 },  // top-left
        { x: 78, y: 20 },  // top-right
        { x:  2, y: 52 },  // mid-left  (더 바깥)
        { x: 98, y: 52 },  // mid-right (더 바깥)
        { x: 22, y: 80 },  // bottom-left
        { x: 78, y: 80 },  // bottom-right
      ] : [
        { x: 22, y: 20 },  // top-left
        { x: 78, y: 20 },  // top-right
        { x: 12, y: 52 },  // mid-left
        { x: 88, y: 52 },  // mid-right
        { x: 22, y: 80 },  // bottom-left
        { x: 78, y: 80 },  // bottom-right
      ];

      const W = aboutSplash.offsetWidth;
      const H = aboutSplash.offsetHeight;
      const cx = W / 2;
      const cy = H / 2;

      BRAND_IMGS.forEach((src, i) => {
        const pos = SCATTER_POS[i];
        const finalX = (pos.x / 100) * W;
        const finalY = (pos.y / 100) * H;

        const el = document.createElement('img');
        el.className = 'splash-prod';
        el.src = src;
        el.alt = '';
        el.draggable = false;
        el.style.left = finalX + 'px';
        el.style.top  = finalY + 'px';
        el.style.setProperty('--dx', (cx - finalX) + 'px');
        el.style.setProperty('--dy', (cy - finalY) + 'px');
        aboutSplash.appendChild(el);

        setTimeout(() => el.classList.add('is-scattered'), 1300 + i * 80);

        el.addEventListener('mouseenter', () => openLb(src));
        el.addEventListener('mouseleave', () => { lbTimer = setTimeout(closeLb, 160); });
      });

      const lb      = document.getElementById('splashLb');
      const lbImg   = document.getElementById('splashLbImg');
      const lbFrame = document.getElementById('splashLbFrame');
      let lbTimer   = null;

      function openLb(src) {
        clearTimeout(lbTimer);
        lbImg.src = src;
        lb.classList.add('is-open');
        lb.setAttribute('aria-hidden', 'false');
      }
      function closeLb() {
        lb.classList.remove('is-open');
        lb.setAttribute('aria-hidden', 'true');
      }

      if (lbFrame) {
        lbFrame.addEventListener('mouseenter', () => clearTimeout(lbTimer));
        lbFrame.addEventListener('mouseleave', () => closeLb());
      }

      const lbClose = document.getElementById('splashLbClose');
      if (lbClose) {
        lbClose.addEventListener('click', closeLb);
        lbClose.addEventListener('keydown', e => (e.key === 'Enter' || e.key === ' ') && closeLb());
      }

      /* story-img mouseenter → 라이트박스 */
      document.querySelectorAll('.story-img img').forEach(img => {
        img.addEventListener('mouseenter', () => openLb(img.src));
        img.addEventListener('mouseleave', () => { lbTimer = setTimeout(closeLb, 160); });
      });

      setTimeout(() => { if (gnbWrap) gnbWrap.classList.add('is-revealed'); }, 1500);

      /* 마지막 이미지 흩어짐(1700ms) + 300ms 여유 후 스크롤 잠금 해제 */
      const splashUnlockMs = 1300 + (BRAND_IMGS.length - 1) * 80 + 300;
      setTimeout(() => { if (lenis) lenis.start(); }, splashUnlockMs);

      /* ── Scroll Line Track ── */
      (function initScrollLine() {
        const svgEl   = document.getElementById('scrollLine');
        const pathEl  = document.getElementById('scrollLinePath');
        const story   = document.querySelector('.about-story');
        const storyR  = document.querySelector('.about-story__right');
        if (!svgEl || !pathEl || !story || !storyR) return;

        let totalLen  = 0;
        let lineEndAt = 0;  // 선이 완전히 그려지는 scrollY 기준

        function buildPath() {
          const pageH = document.querySelector('.about-page').scrollHeight;
          const pageW = window.innerWidth;

          svgEl.setAttribute('viewBox', `0 0 ${pageW} ${pageH}`);
          svgEl.setAttribute('width',  pageW);
          svgEl.setAttribute('height', pageH);

          const sx    = pageW * 0.5;
          const sy    = aboutSplash.offsetTop + aboutSplash.offsetHeight * 0.70;
          const stTop = story.offsetTop;
          const stH   = story.offsetHeight;
          const rLeft = storyR.offsetLeft;
          const rW    = storyR.offsetWidth;

          /*
           * S-curve — Our Story S자 → Material 카드 세로 50% 지점까지 연장.
           *  x0=sx, x1=Image1우측, x2=Image2좌측, x3=Image3우측, x4=sx
           *  y4 = Material 카드(.about-media__card:nth-child(2)) 상단 + 높이*0.5
           */
          const y0 = stTop + stH * 0.04;
          const y1 = stTop + stH * 0.28;
          const y2 = stTop + stH * 0.50;
          const y3 = stTop + stH * 0.72;

          // y4 — Material 카드 세로 50% 지점
          const card2  = document.querySelector('.about-media__card:nth-child(2)');
          let   y4     = stTop + stH * 0.92;  // fallback
          if (card2) {
            const card2Top = card2.getBoundingClientRect().top + window.scrollY;
            y4 = card2Top + card2.offsetHeight * 0.5;
            // 선이 완전히 그려지는 시점: card2 중앙이 뷰포트 중앙에 올 때
            lineEndAt = card2Top + card2.offsetHeight * 0.5 - window.innerHeight * 0.5;
          } else {
            lineEndAt = stTop + stH - window.innerHeight;
          }

          const x0 = sx,               x1 = rLeft + rW * 0.84,
                x2 = rLeft + rW * 0.12, x3 = rLeft + rW * 0.84,
                x4 = sx;

          const m01 = (y0 + y1) * 0.5;
          const m12 = (y1 + y2) * 0.5;
          const m23 = (y2 + y3) * 0.5;
          const m34 = (y3 + y4) * 0.5;

          const d = [
            `M ${f(sx)} ${f(sy)}`,
            `L ${f(sx)} ${f(y0)}`,
            `C ${f(x0)} ${f(m01)} ${f(x1)} ${f(m01)} ${f(x1)} ${f(y1)}`,
            `C ${f(x1)} ${f(m12)} ${f(x2)} ${f(m12)} ${f(x2)} ${f(y2)}`,
            `C ${f(x2)} ${f(m23)} ${f(x3)} ${f(m23)} ${f(x3)} ${f(y3)}`,
            `C ${f(x3)} ${f(m34)} ${f(x4)} ${f(m34)} ${f(x4)} ${f(y4)}`,
          ].join(' ');

          pathEl.setAttribute('d', d);
          totalLen = pathEl.getTotalLength();
          pathEl.style.strokeDasharray  = totalLen;
          pathEl.style.strokeDashoffset = totalLen;
        }

        function f(n) { return Math.round(n * 100) / 100; }

        function updateLine(scrollY) {
          if (!totalLen) return;
          scrollY = scrollY !== undefined ? scrollY : window.scrollY;
          const progress = Math.max(0, Math.min(1, scrollY / Math.max(1, lineEndAt)));
          pathEl.style.strokeDashoffset = totalLen * (1 - progress);
        }

        /* Story image reveal (one by one as each enters the viewport) */
        const storyImgs = document.querySelectorAll('.story-img');
        if (storyImgs.length) {
          const imgObs = new IntersectionObserver(entries => {
            entries.forEach(e => {
              if (e.isIntersecting) { e.target.classList.add('is-visible'); imgObs.unobserve(e.target); }
            });
          }, { threshold: 0.12 });
          storyImgs.forEach(el => imgObs.observe(el));
        }

        /* ── About Closer Parallax ── */
        const closerEl = document.querySelector('.about-closer');
        const closerBg = document.getElementById('aboutCloserBg');
        function updateCloserParallax() {
          if (!closerEl || !closerBg) return;
          const rect   = closerEl.getBoundingClientRect();
          const offset = (rect.top + rect.height * 0.5 - window.innerHeight * 0.5) * 0.18;
          closerBg.style.transform = `translateY(${offset}px)`;
        }

        buildPath();
        window.addEventListener('resize', () => { buildPath(); updateLine(); }, { passive: true });

        /* Drive SVG animation from Lenis (smooth) or native scroll (fallback) */
        if (lenis) {
          lenis.on('scroll', ({ scroll }) => { updateLine(scroll); updateCloserParallax(); });
        } else {
          window.addEventListener('scroll', () => { updateLine(); updateCloserParallax(); }, { passive: true });
        }
        updateLine();
        updateCloserParallax();
      })();

      /* ── Scatter Cards ── */
      (function initScatterCards() {
        const media = document.querySelector('.about-media');
        if (!media) return;

        const cards = Array.from(media.querySelectorAll('.about-media__card'));
        if (cards.length < 3) return;

        const rotations = [-1.5, 1, -0.8];
        let scattered = false;

        function stackCards() {
          const rects = cards.map(c => c.getBoundingClientRect());
          const cx2 = rects[1].left + rects[1].width * 0.5;
          const spread = window.innerWidth * 0.1;
          const offsets = [-spread, 0, spread];

          cards.forEach(c => { c.style.transition = 'none'; });

          rects.forEach((r, i) => {
            const cxi = r.left + r.width * 0.5;
            const dx  = cx2 - cxi + offsets[i];
            cards[i].style.transform = `translateX(${Math.round(dx)}px) rotate(${rotations[i]}deg)`;
          });

          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              cards.forEach(c => { c.style.transition = ''; });
            });
          });
        }

        stackCards();

        /* Observer 1 — fade in when section enters viewport */
        const fadeObs = new IntersectionObserver(entries => {
          entries.forEach(e => {
            if (e.isIntersecting) {
              media.classList.add('is-visible');
              fadeObs.unobserve(e.target);
            }
          });
        }, { threshold: 0.1 });
        fadeObs.observe(media);

        /* 트리거 존 이탈 시 카드 재합침 (트랜지션 유지) */
        function restackCards() {
          const rects = cards.map(c => c.getBoundingClientRect());
          const cx2   = rects[1].left + rects[1].width * 0.5;
          const spread = window.innerWidth * 0.1;
          const offsets = [-spread, 0, spread];
          rects.forEach((r, i) => {
            const dx = cx2 - (r.left + r.width * 0.5) + offsets[i];
            cards[i].style.transform = `translateX(${Math.round(dx)}px) rotate(${rotations[i]}deg)`;
          });
          media.classList.remove('is-scattered');
          scattered = false;
        }

        /* Observer 2 — 트리거 진입 → 흩어짐, 이탈 → 재합침 */
        const scatterObs = new IntersectionObserver(entries => {
          entries.forEach(e => {
            if (e.isIntersecting && !scattered) {
              scattered = true;
              cards.forEach(c => { c.style.transform = ''; });
              media.classList.add('is-scattered');
            } else if (!e.isIntersecting && scattered) {
              restackCards();
            }
          });
        }, { rootMargin: '-35% 0px -55% 0px', threshold: 0 });
        scatterObs.observe(media);

        window.addEventListener('resize', () => {
          if (!scattered) stackCards();
        }, { passive: true });

        /* ── Polaroid Lightbox ── */
        const polaroidLb      = document.getElementById('polaroidLb');
        const polaroidLbCard  = document.getElementById('polaroidLbCard');
        const polaroidLbPhoto = document.getElementById('polaroidLbPhoto');
        const polaroidLbLabel = document.getElementById('polaroidLbLabel');
        const polaroidLbDesc  = document.getElementById('polaroidLbDesc');
        const polaroidLbClose = document.getElementById('polaroidLbClose');
        const polaroidLbOverlay = document.getElementById('polaroidLbOverlay');

        const PHOTO_SRCS = [
          'asset/about-media-1.jpg',
          'asset/about-media-2.jpg',
          'asset/about-media-3.jpg',
        ];

        function openPolaroidLb(i) {
          if (!polaroidLb) return;
          const label = cards[i].querySelector('.about-values__label');
          const desc  = cards[i].querySelector('.about-values__desc');
          polaroidLbPhoto.style.backgroundImage = `url(${PHOTO_SRCS[i]})`;
          polaroidLbLabel.textContent = label ? label.textContent : '';
          polaroidLbDesc.textContent  = desc  ? desc.textContent  : '';
          polaroidLbCard.style.setProperty('--init-rot', rotations[i] + 'deg');
          polaroidLb.setAttribute('aria-hidden', 'false');
          requestAnimationFrame(() => polaroidLb.classList.add('is-open'));
        }

        function closePolaroidLb() {
          if (!polaroidLb) return;
          polaroidLb.classList.remove('is-open');
          polaroidLb.setAttribute('aria-hidden', 'true');
        }

        cards.forEach((card, i) => {
          card.style.cursor = 'pointer';
          card.addEventListener('click', () => openPolaroidLb(i));
        });

        if (polaroidLbClose)   polaroidLbClose.addEventListener('click', closePolaroidLb);
        if (polaroidLbOverlay) polaroidLbOverlay.addEventListener('click', closePolaroidLb);
        document.addEventListener('keydown', e => { if (e.key === 'Escape') closePolaroidLb(); });
      })();

    } else {
      if (gnbWrap) gnbWrap.classList.add('is-revealed');

      /* ── Contact Slideshow ── */
      (function initContactSlideshow() {
        const slideshow = document.getElementById('contactSlideshow');
        if (!slideshow) return;
        const slides = Array.from(slideshow.querySelectorAll('.contact-slide'));
        if (slides.length < 2) return;
        let current = 0;
        setInterval(() => {
          slides[current].classList.remove('is-active');
          current = (current + 1) % slides.length;
          slides[current].classList.add('is-active');
        }, 4000);
      })();
    }
  }

  /* ────────────────────────────────────────────
     CONTACT MODAL
  ──────────────────────────────────────────── */
  const contactModal     = document.getElementById('contactModal');
  const modalClose       = document.getElementById('modalClose');
  const modalOverlay     = document.getElementById('modalOverlay');
  const modalSubmit      = document.getElementById('modalSubmit');
  const contactFormCard  = document.getElementById('contactFormCard');
  const contactPartnerCard = document.getElementById('contactPartnerCard');

  function openModal()  { if (!contactModal) return; contactModal.classList.add('is-open'); contactModal.setAttribute('aria-hidden', 'false'); }
  function closeModal() { if (!contactModal) return; contactModal.classList.remove('is-open'); contactModal.setAttribute('aria-hidden', 'true'); }

  if (contactFormCard)    { contactFormCard.addEventListener('click', openModal); contactFormCard.addEventListener('keydown', e => (e.key==='Enter'||e.key===' ') && openModal()); }
  if (contactPartnerCard) { contactPartnerCard.addEventListener('click', () => showToast('파트너십 페이지는 곧 오픈됩니다.')); }
  if (modalClose)         { modalClose.addEventListener('click', closeModal); }
  if (modalOverlay)       { modalOverlay.addEventListener('click', closeModal); }
  if (modalSubmit)        { modalSubmit.addEventListener('click', () => { closeModal(); showToast('문의가 접수되었습니다. 곧 연락드리겠습니다.'); }); }

  /* ────────────────────────────────────────────
     NEWSLETTER
  ──────────────────────────────────────────── */
  const nlSubmit = document.getElementById('nlSubmit');
  const nlEmail  = document.getElementById('nlEmail');
  if (nlSubmit && nlEmail) {
    const submit = () => {
      if (!nlEmail.value.trim() || !nlEmail.value.includes('@')) { showToast('올바른 이메일 주소를 입력해 주세요.'); return; }
      nlEmail.value = '';
      showToast('뉴스레터 구독이 완료되었습니다.');
    };
    nlSubmit.addEventListener('click', submit);
    nlSubmit.addEventListener('keydown', e => (e.key==='Enter'||e.key===' ') && submit());
  }

  /* ────────────────────────────────────────────
     SCROLL REVEAL (about / contact pages)
  ──────────────────────────────────────────── */
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add('is-visible'); obs.unobserve(entry.target); }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -32px 0px' });
    revealEls.forEach((el, i) => { el.style.transitionDelay = `${(i % 3) * 80}ms`; obs.observe(el); });
  }

  /* ────────────────────────────────────────────
     REDUCED MOTION
  ──────────────────────────────────────────── */
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const cursor = document.getElementById('cursor');
    if (cursor) cursor.style.display = 'none';
    revealEls.forEach(el => { el.style.transition = 'none'; el.classList.add('is-visible'); });
  }

  /* ────────────────────────────────────────────
     ESC KEY (global)
  ──────────────────────────────────────────── */
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

})();
