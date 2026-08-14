import { Icon } from '../../primitives/Icon';
import { cn } from '../../primitives/cn';

interface Field {
  label: string;
  value: string;
  select?: boolean;
}

const ACTION: Field[] = [
  { label: 'Действие', value: 'Установить срок', select: true },
  { label: 'Временная зона', value: 'UTC', select: true },
  { label: 'Срок', value: 'через 2 дня после события' },
];

/** Поле конструктора с «плавающей» подписью в вырезе рамки. */
function RuleField({ label, value, select }: Field) {
  return (
    <div className="relative rounded-(--radius-lg) border border-(--color-border-default) bg-(--color-surface-card) px-3 pb-2.5 pt-3.5">
      {/* Подпись «в вырезе» рамки — фон совпадает с подложкой мока (белой). */}
      <span className="absolute -top-2 left-2.5 bg-(--color-surface-card) px-1 text-[10px] leading-none text-(--color-text-secondary)">
        {label}
      </span>
      <div className="flex items-center gap-2">
        <span className="flex-1 truncate text-[13px] text-(--color-text-primary)">{value}</span>
        {select ? (
          <Icon
            name="ChevronDown"
            aria-hidden
            className="h-3.5 w-3.5 shrink-0 text-(--color-text-secondary)"
            strokeWidth={2}
          />
        ) : null}
      </div>
    </div>
  );
}

/**
 * Конструктор правила автоматизации Kaiten — половина «Выполнить»: действие,
 * которое Kaiten делает в ответ на событие-триггер. Второй из двух шагов сборки
 * правила «если — то» на лендинге модуля «Автоматизации».
 * Пара — AutomationRuleTriggerMock (`automation-rule-trigger`, половина «Когда»).
 */
export function AutomationRuleActionMock() {
  return (
    <div
      aria-hidden
      className={cn(
        'relative w-[420px] overflow-hidden rounded-(--radius-3xl)',
        'bg-(--color-surface-card) p-5',
        'shadow-[0_0_80px_-30px_rgba(125,76,207,0.30)]',
      )}
    >
      <div className="mb-3.5 text-center text-[13px] font-semibold text-(--color-text-accent)">Выполнить</div>

      {/* Группа полей без заливки и рамки — только отбивка между полями. */}
      <div className="space-y-3">
        {ACTION.map((f) => (
          <RuleField key={f.label} {...f} />
        ))}
      </div>

      <div className="pt-1">
        <span className="inline-flex items-center gap-1.5 rounded-(--radius-md) border border-(--color-action-primary) px-2.5 py-1.5 text-[10.5px] font-semibold uppercase tracking-wide text-(--color-text-accent)">
          <Icon name="Plus" aria-hidden className="h-3.5 w-3.5" strokeWidth={2.5} />
          Добавить действие
        </span>
      </div>
    </div>
  );
}
