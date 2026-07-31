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

  // Карусель «одна платформа»
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
      if (nav) nav.style.display = maxScroll > 6 ? '' : 'none';
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
  // Аккордеон: пункт раскрывается по наведению (там, где есть мышь) и по клику.
  // Раньше это были два отдельных обработчика — переключение .open и синхронизация
  // картинок; объединены, чтобы наведение двигало и то и другое.
  (function(){
    var hoverable = window.matchMedia('(hover:hover)').matches;
    document.querySelectorAll('.acc-wrap').forEach(function(w){
      var a = w.querySelector('.acc');
      if (!a) return;
      var items = a.querySelectorAll('.acc-item');
      var panels = w.querySelectorAll('.acc-media .acc-panel');

      function open(it){
        if (it.classList.contains('open')) return;
        items.forEach(function(o){ o.classList.remove('open'); });
        it.classList.add('open');
        if (!panels.length) return;
        var idx = 0;
        items.forEach(function(o, i){ if (o === it) idx = i; });
        panels.forEach(function(pn, i){ pn.classList.toggle('on', i === idx); });
      }

      items.forEach(function(it){
        var head = it.querySelector('.acc-head');
        if (head) head.addEventListener('click', function(){
          // на тач-устройствах повторный тап по раскрытому пункту сворачивает его,
          // на десктопе сворачивать нечем — там всегда открыт тот, где курсор
          if (!hoverable && it.classList.contains('open')) { it.classList.remove('open'); return; }
          open(it);
        });
        if (hoverable) it.addEventListener('mouseenter', function(){ open(it); });
      });
    });
  })();

  // Планшет: фиксируем высоту НЕ аккордеона, а фрейма с картинкой — по самому
  // длинному пункту. Так аккордеон остаётся по контенту (кнопка "Попробовать"
  // сидит прямо под ним), а фрейм не прыгает при переключении пунктов.
  // На десктопе высоту задаёт квадратная панель, на мобилке фрейма нет — не нужно.
  (function(){
    var acc = document.querySelector('#features .acc');
    var media = document.querySelector('#features .acc-media');
    if (!acc || !media) return;
    var mq = window.matchMedia('(min-width:768px) and (max-width:1279px)');
    var timer;

    function apply(){
      media.style.minHeight = '';
      if (!mq.matches) return;
      var open = acc.querySelector('.acc-item.open');
      var openBody = open && open.querySelector('.acc-body');
      // высота аккордеона в самом длинном состоянии = шапки + самый длинный текст
      var base = acc.getBoundingClientRect().height -
                 (openBody ? openBody.getBoundingClientRect().height : 0);
      var tallest = 0;
      acc.querySelectorAll('.acc-body').forEach(function(b){
        if (b.scrollHeight > tallest) tallest = b.scrollHeight;
      });
      // весь блок = аккордеон + кнопка "Попробовать" (с зазором): фрейм тянем по нему,
      // а не только по аккордеону. extra = кнопка+gap (высота bnf-col сверх аккордеона).
      var col = acc.parentElement;
      var extra = col.getBoundingClientRect().height - acc.getBoundingClientRect().height;
      // aspect-ratio:1/1 держит минимум-квадрат (на широком планшете картинка не режется),
      // min-height дотягивает фрейм до низа блока, где блок выше квадрата.
      media.style.minHeight = Math.round(base + tallest + extra) + 'px';
    }

    function schedule(){ clearTimeout(timer); timer = setTimeout(apply, 120); }

    apply();
    window.addEventListener('load', apply);      // после загрузки шрифтов высоты меняются
    window.addEventListener('resize', schedule);
    if (mq.addEventListener) mq.addEventListener('change', schedule);
    else if (mq.addListener) mq.addListener(schedule);
  })();

  // Таблица сравнения — раскрытие/сворачивание разделов
  (function(){
    var table = document.getElementById('cmpTable');
    if (!table) return;
    var secs = table.querySelectorAll('.cmp__sec');

    function setSec(sec, open){
      sec.setAttribute('aria-expanded', open ? 'true' : 'false');
      var g = sec.getAttribute('data-sec');
      table.querySelectorAll('.cmp__cell[data-g="' + g + '"]').forEach(function(cell){
        cell.classList.toggle('cmp__cell--hidden', !open);
      });
    }

    // Дефолт: на десктопе и планшете (>=768) все разделы раскрыты,
    // на мобилке — только первый, иначе таблица уходит на несколько экранов.
    // Пересчитываем при смене брейкпоинта, но перестаём вмешиваться, как только
    // пользователь сам что-то переключил — иначе ресайз сбрасывал бы его выбор.
    var touched = false;
    var mq = window.matchMedia('(min-width:768px)');
    function applyDefault(){
      if (touched) return;
      secs.forEach(function(sec, i){ setSec(sec, mq.matches || i === 0); });
    }
    applyDefault();
    if (mq.addEventListener) mq.addEventListener('change', applyDefault);
    else if (mq.addListener) mq.addListener(applyDefault);

    secs.forEach(function(sec){
      sec.addEventListener('click', function(){
        touched = true;
        setSec(sec, sec.getAttribute('aria-expanded') !== 'true');
      });
    });
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
