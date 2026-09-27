/* ── 햄버거 메뉴 ─────────────────────────────── */
    (function () {
      const burger = document.getElementById('navBurger');
      const mobile = document.getElementById('navMobile');
      function toggle(open) {
        burger.classList.toggle('open', open);
        mobile.classList.toggle('open', open);
        document.body.style.overflow = open ? 'hidden' : '';
        burger.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
      }
      burger.addEventListener('click', () => toggle(!mobile.classList.contains('open')));
      document.getElementById('navMobileClose').addEventListener('click', () => toggle(false));
      mobile.querySelectorAll('.nav__mobile-link').forEach(a => {
        a.addEventListener('click', () => toggle(false));
      });
    })();
