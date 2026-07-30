'use client';

/**
 * RoadmapSteps — дорожная карта внедрения: горизонтальная линия прогресса,
 * пронумерованные точки и карточки этапов в шахматном порядке (над/под линией).
 *
 * Эталон стиля — блок «Как проходит внедрение» лендинга «Кайтен on-premise».
 *
 * Стиль (не менять, заполнять новым контентом через пропсы):
 * - Десктоп (≥1024): сетка по числу этапов, линия по центру, карточки чередуются
 *   сверху/снизу, точки 36px с обводкой 4px цветом секции.
 * - Планшет и мобилка (<1024): линия вертикальная слева, точка и карточка в строку.
 * - Радиусы по DS: карточка 12px, на ≥1280 — 16px. Кнопок в блоке нет.
 * - Появление по скроллу: линия заливается слева направо, этапы включаются
 *   по очереди; к середине экрана видны все. prefers-reduced-motion — всё сразу.
 * - Первая и последняя точки — фиолетовые (--brand-100), промежуточные светлее.
 */
import React, { useEffect, useRef } from 'react';

export type RoadmapStep = {
  /** Заголовок этапа — короткий, без точки на конце */
  title: React.ReactNode;
  /** Описание этапа, 1–2 предложения */
  text: React.ReactNode;
  /** Иконка 18×18 (line-стиль, currentColor) — необязательна */
  icon?: React.ReactNode;
};

export type RoadmapStepsProps = {
  /** Этапы внедрения, обычно 4–6 */
  steps: RoadmapStep[];
  /** Подпись для скринридеров */
  ariaLabel?: string;
  /** Цвет обводки точек — под фон секции (по умолчанию серый DS) */
  sectionBg?: string;
};

const css = `
.rmp{position:relative;font-family:'Roboto',system-ui,sans-serif;color:#2d2d2d}
.rmp__line{position:absolute;left:0;right:0;top:50%;height:2px;border-radius:1px;overflow:hidden;
  background:rgba(125,76,207,.28)}
.rmp__fill{position:absolute;left:0;top:0;height:100%;width:calc(var(--p,0) * 100%);
  background:#7d4ccf;border-radius:1px}
.rmp__cols{display:grid;column-gap:8px}
.rmp__item{display:grid;grid-template-rows:1fr auto 1fr;justify-items:center;row-gap:12px;
  opacity:0;transform:translateY(12px);
  transition:opacity .42s cubic-bezier(.16,1,.3,1),transform .42s cubic-bezier(.16,1,.3,1)}
.rmp__item--bot{transform:translateY(-12px)}
.rmp__item.on{opacity:1;transform:none}
.rmp__dot{grid-row:2;display:inline-flex;width:36px;height:36px;border-radius:50%;
  align-items:center;justify-content:center;font-weight:600;font-size:14px;z-index:1;
  background:#e0e0e0;color:#fff;border:4px solid var(--rmp-bg,#f5f5f5);transform:scale(.72);
  transition:background .3s ease,color .3s ease,transform .3s cubic-bezier(.34,1.3,.64,1)}
.rmp__item.on .rmp__dot{background:#7d4ccf;transform:none}
.rmp__item:nth-child(n+2):nth-child(-n+5).on .rmp__dot{background:#e9dffa;color:#7d4ccf}
.rmp__card{background:#fff;border-radius:12px;padding:16px;width:calc(100% + 22px);margin-inline:-11px;
  display:flex;flex-direction:column;gap:4px}
.rmp__item--top .rmp__card{grid-row:1;align-self:stretch}
.rmp__item--bot .rmp__card{grid-row:3;align-self:stretch}
.rmp__card h3{display:flex;align-items:flex-start;gap:8px;margin:0;font-size:16px;line-height:24px;font-weight:600}
.rmp__card p{margin:0;font-size:12px;line-height:1.45;color:#757575}
.rmp__ic{flex:none;display:inline-flex;width:18px;height:18px;color:#7d4ccf}
.rmp__ic svg{width:18px;height:18px}
@media(min-width:1280px){.rmp__card{border-radius:16px}}
@media(max-width:1023px){
  .rmp__line{left:17px;right:auto;top:0;bottom:0;width:2px;height:auto}
  .rmp__fill{width:100%;height:calc(var(--p,0) * 100%)}
  .rmp__cols{grid-template-columns:1fr!important;row-gap:16px}
  .rmp__item{grid-template-rows:none;grid-template-columns:36px 1fr;column-gap:16px;
    justify-items:start;align-items:center;transform:translateY(12px)}
  .rmp__item.on{transform:none}
  .rmp__dot{grid-row:1;grid-column:1}
  .rmp__item--top .rmp__card,.rmp__item--bot .rmp__card{grid-row:1;grid-column:2;align-self:center}
  .rmp__card{width:auto;margin-inline:0}
  .rmp__ic,.rmp__ic svg{width:20px;height:20px}
}
@media(prefers-reduced-motion:reduce){
  .rmp__item{opacity:1;transform:none;transition:none}
  .rmp__dot{background:#7d4ccf;transform:none}
  .rmp__fill{width:100%;height:100%}
}
`;

export default function RoadmapSteps({
  steps,
  ariaLabel = 'Дорожная карта внедрения',
  sectionBg = '#f5f5f5',
}: RoadmapStepsProps) {
  const mapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const items = Array.from(map.querySelectorAll<HTMLElement>('.rmp__item'));
    const line = map.querySelector<HTMLElement>('.rmp__line');
    if (!items.length) return;
    let ticking = false;

    function upd() {
      ticking = false;
      if (!map) return;
      const r = map.getBoundingClientRect();
      const vh = window.innerHeight || 800;
      // 0 — блок только вошёл снизу; 1 — центр блока достиг середины экрана
      const enter = vh * 0.78;
      const mid = vh * 0.5 - r.height / 2;
      let p = (enter - r.top) / Math.max(1, enter - mid);
      p = Math.max(0, Math.min(1, p));
      map.style.setProperty('--p', p.toFixed(4));
      items.forEach((it, i) => {
        const t = (i / items.length) * 0.85; // слева направо, последний при p≈0.85
        it.classList.toggle('on', p >= t);
      });
    }

    // Линия обрезается по центрам крайних точек, чтобы не торчала за ними
    function layout() {
      if (!map || !line) return;
      const dots = map.querySelectorAll<HTMLElement>('.rmp__dot');
      if (dots.length < 2) return;
      const base = map.getBoundingClientRect();
      const first = dots[0].getBoundingClientRect();
      const last = dots[dots.length - 1].getBoundingClientRect();
      if (window.matchMedia('(max-width: 1023px)').matches) {
        line.style.left = '';
        line.style.right = '';
        line.style.top = `${first.top - base.top + first.height / 2}px`;
        line.style.bottom = 'auto';
        line.style.height = `${last.top - first.top}px`;
      } else {
        line.style.top = '';
        line.style.bottom = '';
        line.style.height = '';
        line.style.left = `${first.left - base.left + first.width / 2}px`;
        line.style.right = `${base.right - last.right + last.width / 2}px`;
      }
    }

    function onScroll() {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(upd);
      }
    }

    layout();
    upd();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    // Страховка: во встроенных браузерах scroll-события могут не доходить
    const timer = window.setInterval(() => {
      layout();
      upd();
    }, 100);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      window.clearInterval(timer);
    };
  }, [steps.length]);

  return (
    <div
      ref={mapRef}
      className="rmp"
      aria-label={ariaLabel}
      style={{ ['--rmp-bg' as string]: sectionBg }}
    >
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div className="rmp__line" aria-hidden>
        <i className="rmp__fill" />
      </div>
      <div
        className="rmp__cols"
        style={{ gridTemplateColumns: `repeat(${steps.length}, 1fr)` }}
      >
        {steps.map((step, i) => (
          <div
            key={i}
            className={`rmp__item ${i % 2 === 0 ? 'rmp__item--top' : 'rmp__item--bot'}`}
          >
            <div className="rmp__card">
              <h3>
                {step.icon ? <span className="rmp__ic">{step.icon}</span> : null}
                {step.title}
              </h3>
              <p>{step.text}</p>
            </div>
            <span className="rmp__dot">{i + 1}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
