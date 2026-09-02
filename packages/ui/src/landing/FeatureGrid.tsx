import { Inspect } from '../primitives/Inspect';
import { cn } from '../primitives/cn';
import { Icon } from '../primitives/Icon';
import { MockVisual, type MockVariant } from './mocks/MockVisual';
import { FeatureGridMock } from './mocks/FeatureGridMock';
import { FeatureTile, FeatureTilesStyle } from './mocks/FeatureTile';

export interface FeatureItemProps {
  icon: string;
  title: string;
  description: string;
  /** Опциональное компактное мок-превью доски внутри карточки. */
  mockVariant?: MockVariant;
  /**
   * Подпись плитки из галереи мини-мокапов фич (`FeatureMocksV01`) —
   * напр. «Чек-листы в задаче», «Прогноз сроков». Иллюстрация карточки
   * в режиме `variant: 'mock'`.
   */
  featureTile?: string;
}

export interface FeatureGridProps {
  eyebrow?: string;
  title: string;
  description?: string;
  items: FeatureItemProps[];
  columns?: 2 | 3 | 4;
  /**
   * 'cards' (дефолт) — простая сетка карточек с иконкой, как у старых лендингов.
   * 'mock' — эталонный блок `FeatureGridMock`: три колонки на десктопе,
   * карусель со стрелками на планшете и мобилке, иллюстрация каждой карточки —
   * мини-мокап фичи из галереи (`items[].featureTile`).
   */
  variant?: 'cards' | 'mock';
  /**
   * Карточки как в эталонном блоке фич (`FeatureGridMock`): светло-серая
   * заливка, без рамки и без hover-подъёма. Opt-in — без него остаётся прежняя
   * белая карточка с обводкой, чтобы не менять старые лендинги.
   */
  flat?: boolean;
  /**
   * Убрать нижний отступ секции. Сейчас действует только для `variant: 'mock'`
   * (у эталонного блока свой крупный padding) — нужен, когда под блоком сразу
   * идёт кнопка или следующая секция.
   */
  flushBottom?: boolean;
}

const colsClass: Record<NonNullable<FeatureGridProps['columns']>, string> = {
  2: 'md:grid-cols-2',
  3: 'md:grid-cols-2 lg:grid-cols-3',
  4: 'md:grid-cols-2 lg:grid-cols-4',
};

export function FeatureGrid({
  eyebrow,
  title,
  description,
  items,
  columns = 3,
  variant = 'cards',
  flat,
  flushBottom,
}: FeatureGridProps) {
  // Эталонный блок галереи фич. Иллюстрация карточки — мини-мокап из
  // FeatureMocksV01 по подписи `featureTile`; стили галереи объёмные, поэтому
  // подключаем их один раз на секцию, а плиткам ставим withStyle={false}.
  if (variant === 'mock') {
    const withTiles = items.some((it) => it.featureTile);
    return (
      <>
        {withTiles && <FeatureTilesStyle />}
        <FeatureGridMock
          title={title}
          subtitle={description}
          flushBottom={flushBottom}
          items={items.map((it) => ({
            title: it.title,
            desc: it.description,
            illustration: it.featureTile ? (
              <FeatureTile caption={it.featureTile} withStyle={false} />
            ) : undefined,
          }))}
        />
      </>
    );
  }

  return (
    <section
      className={cn(
        'mx-auto w-full max-w-(--container-kaiten)',
        'px-4 py-8 md:px-6 md:py-12 xl:px-0 lg:py-16',
      )}
    >
      <div className="mb-12 max-w-2xl">
        {eyebrow && (
          <p
            data-comp="features.eyebrow"
            className="mb-3 text-sm font-medium uppercase tracking-wide text-(--color-text-accent)"
          >
            {eyebrow}
          </p>
        )}
        <h2
          data-comp="features.title"
          className="text-3xl font-semibold leading-tight md:text-4xl"
        >
          {title}
        </h2>
        {description && (
          <p
            data-comp="features.description"
            className="mt-4 text-base text-(--color-text-primary) md:text-lg"
          >
            {description}
          </p>
        )}
      </div>

      <div className={cn('grid grid-cols-1 gap-6', colsClass[columns])}>
        {items.map((item, i) => (
          <Inspect
            as="div"
            key={i}
            name={`features.items[${i}]`}
            className={cn(
              'group rounded-(--radius-2xl) p-6',
              flat
                ? 'bg-(--color-surface-section)'
                : [
                    'border border-(--color-border-default) bg-(--color-surface-card) transition',
                    'hover:-translate-y-0.5 hover:border-(--color-action-primary)/40 hover:shadow-sm',
                  ],
            )}
          >
            {item.mockVariant ? (
              <div className="mb-5">
                <MockVisual variant={item.mockVariant} />
              </div>
            ) : (
              <div
                className={cn(
                  'mb-5 inline-flex h-11 w-11 items-center justify-center',
                  'rounded-(--radius-xl) bg-(--color-action-primary-soft) text-(--color-text-accent)',
                )}
              >
                <Icon name={item.icon} className="h-5 w-5" />
              </div>
            )}
            <h3
              data-comp={`features.items[${i}].title`}
              className="text-lg font-semibold leading-snug"
            >
              {item.title}
            </h3>
            <p
              data-comp={`features.items[${i}].description`}
              className="mt-2 text-base leading-relaxed text-(--color-text-primary)"
            >
              {item.description}
            </p>
          </Inspect>
        ))}
      </div>
    </section>
  );
}
