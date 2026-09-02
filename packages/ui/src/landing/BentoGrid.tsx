import { Inspect } from '../primitives/Inspect';
import { cn } from '../primitives/cn';
import { Icon } from '../primitives/Icon';
import { FeatureTile, FeatureTilesStyle } from './mocks/FeatureTile';

export interface BentoCellProps {
  icon?: string;
  title: string;
  description: string;
  /** Размер ячейки: 1x1 (small), 2x1 (wide), 1x2 (tall), 2x2 (large). */
  size?: 'small' | 'wide' | 'tall' | 'large';
  accent?: boolean;
  /**
   * Подпись плитки из галереи мини-мокапов фич (`FeatureMocksV01`), напр.
   * «Канбан-доски». Когда задана — вместо иконки рисуется интерфейсный
   * мини-мокап фичи. Неизвестная подпись — молча падаем обратно на иконку.
   */
  featureTile?: string;
}

export interface BentoGridProps {
  eyebrow?: string;
  title: string;
  description?: string;
  cells: BentoCellProps[];
  /**
   * Секция на светло-серой подложке во всю ширину, ячейки — белые карточки
   * без обводки. Opt-in: без него остаётся прежний белый фон и карточки
   * с рамкой, чтобы не менять старые лендинги.
   */
  onSurface?: boolean;
  /** 'left' (дефолт) или 'center' — шапка секции по центру. */
  align?: 'left' | 'center';
  /**
   * Просвет между ячейками на десктопе — 32px вместо 20px.
   * Opt-in: старые лендинги оставляем на прежней плотной сетке.
   */
  wideGap?: boolean;
  /**
   * Вертикальные отступы секции на десктопе — 96px вместо 64px. Opt-in:
   * нужны, когда сетка отделена от соседей как самостоятельный блок.
   */
  spaceY?: boolean;
}

const SIZE_CLASS: Record<NonNullable<BentoCellProps['size']>, string> = {
  small: 'md:col-span-1 md:row-span-1',
  wide: 'md:col-span-2 md:row-span-1',
  tall: 'md:col-span-1 md:row-span-2',
  large: 'md:col-span-2 md:row-span-2',
};

/**
 * Bento-grid: 6-9 ячеек разного размера для feature overview платформы.
 * Заменяет однотонный FeatureGrid когда нужна визуальная иерархия
 * (одна крупная фича + 5 поддерживающих).
 */
export function BentoGrid({
  eyebrow,
  title,
  description,
  cells,
  onSurface,
  align,
  wideGap,
  spaceY,
}: BentoGridProps) {
  const content = (
    <section
      className={cn(
        'mx-auto w-full max-w-(--container-kaiten)',
        'px-4 py-8 md:px-6 md:py-12 xl:px-0 lg:py-16',
        // Верхний отступ по брейкпоинтам: 48 мобилка / 64 планшет / 96 десктоп.
        spaceY && 'pt-12 md:pt-16 lg:py-24',
      )}
    >
      <div
        className={cn(
          'mb-10',
          align === 'center' ? 'mx-auto max-w-4xl md:text-center' : 'max-w-2xl',
        )}
      >
        {eyebrow && (
          <p
            data-comp="bento_grid.eyebrow"
            className="mb-3 text-sm font-medium uppercase tracking-wide text-(--color-text-accent)"
          >
            {eyebrow}
          </p>
        )}
        <h2
          data-comp="bento_grid.title"
          className="text-3xl font-semibold leading-tight md:text-4xl"
        >
          {title}
        </h2>
        {description && (
          <p
            data-comp="bento_grid.description"
            className="mt-4 text-base text-(--color-text-primary) md:text-lg"
          >
            {description}
          </p>
        )}
      </div>

      {cells.some((c) => c.featureTile) && <FeatureTilesStyle />}

      <div
        className={cn(
          'grid auto-rows-[minmax(180px,auto)] grid-cols-1 gap-4 md:grid-cols-3 md:gap-5',
          wideGap && 'lg:gap-8',
        )}
      >
        {cells.map((c, i) => (
          <Inspect
            as="div"
            key={i}
            name={`bento_grid.cells[${i}]`}
            className={cn(
              'flex flex-col rounded-(--radius-2xl) p-6',
              SIZE_CLASS[c.size ?? 'small'],
              c.accent
                ? 'border border-(--color-action-primary)/40 bg-(--color-action-primary-soft)'
                : onSurface
                  ? 'bg-(--color-surface-card)'
                  : 'border border-(--color-border-default) bg-(--color-surface-card)',
            )}
          >
            {c.featureTile ? (
              <div
                aria-hidden
                className={cn(
                  'mb-5 flex w-full items-center justify-center overflow-hidden',
                  'rounded-(--radius-xl) p-3',
                  c.accent ? 'bg-(--color-surface-card)' : 'bg-(--color-surface-section)',
                )}
              >
                <FeatureTile caption={c.featureTile} withStyle={false} />
              </div>
            ) : (
              c.icon && (
                <span
                  aria-hidden
                  className={cn(
                    'mb-4 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-(--radius-xl)',
                    c.accent
                      ? 'bg-(--color-surface-card) text-(--color-text-accent)'
                      : 'bg-(--color-action-primary-soft) text-(--color-text-accent)',
                  )}
                >
                  <Icon name={c.icon} className="h-5 w-5" />
                </span>
              )
            )}
            <h3
              data-comp={`bento_grid.cells[${i}].title`}
              className={cn(
                'text-lg font-semibold',
                c.accent ? 'text-(--color-text-accent)' : 'text-(--color-text-primary)',
              )}
            >
              {c.title}
            </h3>
            <p
              data-comp={`bento_grid.cells[${i}].description`}
              className="mt-2 text-sm text-(--color-text-secondary)"
            >
              {c.description}
            </p>
          </Inspect>
        ))}
      </div>
    </section>
  );

  // Серая подложка тянется во всю ширину экрана, а контент остаётся в сетке.
  return onSurface ? <div className="bg-(--color-surface-section)">{content}</div> : content;
}
