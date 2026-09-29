/* Лендинг «Кайтен вместо Excel»: интерактив без React и зависимостей. */

/* Масштаб моков фиксированной ширины под ширину колонки */
(function () {
  function fit() {
    var outers = document.querySelectorAll('[data-mockfit="outer"]');
    for (var i = 0; i < outers.length; i++) {
      var o = outers[i],
        n = o.querySelector('[data-mockfit="inner"]');
      if (!n) continue;
      n.style.transform = "none";
      o.style.height = "";
      var nw = n.offsetWidth,
        nh = n.offsetHeight,
        ow = o.clientWidth;
      if (!nw || !ow) continue;
      var s = Math.min(1, ow / nw);
      n.style.transformOrigin = "top left";
      n.style.transform = "scale(" + s + ")";
      o.style.height = Math.round(nh * s) + "px";
    }
    // Макеты с заданной шириной в style (мок «Правило»): ужимаем под родителя
    var fixed = document.querySelectorAll('[style*="transform-origin"]');
    for (var j = 0; j < fixed.length; j++) {
      var inner = fixed[j],
        outer = inner.parentElement,
        w = parseFloat(inner.style.width);
      if (inner.style.flexShrink !== "0" || !/px$/.test(inner.style.width)) continue;
      if (!w || !outer || !outer.clientWidth) continue;
      var k = Math.min(1, outer.clientWidth / w);
      inner.style.transform = "scale(" + k + ")";
      outer.style.height = Math.round(inner.offsetHeight * k) + "px";
    }
  }
  fit();
  addEventListener("load", fit);
  addEventListener("resize", fit);
})();

/* Слайдер представлений задач: кадры сменяются, когда блок в зоне видимости */
(function () {
  var list = document.querySelectorAll(".tvs");
  if (!list.length) return;
  if (!("IntersectionObserver" in window)) {
    for (var i = 0; i < list.length; i++) list[i].classList.add("is-live");
    return;
  }
  var io = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (e) {
        e.target.classList.toggle("is-live", e.isIntersecting);
      });
    },
    { threshold: 0.35 },
  );
  for (var j = 0; j < list.length; j++) io.observe(list[j]);
})();

/* Карусель модулей: стрелки и счетчик на мобилке и планшете (с 1280px — сетка) */
(function () {
  var tracks = document.querySelectorAll(".mc-track");
  var arrow = function (d) {
    return (
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="' +
      d +
      '"/></svg>'
    );
  };
  for (var t = 0; t < tracks.length; t++)
    (function (track) {
      var total = track.children.length;
      var nav = document.createElement("div");
      nav.className = "mc-nav";
      nav.setAttribute("role", "group");
      nav.setAttribute("aria-label", "Листать модули");
      nav.innerHTML =
        '<button type="button" class="mc-nav__btn" data-dir="-1" aria-label="Предыдущий модуль">' +
        arrow("m15 18-6-6 6-6") +
        "</button>" +
        '<span class="mc-nav__count"><b>1</b> / ' +
        total +
        "</span>" +
        '<button type="button" class="mc-nav__btn" data-dir="1" aria-label="Следующий модуль">' +
        arrow("m9 18 6-6-6-6") +
        "</button>";
      track.parentNode.appendChild(nav);
      var prev = nav.querySelector('[data-dir="-1"]'),
        next = nav.querySelector('[data-dir="1"]'),
        num = nav.querySelector("b");

      function step() {
        var first = track.firstElementChild;
        return first
          ? first.getBoundingClientRect().width + (parseFloat(getComputedStyle(track).columnGap) || 16)
          : track.clientWidth;
      }
      function sync() {
        var max = track.scrollWidth - track.clientWidth;
        nav.hidden = max <= 1;
        prev.disabled = track.scrollLeft <= 1;
        next.disabled = track.scrollLeft >= max - 1;
        num.textContent = Math.min(Math.round(track.scrollLeft / step()) + 1, total);
      }
      nav.addEventListener("click", function (e) {
        var btn = e.target.closest("[data-dir]");
        if (btn) track.scrollBy({ left: +btn.getAttribute("data-dir") * step(), behavior: "smooth" });
      });
      track.addEventListener("scroll", sync, { passive: true });
      addEventListener("resize", sync);
      sync();
    })(tracks[t]);
})();

/* Отзывы: листалка появляется, когда карточки не помещаются в ширину */
(function () {
  var sections = document.querySelectorAll(".revx-mock");
  var arrow = function (d) {
    return (
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="' +
      d +
      '"/></svg>'
    );
  };
  for (var n = 0; n < sections.length; n++)
    (function (sec) {
      var wrap = sec.querySelector(".revx__wrap"),
        track = sec.querySelector(".revx__track");
      if (!wrap || !track) return;
      var total = track.children.length,
        idx = 0;
      var nav = document.createElement("div");
      nav.className = "revx__nav";
      nav.setAttribute("role", "group");
      nav.setAttribute("aria-label", "Листать отзывы");
      nav.innerHTML =
        '<button type="button" class="revx__navbtn" data-dir="-1" aria-label="Предыдущий отзыв">' +
        arrow("m15 18-6-6 6-6") +
        "</button>" +
        '<span class="revx__count"><b>1</b> / ' +
        total +
        "</span>" +
        '<button type="button" class="revx__navbtn" data-dir="1" aria-label="Следующий отзыв">' +
        arrow("m9 18 6-6-6-6") +
        "</button>";
      wrap.parentNode.appendChild(nav);
      var prev = nav.querySelector('[data-dir="-1"]'),
        next = nav.querySelector('[data-dir="1"]'),
        num = nav.querySelector("b");

      function step() {
        var k = track.children;
        if (!k[0]) return 0;
        if (k[1]) return k[1].getBoundingClientRect().left - k[0].getBoundingClientRect().left;
        return k[0].getBoundingClientRect().width + (parseFloat(getComputedStyle(track).columnGap) || 16);
      }
      function maxIdx() {
        var s = step();
        if (!s) return 0;
        var cs = getComputedStyle(track);
        var inner = wrap.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
        var gap = parseFloat(cs.columnGap) || 16;
        return Math.max(0, total - Math.max(1, Math.floor((inner + gap) / s)));
      }
      function apply() {
        // Сначала снимаем «одиночный» режим: он центрирует ленту и сбивает замер шага.
        track.classList.remove("revx__track--single");
        track.style.transform = "translateX(0px)";
        var max = maxIdx();
        idx = Math.min(idx, max);
        sec.classList.toggle("revx--nopager", max === 0);
        track.classList.toggle("revx__track--single", max === 0 || total === 1);
        nav.style.display = max ? "" : "none";
        var tail = Math.max(0, track.scrollWidth + parseFloat(getComputedStyle(track).paddingRight) - wrap.clientWidth);
        track.style.transform = "translateX(-" + Math.min(idx * step(), tail) + "px)";
        num.textContent = Math.min(idx + 1, total);
        prev.disabled = idx <= 0;
        next.disabled = idx >= max;
      }
      nav.addEventListener("click", function (e) {
        var btn = e.target.closest("[data-dir]");
        if (!btn) return;
        idx = Math.max(0, idx + +btn.getAttribute("data-dir"));
        apply();
      });
      addEventListener("resize", apply);
      apply();
    })(sections[n]);
})();
