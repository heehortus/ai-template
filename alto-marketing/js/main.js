(function () {
  'use strict';

  /* ── Hero 패럴랙스 & 스크롤 인디케이터 ── */
  var heroScrollEl = document.querySelector('.hero__scroll');

  window.addEventListener('scroll', function () {
    var sy = window.scrollY;
    heroScrollEl.style.opacity = Math.max(0, 1 - sy / 120);
  }, { passive: true });

  /* ── Writing effect: split chars with stagger ── */
  (function () {
    var allWrits = document.querySelectorAll('.writ');
    var idx = 0;
    allWrits.forEach(function (writEl) {
      var textEl = writEl.querySelector('.writ__text');
      if (!textEl) return;
      var nodes = Array.from(textEl.childNodes);
      textEl.innerHTML = '';
      nodes.forEach(function (node) {
        if (node.nodeType === 3) {
          node.textContent.split('').forEach(function (ch) {
            var s = document.createElement('span');
            s.className = 'writ__char';
            s.textContent = ch === ' ' ? '\u00a0' : ch;
            s.style.transitionDelay = (idx * 0.04).toFixed(2) + 's';
            idx++;
            textEl.appendChild(s);
          });
        } else if (node.nodeType === 1) {
          var tag = node.tagName.toLowerCase();
          var wrap = document.createElement(tag);
          Array.from(node.attributes).forEach(function (a) { wrap.setAttribute(a.name, a.value); });
          node.textContent.split('').forEach(function (ch) {
            var s = document.createElement('span');
            s.className = 'writ__char';
            s.textContent = ch;
            s.style.transitionDelay = (idx * 0.04).toFixed(2) + 's';
            idx++;
            wrap.appendChild(s);
          });
          textEl.appendChild(wrap);
        }
      });
      idx += 6;
    });
  })();

  /* ── Fade-up IntersectionObserver ── */
  var creativenessVideoWrap = document.querySelector('.creativeness__video-wrap');
  var creativenessVideo = creativenessVideoWrap ? creativenessVideoWrap.querySelector('video') : null;
  var videoScheduled = false;
  var fuEls = document.querySelectorAll('.fu, .writ, .sl-l, .sl-r, .works__item');
  var fuObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add('vis');
        fuObs.unobserve(e.target);
        /* writ 진입 시 텍스트 완료 후 비디오 열기 */
        if (e.target.classList.contains('writ') && !videoScheduled && creativenessVideoWrap) {
          videoScheduled = true;
          if (creativenessVideo) creativenessVideo.play();
          setTimeout(function () {
            var textEl = document.querySelector('.creativeness__text');
            creativenessVideoWrap.classList.add('vid-open');
            if (textEl) textEl.classList.add('text-invert');
          }, 1600);
        }
      }
    });
  }, { threshold: 0.12 });
  fuEls.forEach(function (el) { fuObs.observe(el); });


  /* ── Works: IO 자동 slide-in + cream→black ── */
  (function () {
    var pin  = document.querySelector('.works__pin');
    var hero = document.querySelector('.works__hero');
    if (!pin || !hero) return;

    var visObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          hero.classList.add('works--vis');
          visObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    visObs.observe(pin);
  })();

  /* ── 카운트업 ── */
  var countEls = document.querySelectorAll('.countup');
  var countObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      var el     = e.target;
      var target = parseInt(el.getAttribute('data-target'), 10);
      var dur    = 2000;
      var t0     = performance.now();
      function tick(now) {
        var p = Math.min((now - t0) / dur, 1);
        var ease = 1 - Math.pow(1 - p, 4);
        el.textContent = Math.floor(ease * target);
        if (p < 1) requestAnimationFrame(tick);
        else el.textContent = target;
      }
      requestAnimationFrame(tick);
      countObs.unobserve(el);
    });
  }, { threshold: 0.5 });
  countEls.forEach(function (el) { countObs.observe(el); });

})();
