import { cn } from '../../primitives/cn';

const panelCls = 'rounded-(--radius-xl) border border-(--color-neutral-200) px-3.5 py-3';
const titleCls = 'text-[12.5px] font-semibold text-(--color-text-primary)';

/**
 * Window: «Отчеты и аналитика» Kaiten — сводка по проекту.
 * Четыре мини-графика: статус проекта (донат), сгорание задач (линия
 * с идеальной траекторией), загрузка команды (столбики план/факт),
 * накопительный поток задач (области).
 */
export function WindowReportsMock() {
  return (
    <div
      aria-hidden
      className={cn(
        'overflow-hidden rounded-(--radius-3xl) border border-(--color-border-default)',
        'bg-(--color-surface-card) p-5 md:p-6',
        'shadow-[0_30px_80px_-30px_rgba(125,76,207,0.25)]',
      )}
    >
      {/* header */}
      <div className="flex items-center">
        <h3 className="text-base font-semibold text-(--color-text-primary)">Отчеты и аналитика</h3>
        <span className="ml-auto inline-flex items-center gap-1.5 rounded-(--radius-lg) border border-(--color-neutral-200) px-2.5 py-1 text-xs text-(--color-text-secondary)">
          июль 2026
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3"><path d="M6 9l6 6 6-6" /></svg>
        </span>
      </div>

      <div className="mt-3.5 grid grid-cols-2 gap-3.5">
        {/* донат: статус проекта */}
        <div className={panelCls}>
          <div className={titleCls}>Статус проекта</div>
          <div className="mt-2.5 flex items-center gap-2.5">
            <svg width="92" height="92" viewBox="0 0 42 42" className="shrink-0">
              <circle cx="21" cy="21" r="15.9" fill="none" stroke="var(--color-neutral-200)" strokeWidth="6.5" />
              <circle cx="21" cy="21" r="15.9" fill="none" stroke="var(--color-green-100)" strokeWidth="6.5" strokeDasharray="46 54" strokeDashoffset="25" />
              <circle cx="21" cy="21" r="15.9" fill="none" stroke="var(--color-orange-100)" strokeWidth="6.5" strokeDasharray="32 68" strokeDashoffset="79" />
              <circle cx="21" cy="21" r="15.9" fill="none" stroke="var(--color-action-primary)" strokeWidth="6.5" strokeDasharray="22 78" strokeDashoffset="47" />
              <text x="21" y="23.6" textAnchor="middle" className="fill-(--color-text-primary) text-[8px] font-semibold">46%</text>
            </svg>
            <div className="flex flex-col gap-1.5 text-[10.5px] text-(--color-text-secondary)">
              <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-(--color-green-100)" />Готово — 46%</span>
              <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-(--color-orange-100)" />В работе — 32%</span>
              <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-(--color-action-primary)" />Очередь — 22%</span>
            </div>
          </div>
        </div>

        {/* линия: сгорание задач */}
        <div className={panelCls}>
          <div className={titleCls}>Сгорание задач</div>
          <svg viewBox="0 0 240 92" preserveAspectRatio="none" className="mt-2.5 h-[92px] w-full">
            {[24, 48, 72].map((y) => (
              <line key={y} x1="0" y1={y} x2="240" y2={y} stroke="var(--color-neutral-100)" />
            ))}
            <path d="M6 10 L234 82" stroke="var(--color-neutral-400)" strokeWidth="1.6" strokeDasharray="5 4" fill="none" />
            <path
              d="M6 10 L40 16 L74 30 L108 30 L142 46 L176 62 L210 66 L234 74"
              stroke="var(--color-action-primary)"
              strokeWidth="2.6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="234" cy="74" r="3.4" fill="var(--color-action-primary)" />
          </svg>
        </div>

        {/* столбики: загрузка команды */}
        <div className={panelCls}>
          <div className={titleCls}>Загрузка команды</div>
          <svg viewBox="0 0 240 92" className="mt-2.5 h-[92px] w-full">
            {[
              { x: 14, plan: [30, 54], fact: [60, 24], warn: false, label: 'АМ' },
              { x: 70, plan: [18, 66], fact: [38, 46], warn: false, label: 'АК' },
              { x: 126, plan: [38, 46], fact: [52, 32], warn: false, label: 'ЕГ' },
              { x: 182, plan: [24, 60], fact: [30, 54], warn: true, label: 'ПС' },
            ].map((b) => (
              <g key={b.label}>
                <rect x={b.x} y={b.plan[0]} width="26" height={b.plan[1]} rx="4" fill={b.warn ? 'var(--color-orange-12)' : 'var(--color-green-12)'} />
                <rect x={b.x} y={b.fact[0]} width="26" height={b.fact[1]} rx="4" fill={b.warn ? 'var(--color-orange-100)' : 'var(--color-green-100)'} />
                <text x={b.x + 13} y="91" textAnchor="middle" className="fill-(--color-neutral-500) text-[9px]">{b.label}</text>
              </g>
            ))}
          </svg>
        </div>

        {/* области: поток задач */}
        <div className={panelCls}>
          <div className={titleCls}>Поток задач</div>
          <svg viewBox="0 0 240 92" preserveAspectRatio="none" className="mt-2.5 h-[92px] w-full">
            <path d="M0 92 L0 66 C60 60 120 46 240 16 L240 92 Z" fill="var(--color-action-primary-soft)" />
            <path d="M0 92 L0 76 C70 72 140 62 240 40 L240 92 Z" fill="#cbb2ec" />
            <path d="M0 92 L0 84 C80 82 160 76 240 62 L240 92 Z" fill="var(--color-action-primary)" />
          </svg>
        </div>
      </div>
    </div>
  );
}
