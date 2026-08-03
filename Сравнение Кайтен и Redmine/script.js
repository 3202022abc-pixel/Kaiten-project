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

  // FAQ-аккордеон по мокапу FAQAccordion: открыт только один пункт за раз.
  // Высота анимируется через grid 0fr→1fr (max-height не трогаем).
  document.querySelectorAll('.faq-q').forEach(function(q){
    q.addEventListener('click', function(){
      var item = q.parentElement;
      var willOpen = !item.classList.contains('open');
      item.parentElement.querySelectorAll('.faq-item.open').forEach(function(o){
        o.classList.remove('open');
        o.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
      });
      if (willOpen){
        item.classList.add('open');
        q.setAttribute('aria-expanded', 'true');
      }
    });
  });
  // Аккордеон: раскрытие пункта + синхронизация медиа-панели справа.
  // Переключение по клику и по наведению (только там, где есть настоящий hover —
  // на тач-устройствах mouseenter стреляет по тапу и мешает).
  (function(){
    var hoverable = window.matchMedia('(hover:hover) and (pointer:fine)').matches;
    document.querySelectorAll('.acc-wrap').forEach(function(wrap){
      var acc = wrap.querySelector('.acc');
      if (!acc) return;
      var items = [].slice.call(acc.querySelectorAll('.acc-item'));
      var panels = [].slice.call(wrap.querySelectorAll('.acc-media .acc-panel'));
      var timer = null;
      function open(idx){
        items.forEach(function(it, i){ it.classList.toggle('open', i === idx); });
        panels.forEach(function(pn, i){ pn.classList.toggle('on', i === idx); });
      }
      items.forEach(function(item, i){
        var head = item.querySelector('.acc-head');
        if (!head) return;
        // как в мокапе AccordionFeatureSection: клик открывает пункт, но не сворачивает
        // последний открытый — секция никогда не остаётся без активной иллюстрации
        head.addEventListener('click', function(){
          clearTimeout(timer);
          open(i);
        });
        head.addEventListener('focus', function(){ open(i); });
        if (!hoverable) return;
        // небольшая задержка, чтобы пункты не мигали, когда курсор просто проезжает мимо
        item.addEventListener('mouseenter', function(){
          clearTimeout(timer);
          timer = setTimeout(function(){ open(i); }, 120);
        });
        item.addEventListener('mouseleave', function(){ clearTimeout(timer); });
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

  // Галерея с вкладками (SliderTabs)
  (function(){
    document.querySelectorAll('.stabs').forEach(function(root){
      var tabs = [].slice.call(root.querySelectorAll('.stabs__tab'));
      var panels = [].slice.call(root.querySelectorAll('.stp'));
      if (!panels.length) return;
      var prev = root.querySelector('.stabs__prev');
      var next = root.querySelector('.stabs__next');
      var cnt = root.querySelector('.stabs__counter');
      var i = 0, n = panels.length;
      function show(k){
        i = (k + n) % n;
        tabs.forEach(function(t, j){
          t.classList.toggle('on', j === i);
          t.setAttribute('aria-selected', j === i ? 'true' : 'false');
        });
        panels.forEach(function(p, j){ p.classList.toggle('on', j === i); });
        if (cnt) cnt.innerHTML = '<b>' + (i + 1) + '</b> / ' + n;
      }
      tabs.forEach(function(t, j){ t.addEventListener('click', function(){ show(j); }); });
      if (prev) prev.addEventListener('click', function(){ show(i - 1); });
      if (next) next.addEventListener('click', function(){ show(i + 1); });
      show(0);
    });
  })();
