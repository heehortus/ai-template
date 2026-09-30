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
    { name: '미네랄 오버코트',       type: 'coat',  color: '#3C3C38', desc: '더블 페이스 울 소재의 오버핏 코트. 광물의 견고함을 형태로 옮긴 겨울의 외피.',                       material: 'Wool 100%', img: 'asset/product-image-9.png' },
    { name: '쉬폰 롱 드레스',        type: 'dress', color: '#4C4C48', desc: '스카프 타이 넥라인의 미디 쉬폰 드레스. 미네랄 시즌에 스며든 한 줄기 빛.',                          material: 'Polyester Chiffon 100%', img: 'asset/product-image-10.png' },
    { name: '헤비 울 와이드 팬츠',   type: 'pants', color: '#2E2E2A', desc: '헤비웨이트 울 블렌드 와이드 팬츠. 겨울을 버티는 무게감과 보온성.',                                  material: 'Wool 70% Polyester 30%', img: 'asset/product-image-11.png' },
    { name: '패딩 크롭 재킷',        type: 'top',   color: '#5A5A56', desc: '숄더 패딩이 들어간 크롭 재킷.',                                                                      material: 'Wool 60% Linen 40%', img: 'asset/product-image-12.png' },
    { name: '파인 울 터틀넥',        type: 'shirt', color: '#444440', desc: '파인 게이지 울 터틀넥. 피부에 닿는 부드러움.',                                                       material: 'Merino Wool 100%', img: 'asset/product-image-13.png' },
    { name: '리브 니트 스커트',      type: 'skirt',  color: '#383834', desc: '미니 길이 니트 플리츠 스커트. 레이스 장식이 귀여운 분위기를 연출한다.',                                      material: 'Wool 85% Cotton 15%', img: 'asset/product-image-14.png' },
    { name: '세미-리지드 숄더백',    type: 'bag',   color: '#4A4A46', desc: '세미-리지드 구조의 숄더백. 소가죽, 무광 금속 클래스프.',                                                  material: '소가죽 100%', img: 'asset/product-image-15.png' },
    { name: '오리진 트렌치코트',     type: 'coat',  color: '#8C7060', desc: '면-울 혼방 소재의 구조적 트렌치코트. 모든 것의 시작점.',                                             material: 'Cotton 60% Wool 40%', img: 'asset/product-image-16.png' },
    { name: '어스 미디 드레스',      type: 'dress', color: '#9C8070', desc: '흙의 색을 담은 미디 드레스. 비대칭 헴라인이 유기적 형태를 만든다.',                                  material: 'Organic Cotton 100%', img: 'asset/product-image-17.png' },
    { name: '어스 와이드 팬츠',      type: 'pants', color: '#7C6050', desc: '어스 팔레트의 코어 보텀. 두꺼운 울 소재의 와이드 실루엣.',                                           material: 'Wool 80% Linen 20%', img: 'asset/product-image-18.png' },
    { name: '오버 린넨-코튼 셔츠',   type: 'shirt', color: '#A08070', desc: '면-린넨 혼방의 오버사이즈 셔츠.',                                                                    material: 'Cotton 50% Linen 50%' },
    { name: '코스 게이지 카디건',    type: 'vest',  color: '#988068', desc: '코스 게이지 니트 카디건. 가장 부드러운 레이어.',                                                     material: 'Wool 70% Cotton 30%' },
    { name: '풀그레인 레더 백',      type: 'bag',   color: '#7A6058', desc: '풀그레인 소가죽 숄더백. 자연스러운 에이징.',                                                         material: '소가죽 100%' },
    { name: '보이드 롱 코트',        type: 'coat',  color: '#D0CCC4', desc: '초경량 재생 폴리에스터 소재의 롱 코트. 비어있음을 향한 브랜드의 첫 선언.',                           material: 'Recycled Polyester 100%' },
    { name: '보일 레이어드 드레스',  type: 'dress', color: '#E0DCD4', desc: '얇고 반투명한 소재의 레이어드 드레스. 빛이 통과하는 감각.',                                          material: 'Organic Cotton Voile 100%' },
    { name: '코튼 와이드 팬츠',      type: 'pants', color: '#C0BCB4', desc: '페일 애시 컬러의 코튼 와이드 팬츠. 최소한의 절개선으로 구성된 실루엣.',                              material: 'Organic Cotton 100%' },
    { name: '숄더리스 슬리브리스 탑', type: 'top',  color: '#CCCAC2', desc: '숄더리스 구조의 슬리브리스 탑.',                                                                     material: 'Organic Linen 100%' },
    { name: '셔링 오버 셔츠',        type: 'shirt', color: '#D8D4CC', desc: '셔링 디테일의 오버사이즈 셔츠. 빛에 따라 텍스처가 달라지는 표면.',                                  material: 'Cotton 80% Linen 20%' },
    { name: '파인 코튼 베스트',      type: 'vest',  color: '#B8B4AC', desc: '파인 게이지 니트 베스트. 무게 없는 레이어링.',                                                       material: 'Organic Cotton 100%' },
    { name: '소가죽 미니 크로스 백', type: 'bag',   color: '#BCBAB2', desc: '미니멀 디자인의 크로스바디 백. 실버 하드웨어.',                                                      material: '소가죽 100%' },
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

    let wrapScale = 1.4;

    /* ── Grid layout ── */
    const ITEM_H = 300;
    const ROW_GAP = 120;
    const CANVAS_PAD_V = 120;
    const COLS = 4;

    const allProducts = PRODUCTS;

    const CANVAS_W = canvasWrap.clientWidth;
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
        el.className = `col-item${p.img ? ' col-item--image' : ` col-item--${p.type}`}`;
        el.dataset.name     = p.name;
        el.dataset.desc     = p.desc;
        el.dataset.material = p.material;
        el.dataset.color    = p.color;
        if (p.img) el.dataset.img = p.img;
        el.style.left       = x + 'px';
        el.style.top        = y + 'px';
        el.setAttribute('role', 'button');
        el.setAttribute('tabindex', '0');
        el.setAttribute('aria-label', `${p.name} 보기`);

        const shadow = document.createElement('div');
        shadow.className = 'col-item__shadow';
        el.appendChild(shadow);

        let swatch;
        if (p.img) {
          swatch = document.createElement('img');
          swatch.className = 'col-item__swatch';
          swatch.src = p.img;
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
      targetPanX = 0; targetPanY = 0;
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

    /* ── Custom cursor ── */
    const cursor      = document.getElementById('cursor');
    const cursorLabel = document.getElementById('cursorLabel');
    let mx = 0, my = 0, cx = 0, cy = 0;

    document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
    (function tick() {
      cx += (mx - cx) * 0.18;
      cy += (my - cy) * 0.18;
      if (cursor) cursor.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
      requestAnimationFrame(tick);
    })();

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
    const panelThumbs  = document.getElementById('panelThumbs');
    const panelFeat    = document.getElementById('panelFeatured');
    const panelDesc    = document.getElementById('panelDesc');
    const panelMat     = document.getElementById('panelMaterial');

    function colorVariants(hex) {
      const r = parseInt(hex.slice(1,3), 16);
      const g = parseInt(hex.slice(3,5), 16);
      const b = parseInt(hex.slice(5,7), 16);
      const c = (r2,g2,b2) => `rgb(${Math.max(0,Math.min(255,r2))},${Math.max(0,Math.min(255,g2))},${Math.max(0,Math.min(255,b2))})`;
      return [hex, c(r+22,g+22,b+22), c(r-22,g-22,b-22), c(r+10,g-12,b-20)];
    }

    function openPanel(el) {
      const name     = el.dataset.name;
      const desc     = el.dataset.desc;
      const material = el.dataset.material;
      const color    = el.dataset.color;

      panelName.textContent   = name;
      panelDesc.textContent   = desc;
      panelMat.textContent    = material;

      const variants = colorVariants(color);
      panelThumbs.innerHTML = '';
      variants.forEach((v, i) => {
        const t = document.createElement('div');
        t.className = 'panel__thumb' + (i === 0 ? ' is-active' : '');
        t.style.background = v;
        t.addEventListener('click', () => {
          panelThumbs.querySelectorAll('.panel__thumb').forEach(x => x.classList.remove('is-active'));
          t.classList.add('is-active');
          panelFeat.querySelector('.panel__featured-inner').style.background = v;
        });
        panelThumbs.appendChild(t);
      });
      if (el.dataset.img) {
        panelFeat.innerHTML = `<img class="panel__featured-img" src="${el.dataset.img}" alt="${name}">`;
      } else {
        panelFeat.innerHTML = `<div class="panel__featured-inner" style="background:${color}"></div>`;
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
    canvasScaler.style.transform  = `scale(1.2)`;

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
    /* Non-canvas pages: reveal nav immediately */
    if (gnbWrap) gnbWrap.classList.add('is-revealed');
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
