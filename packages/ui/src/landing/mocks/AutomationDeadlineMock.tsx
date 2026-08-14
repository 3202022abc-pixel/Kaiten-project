import { Icon } from '../../primitives/Icon';
import { cn } from '../../primitives/cn';

interface Row {
  card: string;
  due: string;
  /** Что сделало правило контроля срока. */
  action: string;
  state: 'ok' | 'soon' | 'stuck';
}

const ROWS: Row[] = [
  {
    card: 'Интеграция CRM с сервисами',
    due: 'срок 14 августа',
    action: 'Напоминание отправлено за 1 день',
    state: 'soon',
  },
  {
    card: 'Реализация кастомных полей',
    due: 'срок перенесен на 21 августа',
    action: 'Напоминание пересчитано',
    state: 'ok',
  },
  {
    card: 'Рефакторинг модуля отчетов',
    due: 'заблокирована 3 дня',
    action: 'Уведомление ответственному и руководителю',
    state: 'stuck',
  },
];

const STATE_CLASS: Record<Row['state'], string> = {
  ok: 'bg-(--color-green-12) text-green-700',
  soon: 'bg-(--color-orange-12) text-amber-800',
  stuck: 'bg-(--color-red-12) text-red-700',
};

/**
 * Контроль сроков автоматизацией Kaiten: карточки с дедлайнами и то, что
 * правило сделало само — напомнило за сутки, пересчитало напоминание после
 * переноса срока, уведомило руководителя о затянувшейся блокировке. Поверх —
 * всплывающее напоминание Kaiten. Для блока сценариев «Контроль сроков»
 * на лендинге модуля «Автоматизации».
 */
export function AutomationDeadlineMock() {
  return (
    <div
      aria-hidden
      className={cn(
        'relative w-[680px] overflow-hidden rounded-(--radius-3xl)',
        'border border-(--color-border-default) bg-(--color-surface-card)',
        'shadow-[0_30px_80px_-30px_rgba(125,76,207,0.30)]',
      )}
    >
      {/* window-chrome */}
      <div className="flex flex-wrap items-center gap-1.5 border-b border-(--color-border-default) bg-(--color-surface-section) px-3 py-2.5">
        <span className="h-2 w-2 rounded-full bg-red-300" />
        <span className="h-2 w-2 rounded-full bg-yellow-300" />
        <span className="h-2 w-2 rounded-full bg-green-300" />
        <div className="ml-2 flex flex-wrap items-center gap-3 text-[11px] text-(--color-text-secondary)">
          <span className="font-medium text-(--color-text-primary)">Текущие задачи</span>
          <span>Сроки</span>
          <span>Напоминания</span>
          <span className="rounded-md border border-(--color-border-default) bg-(--color-surface-page) px-1.5 py-0.5">
            Фильтры
          </span>
        </div>
      </div>

      <div className="space-y-2.5 p-4">
        {ROWS.map((r) => (
          <div
            key={r.card}
            className="flex items-center gap-3 rounded-(--radius-lg) border border-(--color-border-default) bg-(--color-surface-card) p-2.5 shadow-sm"
          >
            <div className="min-w-0 flex-1">
              <div className="truncate text-[11.5px] font-semibold leading-tight text-(--color-text-primary)">
                {r.card}
              </div>
              <div className="mt-1 flex items-center gap-1 text-[10px] text-(--color-text-secondary)">
                <Icon name="Calendar" aria-hidden className="h-3 w-3" strokeWidth={2} />
                {r.due}
              </div>
            </div>
            <span
              className={cn(
                'shrink-0 rounded-full px-2 py-1 text-[9px] font-medium',
                STATE_CLASS[r.state],
              )}
            >
              {r.action}
            </span>
          </div>
        ))}
      </div>

      {/* всплывающее напоминание Kaiten */}
      <div className="absolute bottom-4 right-4 w-[236px] rounded-(--radius-xl) border border-(--color-border-default) bg-(--color-surface-card) p-3 shadow-[0_18px_40px_-18px_rgba(125,76,207,0.45)]">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-5 w-5 items-center justify-center rounded-(--radius-md) bg-(--color-action-primary-soft) text-(--color-text-accent)">
            <Icon name="BellRing" aria-hidden className="h-3 w-3" strokeWidth={2} />
          </span>
          <span className="text-[10px] font-semibold text-(--color-text-primary)">Напоминание</span>
          <span className="ml-auto text-[9px] text-(--color-text-secondary)">сейчас</span>
        </div>
        <div className="mt-1.5 text-[10px] leading-snug text-(--color-text-secondary)">
          Срок задачи «Интеграция CRM с сервисами» наступает завтра
        </div>
      </div>
    </div>
  );
}
