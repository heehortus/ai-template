/* ═══════════════════════════════════════
   NAVIS 수산 — main.js
   ═══════════════════════════════════════ */
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
  document.querySelectorAll('.mobile-link').forEach(function (l) { l.addEventListener('click', closeDrawer); });

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
  var EXPAND_DIST  = 360;  // 이 px 만큼 스크롤하면 완전히 확장 (hero-pin height의 extra 부분)
  var INSET_TOP    = 96;   // 초기 top inset: GNB(72) + 간격(24)
  var INSET_SIDE   = 24;   // 초기 side inset
  var INSET_BOT    = 24;   // 초기 bottom inset
  var BR_INIT      = 20;   // 초기 border-radius
  var heroBg       = document.getElementById('heroBg');
  var heroRafPending = false;
  var heroPrev     = 0;    // 직전 프레임의 p 값
  var heroLocked   = false; // 스크롤 일시 정지 중 여부

  function updateHero() {
    var p = clamp(window.scrollY / EXPAND_DIST, 0, 1);

    // hero가 완전히 펼쳐지는 순간(p < 1 → p ≥ 1) 스크롤을 잠시 정지
    if (p >= 1 && heroPrev < 1 && !heroLocked) {
      heroLocked = true;
      lenis.stop();
      setTimeout(function () {
        heroLocked = false;
        lenis.start();
      }, 900);
    }
    heroPrev = p;

    if (heroEl) {
      var it  = (INSET_TOP  * (1 - p)).toFixed(1);
      var is_ = (INSET_SIDE * (1 - p)).toFixed(1);
      var ib  = (INSET_BOT  * (1 - p)).toFixed(1);
      var br  = (BR_INIT    * (1 - p)).toFixed(1);
      heroEl.style.clipPath = 'inset(' + it + 'px ' + is_ + 'px ' + ib + 'px round ' + br + 'px)';

      // 스크롤 인디케이터: 확장 중에 페이드 아웃
      var ind = heroEl.querySelector('.hero-scroll-ind');
      if (ind) ind.style.opacity = (1 - p * 3 > 0 ? 1 - p * 3 : 0).toFixed(2);
    }

    // GNB 그림자: 히어로 벗어나면 표시
    if (gnb) {
      var heroBottom = heroEl ? heroEl.getBoundingClientRect().bottom : 0;
      if (heroBottom > 0) {
        gnb.classList.remove('is-shadow');
      } else {
        gnb.classList.add('is-shadow');
      }
    }

    // 패럴랙스
    if (heroBg && window.scrollY < window.innerHeight * 1.5) {
      heroBg.style.transform = 'translateY(' + (window.scrollY * 0.36).toFixed(1) + 'px)';
    }
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
  var SLIDE_DUR   = 2000;

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
    lenis.start(); // 혹시 멈춰 있는 경우 강제 재개
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
    if (slideIdx < slideTotal - 1) {
      slideTimer = setInterval(function () { goSlide(slideIdx + 1); }, SLIDE_DUR);
    } else {
      slideTimer = setTimeout(scrollToNetwork, SLIDE_DUR);
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

  // 초기 자동 슬라이드 시작
  restartTabBar(tabs[0]);
  slideTimer = setInterval(function () { goSlide(slideIdx + 1); }, SLIDE_DUR);

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

  function updateBiz() {
    if (!bizPin || !bizStage) return;
    var pinExtra = bizPin.offsetHeight - window.innerHeight;
    var p = clamp(-bizPin.getBoundingClientRect().top / pinExtra, 0, 1);

    var inP3 = p >= BIZ_P2 - 0.01;

    // Phase 3 종료 시 절대 위치 + slider 초기화
    if (!inP3 && bizRects) {
      bizRects = null;
      if (bizStageCards) { bizStageCards.style.height = ''; }
      bizCards.forEach(function(card) {
        card.style.position = card.style.left = card.style.top =
        card.style.width = card.style.height = card.style.borderRadius =
        card.style.zIndex = '';
      });
      // bizSliderReady=true면 위 스크롤 중이므로 slider는 건드리지 않음
      if (!bizSliderReady) {
        if (bizSlider) { bizSlider.style.cssText = ''; }
        selectedBizCard = 2;
      }
    }

    if (!inP3) {
      // Phase 1: 헤더 클립패스 (0 → BIZ_P0)
      if (bizHd) {
        var t0  = clamp(p / BIZ_P0, 0, 1);
        var t0e = 1 - Math.pow(1 - t0, 2); // easeOutQuad
        bizHd.style.clipPath = 'inset(' + (100 - 100 * t0e).toFixed(1) + '% 0 0 0)';
        bizHd.style.opacity  = '';
      }

      // Phase 2: 카드 상승 (BIZ_P0+stagger → BIZ_P1)
      bizCards.forEach(function(card, i) {
        var startP = BIZ_P0 + BIZ_STAGGER[i];
        var lp     = clamp((p - startP) / (BIZ_P1 - startP), 0, 1);
        var ease   = 1 - Math.pow(1 - lp, 3); // easeOutCubic
        card.style.transform = 'translateY(' + ((1 - ease) * 110).toFixed(2) + 'vh)';
        card.style.opacity   = lp > 0 ? '1' : '0';
      });
    } else {
      // Phase 3: 선택된 카드 확장
      if (!bizRects) {
        bizRects = [];
        // 컨테이너 높이 freeze → flex layout shift 방지
        if (bizStageCards) { bizStageCards.style.height = bizStageCards.offsetHeight + 'px'; }
        var sr = bizStage.getBoundingClientRect();
        bizCards.forEach(function(card) {
          var r = card.getBoundingClientRect();
          bizRects.push({ l: r.left - sr.left, t: r.top - sr.top, w: r.width, h: r.height });
        });
        // 슬라이더 slide를 확장 카드와 미리 sync (slider 등장 전에 처리 → 렉 감소)
        goSlide(selectedBizCard);
      }

      var t3  = clamp((p - BIZ_P2) / (1 - BIZ_P2), 0, 1);
      var t3e = 1 - Math.pow(1 - t3, 3); // easeOutCubic

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
          card.style.left    = r.l + 'px';
          card.style.top     = r.t + 'px';
          card.style.width   = r.w + 'px';
          card.style.height  = r.h + 'px';
          card.style.opacity = Math.max(0, 1 - t3e * 2.5).toFixed(2);
          card.style.zIndex  = '5';
        }
      });

      if (bizHd) {
        bizHd.style.opacity = Math.max(0, 1 - t3e * 3).toFixed(2);
      }

      // biz-slider: 카드 확장 후반부(t3e 0.75→1.0)에 고정 오버레이로 페이드인
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

    // biz-slider 관리: fixed 해제 / 위 스크롤 시 재표시
    if (bizSlider) {
      var pinBtm = bizPin.getBoundingClientRect().bottom;

      if (bizSliderReady) {
        if (pinBtm > 0) {
          // 위로 스크롤 중: fixed 오버레이로 다시 표시
          var revOp = clamp((p - BIZ_P2 + 0.08) / 0.08, 0, 1);
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
  }

  /* ══════════════════════════════
     앵커 스크롤 (GNB 높이 보정)
  ══════════════════════════════ */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var href = a.getAttribute('href');
      if (href === '#') return;
      var target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
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
