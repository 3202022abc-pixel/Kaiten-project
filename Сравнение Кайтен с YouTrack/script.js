  // Мобильное меню
  (function(){
    var burger = document.getElementById('burger');
    var menu = document.getElementById('mobileMenu');
    if (burger && menu){
      burger.addEventListener('click', function(){
        var open = menu.classList.toggle('open');
        burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
      menu.querySelectorAll('a').forEach(function(a){
        a.addEventListener('click', function(){
          menu.classList.remove('open');
          burger.setAttribute('aria-expanded','false');
        });
      });
    }
  })();

  // Карусель фич (Features)
  (function(){
    var track = document.getElementById('scrumGrid');
    var prev = document.getElementById('featPrev');
    var next = document.getElementById('featNext');
    var count = document.getElementById('featCount');
    var nav = document.getElementById('featNav');
    if (!track || !prev || !next) return;
    var cards = track.querySelectorAll('.scard-f');
    function step(){ var c = cards[0]; return c ? c.getBoundingClientRect().width + (parseFloat(getComputedStyle(track).columnGap) || 24) : 320; }
    function update(){
      var maxScroll = track.scrollWidth - track.clientWidth;
      if (nav) nav.style.display = maxScroll > 6 ? 'flex' : 'none';
      var idx = Math.round(track.scrollLeft / step());
      if (count) count.innerHTML = '<b>' + (idx + 1) + '</b> / ' + cards.length;
      prev.disabled = track.scrollLeft <= 6;
      next.disabled = track.scrollLeft >= maxScroll - 6;
    }
    prev.addEventListener('click', function(){ track.scrollBy({ left: -step(), behavior: 'smooth' }); });
    next.addEventListener('click', function(){ track.scrollBy({ left: step(), behavior: 'smooth' }); });
    track.addEventListener('scroll', function(){ window.requestAnimationFrame(update); });
    window.addEventListener('resize', update);
    window.addEventListener('load', update);
    if (window.ResizeObserver) { new ResizeObserver(update).observe(track); }
    update();
  })();

  // Карусель кейсов (Reviews)
  (function(){
    var track = document.getElementById('otzivTrack');
    var prev = document.getElementById('otzivPrev');
    var next = document.getElementById('otzivNext');
    var count = document.getElementById('otzivCount');
    var nav = document.querySelector('.otziv-nav');
    if (!track || !prev || !next) return;
    var cards = track.querySelectorAll('.otziv');
    function step(){
      var c = cards[0];
      return c ? c.getBoundingClientRect().width + (parseFloat(getComputedStyle(track).columnGap) || 24) : 320;
    }
    function update(){
      var maxScroll = track.scrollWidth - track.clientWidth;
      var hasNav = maxScroll > 6;
      if (nav) nav.style.display = hasNav ? '' : 'none';
      // Класс на секции нужен CSS: со стрелками нижний отступ равен отступу над стрелками,
      // без стрелок — равен верхнему отступу секции.
      var sec = track.closest('section');
      if (sec) sec.classList.toggle('has-nav', hasNav);
      var idx = Math.round(track.scrollLeft / step());
      if (count) count.innerHTML = '<b>' + (idx + 1) + '</b> / ' + cards.length;
      prev.disabled = track.scrollLeft <= 6;
      next.disabled = track.scrollLeft >= maxScroll - 6;
    }
    prev.addEventListener('click', function(){ track.scrollBy({ left: -step(), behavior: 'smooth' }); });
    next.addEventListener('click', function(){ track.scrollBy({ left: step(), behavior: 'smooth' }); });
    track.addEventListener('scroll', function(){ window.requestAnimationFrame(update); });
    window.addEventListener('resize', update);
    window.addEventListener('load', update);
    if (window.ResizeObserver) { new ResizeObserver(update).observe(track); }
    update();
  })();

  // FAQ-аккордеон
  document.querySelectorAll('.faq-q').forEach(function(q){
    q.addEventListener('click', function(){
      var item = q.parentElement;
      var ans = q.nextElementSibling;
      var willOpen = !item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(function(openItem){
        openItem.classList.remove('open');
        openItem.querySelector('.faq-a').style.maxHeight = '0';
      });
      if (willOpen){
        item.classList.add('open');
        ans.style.maxHeight = ans.scrollHeight + 'px';
      }
    });
  });
  (function(){document.querySelectorAll(".acc .acc-head").forEach(function(h){h.addEventListener("click",function(){var it=h.parentElement,op=it.classList.contains("open");it.parentElement.querySelectorAll(".acc-item.open").forEach(function(o){o.classList.remove("open")});if(!op)it.classList.add("open")})})})();
  (function(){document.querySelectorAll('.acc-wrap').forEach(function(w){var a=w.querySelector('.acc');if(!a)return;var items=a.querySelectorAll('.acc-item');var panels=w.querySelectorAll('.acc-media .acc-panel');if(!panels.length)return;a.querySelectorAll('.acc-head').forEach(function(h){h.addEventListener('click',function(){var idx=0;items.forEach(function(it,i){if(it.classList.contains('open'))idx=i});panels.forEach(function(pn,i){pn.classList.toggle('on',i===idx)})})})})})();

  // Таблица сравнения — раскрытие/сворачивание разделов
  (function(){
    var table = document.getElementById('cmpTable');
    if (!table) return;
    table.querySelectorAll('.cmp__sec').forEach(function(sec){
      sec.addEventListener('click', function(){
        var open = sec.getAttribute('aria-expanded') === 'true';
        sec.setAttribute('aria-expanded', open ? 'false' : 'true');
        var g = sec.getAttribute('data-sec');
        table.querySelectorAll('.cmp__cell[data-g="' + g + '"]').forEach(function(cell){
          cell.classList.toggle('cmp__cell--hidden', open);
        });
      });
    });
  })();

  // Таблица сравнения — стартовое состояние: на десктопе и планшете раскрыты все
  // разделы, на мобиле только первый (иначе таблица уезжает на несколько экранов).
  // Пересчитывается при смене брейкпоинта, ручные клики внутри брейкпоинта не трогаем.
  (function(){
    var table = document.getElementById('cmpTable');
    if (!table) return;
    var mq = window.matchMedia('(min-width:768px)');
    function apply(){
      var wide = mq.matches;
      table.querySelectorAll('.cmp__sec').forEach(function(sec, i){
        var open = wide || i === 0;
        sec.setAttribute('aria-expanded', open ? 'true' : 'false');
        var g = sec.getAttribute('data-sec');
        table.querySelectorAll('.cmp__cell[data-g="' + g + '"]').forEach(function(cell){
          cell.classList.toggle('cmp__cell--hidden', !open);
        });
      });
    }
    apply();
    if (mq.addEventListener) mq.addEventListener('change', apply);
    else if (mq.addListener) mq.addListener(apply);
  })();

  // ScaleToFit — масштабирует доску фикс. ширины под контейнер (HeroScreenInterface)
  (function(){
    var nodes = document.querySelectorAll('.stf');
    if (!nodes.length) return;
    function fit(outer){
      var inner = outer.querySelector('.stf-inner');
      if (!inner) return;
      var dw = parseFloat(outer.getAttribute('data-dw')) || 1360;
      outer.__stfW = outer.clientWidth;
      var s = Math.min(1, outer.clientWidth / dw);
      inner.style.transform = 'scale(' + s + ')';
      outer.style.height = (inner.offsetHeight * s) + 'px';
    }
    function fitAll(){ nodes.forEach(fit); }
    fitAll();
    window.addEventListener('resize', fitAll);
    window.addEventListener('load', fitAll);
    if (window.ResizeObserver){
      nodes.forEach(function(n){ new ResizeObserver(function(){ fit(n); }).observe(n); });
    }
    // Страховка: если resize/RO не сработали (эмуляция вьюпорта, iframe) — следим за фактической шириной
    setInterval(function(){
      nodes.forEach(function(n){ if (n.clientWidth && n.clientWidth !== n.__stfW) fit(n); });
    }, 250);
  })();

  // На мобиле заголовок занимает всю ширину шапки — фоновые колонки начинаются под ним
  (function(){
    var table = document.getElementById('cmpTable');
    if (!table) return;
    var head = table.querySelector('.cmp__hcell--label');
    function upd(){
      table.style.setProperty('--cmp-bg-top', (window.innerWidth < 768 ? head.offsetHeight : 0) + 'px');
    }
    upd();
    window.addEventListener('resize', upd);
    setInterval(upd, 400);
  })();

/* Галерея по вкладкам (секция #teams) — TabsGallery */
(function(){
  var root = document.querySelector('#teams .stabs');
  if (!root) return;
  var tabs = root.querySelectorAll('.stabs__tab');
  var panels = root.querySelectorAll('.stp');
  var counter = root.querySelector('.stabs__counter');
  var n = panels.length, active = 0;
  function show(k){
    active = ((k % n) + n) % n;
    tabs.forEach(function(t, i){
      var on = i === active;
      t.classList.toggle('on', on);
      t.setAttribute('aria-selected', on ? 'true' : 'false');
    });
    panels.forEach(function(p, i){
      var on = i === active;
      p.classList.toggle('on', on);
      if (on) p.removeAttribute('hidden'); else p.setAttribute('hidden', '');
    });
    if (counter) counter.innerHTML = '<b>' + (active + 1) + '</b> / ' + n;
  }
  tabs.forEach(function(t, i){ t.addEventListener('click', function(){ show(i); }); });
  var prev = root.querySelector('.stabs__prev'), next = root.querySelector('.stabs__next');
  if (prev) prev.addEventListener('click', function(){ show(active - 1); });
  if (next) next.addEventListener('click', function(){ show(active + 1); });
  show(0);
})();

/* Аккордеон фич — раскрытие по наведению (только мышь; тач работает по клику) */
(function(){
  if (!window.matchMedia || !window.matchMedia('(hover:hover) and (pointer:fine)').matches) return;
  document.querySelectorAll('.acc-wrap').forEach(function(w){
    var acc = w.querySelector('.acc');
    if (!acc) return;
    var items = acc.querySelectorAll('.acc-item');
    var panels = w.querySelectorAll('.acc-media .acc-panel');
    acc.querySelectorAll('.acc-head').forEach(function(head, i){
      head.addEventListener('mouseenter', function(){
        var item = head.parentElement;
        if (item.classList.contains('open')) return;
        items.forEach(function(it){ it.classList.remove('open'); });
        item.classList.add('open');
        panels.forEach(function(pn, k){ pn.classList.toggle('on', k === i); });
      });
    });
  });
})();

/* Табы: одинаковая высота панелей, пока листаем стрелками — контент не прыгает */
(function(){
  var root = document.querySelector('#teams .stabs');
  if (!root) return;
  var panels = root.querySelectorAll('.stp');
  if (!panels.length) return;

  function texts(){
    return [].map.call(panels, function(p){ return p.querySelector('.stabs__text'); });
  }

  function equalize(){
    panels.forEach(function(p){ p.style.minHeight = ''; });
    texts().forEach(function(t){ if (t) t.style.minHeight = ''; });
    if (window.innerWidth >= 1024) return;   // на десктопе панель одна и переключается вкладками

    // сначала выравниваем блок текста — иначе картинка под ним стартует
    // на разной высоте и «плавает» при переключении
    var maxText = 0;
    panels.forEach(function(p){
      var hidden = p.hasAttribute('hidden');
      var on = p.classList.contains('on');
      if (hidden) p.removeAttribute('hidden');
      if (!on) p.classList.add('on');
      var t = p.querySelector('.stabs__text');
      if (t) maxText = Math.max(maxText, t.offsetHeight);
      if (!on) p.classList.remove('on');
      if (hidden) p.setAttribute('hidden', '');
    });
    if (maxText) texts().forEach(function(t){ if (t) t.style.minHeight = maxText + 'px'; });

    var max = 0;
    panels.forEach(function(p){
      var hidden = p.hasAttribute('hidden');
      var on = p.classList.contains('on');
      if (hidden) p.removeAttribute('hidden');
      if (!on) p.classList.add('on');
      max = Math.max(max, p.offsetHeight);
      if (!on) p.classList.remove('on');
      if (hidden) p.setAttribute('hidden', '');
    });
    if (max) panels.forEach(function(p){ p.style.minHeight = max + 'px'; });
  }

  var t;
  function schedule(){ clearTimeout(t); t = setTimeout(equalize, 120); }
  window.addEventListener('load', schedule);
  window.addEventListener('resize', schedule);
  root.querySelectorAll('img').forEach(function(img){ img.addEventListener('load', schedule); });
  equalize();
})();
