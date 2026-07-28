import { cn } from '../primitives/cn';
import { FormConsent } from './FormConsent';
import { FormMessengers } from './FormMessengers';

export interface RegistrationFormProps {
  /** Заголовок карточки. Опционален: в первом экране форма идёт без своего заголовка. */
  title?: string;
  description?: string;
  submitLabel: string;
  /** Мягкая строка под кнопкой (напр. обещание сопровождения после вебинара). */
  note?: string;
  /**
   * Якорь формы — на него ведут кнопки «Занять место». Он же префикс `id` полей,
   * поэтому на странице с двумя формами якоря ОБЯЗАНЫ различаться: иначе `id`
   * полей совпадут и `<label>` второй формы будет фокусировать поле первой.
   */
  anchorId?: string;
  /**
   * Куда форма POST-ится. Верстальщик подменит на реальный endpoint.
   * По умолчанию `#` — заглушка.
   */
  action?: string;
  /**
   * Ссылка на регистрацию через Telegram-бота (deep-link `https://t.me/<bot>?start=…`).
   * Верстальщик подменит на реальный бот. `undefined` → кнопка не рендерится.
   */
  telegramHref?: string;
  /**
   * Ссылка на регистрацию через бота в MAX. `undefined` → кнопка не рендерится.
   */
  maxHref?: string;
  /** Сделать согласие на рассылку тоже обязательным (по умолчанию оно опционально). */
  newsletterRequired?: boolean;
  /** @deprecated Ссылки согласий теперь фиксированы в компоненте (юр-ссылки Кайтен). Поле оставлено для совместимости со спеком. */
  dataConsentHref?: string;
}

/**
 * Форма регистрации на вебинар. Поля и логика по ТЗ: имя и email обязательные,
 * телефон опциональный (чтобы не отпугнуть на входе), согласие на обработку
 * данных по 152-ФЗ обязательно. Поле «Компания / роль» из ТЗ убрано по решению
 * команды (18.07.2026) — квалификация лида по компании больше не собирается.
 * Все проверки браузерные, JS не нужен: обработчик настраивает верстальщик
 * через `action`.
 *
 * Карточка используется дважды — в правой колонке первого экрана и в финальном
 * блоке, — поэтому у неё нет собственной секционной обёртки и отступов.
 */
export function RegistrationForm({
  title,
  description,
  submitLabel,
  note,
  anchorId,
  action = '#',
  telegramHref,
  maxHref,
  newsletterRequired,
}: RegistrationFormProps) {
  // Префикс id полей — от якоря: форма рендерится дважды (первый экран и финал),
  // и с общим префиксом id полей дублировались бы на одной странице.
  const fid = (name: string) => `${anchorId ?? 'reg'}-${name}`;

  return (
    <form
      id={anchorId}
      action={action}
      method="post"
      className={cn(
        'w-full scroll-mt-24 rounded-(--radius-xl) lg:rounded-(--radius-2xl)',
        'border border-(--color-border-default) bg-(--color-surface-card) p-6 md:p-8',
        'text-(--color-text-primary) shadow-[0_30px_60px_-30px_rgba(0,0,0,0.25)]',
      )}
    >
      {title && <h2 className="text-xl font-semibold md:text-2xl">{title}</h2>}
      {description && (
        <p className={cn('text-base text-(--color-text-primary)', title ? 'mt-2' : '')}>
          {description}
        </p>
      )}

      <div className={cn('flex flex-col gap-4', title || description ? 'mt-6' : '')}>
        <Field id={fid('name')} name="name" type="text" label="Имя" required autoComplete="name" />
        <Field
          id={fid('email')}
          name="email"
          type="email"
          label="Email"
          required
          placeholder="name@company.ru"
          autoComplete="email"
        />
        <Field
          id={fid('phone')}
          name="phone"
          type="tel"
          label="Телефон"
          placeholder="+7 999 000-00-00"
          autoComplete="tel"
        />
      </div>

      <FormConsent idPrefix={anchorId ?? 'reg'} newsletterRequired={newsletterRequired} />

      <button
        type="submit"
        className={cn(
          'mt-6 inline-flex h-12 w-full items-center justify-center rounded-(--radius-lg)',
          'bg-(--color-action-primary) text-base font-semibold text-(--color-text-inverse)',
          'transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2',
          'focus-visible:ring-(--color-action-primary) focus-visible:ring-offset-2',
        )}
      >
        {submitLabel}
      </button>

      <FormMessengers telegramHref={telegramHref} maxHref={maxHref} />

      {note && (
        <p className="mt-4 text-center text-sm text-(--color-text-secondary)">{note}</p>
      )}
    </form>
  );
}

interface FieldProps {
  id: string;
  name: string;
  type: 'text' | 'email' | 'tel';
  label: string;
  required?: boolean;
  placeholder?: string;
  autoComplete?: string;
}

function Field({ id, name, type, label, required, placeholder, autoComplete }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-(--color-text-primary)">
        {label}
        {required && (
          <span aria-hidden className="ml-0.5 text-(--color-action-primary)">
            *
          </span>
        )}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={cn(
          'h-11 w-full rounded-(--radius-lg) border border-(--color-border-default) bg-(--color-surface-page)',
          'px-3.5 text-base text-(--color-text-primary) placeholder:text-(--color-text-secondary)',
          'transition focus:border-(--color-action-primary) focus:outline-none focus:ring-2',
          'focus:ring-(--color-action-primary)/30',
        )}
      />
    </div>
  );
}
