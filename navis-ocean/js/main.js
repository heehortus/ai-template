/* ═══════════════════════════════════════
   NAVIS 수산 — main.js
   ═══════════════════════════════════════ */

/* 모바일 biz 슬라이더 열기 (전역 — onclick 속성에서 직접 호출) */
function bizOpenSlider(idx) {
  var slider = document.querySelector('.biz-slider');
  if (!slider) return;
  /* slides / tabs 는 IIFE 내부 변수이므로 DOM 직접 조작 */
  var slides = slider.querySelectorAll('.slide');
  var tabs   = document.querySelectorAll('.slide-tab');
  slides.forEach(function(s) { s.classList.remove('active'); });
  tabs.forEach(function(t)   { t.classList.remove('active'); });
  if (slides[idx]) slides[idx].classList.add('active');
  if (tabs[idx])   tabs[idx].classList.add('active');
  slider.classList.add('mobile-open');
  if (window.lenis) window.lenis.stop();
}

(function () {
  'use strict';

  /* ══════════════════════════════
     유틸
  ══════════════════════════════ */
  function clamp(v, min, max) { return Math.min(Math.max(v, min), max); }
  function lerp(a, b, t) { return a + (b - a) * t; }

  /* ══════════════════════════════
     Lenis 스무스 스크롤
  ══════════════════════════════ */
  var lenis = new Lenis({
    duration: 1.4,
    easing: function (t) { return 1 - Math.pow(1 - t, 4); }, // easeOutQuart
    smoothWheel: true
  });
  window.lenis = lenis; // bizOpenSlider 전역 함수에서 참조
  (function lenisRaf(time) {
    lenis.raf(time);
    requestAnimationFrame(lenisRaf);
  }(performance.now()));

  var gnb = document.getElementById('gnb');

  /* ══════════════════════════════
     모바일 메뉴
  ══════════════════════════════ */
  var hamburger = document.getElementById('hamburger');
  var drawer    = document.getElementById('mobileDrawer');
  var dim       = document.getElementById('mobileDim');
  var closer    = document.getElementById('drawerClose');

  function openDrawer()  { hamburger.classList.add('is-open'); drawer.classList.add('open'); dim.classList.add('open'); document.body.style.overflow = 'hidden'; }
  function closeDrawer() { hamburger.classList.remove('is-open'); drawer.classList.remove('open'); dim.classList.remove('open'); document.body.style.overflow = ''; }

  if (hamburger) hamburger.addEventListener('click', function () { drawer.classList.contains('open') ? closeDrawer() : openDrawer(); });
  if (closer) closer.addEventListener('click', closeDrawer);
  if (dim)    dim.addEventListener('click', closeDrawer);
  document.querySelectorAll('.mobile-link').forEach(function (l) {
    l.addEventListener('click', function (e) {
      e.preventDefault();
      closeDrawer();
      var target = l.getAttribute('href');
      if (target && target !== '#') {
        var el = document.querySelector(target);
        if (el) setTimeout(function () { lenis.scrollTo(el, { duration: 1.2 }); }, 340);
      }
    });
  });

  /* ══════════════════════════════
     HERO: 페이지 로드 인트로
     — 텍스트가 왼쪽에서 슬라이드 인
  ══════════════════════════════ */
  var heroEl = document.getElementById('hero');
  if (heroEl) {
    setTimeout(function () { heroEl.classList.add('is-loaded'); }, 120);
  }

  /* ══════════════════════════════
     HERO: 스크롤하면 둥근 박스 → 풀스크린으로 확장 (sticky pin)
     clip-path: inset(96px 24px 24px round 20px) → inset(0)
     GNB: 배경 투명 전환
  ══════════════════════════════ */
  var EXPAND_DIST  = 360;
  var INSET_TOP    = 96;
  var INSET_SIDE   = 24;
  var INSET_BOT    = 24;
  var BR_INIT      = 20;
  var heroBg       = document.getElementById('heroBg');
  var heroRafPending = false;
  var heroPrev     = 0;
  var heroLocked   = false;
  var heroAnimating = false; // CSS transition 진행 중 여부
  var heroExpanded  = false; // 풀스크린 확장 완료 여부

  function updateHero() {
    // 애니메이션 진행 중엔 scroll 기반 업데이트 차단
    if (heroAnimating) { heroRafPending = false; return; }

    var p = clamp(window.scrollY / EXPAND_DIST, 0, 1);

    // 스크롤 시작 순간 lenis.stop + CSS transition으로 풀스크린 확장
    if (p > 0 && !heroExpanded) {
      heroAnimating = true;
      lenis.stop();

      if (heroEl) {
        heroEl.style.transition = 'clip-path 0.72s cubic-bezier(0.16, 1, 0.3, 1)';
        heroEl.style.clipPath   = 'inset(0px 0px 0px round 0px)';
      }
      var ind = heroEl ? heroEl.querySelector('.hero-scroll-ind') : null;
      if (ind) { ind.style.transition = 'opacity 0.24s'; ind.style.opacity = '0'; }

      setTimeout(function () {
        if (heroEl) heroEl.style.transition = '';
        if (ind)    ind.style.transition    = '';
        heroAnimating = false;
        heroExpanded  = true;
        lenis.start();
      }, 760);

      heroRafPending = false;
      return; // 같은 콜에서 아래 scroll 기반 clipPath가 덮어쓰지 않도록 차단
    }

    // 맨 위로 돌아오면 초기 상태로 리셋
    if (heroExpanded && window.scrollY <= 0) {
      heroExpanded = false;
      if (heroEl) heroEl.style.clipPath =
        'inset(' + INSET_TOP + 'px ' + INSET_SIDE + 'px ' + INSET_BOT + 'px round ' + BR_INIT + 'px)';
    }

    // 확장 전: 스크롤 기반 clip-path (모바일 등 isPc 아닌 경우 자연스러운 폴백)
    if (!heroExpanded && heroEl) {
      var it  = (INSET_TOP  * (1 - p)).toFixed(1);
      var is_ = (INSET_SIDE * (1 - p)).toFixed(1);
      var ib  = (INSET_BOT  * (1 - p)).toFixed(1);
      var br  = (BR_INIT    * (1 - p)).toFixed(1);
      heroEl.style.clipPath = 'inset(' + it + 'px ' + is_ + 'px ' + ib + 'px round ' + br + 'px)';
      var ind2 = heroEl.querySelector('.hero-scroll-ind');
      if (ind2) ind2.style.opacity = (1 - p * 3 > 0 ? 1 - p * 3 : 0).toFixed(2);
    }

    // GNB 그림자
    if (gnb) {
      var heroBottom = heroEl ? heroEl.getBoundingClientRect().bottom : 0;
      if (heroBottom > 0) { gnb.classList.remove('is-shadow'); }
      else                { gnb.classList.add('is-shadow'); }
    }

    // 패럴랙스
    if (heroBg && window.scrollY < window.innerHeight * 1.5) {
      heroBg.style.transform = 'translateY(' + (window.scrollY * 0.36).toFixed(1) + 'px)';
    }
    heroPrev = p;
    heroRafPending = false;
  }

  updateHero(); // 초기값 적용
  lenis.on('scroll', function () {
    if (!heroRafPending) {
      heroRafPending = true;
      requestAnimationFrame(updateHero);
    }
  });

  /* ══════════════════════════════
     스크롤 리빌 (IntersectionObserver)
     .reveal         → translateY(32px) → 0
     .reveal-right   → translateX(56px) → 0
     .biz-card-reveal → translateY(72px) → 0  (스태거)
  ══════════════════════════════ */
  var allReveal = document.querySelectorAll('.reveal, .reveal-right, .biz-card-reveal, .reveal-clip');

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.08,
      rootMargin: '0px 0px -20px 0px'
    });

    allReveal.forEach(function (el) { io.observe(el); });
  } else {
    // 폴백: 즉시 표시
    allReveal.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ══════════════════════════════
     비즈니스 슬라이더
  ══════════════════════════════ */
  var slides      = document.querySelectorAll('.biz-slider .slide');
  var tabs        = document.querySelectorAll('.slide-tab');
  var prevBtn     = document.getElementById('slidePrev');
  var slideIdx    = 0;
  var slideTotal  = slides.length;
  var slideTimer  = null;
  var SLIDE_DUR   = 4000; // CSS tab-progress 애니메이션(4s)과 일치

  function restartTabBar(tab) {
    var bar = tab.querySelector('.tab-bar');
    if (!bar) return;
    bar.style.animation = 'none';
    bar.offsetWidth; // reflow
    bar.style.animation = '';
  }

  function scrollToNetwork() {
    clearTimeout(slideTimer);
    clearInterval(slideTimer);
    lenis.start();
    if (window.innerWidth <= 900) {
      // 모바일: 슬라이더 닫은 뒤 network 섹션으로 스크롤
      var mSlider = document.querySelector('.biz-slider');
      if (mSlider) mSlider.classList.remove('mobile-open');
      var networkEl = document.getElementById('network');
      if (networkEl) setTimeout(function () { lenis.scrollTo(networkEl, { duration: 1.2 }); }, 440);
      return;
    }
    var networkEl = document.getElementById('network');
    if (!networkEl) return;
    // slider가 fixed 상태면 먼저 자연 배치로 복귀
    if (bizSlider && bizSlider.style.position === 'fixed') {
      bizSlider.style.cssText = '';
      bizSliderReady = true;
    }
    lenis.scrollTo(networkEl, { duration: 1.2 });
  }

  function goSlide(idx) {
    slides[slideIdx].classList.remove('active');
    tabs[slideIdx].classList.remove('active');
    slideIdx = (idx + slideTotal) % slideTotal;
    slides[slideIdx].classList.add('active');
    tabs[slideIdx].classList.add('active');
    restartTabBar(tabs[slideIdx]);
    clearTimeout(slideTimer);
    clearInterval(slideTimer);
    if (window.innerWidth > 900) {
      if (slideIdx < slideTotal - 1) {
        slideTimer = setInterval(function () { goSlide(slideIdx + 1); }, SLIDE_DUR);
      } else {
        slideTimer = setTimeout(scrollToNetwork, SLIDE_DUR);
      }
    }
  }

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      goSlide(parseInt(tab.getAttribute('data-idx'), 10));
    });
  });

  var nextBtn = document.getElementById('slideNext');
  if (prevBtn) prevBtn.addEventListener('click', function () { goSlide(slideIdx - 1); });
  if (nextBtn) nextBtn.addEventListener('click', function () {
    if (slideIdx === slideTotal - 1) {
      scrollToNetwork();
    } else {
      goSlide(slideIdx + 1);
    }
  });

  // 초기 자동 슬라이드 시작 (PC 전용)
  restartTabBar(tabs[0]);
  if (window.innerWidth > 900) {
    slideTimer = setInterval(function () { goSlide(slideIdx + 1); }, SLIDE_DUR);
  }

  /* ══════════════════════════════
     스탯 카운트업
  ══════════════════════════════ */
  var statEls = document.querySelectorAll('.nstat-num[data-target]');

  function countUp(el) {
    var target   = parseInt(el.getAttribute('data-target'), 10);
    var duration = 900;
    var start    = performance.now();
    function step(now) {
      var t = clamp((now - start) / duration, 0, 1);
      var e = t === 1 ? 1 : 1 - Math.pow(2, -10 * t); // easeOutExpo
      el.textContent = Math.floor(e * target);
      if (t < 1) requestAnimationFrame(step);
      else el.textContent = target;
    }
    requestAnimationFrame(step);
  }

  if ('IntersectionObserver' in window) {
    var statIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { countUp(e.target); statIO.unobserve(e.target); }
      });
    }, { threshold: 0.5 });
    statEls.forEach(function (el) { statIO.observe(el); });
  }

  /* ══════════════════════════════
     비즈니스 스테이지 스크롤 애니메이션
     Phase 1 (0→0.44): 카드 아래에서 상승
     Phase 2 (0.44→0.60): 헤더 클립패스 리빌
     Phase 3 (0.60→1.0): 센터 카드 풀스크린 확장
  ══════════════════════════════ */
  var bizPin         = document.getElementById('bizPin');
  var bizStage       = document.getElementById('bizStage');
  var bizHd          = document.getElementById('bizStageHd');
  var bizStageCards  = document.getElementById('bizStageCards');
  var bizCards       = document.querySelectorAll('.biz-stage-card');
  var bizRects        = null;
  var bizLocked       = false;
  var bizPrevP        = -1;
  var bizRafPend      = false;
  var bizSlider       = document.querySelector('.biz-slider');
  var bizSliderReady  = false; // 점프 후 재고정 방지
  var selectedBizCard = 2;     // 확장할 카드 인덱스 (호버로 변경)

  // 카드 호버 시 확장 대상 선택 (phase 1/2 구간에서만)
  bizCards.forEach(function(card, i) {
    card.addEventListener('mouseenter', function() {
      if (!bizRects) { selectedBizCard = i; }
    });
  });

  var BIZ_STAGGER = [0.08, 0.04, 0, 0.04, 0.08]; // center first
  var BIZ_P0 = 0.16;  // 헤더 완전히 나타남
  var BIZ_P1 = 0.56;  // 카드 완전히 정착
  var BIZ_P2 = 0.60;  // 센터 카드 확장 시작
  var isMobileBiz = window.innerWidth <= 900; // 모바일/태블릿 여부 (biz 섹션 애니메이션 분기)

  function updateBiz() {
    if (!bizPin || !bizStage) return;
    var pinExtra = bizPin.offsetHeight - window.innerHeight;
    if (pinExtra <= 0) return;
    var p = clamp(-bizPin.getBoundingClientRect().top / pinExtra, 0, 1);

    var biz_p2_eff = BIZ_P2;
    var inP3 = p >= biz_p2_eff - 0.01;

    // Phase 3 종료 시 절대 위치 + slider 초기화
    if (!inP3 && bizRects) {
      bizRects = null;
      if (bizStageCards) { bizStageCards.style.height = ''; }
      bizCards.forEach(function(card) {
        card.style.position = card.style.left = card.style.top =
        card.style.width = card.style.height = card.style.borderRadius =
        card.style.zIndex = card.style.transform = card.style.opacity = '';
      });
      if (bizHd) { bizHd.style.opacity = ''; bizHd.style.clipPath = ''; bizHd.style.transform = ''; }
      // bizSliderReady=true면 위 스크롤 중이므로 slider는 건드리지 않음
      if (!bizSliderReady) {
        if (bizSlider) { bizSlider.style.cssText = ''; }
        selectedBizCard = 2;
      }
    }

    if (!inP3) {
      if (isMobileBiz) {
        /* 모바일: CSS .biz-entered 클래스로 표시 — 인라인 스타일 개입 없음 */
      } else {
        // Phase 1: hd는 항상 표시 — 카드 애니메이션만 실행

        // Phase 2: 카드 상승 (BIZ_P0+stagger → BIZ_P1)
        bizCards.forEach(function(card, i) {
          var startP = BIZ_P0 + BIZ_STAGGER[i];
          var lp     = clamp((p - startP) / (BIZ_P1 - startP), 0, 1);
          var ease   = 1 - Math.pow(1 - lp, 3); // easeOutCubic
          card.style.transform = 'translateY(' + ((1 - ease) * 110).toFixed(2) + 'vh)';
          card.style.opacity   = lp > 0 ? '1' : '0';
        });
      }
    } else if (!isMobileBiz) {
      // Phase 3: 선택된 카드 확장 (PC 전용)
      if (!bizRects) {
        bizRects = [];
        if (bizStageCards) { bizStageCards.style.height = bizStageCards.offsetHeight + 'px'; }
        var sr = bizStage.getBoundingClientRect();
        bizCards.forEach(function(card) {
          var r = card.getBoundingClientRect();
          bizRects.push({ l: r.left - sr.left, t: r.top - sr.top, w: r.width, h: r.height });
        });
        goSlide(selectedBizCard);
      }

      var t3  = clamp((p - biz_p2_eff) / (1 - biz_p2_eff), 0, 1);
      var t3e = 1 - Math.pow(1 - t3, 3);

      bizCards.forEach(function(card, i) {
        var r = bizRects[i];
        card.style.position  = 'absolute';
        card.style.transform = 'none';

        if (i === selectedBizCard) {
          card.style.left         = lerp(r.l, 0, t3e).toFixed(1) + 'px';
          card.style.top          = lerp(r.t, 0, t3e).toFixed(1) + 'px';
          card.style.width        = lerp(r.w, bizStage.offsetWidth, t3e).toFixed(1) + 'px';
          card.style.height       = lerp(r.h, bizStage.offsetHeight, t3e).toFixed(1) + 'px';
          card.style.borderRadius = lerp(16, 0, t3e).toFixed(1) + 'px';
          card.style.opacity      = '1';
          card.style.zIndex       = '20';
        } else {
          card.style.opacity = '0';
          card.style.zIndex  = '5';
        }
      });

      if (bizHd) {
        bizHd.style.opacity = Math.max(0, 1 - t3e * 3).toFixed(2);
      }

      if (bizSlider && !bizSliderReady) {
        var slOp = clamp((t3e - 0.75) / 0.25, 0, 1);
        if (slOp > 0) {
          bizSlider.style.position   = 'fixed';
          bizSlider.style.inset      = '0';
          bizSlider.style.zIndex     = '500';
          bizSlider.style.transition = 'none';
          bizSlider.style.opacity    = slOp.toFixed(3);
        } else {
          bizSlider.style.cssText = '';
        }
      }
    }

    // biz-slider 관리: fixed 해제 / 위 스크롤 시 재표시 (PC 전용)
    if (bizSlider && !isMobileBiz) {
      var pinBtm = bizPin.getBoundingClientRect().bottom;

      if (bizSliderReady) {
        if (pinBtm > 0) {
          // 위로 스크롤 중: fixed 오버레이로 다시 표시
          var revOp = clamp((p - biz_p2_eff + 0.08) / 0.08, 0, 1);
          if (revOp > 0) {
            bizSlider.style.position   = 'fixed';
            bizSlider.style.inset      = '0';
            bizSlider.style.zIndex     = '500';
            bizSlider.style.transition = 'none';
            bizSlider.style.opacity    = revOp.toFixed(3);
          } else {
            // 완전히 Phase 3 밖으로 나옴 → 초기화
            bizSlider.style.cssText = '';
            bizSliderReady  = false;
            selectedBizCard = 2;
          }
        } else {
          // 아래로 이동 중 (자연 배치 상태 유지)
          bizSlider.style.cssText = '';
        }
      } else if (bizSlider.style.position === 'fixed') {
        // 아직 fixed 페이드인 중: biz-pin 지나가면 자연 배치로
        if (pinBtm <= 0) {
          bizSlider.style.cssText = '';
          bizSliderReady = true;
        }
      }
    }

    // p=1: 짧은 정지 후 재개 (점프 없음 — fixed 오버레이가 전환 처리)
    if (p >= 1 && bizPrevP < 1 && !bizLocked) {
      bizLocked = true;
      lenis.stop();
      setTimeout(function() { bizLocked = false; lenis.start(); }, 300);
    }
    bizPrevP = p;
    bizRafPend = false;
  }

  if (bizPin) {
    updateBiz();
    lenis.on('scroll', function() {
      if (!bizRafPend) { bizRafPend = true; requestAnimationFrame(updateBiz); }
    });

    // 모바일: biz-pin 진입 시 콘텐츠 즉시 표시 (CSS 트랜지션)
    if (isMobileBiz && 'IntersectionObserver' in window) {
      var bizEntryIO = new IntersectionObserver(function(entries) {
        if (!entries[0].isIntersecting) return;
        if (bizHd) setTimeout(function() { bizHd.classList.add('biz-entered'); }, 60);
        bizCards.forEach(function(card, i) {
          var delays = [160, 280, 60, 220];
          setTimeout(function() { card.classList.add('biz-entered'); }, delays[i] !== undefined ? delays[i] : 60);
        });
        bizEntryIO.disconnect();
      }, { threshold: 0 });
      bizEntryIO.observe(bizPin);
    } else if (isMobileBiz) {
      // 폴백: 즉시 표시
      if (bizHd) bizHd.classList.add('biz-entered');
      bizCards.forEach(function(card) { card.classList.add('biz-entered'); });
    }

    // 닫기 버튼
    var slideClose = document.getElementById('slideClose');
    if (slideClose) {
      slideClose.addEventListener('touchend', function(e) {
        e.preventDefault();
        if (bizSlider) { bizSlider.classList.remove('mobile-open'); bizSlider.style.cssText = ''; }
        lenis.start();
      });
      slideClose.addEventListener('click', function() {
        if (bizSlider) { bizSlider.classList.remove('mobile-open'); bizSlider.style.cssText = ''; }
        lenis.start();
      });
    }
  }

  /* ══════════════════════════════
     앵커 스크롤 (GNB 높이 보정)
  ══════════════════════════════ */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      var href = a.getAttribute('href');
      if (href === '#') return;
      var target = document.querySelector(href);
      if (!target) return;
      var off = gnb ? gnb.offsetHeight : 72;
      lenis.scrollTo(target, { offset: -off, duration: 1.4 });
    });
  });

  /* ══════════════════════════════
     뉴스 캐러셀 드래그 + 클릭 슬라이드
  ══════════════════════════════ */
  (function () {
    var grid = document.querySelector('.news-grid');
    if (!grid) return;
    var isDown = false, startX, scrollLeft, hasMoved = false;

    function endDrag() {
      isDown = false;
      grid.classList.remove('is-grabbing');
      grid.style.scrollSnapType = '';
    }

    grid.addEventListener('mousedown', function (e) {
      e.preventDefault();
      isDown = true; hasMoved = false;
      grid.style.scrollSnapType = 'none';
      grid.classList.add('is-grabbing');
      startX = e.pageX - grid.offsetLeft;
      scrollLeft = grid.scrollLeft;
    });
    grid.addEventListener('mouseleave', endDrag);
    grid.addEventListener('mouseup',    endDrag);
    grid.addEventListener('mousemove',  function (e) {
      if (!isDown) return;
      var x = e.pageX - grid.offsetLeft;
      var walk = x - startX;
      if (Math.abs(walk) > 4) hasMoved = true;
      if (!hasMoved) return;
      e.preventDefault();
      grid.scrollLeft = scrollLeft - walk;
    });

    /* 카드 클릭 → 해당 카드로 부드럽게 스크롤 */
    grid.querySelectorAll('.news-card').forEach(function (card) {
      card.addEventListener('click', function (e) {
        e.preventDefault();
        if (hasMoved) return;
        var gridRect  = grid.getBoundingClientRect();
        var cardRect  = card.getBoundingClientRect();
        var target    = grid.scrollLeft + cardRect.left - gridRect.left
                        - (gridRect.width - cardRect.width) / 2;
        grid.scrollTo({ left: target, behavior: 'smooth' });
      });
    });
  })();

})();;
