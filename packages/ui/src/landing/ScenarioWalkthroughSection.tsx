import { ButtonLink } from '../primitives/ButtonLink';
import { Icon } from '../primitives/Icon';
import { Inspect } from '../primitives/Inspect';
import { cn } from '../primitives/cn';
import { MockFit } from '../primitives/MockFit';
import { MockVisual, type MockVariant } from './mocks';

export interface ScenarioStepProps {
  time: string;
  title: string;
  description: string;
  icon?: string;
  /**
   * Кнопка под текстом шага. Нужна на завершающем шаге, чтобы призыв
   * стоял в самом сценарии, а не отдельной секцией под ним. Opt-in.
   */
  primaryCta?: { label: string; href: string };
  mockVariant: MockVariant;
}

export interface ScenarioWalkthroughSectionProps {
  eyebrow?: string;
  title: string;
  description?: string;
  protagonist?: string;
  steps: ScenarioStepProps[];
  /**
   * Простой таймлайн: без нумерованных кружков и без вертикальной линии между
   * шагами — остаются только плашки «Шаг N» из контента. Opt-in, старые лендинги
   * не трогаем.
   */
  plainTimeline?: boolean;
  /**
   * Номер шага (`steps[].time`) уходит фирменным фиолетовым в начало заголовка
   * вместо отдельной плашки над ним. Opt-in, старые лендинги не трогаем.
   */
  stepInTitle?: boolean;
  /** 'left' (дефолт) или 'center' — шапка секции по центру. */
  align?: 'left' | 'center';
  /**
   * Две колонки уже с планшета, а не только с десктопа: та же пропорция
   * «мок рядом с текстом», просто пропорционально уже. Без флага шаги
   * на планшете складываются в одну колонку. Opt-in.
   */
  columnsFromTablet?: boolean;
}

/**
 * ScenarioWalkthroughSection — нарративная секция «День из жизни» (например,
 * «День менеджера продаж»). Вертикальный таймлайн, на каждом шаге чередуются
 * стороны mock и текста. У каждого шага — время суток, заголовок действия,
 * описание и mock интерфейса в этот момент. Дает живое представление о
 * продукте без сухого MediaCopy×N.
 */
export function ScenarioWalkthroughSection({
  eyebrow,
  title,
  description,
  protagonist,
  steps,
  plainTimeline,
  stepInTitle,
  align,
  columnsFromTablet,
}: ScenarioWalkthroughSectionProps) {
  return (
    <section
      className={cn(
        'relative',
        'mx-auto w-full max-w-(--container-kaiten)',
        'px-4 py-8 md:px-6 md:py-12 xl:px-0 lg:py-16',
      )}
    >
      <div
        className={cn(
          'mb-14',
          align === 'center'
            ? // На мобилке шапка по левому краю, по центру — с планшета.
              'mx-auto max-w-3xl text-left md:text-center'
            : 'max-w-3xl',
        )}
      >
        {eyebrow && (
          <p
            data-comp="scenario_walkthrough.eyebrow"
            className="mb-3 text-sm font-medium uppercase tracking-wide text-(--color-text-accent)"
          >
            {eyebrow}
          </p>
        )}
        {/*
          На десктопе заголовок держим в одну строку: перенос разбивал
          «Справочном центре» и ломал ритм шапки раздела.
        */}
        <h2
          data-comp="scenario_walkthrough.title"
          className="text-3xl font-semibold leading-tight md:text-4xl lg:whitespace-nowrap"
        >
          {title}
        </h2>
        {description && (
          <p
            data-comp="scenario_walkthrough.description"
            className="mt-4 text-base leading-relaxed text-(--color-text-primary) md:text-lg"
          >
            {description}
          </p>
        )}
        {protagonist && (
          <div
            className={cn(
              'mt-5 inline-flex items-center gap-2 rounded-full',
              'border border-(--color-border-default) bg-(--color-surface-section) px-3 py-1.5',
              'text-sm text-(--color-text-secondary)',
            )}
          >
            <Icon name="UserRound" className="h-4 w-4 text-(--color-text-accent)" strokeWidth={2} />
            <span data-comp="scenario_walkthrough.protagonist">{protagonist}</span>
          </div>
        )}
      </div>

      {/* На планшете шаги стоят плотнее: две колонки уже с md, и 56px
          между ними читаются как разрыв. */}
      <ol className={cn('relative space-y-14', columnsFromTablet && 'md:space-y-16 lg:space-y-14')}>
        {/* spine — вертикальная линия таймлайна, only on lg+ */}
        {!plainTimeline && (
          <span
            aria-hidden
            className={cn(
              'pointer-events-none absolute left-1/2 top-2 hidden h-[calc(100%-1rem)] w-px -translate-x-1/2 lg:block',
              'bg-gradient-to-b from-(--color-action-primary)/40 via-(--color-border-default) to-transparent',
            )}
          />
        )}
        {steps.map((s, i) => {
          const reverse = i % 2 === 1;
          return (
            <Inspect
              as="li"
              key={i}
              name={`scenario_walkthrough.steps[${i}]`}
              className={cn(
                'relative grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-center lg:gap-16',
                columnsFromTablet && 'md:grid-cols-2 md:items-center md:gap-8',
              )}
            >
              {/* timeline dot — номер шага на линии; скрывается через plainTimeline */}
              {!plainTimeline && (
                <span
                  aria-hidden
                  className={cn(
                    'absolute left-1/2 top-0 hidden h-10 w-10 -translate-x-1/2 items-center justify-center',
                    'rounded-full border border-(--color-action-primary)/30 bg-(--color-surface-page) text-(--color-text-accent) shadow-sm lg:inline-flex',
                  )}
                >
                  <span className="text-xs font-semibold tabular-nums">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </span>
              )}

              <div
                className={cn(
                  reverse && 'lg:order-2',
                  columnsFromTablet && reverse && 'md:order-2',
                )}
              >
                {!stepInTitle && (
                  <div
                    className={cn(
                      'inline-flex items-center gap-2 rounded-full border border-(--color-border-default)',
                      'bg-(--color-surface-page) px-3 py-1.5 text-xs font-medium text-(--color-text-secondary)',
                    )}
                  >
                    {s.icon && (
                      <Icon name={s.icon} className="h-3.5 w-3.5 text-(--color-text-accent)" strokeWidth={2} />
                    )}
                    <span data-comp={`scenario_walkthrough.steps[${i}].time`}>{s.time}</span>
                  </div>
                )}
                <h3
                  data-comp={`scenario_walkthrough.steps[${i}].title`}
                  className={cn(
                    'text-2xl font-semibold leading-tight md:text-3xl',
                    // В двухколоночной раскладке с планшета колонка узкая —
                    // крупный заголовок там ломается, держим 24px до десктопа.
                    columnsFromTablet && 'md:text-2xl lg:text-3xl',
                    stepInTitle ? 'mt-0' : 'mt-4',
                  )}
                >
                  {stepInTitle && (
                    <span
                      data-comp={`scenario_walkthrough.steps[${i}].time`}
                      className="text-(--color-text-accent)"
                    >
                      {s.time}{'  '}
                    </span>
                  )}
                  {s.title}
                </h3>
                <p
                  data-comp={`scenario_walkthrough.steps[${i}].description`}
                  className={cn(
                    'mt-3 text-base leading-relaxed text-(--color-text-primary) md:text-lg',
                    // На планшете колонка уже, чем на десктопе, — описание там 16px.
                    columnsFromTablet && 'md:text-base lg:text-lg',
                  )}
                >
                  {s.description}
                </p>
                {s.primaryCta && (
                  <div
                    className={cn(
                      'mt-6',
                      // На мобилке кнопка шага по центру колонки.
                      columnsFromTablet && 'flex justify-center sm:block',
                    )}
                  >
                    <Inspect name={`scenario_walkthrough.steps[${i}].primaryCta`}>
                      <ButtonLink size="lg" href={s.primaryCta.href}>
                        {s.primaryCta.label}
                      </ButtonLink>
                    </Inspect>
                  </div>
                )}
              </div>
              <Inspect
                as="div"
                name={`scenario_walkthrough.steps[${i}].mockVariant`}
                className={cn(
                  reverse && 'lg:order-1',
                  columnsFromTablet && reverse && 'md:order-1',
                )}
              >
                {/* Мок фиксированной ширины ужимается под колонку целиком,
                    поэтому композиция не меняется между брейкпоинтами. */}
                <MockFit>
                  <MockVisual variant={s.mockVariant} />
                </MockFit>
              </Inspect>
            </Inspect>
          );
        })}
      </ol>
    </section>
  );
}
