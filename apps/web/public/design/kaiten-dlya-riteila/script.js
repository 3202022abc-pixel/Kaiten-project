/* Кайтен для ритейла — интерактив статичного лендинга (vanilla JS).
   FAQ работает на нативном <details>, hero-анимация — на CSS.
   Здесь: аккордеон-секции, слайдер отзывов, табы, карусели фич и шаблонов, бургер-меню. */
(function () {
  'use strict';
  const $ = (sel, el) => (el || document).querySelector(sel);
  const $$ = (sel, el) => Array.prototype.slice.call((el || document).querySelectorAll(sel));

  /* ---- 1. Аккордеон-секции (.afs): открытие пункта + синхронная медиа-панель ---- */
  $$('.afs').forEach((sec) => {
    const items = $$('.acc .acc-item', sec);
    const panels = $$('.acc-media .acc-panel', sec);
    const setOpen = (idx) => {
      items.forEach((it, i) => {
        const on = i === idx;
        it.classList.toggle('open', on);
        const head = $('.acc-head', it);
        if (head) head.setAttribute('aria-expanded', on ? 'true' : 'false');
      });
      panels.forEach((p, i) => p.classList.toggle('on', i === idx));
    };
    items.forEach((it, i) => {
      const head = $('.acc-head', it);
      if (head) head.addEventListener('click', () => setOpen(it.classList.contains('open') ? -1 : i));
    });
  });

  /* ---- 2. Слайдер отзывов (.revx-mock): transform-лента + стрелки ---- */
  $$('.revx-mock').forEach((sec) => {
    const wrap = $('.revx__wrap', sec);
    const track = $('.revx__track', sec);
    if (!wrap || !track) return;
    // стрелки в исходнике рендерятся условно (maxI>0) и в статике отсутствуют — создаём
    let nav = $('.revx__nav', sec);
    if (!nav) {
      const ic = (d) => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="' + d + '"/></svg>';
      nav = document.createElement('div');
      nav.className = 'revx__nav';
      nav.setAttribute('role', 'group');
      nav.setAttribute('aria-label', 'Листать отзывы');
      nav.innerHTML =
        '<button type="button" class="revx__navbtn" aria-label="Предыдущий отзыв" disabled>' + ic('m15 18-6-6 6-6') + '</button>' +
        '<button type="button" class="revx__navbtn" aria-label="Следующий отзыв">' + ic('m9 18 6-6-6-6') + '</button>';
      const inr = $('.revx__in', sec) || sec;
      inr.appendChild(nav);
    }
    const btns = $$('.revx__navbtn', nav);
    const prev = btns[0], next = btns[1];
    const GAP = 32;
    let idx = 0;

    const step = () => {
      const cards = track.children;
      if (cards.length < 1) return 0;
      if (cards.length > 1) return cards[1].getBoundingClientRect().left - cards[0].getBoundingClientRect().left;
      return cards[0].getBoundingClientRect().width + GAP;
    };
    const apply = () => {
      const s = step();
      if (!s) return;
      const cs = getComputedStyle(wrap);
      const visible = wrap.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      const maxT = Math.max(0, track.scrollWidth - visible);
      const maxI = Math.ceil(maxT / s);
      idx = Math.min(idx, maxI);
      track.style.transform = 'translateX(-' + Math.min(idx * s, maxT) + 'px)';
      if (nav) nav.style.display = maxI > 0 ? '' : 'none';
      if (prev) prev.disabled = idx <= 0;
      if (next) next.disabled = idx >= maxI;
    };
    if (prev) prev.addEventListener('click', () => { if (idx > 0) { idx--; apply(); } });
    if (next) next.addEventListener('click', () => { idx++; apply(); });
    window.addEventListener('resize', apply);
    apply();
  });

  /* ---- 3. Табы (.tabsg-mock): пилюли + стрелки ---- */
  $$('.tabsg-mock').forEach((sec) => {
    const tabs = $$('.stabs__tab', sec);
    const panels = $$('.stp', sec);
    const counter = $('.stabs__counter b', sec);
    const prev = $('.stabs__prev', sec);
    const next = $('.stabs__next', sec);
    const n = panels.length;
    let active = 0;
    const setActive = (k) => {
      active = ((k % n) + n) % n;
      tabs.forEach((t, i) => t.classList.toggle('on', i === active));
      panels.forEach((p, i) => p.classList.toggle('on', i === active));
      if (counter) counter.textContent = String(active + 1);
    };
    tabs.forEach((t, i) => t.addEventListener('click', () => setActive(i)));
    if (prev) prev.addEventListener('click', () => setActive(active - 1));
    if (next) next.addEventListener('click', () => setActive(active + 1));
  });

  /* ---- 4. Карусели на нативном скролле (фичи .fg-mock и шаблоны .tplg-mock) ---- */
  function nativeCarousel(sec, trackSel, cardSel, navSel, countSel) {
    const track = $(trackSel, sec);
    const nav = $(navSel, sec);
    if (!track || !nav) return;
    const btns = $$('button', nav);
    const prev = btns[0], next = btns[1];
    const countB = $(countSel + ' b', sec);
    const total = $$(cardSel, track).length;
    const stepOf = () => {
      const c = $(cardSel, track);
      const gap = parseFloat(getComputedStyle(track).columnGap) || 24;
      return c ? c.getBoundingClientRect().width + gap : 320;
    };
    const update = () => {
      const s = stepOf();
      const maxScroll = track.scrollWidth - track.clientWidth;
      const i = Math.round(track.scrollLeft / s);
      if (prev) prev.disabled = track.scrollLeft <= 6;
      if (next) next.disabled = track.scrollLeft >= maxScroll - 6;
      if (nav) nav.style.display = maxScroll > 6 ? '' : 'none';
      if (countB) countB.textContent = String(Math.min(i + 1, total));
    };
    const go = (dir) => track.scrollBy({ left: dir * stepOf(), behavior: 'smooth' });
    if (prev) prev.addEventListener('click', () => go(-1));
    if (next) next.addEventListener('click', () => go(1));
    track.addEventListener('scroll', () => window.requestAnimationFrame(update));
    window.addEventListener('resize', update);
    update();
  }
  $$('.fg-mock').forEach((sec) => nativeCarousel(sec, '.fg-grid', '.fg-card', '.fg-nav', '.fg-count'));
  $$('.tplg-mock').forEach((sec) => nativeCarousel(sec, '.tpl', '.tplc', '.tpl-nav', '.tpl-count'));

  /* ---- 5. Бургер-меню шапки ---- */
  $$('.khdr').forEach((hdr) => {
    const burger = $('.navbar__burger', hdr);
    const menu = $('.mobile-menu', hdr);
    if (burger && menu) {
      burger.addEventListener('click', () => {
        const open = menu.classList.toggle('open');
        burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
    }
  });
})();


/* ---- 6. ScaleToFit: масштабирование фиксированных макетов (борд 1360, CTA 1216)
   в ширину контейнера — в статике нет React-скейлера, SSR замораживает scale(1) ---- */
(function () {
  function fitAll() {
    document.querySelectorAll('div[style*="transform-origin"]').forEach(function (inner) {
      var w = parseFloat(inner.style.width);
      if (!w) return;
      var outer = inner.parentElement;
      var host = outer && outer.parentElement;
      if (!host) return;
      var avail = host.clientWidth;
      if (!avail) return;
      var s = Math.min(1, avail / w);
      inner.style.transform = 'scale(' + s + ')';
      outer.style.height = inner.offsetHeight * s + 'px';
    });
  }
  window.addEventListener('resize', fitAll);
  window.addEventListener('load', fitAll);
  fitAll();
})();

/* ---- 7. FAQ: первый пункт раскрыт по умолчанию + эксклюзив (как в исходнике) ---- */
(function () {
  var items = Array.prototype.slice.call(document.querySelectorAll('.faq-mock details.faq-item'));
  if (!items.length) return;
  if (!items.some(function (d) { return d.open; })) items[0].open = true;
  items.forEach(function (d) {
    d.addEventListener('toggle', function () {
      if (d.open) items.forEach(function (o) { if (o !== d && o.open) o.open = false; });
    });
  });
})();
