import Link from 'next/link';
import { readdir, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

export const dynamic = 'force-dynamic';

async function listLandings(): Promise<string[]> {
  const dir = resolve(process.cwd(), '..', '..', 'content', 'landings');
  try {
    const files = await readdir(dir);
    return files
      .filter((f) => f.endsWith('.json'))
      .map((f) => f.replace(/\.json$/, ''))
      .sort();
  } catch {
    return [];
  }
}

async function listDesignLandings(): Promise<{ slug: string; title: string | null }[]> {
  const dir = resolve(process.cwd(), 'public', 'design');
  try {
    const entries = await readdir(dir, { withFileTypes: true });
    const slugs = entries
      .filter((e) => e.isDirectory())
      .map((e) => e.name)
      .sort();
    return Promise.all(
      slugs.map(async (slug) => {
        const title = await readFile(resolve(dir, slug, 'title.txt'), 'utf8')
          .then((t) => t.trim() || null)
          .catch(() => null);
        return { slug, title };
      }),
    );
  } catch {
    return [];
  }
}

async function specTitle(slug: string): Promise<string | null> {
  const file = resolve(process.cwd(), '..', '..', 'content', 'landings', `${slug}.json`);
  try {
    const spec = JSON.parse(await readFile(file, 'utf8')) as {
      sections?: { props?: { title?: unknown } }[];
    };
    for (const section of spec.sections ?? []) {
      const title = section?.props?.title;
      if (typeof title === 'string' && title.trim()) return title.trim();
    }
    return null;
  } catch {
    return null;
  }
}

export default async function DashboardPage() {
  const landings = await listLandings();
  const designLandings = await listDesignLandings();
  const specLandings = await Promise.all(
    landings.map(async (slug) => ({ slug, title: await specTitle(slug) })),
  );
  const allLandings = [
    ...designLandings.map(({ slug, title }) => ({ slug, title, design: true })),
    ...specLandings.map(({ slug, title }) => ({ slug, title, design: false })),
  ].sort((a, b) => a.slug.localeCompare(b.slug));

  const GROUPS = ['Отрасли и команды', 'Сравнения', 'Продукт и фичи', 'Вебинары', 'Тестовые'] as const;
  const groupOf = (slug: string): (typeof GROUPS)[number] => {
    if (/^kaiten-vs-/.test(slug) || ['kaiten-clickup', 'kaiten-wrike', 'kaiten-trello', 'kaiten-asana', 'kaiten-weeek', 'kaiten-evateam', 'kaiten-youtrack'].includes(slug)) {
      return 'Сравнения';
    }
    if (/^kaiten-dlya-/.test(slug) || ['kaiten-finance', 'kaiten-manufacturing', 'kaiten-retail'].includes(slug)) {
      return 'Отрасли и команды';
    }
    if (/^webinar-/.test(slug)) return 'Вебинары';
    if (/^(test-|sample-)/.test(slug) || ['test-kaiten', 'sample-kaiten'].includes(slug)) return 'Тестовые';
    return 'Продукт и фичи';
  };
  const grouped = GROUPS.map((group) => ({
    group,
    items: allLandings.filter(({ slug }) => groupOf(slug) === group),
  })).filter(({ items }) => items.length > 0);

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <header className="mb-8">
        <p className="text-xs uppercase tracking-wide text-(--color-text-secondary)">Контент-завод Кайтен</p>
        <h1 className="text-3xl font-semibold tracking-tight">LLM harness для лендингов</h1>
        <p className="mt-2 text-base text-(--color-text-secondary)">
          Маркетинг создаёт brief → harness собирает Kaiten-стайл лендинг → команда фронта мержит TSX.
        </p>
      </header>

      <section className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Link
          href="/new"
          className="group rounded-(--radius-2xl) border border-(--color-action-primary)/30 bg-(--color-action-primary-soft) p-6 transition hover:border-(--color-action-primary)"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-(--color-text-accent)">
                Как создать лендинг
              </h2>
              <p className="mt-1 text-sm text-(--color-text-secondary)">
                Открой claude / codex в терминале → кинь ТЗ → попроси сгенерить.
                Инструкция и готовые шаблоны промптов.
              </p>
            </div>
            <span aria-hidden className="text-2xl text-(--color-text-accent)">
              →
            </span>
          </div>
        </Link>

        <Link
          href="/catalog"
          className="group rounded-(--radius-2xl) border border-(--color-border-default) bg-(--color-surface-page) p-6 transition hover:border-(--color-action-primary)/50"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">Каталог блоков</h2>
              <p className="mt-1 text-sm text-(--color-text-secondary)">
                22 секции + 39 моков с живыми примерами. Всё прямо в браузере, без запуска
                Storybook.
              </p>
            </div>
            <span aria-hidden className="text-2xl">
              →
            </span>
          </div>
        </Link>

        <Link
          href="/pipeline"
          className="group rounded-(--radius-2xl) border border-(--color-border-default) bg-(--color-surface-page) p-6 transition hover:border-(--color-action-primary)/50"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">Как устроен конвейер</h2>
              <p className="mt-1 text-sm text-(--color-text-secondary)">
                Справочник по всем этапам: что на входе и выходе, правила и гейты, команды.
              </p>
            </div>
            <span aria-hidden className="text-2xl">
              →
            </span>
          </div>
        </Link>
      </section>

      <section>
        <div className="mb-3 flex items-end justify-between">
          <h2 className="text-xl font-medium">Существующие лендинги</h2>
          <span className="text-xs text-(--color-text-secondary)">{allLandings.length} шт.</span>
        </div>
        {allLandings.length === 0 ? (
          <p className="text-sm text-(--color-text-secondary)">
            Пока нет. Начните с <Link href="/new" className="underline">/new</Link>.
          </p>
        ) : (
          grouped.map(({ group, items }) => (
          <div key={group} className="mb-8">
            <div className="mb-2 flex items-end justify-between">
              <h3 className="text-sm font-semibold uppercase tracking-wide">
                {group}
              </h3>
              <span className="text-xs text-(--color-text-secondary)">{items.length} шт.</span>
            </div>
            <ul className="grid grid-cols-1 gap-2">
            {items.map(({ slug, title, design }) => (
              <li
                key={`${design ? 'design' : 'spec'}-${slug}`}
                className="flex items-center justify-between rounded-(--radius-lg) border border-(--color-border-default) bg-(--color-surface-page) px-4 py-3"
              >
                <span className="flex min-w-0 flex-col gap-0.5">
                  <code className="truncate text-sm font-medium">{slug}</code>
                  {title && (
                    <span className="truncate text-xs text-(--color-text-secondary)" title={title}>
                      {title}
                    </span>
                  )}
                </span>
                {design ? (
                  <div className="flex items-center gap-3 text-sm">
                    <a
                      href={`/design/${slug}/index.html`}
                      target="_blank"
                      rel="noreferrer"
                      className="font-medium text-(--color-text-accent) hover:underline"
                    >
                      preview
                    </a>
                    <span className="shrink-0 rounded-full bg-(--color-action-primary-soft) px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-(--color-text-accent)">
                      Design
                    </span>
                  </div>
                ) : (
                  <div className="flex gap-3 text-sm">
                    <Link
                      href={`/landings/${slug}`}
                      target="_blank"
                      rel="noreferrer"
                      className="font-medium text-(--color-text-accent) hover:underline"
                    >
                      preview
                    </Link>
                    <Link
                      href={`/edit/${slug}`}
                      className="text-(--color-text-secondary) hover:underline"
                    >
                      edit
                    </Link>
                    <Link
                      href={`/approve/${slug}`}
                      className="text-(--color-text-secondary) hover:underline"
                    >
                      approve
                    </Link>
                    <a
                      href={`/api/handoff/${slug}`}
                      download={`landing-${slug}.zip`}
                      className="text-emerald-700 hover:underline"
                      title="Скачать ZIP-архив для разработчика"
                    >
                      handoff ↓
                    </a>
                  </div>
                )}
              </li>
            ))}
            </ul>
          </div>
          ))
        )}
      </section>

      <footer className="mt-12 border-t border-(--color-border-default) pt-6 text-xs text-(--color-text-secondary)">
        <p>
          Документация для маркетинга — <code>wiki/marketing/getting-started.md</code> · Полная
          техническая — <code>README.md</code>.
        </p>
      </footer>
    </main>
  );
}
