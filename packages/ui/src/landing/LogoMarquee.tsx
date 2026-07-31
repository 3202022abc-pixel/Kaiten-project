import { Inspect } from '../primitives/Inspect';
import { cn } from '../primitives/cn';
import { LogoMarqueeMock } from './mocks/LogoMarqueeMock';

export interface LogoMarqueeItemProps {
  /** Название компании — идёт в alt логотипа. */
  brand: string;
  /** Путь к логотипу, напр. `/brand/client-logos/wrap-1.png`. */
  logoSrc: string;
}

export interface LogoMarqueeProps {
  eyebrow?: string;
  title?: string;
  /** Слово заголовка, которое красим в фирменный фиолетовый. */
  accentWord?: string;
  description?: string;
  items: LogoMarqueeItemProps[];
  /** Длительность полного цикла прокрутки, сек. По умолчанию 38. */
  durationSec?: number;
}

/**
 * Блок доверия «Более 200 тысяч компаний работают эффективнее с Кайтен»:
 * центрированный заголовок с акцентным словом + подзаголовок, под ними
 * бесконечная бегущая лента настоящих логотипов клиентов
 * (`LogoMarqueeMock` — порт блока `.lmq` с лендинга «Кайтен on-premise»:
 * растворение по краям, пауза на hover, отключение по prefers-reduced-motion).
 *
 * Отличие от `LogoCloud`: там статичная сетка инициалов-заглушек, здесь —
 * анимированная лента с реальными логотипами. Это два разных блока, оба
 * доступны в реестре; `LogoCloud` остаётся у старых лендингов.
 *
 * Ассеты логотипов — `apps/web/public/brand/client-logos/`.
 */
export function LogoMarquee({
  eyebrow,
  title,
  accentWord,
  description,
  items,
  durationSec,
}: LogoMarqueeProps) {
  return (
    <section className={cn('w-full overflow-hidden px-4 py-12 md:px-6 md:py-16')}>
      {(eyebrow || title || description) && (
        // отступ до ленты задаёт сам мок (.lmq__marq margin-top)
        <div className="mx-auto max-w-3xl text-center">
          {eyebrow && (
            <p
              data-comp="logo_marquee.eyebrow"
              className="mb-3 text-sm font-medium uppercase tracking-wide text-(--color-text-accent)"
            >
              {eyebrow}
            </p>
          )}
          {title && (
            <h2
              data-comp="logo_marquee.title"
              className="text-2xl font-semibold leading-tight md:text-4xl"
            >
              <AccentTitle title={title} accentWord={accentWord} />
            </h2>
          )}
          {description && (
            <p
              data-comp="logo_marquee.description"
              className="mt-3 text-base text-(--color-text-primary) md:text-lg"
            >
              {description}
            </p>
          )}
        </div>
      )}

      <Inspect as="div" name="logo_marquee.items">
        <LogoMarqueeMock
          logos={items.map((item) => ({ src: item.logoSrc, alt: item.brand }))}
          durationSec={durationSec}
          ariaLabel="Клиенты Кайтен"
        />
      </Inspect>
    </section>
  );
}

/** Заголовок с одним акцентным словом в фирменном фиолетовом. */
function AccentTitle({ title, accentWord }: { title: string; accentWord?: string }) {
  if (!accentWord) return <>{title}</>;
  const at = title.indexOf(accentWord);
  if (at < 0) return <>{title}</>;
  return (
    <>
      {title.slice(0, at)}
      <span className="text-(--color-text-accent)">{accentWord}</span>
      {title.slice(at + accentWord.length)}
    </>
  );
}
