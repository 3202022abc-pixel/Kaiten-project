import { cn } from '../primitives/cn';

/**
 * FormMessengers — блок «регистрация в один клик через мессенджер»: разделитель +
 * кнопки Telegram и MAX, ведущие в ботов регистрации. Отдельный элемент завода
 * (по образцу `FormConsent`).
 *
 * НЕ дефолт. Стандартная форма заявки завода — поля + `FormConsent`, БЕЗ этих
 * кнопок. FormMessengers — ВТОРОЙ вариант формы, только для исключительных случаев
 * (правило `messenger-form-variant`), не привязан к типу лендинга. Рендерится
 * **opt-in** — кнопка появляется лишь когда задан её deep-link бота; если не задано
 * ни одной ссылки, компонент не рендерит ничего (можно ставить в форму безусловно).
 *
 * Ссылки — из спека (`telegramHref`/`maxHref`), их подменяет верстальщик на
 * боевые deep-link'и ботов (`https://t.me/<bot>?start=…` и ссылка на бота в MAX).
 */
export function FormMessengers({
  telegramHref,
  maxHref,
}: {
  telegramHref?: string;
  maxHref?: string;
}) {
  if (!telegramHref && !maxHref) return null;

  return (
    <>
      <div className="mt-5 flex items-center gap-3 text-xs text-(--color-text-secondary)">
        <span aria-hidden className="h-px flex-1 bg-(--color-border-default)" />
        или в&nbsp;один клик через мессенджер
        <span aria-hidden className="h-px flex-1 bg-(--color-border-default)" />
      </div>

      <div className={cn('mt-4 grid gap-3', telegramHref && maxHref ? 'grid-cols-2' : 'grid-cols-1')}>
        {telegramHref && (
          <a href={telegramHref} className={cn(MESSENGER_BTN)}>
            <TelegramIcon />
            Telegram
          </a>
        )}
        {maxHref && (
          <a href={maxHref} className={cn(MESSENGER_BTN)}>
            <MaxIcon />
            MAX
          </a>
        )}
      </div>
    </>
  );
}

/** Общий стиль кнопки-мессенджера: аутлайн-кнопка в тон DS, фирменный знак — цветом. */
const MESSENGER_BTN = cn(
  'inline-flex h-11 items-center justify-center gap-2 rounded-(--radius-lg)',
  'border border-(--color-border-default) bg-(--color-surface-page)',
  'text-sm font-medium text-(--color-text-primary) transition',
  'hover:border-(--color-action-primary) hover:bg-(--color-action-primary)/5',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-action-primary)/30',
);

/** Фирменный самолётик Telegram (бренд-синий #229ED9). */
function TelegramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" fill="#229ED9" aria-hidden>
      <path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z" />
    </svg>
  );
}

/** Знак MAX — у мессенджера нет открытого SVG-лого, поэтому нейтральный «пузырь» в акценте DS. */
function MaxIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5 shrink-0"
      fill="none"
      stroke="var(--color-action-primary)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  );
}
