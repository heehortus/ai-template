// ORBIS — main.js
// Three.js ES module (importmap 기반)
// 제품 추가: PRODUCTS 배열에 항목을 추가하면 카드·dot·3D 오브젝트가 자동 생성됩니다.

import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import Lenis from 'https://cdn.jsdelivr.net/npm/lenis@1.1.14/dist/lenis.mjs';

// ── PRODUCTS CONFIG ───────────────────────────────────────
// 새 제품 추가 시: 이 배열에 객체 하나를 추가하면 됩니다.
const PRODUCTS = [
  {
    name: 'ORBIS ONE',
    desc: '게이밍과 가상 세계 체험을 위한 올인원 VR 헤드셋',
    glb:  'asset/vr_headset.glb',
    specs: [
      { k: '무게',   v: '312 g' },
      { k: '해상도', v: '4K / eye' },
      { k: '시야각', v: '80° FOV' },
      { k: '배터리', v: '6시간 연속' },
      { k: '연결',   v: '5G · Wi-Fi 6E' },
    ],
  },
  {
    name: 'ORBIS PRO',
    desc: '현장 작업자를 위한 경량 산업용 AR 글래스',
    glb:  'asset/ar_glasses.glb',
    specs: [
      { k: '무게',     v: '78 g' },
      { k: '디스플레이', v: 'Micro-OLED Waveguide' },
      { k: '시야각',   v: '40° FOV' },
      { k: '배터리',   v: '8시간 연속' },
      { k: '방수등급', v: 'IP67' },
      { k: '연결',     v: '5G · Wi-Fi 6E · BT 5.2' },
    ],
  },
];

// ── DOM 자동 생성 (카드 + dot) ────────────────────────────
const productsPanel = document.getElementById('productsPanel');
const productDotsEl = document.getElementById('productDots');

PRODUCTS.forEach((prod, i) => {
  const card = document.createElement('div');
  card.className = 'product-card';
  card.id = `productCard${i}`;
  card.innerHTML =
    `<h2 class="product-name">${prod.name}</h2>` +
    `<p class="product-desc">${prod.desc}</p>` +
    `<ul class="product-specs">` +
    prod.specs.map(s => `<li><span class="spec-k">${s.k}</span><span class="spec-v">${s.v}</span></li>`).join('') +
    `</ul>` +
    `<a class="product-cta" href="#inquiry">구매 문의</a>`;
  productsPanel.appendChild(card);

  const dot = document.createElement('span');
  dot.className = 'product-dot' + (i === 0 ? ' is-active' : '');
  dot.dataset.idx = String(i);
  productDotsEl.appendChild(dot);
});

// ── 1. Renderer ───────────────────────────────────────────
const canvas = document.getElementById('orb-canvas');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x07070f, 1);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.8;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// ── 2. Scene & Camera ─────────────────────────────────────
const scene = new THREE.Scene();

// RoomEnvironment — 스튜디오 환경맵 (렌즈·바디 반사 품질 향상)
const pmrem = new THREE.PMREMGenerator(renderer);
const roomEnv = new RoomEnvironment();
scene.environment = pmrem.fromScene(roomEnv).texture;
scene.environmentIntensity = 0.2;
roomEnv.dispose();
pmrem.dispose();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);

function applyCameraForViewport() {
  if (window.innerWidth <= 767) {
    camera.position.set(0, -0.4, 6.5);
    camera.lookAt(0, 0.3, 0);
  } else {
    camera.position.set(0.4, 0.2, 4);
    camera.lookAt(0, 0, 0);
  }
}
applyCameraForViewport();

// ── 3. Lights (blue-purple ORBIS theme) ───────────────────
// Ambient — 전체 저조도
const ambientLight = new THREE.AmbientLight(0x1a1040, 1.2);
scene.add(ambientLight);

// Key light — 전면 좌상단, 쿨 화이트 (그림자 포함)
const keyLight = new THREE.DirectionalLight(0xddeeff, 4.0);
keyLight.position.set(-2, 2.5, 3);
keyLight.castShadow = true;
keyLight.shadow.mapSize.set(2048, 2048);
keyLight.shadow.camera.near = 0.1;
keyLight.shadow.camera.far = 20;
scene.add(keyLight);

// Fill light — 우측 보조광 (그림자 완화)
const fillLight = new THREE.DirectionalLight(0xffffff, 1.2);
fillLight.position.set(3, 1, 2);
scene.add(fillLight);

// Rim left — 전기 블루 (뒤쪽 외곽선)
const rimBlue = new THREE.PointLight(0x4488ff, 16, 14);
rimBlue.position.set(-4, 0.5, -2);
scene.add(rimBlue);

// Rim right — 퍼플 (뒤쪽 외곽선)
const rimPurple = new THREE.PointLight(0x8844ff, 20, 14);
rimPurple.position.set(4, -0.5, -2);
scene.add(rimPurple);

// Under glow — 보라빛 언더라이트
const underGlow = new THREE.PointLight(0x6e4ef5, 4, 10);
underGlow.position.set(0, -2.5, 1);
scene.add(underGlow);

// Top accent — 상단 미세 하이라이트
const topLight = new THREE.PointLight(0xaaccff, 3, 8);
topLight.position.set(0, 4, 0);
scene.add(topLight);

// 조명 기본 강도 (tagline dim 연동)
const BASE_INT = {
  ambient: 1.2, key: 4.0, fill: 1.2,
  rimBlue: 16, rimPurple: 20, underGlow: 4, topLight: 3,
};
let lightDimFactor = 1.0;

// ── 4. 3D 오브젝트 그룹 (PRODUCTS 기반 자동 생성) ─────────
const loader = new GLTFLoader();

const objGroups = PRODUCTS.map((prod, i) => {
  const group = new THREE.Group();
  scene.add(group);

  loader.load(prod.glb, (gltf) => {
    while (group.children.length) group.remove(group.children[0]);
    group.add(gltf.scene);

    const box    = new THREE.Box3().setFromObject(gltf.scene);
    const size   = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const scale  = 2.0 / maxDim;
    gltf.scene.scale.setScalar(scale);

    const center = box.getCenter(new THREE.Vector3());
    gltf.scene.position.sub(center.multiplyScalar(scale));

    // 재질 원본 opacity 저장 (cross-fade 시 재질별 투명도 유지)
    const origOp = new Map();
    gltf.scene.traverse((node) => {
      if (!node.isMesh) return;
      const mats = Array.isArray(node.material) ? node.material : [node.material];
      mats.forEach(m => { if (m) origOp.set(m.uuid, m.opacity ?? 1.0); });
    });
    group.userData.origOp = origOp;

    gltf.scene.traverse((node) => {
      if (!node.isMesh) return;
      node.castShadow    = true;
      node.receiveShadow = true;
      const mats = Array.isArray(node.material) ? node.material : [node.material];
      mats.forEach(m => {
        if (!m) return;
        const orig = origOp.get(m.uuid) ?? 1.0;
        // KHR_materials_transmission (물리 유리) → 불투명 전환
        if (m.transmission !== undefined) m.transmission = 0;
        // 렌즈/유리 재질 감지 (roughness≈0 또는 반투명)
        const isLens = (m.roughness !== undefined && m.roughness < 0.05) || orig < 0.5;
        if (isLens) m.side = THREE.DoubleSide;
        m.transparent = true;
        // 완전투명 재질도 최소 0.12 opacity로 렌즈가 보이게
        m.opacity    = i === 0 ? Math.max(orig, 0.06) : 0.0;
        m.depthWrite = !isLens;
        if (m.roughness !== undefined && m.roughness < 0.2) {
          m.roughness      = 0.22;
          m.envMapIntensity = 0.5;
        } else if (m.envMapIntensity !== undefined) {
          m.envMapIntensity = 0.8;
        }
        m.needsUpdate = true;
      });
    });
  });

  return group;
});

// ── 7. 드래그 회전 (카메라 고정, headsetGroup 직접 회전) ──
// OrbitControls 대신 직접 회전 — 카메라가 움직이지 않으므로
// 오브젝트 화면 위치(좌측)가 드래그 중에도 유지됨.

let dragEnabled  = true;   // 히어로/제품 모두 드래그 허용
let isDragging   = false;
let userInteracting = false;
let prevDragX    = 0;
let prevDragY    = 0;

// 누적 드래그 회전 (기본 회전값에 더해짐)
let dragRotY = 0;
let dragRotX = 0;
let isResetting = false; // 히어로 재진입 시 초기 방향 복원 플래그

// 제품 구간 Y 범위 제한 (±75°)
const MAX_Y = Math.PI / 2.4;
// X 범위 제한 (위 30°, 아래 25°)
const MAX_X_UP   =  0.30;
const MAX_X_DOWN =  0.44;

function onDragStart(x, y) {
  if (!dragEnabled) return;
  isDragging = true;
  userInteracting = true;
  isResetting = false;
  prevDragX = x;
  prevDragY = y;
}
function onDragMove(x, y, isHero) {
  if (!isDragging) return;
  const dx = x - prevDragX;
  const dy = y - prevDragY;
  dragRotY += dx * 0.007;
  dragRotX += dy * 0.004;
  // 제품 구간에서만 범위 제한 (히어로는 자유)
  if (!isHero) {
    dragRotY = Math.max(-MAX_Y, Math.min(MAX_Y, dragRotY));
    dragRotX = Math.max(-MAX_X_UP, Math.min(MAX_X_DOWN, dragRotX));
  }
  prevDragX = x;
  prevDragY = y;
}
function onDragEnd() {
  isDragging = false;
  setTimeout(() => { userInteracting = false; }, 800);
}

canvas.addEventListener('mousedown',  (e) => onDragStart(e.clientX, e.clientY));
window.addEventListener('mousemove',  (e) => onDragMove(e.clientX, e.clientY, lastP <= BP.HERO_END));
window.addEventListener('mouseup',    () => onDragEnd());
canvas.addEventListener('touchstart', (e) => { e.preventDefault(); onDragStart(e.touches[0].clientX, e.touches[0].clientY); }, { passive: false });
window.addEventListener('touchmove',  (e) => onDragMove(e.touches[0].clientX, e.touches[0].clientY, lastP <= BP.HERO_END));
window.addEventListener('touchend',   () => onDragEnd());

// ── 8. 상태 변수 ──────────────────────────────────────────
// 오브젝트 이동 타겟 (Three.js world X)
// x=0: 화면 중앙, x=-1.1: 화면 좌측
let targetObjX = 0;

// 페이즈 breakpoints (runway progress 0~1 기준, 700vh)
const BP = {
  HERO_END:    0.15,
  TRANS_END:   0.25,
  TAGLINE_END: 0.55,
  P3_END:      0.90,  // 전체 products 종료
};
// PROD_FADE_IN: tagline 끝나고 제품 섹션 시작
const PROD_FADE_IN = BP.TAGLINE_END + 0.03;             // 0.58
// 제품당 할당 구간 (자동 계산)
const PROD_STEP    = (BP.P3_END - PROD_FADE_IN) / PRODUCTS.length;

// 제품 카드 + dot (DOM 생성 완료 후 참조)
const productCards = Array.from(document.querySelectorAll('.product-card'));
const productDots  = Array.from(document.querySelectorAll('.product-dot'));
let currentProduct  = -1;
let currentMobileYOffset = 0;
let lastSeenProduct =  0; // 마지막으로 표시된 제품 인덱스 (제품 구간 이탈 후 유지)

function showProduct(idx) {
  if (idx === currentProduct) return;
  currentProduct = idx;
  productCards.forEach((card, i) => card.classList.toggle('is-active', i === idx));
  productDots.forEach((dot,  i) => dot.classList.toggle('is-active',  i === idx));
}

// 씬 opacity
const sceneHero     = document.getElementById('sceneHero');
const sceneTagline  = document.getElementById('sceneTagline');
const sceneProducts = document.getElementById('sceneProducts');
const dimOverlay    = document.getElementById('dimOverlay');
const taglineWords  = document.querySelectorAll('.tw');

// 오브젝트 크로스페이드 타겟 (index 기반, 첫 번째만 1.0으로 초기화)
const objTargetOp = PRODUCTS.map((_, i) => i === 0 ? 1.0 : 0.0);

// easeInOut quadratic
function easeIO(t) { return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; }
function lerp(a, b, t) { return a + (b - a) * t; }
function clamp01(v) { return Math.min(1, Math.max(0, v)); }
function invLerp(a, b, v) { return clamp01((v - a) / (b - a)); }

function setGroupOpacity(group, target) {
  const origOp = group.userData.origOp;
  group.traverse((node) => {
    if (!node.isMesh) return;
    const mats = Array.isArray(node.material) ? node.material : [node.material];
    mats.forEach(m => {
      if (!m) return;
      const base = origOp ? Math.max(origOp.get(m.uuid) ?? 1.0, 0.12) : 1.0;
      m.opacity    = lerp(m.opacity, base * target, 0.10);
      m.depthWrite = m.opacity >= 0.98;
    });
  });
}

// ── 9. Scroll Handler ─────────────────────────────────────
const runwayWrap = document.getElementById('runwayWrap');
let lastP = -1;

function onScroll() {
  if (!runwayWrap) return;
  const rect   = runwayWrap.getBoundingClientRect();
  const runway = runwayWrap.offsetHeight - window.innerHeight;
  const p      = runway > 0 ? clamp01(-rect.top / runway) : 0;
  if (Math.abs(p - lastP) < 0.0004) return;
  const prevP = lastP;
  lastP = p;

  // 히어로 재진입 감지
  if (prevP > BP.HERO_END && p <= BP.HERO_END) isResetting = true;

  // ─ Hero opacity
  const heroOp = p < BP.HERO_END
    ? 1
    : 1 - invLerp(BP.HERO_END, BP.TRANS_END, p);
  if (sceneHero) sceneHero.style.opacity = heroOp;

  // ─ Tagline opacity & word wipe
  const TF_IN   = 0.03;                       // fade-in 길이
  const WIPE_END = BP.TAGLINE_END - 0.13;     // 단어 wipe 완료 지점 (dwell 확보)
  const TF_OUT  = 0.02;                        // fade-out 길이

  const taglineOp = p < BP.TRANS_END
    ? 0
    : p < BP.TRANS_END + TF_IN
      ? invLerp(BP.TRANS_END, BP.TRANS_END + TF_IN, p)
      : p < BP.TAGLINE_END - TF_OUT
        ? 1
        : p < BP.TAGLINE_END
          ? 1 - invLerp(BP.TAGLINE_END - TF_OUT, BP.TAGLINE_END, p)
          : 0;
  if (sceneTagline) sceneTagline.style.opacity = taglineOp;

  // 단어 wipe: WIPE_END까지 순차 점등 → 이후 dwell
  const tagP = invLerp(BP.TRANS_END + TF_IN, WIPE_END, p);
  const N    = taglineWords.length;
  taglineWords.forEach((w, i) => {
    w.classList.toggle('is-lit', tagP >= (i + 0.5) / N);
  });

  // ─ Dim overlay + 조명 dimming (taglineOp 연동)
  if (dimOverlay) dimOverlay.style.opacity = taglineOp * 0.82;
  lightDimFactor = 1 - taglineOp * 0.52;

  // ─ Products opacity
  const prodOp = p < PROD_FADE_IN
    ? 0
    : p < PROD_FADE_IN + 0.04
      ? invLerp(PROD_FADE_IN, PROD_FADE_IN + 0.04, p)
      : p < BP.P3_END
        ? 1
        : 1 - invLerp(BP.P3_END, 1.0, p);
  if (sceneProducts) sceneProducts.style.opacity = prodOp;

  // ─ 3D 오브젝트 X 이동 (모바일: 항상 중앙 고정)
  if (window.innerWidth > 767) {
    if (p <= BP.TAGLINE_END) {
      targetObjX = 0;
    } else if (p <= BP.TAGLINE_END + 0.06) {
      const t = easeIO(invLerp(BP.TAGLINE_END, BP.TAGLINE_END + 0.06, p));
      targetObjX = lerp(0, -1.1, t);
    } else {
      targetObjX = -1.1;
    }
  } else {
    targetObjX = 0;
  }

  // ─ 활성 제품 인덱스 계산
  let activeProduct = -1;
  if (p > PROD_FADE_IN && p <= BP.P3_END) {
    activeProduct = Math.min(
      PRODUCTS.length - 1,
      Math.floor((p - PROD_FADE_IN) / PROD_STEP)
    );
    lastSeenProduct = activeProduct; // 마지막 본 제품 기억
  }

  // ─ 오브젝트 크로스페이드 타겟 갱신
  // 제품 구간 밖에서도 마지막 본 제품 유지 (headset으로 돌아가지 않음)
  const showIdx = activeProduct >= 0 ? activeProduct : lastSeenProduct;
  PRODUCTS.forEach((_, i) => {
    objTargetOp[i] = i === showIdx ? 1.0 : 0.0;
  });

  // ─ 제품 카드 전환
  if (activeProduct >= 0) showProduct(activeProduct);
}

// scroll → lenis.on('scroll') 에서 통합 호출

// ── 10. GNB & Display Logo scroll fade ───────────────────
const gnb          = document.getElementById('gnb');
const displayLogo  = document.getElementById('heroDisplayLogo');
const subWrap      = document.getElementById('heroSubWrap');
const hamburgerBtn = document.getElementById('gnbHamburger');
const mobileMenu   = document.getElementById('gnbMobileMenu');

function closeMobileMenu() {
  hamburgerBtn.classList.remove('is-open');
  mobileMenu.classList.remove('is-open');
  hamburgerBtn.setAttribute('aria-expanded', 'false');
  mobileMenu.setAttribute('aria-hidden', 'true');
}

if (hamburgerBtn) {
  hamburgerBtn.addEventListener('click', () => {
    const isOpen = hamburgerBtn.classList.toggle('is-open');
    mobileMenu.classList.toggle('is-open', isOpen);
    hamburgerBtn.setAttribute('aria-expanded', String(isOpen));
    mobileMenu.setAttribute('aria-hidden', String(!isOpen));
  });
  mobileMenu.querySelectorAll('.gnb-mobile-link').forEach(link => {
    link.addEventListener('click', () => closeMobileMenu());
  });
}

let introComplete = false;

// ── Display logo ↔ sub-wrap 좌/우 정렬 동기화 ────────────
function syncSubToLogo() {
  if (!displayLogo || !subWrap) return;
  const range = document.createRange();
  range.selectNodeContents(displayLogo);
  const rect = range.getBoundingClientRect();
  const l = Math.round(rect.left);
  const r = Math.round(window.innerWidth - rect.right);
  subWrap.style.paddingLeft  = `${l}px`;
  subWrap.style.paddingRight = `${r}px`;
}
document.fonts.ready.then(syncSubToLogo);
window.addEventListener('resize', syncSubToLogo);

function updateScrollFade(sy = window.scrollY) {
  // Display logo + 서브텍스트: opacity (0 → 320px) — 인트로 완료 후만 제어
  if (introComplete) {
    const lP = Math.min(1, sy / 320);
    if (displayLogo) displayLogo.style.opacity = 1 - lP;
    if (subWrap)     subWrap.style.opacity     = 1 - lP;
  }
}

// ── Lenis 초기화 ──────────────────────────────────────────
const lenis = new Lenis({
  duration: 1.4,
  easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
  smoothTouch: false,
});

const inquirySection    = document.getElementById('inquiry');
const industriesSection = document.getElementById('industries');
const techSection       = document.getElementById('technology');

// inquiry 섹션 중앙이 뷰포트 중앙과 일치하는 scrollY 값
let snapScrollY = 0;
function computeSnapScrollY() {
  if (!inquirySection) return;
  snapScrollY = inquirySection.offsetTop + inquirySection.offsetHeight / 2 - window.innerHeight / 2;
}
computeSnapScrollY();

// 현재 Lenis scroll 값 추적 (animate loop에서 사용)
let currentLenisScroll = 0;
let lastScrollY = 0;
let inInquiry = false;

lenis.on('scroll', ({ scroll }) => {
  currentLenisScroll = scroll;
  const scrollingDown = scroll > lastScrollY;
  lastScrollY = scroll;

  onScroll();
  updateScrollFade(scroll);

  // 테크 섹션 진입 시 오브젝트 중앙 복귀 (-1.1 → 0, 모바일 제외)
  if (window.innerWidth > 767 && techSection) {
    const tr = techSection.getBoundingClientRect();
    if (tr.top < window.innerHeight && tr.top > -tr.height) {
      const prog = clamp01(1 - tr.top / window.innerHeight);
      targetObjX = lerp(-1.1, 0, easeIO(prog));
    }
  }

  // GNB: 스크롤 상단 근처면 항상 표시, 아래로 스크롤 시 숨김, 위로 스크롤 시 재표시
  const menuIsOpen = mobileMenu && mobileMenu.classList.contains('is-open');
  if (scroll <= 80) {
    gnb.style.transform    = 'translateY(0)';
    gnb.style.opacity      = '1';
    gnb.style.pointerEvents = '';
  } else if (scrollingDown && !menuIsOpen) {
    gnb.style.transform    = 'translateY(calc(-100% - 48px))';
    gnb.style.opacity      = '0';
    gnb.style.pointerEvents = 'none';
    if (menuIsOpen) closeMobileMenu();
  } else if (!scrollingDown) {
    gnb.style.transform    = 'translateY(0)';
    gnb.style.opacity      = '1';
    gnb.style.pointerEvents = '';
  }

  // Industries 섹션: 뷰포트 중앙 교차 시 색상 반전
  if (industriesSection) {
    const ir = industriesSection.getBoundingClientRect();
    const vc = window.innerHeight / 2;
    industriesSection.classList.toggle('is-inverted', ir.top < vc && ir.bottom > vc);
  }

  // 구매 문의 섹션이 뷰포트에 보이면 무조건 첫 번째 오브젝트 + 정면 복귀 플래그
  if (inquirySection) {
    const r = inquirySection.getBoundingClientRect();
    inInquiry = r.top < window.innerHeight && r.bottom > 0;
    if (inInquiry) {
      PRODUCTS.forEach((_, i) => { objTargetOp[i] = i === 0 ? 1.0 : 0.0; });
      if (window.innerWidth > 767) targetObjX = -1.1;
    }
  }

  // footer 요소: 스크롤 90% 도달 시 slide-in 등장
  if (!footerRevealed) {
    const maxScroll = document.body.scrollHeight - window.innerHeight;
    if (maxScroll > 0 && scroll / maxScroll >= 0.9) {
      footerRevealEls.forEach(el => el.classList.add('is-visible'));
      footerRevealed = true;
    }
  }
});

// 앵커 클릭 → Lenis smooth scroll
document.addEventListener('click', (e) => {
  const link = e.target.closest('a[href^="#"]');
  if (!link) return;
  const target = document.querySelector(link.getAttribute('href'));
  if (!target) return;
  e.preventDefault();
  lenis.scrollTo(target, { duration: 1.2 });
});

onScroll();
updateScrollFade(0);

// ── 인트로 애니메이션 시퀀스 ─────────────────────────────
(function playIntro() {
  const gnbInner = document.querySelector('.gnb-inner');
  // SPRING: 빠른 가속 + 강한 오버슈트 → 위잉 바운스 정착
  const SPRING = 'cubic-bezier(0.16, 1, 0.3, 1)';
  const EASE   = 'cubic-bezier(0.42, 0, 0.58, 1)';

  // ── GNB: scaleX 중앙 → 좌우 위잉~ 펼침
  gnbInner.style.transition     = 'none';
  gnbInner.style.transform      = 'scaleX(0)';
  gnbInner.style.opacity        = '0';
  gnbInner.style.transformOrigin = 'center';
  gnbInner.offsetHeight;

  setTimeout(() => {
    gnbInner.style.transition = `transform 0.56s ${SPRING}, opacity 0.28s ${EASE}`;
    requestAnimationFrame(() => {
      gnbInner.style.transform = 'scaleX(1)';
      gnbInner.style.opacity   = '1';
    });
    setTimeout(() => {
      gnbInner.style.transform      = '';
      gnbInner.style.opacity        = '';
      gnbInner.style.transition     = '';
      gnbInner.style.transformOrigin = '';
    }, 640);
  }, 200);

  // ── Display logo + 서브텍스트 래퍼: 하단 오프스크린 배치
  [displayLogo, subWrap].forEach(el => {
    if (!el) return;
    el.style.transition = 'none';
    el.style.transform  = 'translateY(80px)';
    el.style.opacity    = '0';
  });
  displayLogo && displayLogo.offsetHeight;

  // Step 2 — 디스플레이 로고 + 서브텍스트 슬라이드 업 (700ms 후)
  setTimeout(() => {
    if (!displayLogo) return;
    // 로고: 슬라이드 업
    displayLogo.style.transition = `transform 1.0s ${SPRING}, opacity 0.8s ${EASE}`;
    displayLogo.style.transform  = 'translateY(0)';
    displayLogo.style.opacity    = '1';
    // 서브텍스트 래퍼: 50ms 딜레이 후 동일 애니메이션
    setTimeout(() => {
      if (!subWrap) return;
      subWrap.style.transition = `transform 1.0s ${SPRING}, opacity 0.8s ${EASE}`;
      subWrap.style.transform  = 'translateY(0)';
      subWrap.style.opacity    = '1';
    }, 50);

    setTimeout(() => {
      displayLogo.style.transition = 'none';
      if (subWrap) subWrap.style.transition = 'none';
      introComplete = true;
    }, 1000);
  }, 700);
})();

// ── 11. Reveal on scroll ──────────────────────────────────
// footer 요소는 스크롤 90% 지점에서 별도 트리거 — observer 제외
const revealEls = document.querySelectorAll('[data-reveal]:not(.footer-tagline):not(.footer-big-logo)');
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('is-visible');
    revealObs.unobserve(e.target);
  });
}, { threshold: 0.2, rootMargin: '0px 0px -8% 0px' });
revealEls.forEach(el => revealObs.observe(el));

// footer 요소: 스크롤 90% 도달 시 등장
const footerRevealEls = document.querySelectorAll('.footer-tagline, .footer-big-logo');
let footerRevealed = false;

// ── 12. Resize ────────────────────────────────────────────
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  applyCameraForViewport();
  computeSnapScrollY();
  lastP = -1;
  onScroll();
});

// ── 13. Render Loop ───────────────────────────────────────
const clock = new THREE.Clock();

function animate(time) {
  requestAnimationFrame(animate);
  lenis.raf(time);
  const t = clock.getElapsedTime();

  // 부드러운 X 위치 lerp (기준: 첫 번째 그룹)
  objGroups[0].position.x = lerp(objGroups[0].position.x, targetObjX, 0.06);

  // 플로팅 (상하 미세 움직임) + inquiry 섹션 중앙 고정
  const floatY = Math.sin(t * 0.72) * 0.04;
  const inProductSection = lastP >= PROD_FADE_IN && lastP <= BP.P3_END;
  let targetMobileY = 0;
  if (window.innerWidth <= 767 && inProductSection) {
    // 패널이 차지하는 픽셀(bottom:48 + 패널 높이)의 절반만큼 오브젝트를 위로 올림
    const panelH     = productsPanel ? productsPanel.offsetHeight : 280;
    const pixelShift = (48 + panelH) / 2;
    const worldPerPx = (2 * Math.tan(22.5 * Math.PI / 180) * camera.position.z) / window.innerHeight;
    targetMobileY    = pixelShift * worldPerPx;
  }
  currentMobileYOffset = lerp(currentMobileYOffset, targetMobileY, 0.05);
  let objY = floatY + currentMobileYOffset;
  if (currentLenisScroll >= snapScrollY && inquirySection) {
    const r = inquirySection.getBoundingClientRect();
    const inquiryCenterViewport = r.top + r.height / 2;
    const deltaPixels = window.innerHeight / 2 - inquiryCenterViewport;
    const worldPerPx = (2 * Math.tan(22.5 * Math.PI / 180) * camera.position.z) / window.innerHeight;
    objY = floatY + deltaPixels * worldPerPx;
  }
  objGroups[0].position.y = objY;

  // 자동 회전 + 히어로 재진입 시 정면 복귀
  if (lastP <= BP.TAGLINE_END && !userInteracting) {
    if (isResetting) {
      dragRotY = lerp(dragRotY, 0, 0.04);
      dragRotX = lerp(dragRotX, 0, 0.04);
      if (Math.abs(dragRotY) < 0.002 && Math.abs(dragRotX) < 0.002) {
        dragRotY = 0; dragRotX = 0; isResetting = false;
      }
    } else {
      dragRotY += 0.004;
    }
  }

  // inquiry 섹션: 정면 복귀 (userInteracting 중엔 유지)
  if (inInquiry && !userInteracting) {
    dragRotY = lerp(dragRotY, 0, 0.04);
    dragRotX = lerp(dragRotX, 0, 0.04);
  }

  // 기본 방향: 정면 (오프셋 0)
  objGroups[0].rotation.y = dragRotY;
  objGroups[0].rotation.x = dragRotX;

  // 나머지 그룹 — 첫 번째와 동일 위치·회전 공유 + 크로스페이드
  for (let i = 1; i < objGroups.length; i++) {
    objGroups[i].position.x = objGroups[0].position.x;
    objGroups[i].position.y = objGroups[0].position.y;
    objGroups[i].rotation.y = dragRotY;
    objGroups[i].rotation.x = dragRotX;
  }

  // 오브젝트 크로스페이드
  objGroups.forEach((group, i) => setGroupOpacity(group, objTargetOp[i]));

  // 조명 dim (tagline 씬 연동)
  ambientLight.intensity  = BASE_INT.ambient   * lightDimFactor;
  keyLight.intensity      = BASE_INT.key        * lightDimFactor;
  fillLight.intensity     = BASE_INT.fill       * lightDimFactor;
  rimBlue.intensity       = BASE_INT.rimBlue    * lightDimFactor;
  rimPurple.intensity     = BASE_INT.rimPurple  * lightDimFactor;
  underGlow.intensity     = BASE_INT.underGlow  * lightDimFactor;
  topLight.intensity      = BASE_INT.topLight   * lightDimFactor;

  renderer.render(scene, camera);
}

// ── 14. Custom Cursor ─────────────────────────────────
const cursorEl    = document.getElementById('cursor');
const dragCursorEl = document.getElementById('drag-cursor');
let   curX = -100, curY = -100;
const _projVec = new THREE.Vector3();

document.addEventListener('mousemove', (e) => {
  curX = e.clientX;
  curY = e.clientY;

  if (cursorEl) {
    cursorEl.style.left = curX + 'px';
    cursorEl.style.top  = curY + 'px';
  }

  if (dragCursorEl) {
    dragCursorEl.style.left = curX + 'px';
    dragCursorEl.style.top  = curY + 'px';

    // 오브젝트 중심을 화면 좌표로 투영 후 마우스 거리 계산
    _projVec.copy(objGroups[0].position).project(camera);
    const objSx = (_projVec.x * 0.5 + 0.5) * window.innerWidth;
    const objSy = (-_projVec.y * 0.5 + 0.5) * window.innerHeight;
    const dist  = Math.hypot(curX - objSx, curY - objSy);

    // 오브젝트 반경(1 world unit)을 픽셀로 환산 (FOV 45°, z=4 기준)
    const worldPerPx   = (2 * Math.tan(22.5 * Math.PI / 180) * 4) / window.innerHeight;
    const objRadiusPx  = 1.1 / worldPerPx;

    const inDraggable = lastP >= 0 && lastP < 0.98;
    const showDrag = inDraggable && dist < objRadiusPx;
    dragCursorEl.classList.toggle('is-visible', showDrag);
    if (cursorEl) cursorEl.style.opacity = showDrag ? '0' : '1';
  }
});

document.addEventListener('mouseleave', () => {
  cursorEl.style.opacity = '0';
  if (dragCursorEl) dragCursorEl.classList.remove('is-visible');
});
document.addEventListener('mouseenter', () => { cursorEl.style.opacity = '1'; });

// ── Industry Popup ────────────────────────────────────
const industryPopupEl  = document.getElementById('industry-popup');
const industryPopupImg = document.getElementById('industry-popup-img');

function positionPopup(x, y) {
  if (!industryPopupEl) return;
  const pw = 280, ph = 380;
  const left = x + 24 + pw > window.innerWidth ? x - 24 - pw : x + 24;
  const top  = Math.max(8, Math.min(y - ph / 2, window.innerHeight - ph - 8));
  industryPopupEl.style.left = left + 'px';
  industryPopupEl.style.top  = top  + 'px';
}

document.querySelectorAll('.industry-item').forEach(item => {
  item.addEventListener('mouseenter', (e) => {
    if (!industryPopupEl || !industryPopupImg) return;
    const src = item.dataset.img;
    if (!src) return;
    industryPopupImg.src = src;
    positionPopup(e.clientX, e.clientY);
    industryPopupEl.classList.add('is-visible');
  });
  item.addEventListener('mousemove', (e) => {
    positionPopup(e.clientX, e.clientY);
  });
  item.addEventListener('mouseleave', () => {
    if (industryPopupEl) industryPopupEl.classList.remove('is-visible');
  });
});

animate();

