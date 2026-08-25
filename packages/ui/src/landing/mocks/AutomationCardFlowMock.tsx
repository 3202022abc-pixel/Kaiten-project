import { Icon } from '../../primitives/Icon';
import { cn } from '../../primitives/cn';

interface Child {
  /** Колонка доски, в которой лежит дочерняя карточка. */
  column: string;
  title: string;
  /** Дата в правом нижнем углу карточки. */
  date: string;
  /** Карточку только что перенесло правило — она подсвечена. */
  moved?: boolean;
}

/** Геометрия доски: три колонки ровно укладываются в 680 − 2×16 padding. */
const COL_W = 208;
const COL_GAP = 12;

const CHILDREN: Child[] = [
  { column: 'В работе', title: 'Сверстать лендинг', date: '21 августа' },
  { column: 'Согласовано', title: 'Собрать контент', date: '19 августа' },
  { column: 'Готово', title: 'Настроить аналитику', date: '18 августа', moved: true },
];

/** Дочерняя карточка в колонке доски. */
function ChildCard({ title, date, moved }: Child) {
  return (
    <div
      className={cn(
        'rounded-(--radius-lg) border border-[#ededed] bg-(--color-surface-card) p-2.5',
      )}
    >
      {moved && (
        <span className="mb-1.5 inline-flex items-center gap-1 rounded-full bg-(--color-green-12) px-1.5 py-0.5 text-[9px] font-semibold text-green-700">
          <Icon name="Check" className="h-2.5 w-2.5" strokeWidth={3} />
          правилом
        </span>
      )}
      <div
        className={cn(
          'text-[12px] font-medium leading-snug',
          moved ? 'text-(--color-text-primary)' : 'text-(--color-text-secondary)',
        )}
      >
        {title}
      </div>
      <div className="mt-2 flex items-center gap-2">
        <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-(--color-action-primary-soft) text-[9px] font-semibold text-(--color-text-accent)">
          АК
        </span>
        <span className="ml-auto text-[10px] text-(--color-text-secondary)">{date}</span>
      </div>
    </div>
  );
}

/** Родительская карточка: лежит в той же колонке, что и дочерняя в работе. */
function ParentCard() {
  return (
    <div className="mt-2 rounded-(--radius-lg) border border-(--color-border-default) bg-(--color-surface-card) p-2.5 shadow-[0_0_10px_-2px_rgba(24,24,27,0.10)]">
      <div className="text-[9px] font-semibold uppercase tracking-wide text-(--color-text-secondary)">
        Родительская карточка
      </div>
      <div className="mt-1 text-[12px] font-medium leading-snug text-(--color-text-primary)">
        Запуск нового сайта
      </div>
      {/* дочерние карточки цели — списком с галочками */}

      <div className="mt-2 text-[10px] text-(--color-text-secondary)">Дочерние 1/3</div>
      <ul className="mt-2 space-y-1">
        {CHILDREN.map((c) => (
          <li key={c.title} className="flex items-center gap-1.5">
            {c.moved ? (
              <span className="inline-flex h-3 w-3 shrink-0 items-center justify-center rounded-[3px] bg-(--color-action-primary)">
                <svg viewBox="0 0 12 12" className="h-2 w-2" fill="none" stroke="#fff" strokeWidth="2.5">
                  <path d="M2.5 6.2l2.4 2.4L9.6 3.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            ) : (
              <span className="inline-flex h-3 w-3 shrink-0 rounded-[3px] border border-(--color-neutral-300)" />
            )}
            <span className="truncate text-[10px] text-(--color-text-secondary)">{c.title}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
/**
 * Доска из трёх колонок — «В работе», «Согласовано», «Готово» — с дочерними
 * карточками цели «Запуск нового сайта». Сама родительская карточка лежит
 * в «В работе» рядом со своей дочерней, а в «Готово» карточка помечена как
 * перенесённая правилом: как только она закрылась, родитель уехал следом.
 */
export function AutomationCardFlowMock() {
  return (
    <div
      aria-hidden
      className={cn(
        'relative w-[680px] overflow-hidden rounded-(--radius-3xl)',
        'border border-(--color-border-default) bg-(--color-surface-card)',
        'shadow-[0_0_40px_-12px_rgba(125,76,207,0.30)]',
      )}
    >
      {/* window-chrome */}
      <div className="flex flex-wrap items-center gap-1.5 border-b border-(--color-border-default) bg-(--color-surface-section) px-3 py-2.5">
        <span className="h-2 w-2 rounded-full bg-red-300" />
        <span className="h-2 w-2 rounded-full bg-yellow-300" />
        <span className="h-2 w-2 rounded-full bg-green-300" />
        <div className="ml-2 flex flex-wrap items-center gap-3 text-[11px] text-(--color-text-secondary)">
          <span className="font-medium text-(--color-text-primary)">Текущие задачи</span>
          <span>Поток</span>
          <span>Связи</span>
        </div>
      </div>

      <div className="p-4">
        {/* доска: дочерние карточки разложены по колонкам */}
        <div className="flex min-h-[220px]" style={{ gap: COL_GAP }}>
          {CHILDREN.map((c) => (
            <div
              key={c.column}
              className="shrink-0 rounded-(--radius-lg) bg-(--color-surface-section) px-2 pb-3 pt-2"
              style={{ width: COL_W }}
            >
              <div className="mb-2 flex items-center gap-1.5 px-1">
                <span className="truncate text-[11px] font-semibold uppercase tracking-wide text-(--color-text-secondary)">
                  {c.column}
                </span>
                <span className="ml-auto inline-flex h-4 min-w-4 shrink-0 items-center justify-center rounded-full bg-(--color-border-default) px-1 text-[10px] font-semibold text-(--color-text-secondary)">
                  {c.column === 'В работе' ? 2 : 1}
                </span>
              </div>
              <ChildCard {...c} />
              {c.column === 'В работе' && <ParentCard />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
