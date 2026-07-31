import { FEATURE_TILES_CSS, featureTileCard } from './FeatureMocksV01';

/**
 * Одна плитка из галереи мини-мокапов фич Kaiten (`FeatureMocksV01`) —
 * белая карточка 240×176 с интерфейсом фичи. Достаётся по подписи из галереи
 * (напр. «Канбан-доски», «База знаний», «CRM»).
 *
 * Нужна, чтобы секции лендинга могли брать иллюстрацию карточки из галереи
 * по строке-подписи в спеке, а не тащить ReactNode. Если подписи в галерее
 * нет — рендерится ничего (секция покажет свой запасной вариант, напр. иконку).
 *
 * Стили галереи объёмные, поэтому при нескольких плитках в одной секции
 * подключай их ОДИН раз через `<FeatureTilesStyle />` и ставь плиткам
 * `withStyle={false}` — иначе один и тот же CSS уедет в разметку N раз.
 *
 * Полный список подписей — `<div class="cap">` в `FeatureMocksV01.tsx`.
 */
export function FeatureTile({
  caption,
  withStyle = true,
}: {
  caption: string;
  withStyle?: boolean;
}) {
  const html = featureTileCard(caption);
  if (!html) return null;
  return (
    <div className="fm" style={{ background: 'transparent', padding: 0, width: 'fit-content' }}>
      {withStyle && <FeatureTilesStyle />}
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}

/** Стили галереи плиток — подключить один раз на секцию с несколькими плитками. */
export function FeatureTilesStyle() {
  return <style dangerouslySetInnerHTML={{ __html: FEATURE_TILES_CSS }} />;
}

/** Есть ли такая плитка в галерее — чтобы секция знала, рисовать ли запасной вариант. */
export function hasFeatureTile(caption: string): boolean {
  return featureTileCard(caption) !== null;
}
