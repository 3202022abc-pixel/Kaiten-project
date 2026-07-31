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
      count.innerHTML = '<b>' + (idx + 1) + '</b> / ' + cards.length;
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
      count.innerHTML = '<b>' + (idx + 1) + '</b> / ' + cards.length;
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

  // Карусель «одна платформа» (FeatureGrid)
  (function(){
    var track = document.getElementById('platGrid');
    var prev = document.getElementById('platPrev');
    var next = document.getElementById('platNext');
    var count = document.getElementById('platCount');
    var nav = document.getElementById('platNav');
    if (!track || !prev || !next) return;
    var cards = track.querySelectorAll('.fg-card');
    function step(){ var c = cards[0]; return c ? c.getBoundingClientRect().width + (parseFloat(getComputedStyle(track).columnGap) || 24) : 320; }
    function update(){
      var maxScroll = track.scrollWidth - track.clientWidth;
      if (nav) nav.style.display = maxScroll > 6 ? 'flex' : 'none';
      var idx = Math.round(track.scrollLeft / step());
      count.innerHTML = '<b>' + (idx + 1) + '</b> / ' + cards.length;
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
  // Слайдер-аккордеоны: раскрытие по наведению (desktop), клик — фолбэк для touch
  (function(){
    var canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    document.querySelectorAll('.acc').forEach(function(a){
      var wrap = a.closest('.acc-wrap');
      var panels = wrap ? wrap.querySelectorAll('.acc-media .acc-panel') : [];
      var items = Array.prototype.slice.call(a.querySelectorAll('.acc-item'));
      function openItem(it, toggle){
        var wasOpen = it.classList.contains('open');
        items.forEach(function(o){ o.classList.remove('open'); });
        if (!(toggle && wasOpen)) it.classList.add('open');
        var idx = items.indexOf(it);
        panels.forEach(function(pn, i){ pn.classList.toggle('on', i === idx); });
      }
      items.forEach(function(it){
        var h = it.querySelector('.acc-head');
        if (h) h.addEventListener('click', function(){ openItem(it, true); });
        if (canHover) it.addEventListener('mouseenter', function(){ openItem(it, false); });
      });
    });
  })();

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
