/* Статичная выгрузка: интерактив без React. */

(function(){function fit(){var outers=document.querySelectorAll('[data-mockfit="outer"]');for(var i=0;i<outers.length;i++){var o=outers[i],n=o.querySelector('[data-mockfit="inner"]');if(!n)continue;n.style.transform='none';o.style.height='';var nw=n.offsetWidth,nh=n.offsetHeight,ow=o.clientWidth;if(!nw||!ow)continue;var s=Math.min(1,ow/nw);n.style.transformOrigin='top left';n.style.transform='scale('+s+')';o.style.height=Math.round(nh*s)+'px';}}window.__ktFitMocks=fit;fit();addEventListener('load',fit);addEventListener('resize',fit);})();

(function(){var rows=document.querySelectorAll('[data-acc-row]');if(!rows.length)return;function apply(el,on){var a=el.getAttribute('data-acc-on')||'',b=el.getAttribute('data-acc-off')||'';(on?b:a).split(/\s+/).forEach(function(c){if(c)el.classList.remove(c)});(on?a:b).split(/\s+/).forEach(function(c){if(c)el.classList.add(c)})}function select(id){for(var i=0;i<rows.length;i++){var row=rows[i],on=row.getAttribute('data-acc-row')===id;apply(row,on);var kids=row.querySelectorAll('[data-acc-on],[data-acc-off]');for(var j=0;j<kids.length;j++)apply(kids[j],on);var btn=row.querySelector('button');if(btn)btn.setAttribute('aria-expanded',on?'true':'false')}var panels=document.querySelectorAll('[data-acc-panel]');for(var k=0;k<panels.length;k++)panels[k].classList.toggle('hidden',panels[k].getAttribute('data-acc-panel')!==id);if(window.__ktFitMocks)window.__ktFitMocks()}for(var i=0;i<rows.length;i++){(function(row){var id=row.getAttribute('data-acc-row');row.addEventListener('mouseenter',function(){select(id)});row.addEventListener('click',function(){select(id)});row.addEventListener('focusin',function(){select(id)})})(rows[i])}})();

/* слайдер представлений: старт, когда блок попал в кадр */
(function(){var list=document.querySelectorAll(".tvs");if(!list.length)return;
if(!("IntersectionObserver" in window)){for(var i=0;i<list.length;i++)list[i].classList.add("is-live");return;}
var io=new IntersectionObserver(function(es){es.forEach(function(e){e.target.classList.toggle("is-live",e.isIntersecting);});},{threshold:0.35});
for(var j=0;j<list.length;j++)io.observe(list[j]);})();
