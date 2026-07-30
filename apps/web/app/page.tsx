import Link from 'next/link';
import type { ReactNode } from 'react';
import { readdir, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

export const dynamic = 'force-dynamic';

function ActionIcon({ name }: { name: 'preview' | 'edit' | 'approve' | 'handoff' }) {
  const paths: Record<string, ReactNode> = {
    preview: (
      <>
        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
        <circle cx="12" cy="12" r="3" />
      </>
    ),
    edit: <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3Z" />,
    approve: <path d="M20 6 9 17l-5-5" />,
    handoff: (
      <>
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <path d="m7 10 5 5 5-5" />
        <path d="M12 15V3" />
      </>
    ),
  };
  return (
    <svg
      aria-hidden
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0"
    >
      {paths[name]}
    </svg>
  );
}

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

  const GROUPS = ['Кайтен для отраслей', 'Сравнение Кайтен с продуктом', 'Продукт и фичи', 'Вебинары', 'Тестовые'] as const;
  const groupOf = (slug: string): (typeof GROUPS)[number] => {
    if (/^kaiten-vs-/.test(slug) || ['kaiten-clickup', 'kaiten-wrike', 'kaiten-trello', 'kaiten-asana', 'kaiten-weeek', 'kaiten-evateam', 'kaiten-youtrack'].includes(slug)) {
      return 'Сравнение Кайтен с продуктом';
    }
    if (/^kaiten-dlya-/.test(slug) || ['kaiten-finance', 'kaiten-manufacturing', 'kaiten-retail'].includes(slug)) {
      return 'Кайтен для отраслей';
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
    <main className="mx-auto max-w-6xl px-6 py-12">
      <header className="mb-8">
        <p className="text-xs uppercase tracking-wide text-(--color-text-secondary)">Контент-завод Кайтен</p>
        <h1 className="text-3xl font-semibold tracking-tight">LLM harness для лендингов</h1>
        <p className="mt-2 text-base text-(--color-text-secondary)">
          Маркетинг создаёт brief → harness собирает Kaiten-стайл лендинг → команда фронта мержит TSX.
        </p>
      </header>

      <section className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
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
          <details key={group} open className="group mb-6 rounded-(--radius-2xl) bg-(--color-surface-section) p-4 sm:p-5">
            <summary className="flex cursor-pointer list-none items-center justify-between [&::-webkit-details-marker]:hidden">
              <span className="flex items-center gap-2">
                <svg
                  aria-hidden
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="-rotate-90 text-(--color-text-secondary) transition-transform group-open:rotate-0"
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
                <h3 className="text-sm font-semibold uppercase tracking-wide">
                  {group}
                </h3>
              </span>
              <span className="text-xs text-(--color-text-secondary)">{items.length} шт.</span>
            </summary>
            <ul className="mt-3 grid grid-cols-1 gap-2">
            {items.map(({ slug, title, design }) => (
              <li
                key={`${design ? 'design' : 'spec'}-${slug}`}
                className="flex items-center justify-between rounded-(--radius-lg) border border-transparent bg-(--color-surface-page) px-4 py-3 transition-colors hover:border-(--color-border-default)"
              >
                <span className="flex min-w-0 flex-col gap-0.5">
                  <span className="truncate text-sm font-medium">{slug}</span>
                  {title && (
                    <span className="truncate text-xs text-(--color-text-secondary)" title={title}>
                      {title}
                    </span>
                  )}
                </span>
                <div className="grid shrink-0 grid-cols-[78px_54px_78px_78px_64px] items-center text-xs">
                  {design ? (
                    <a
                      href={`/design/${slug}/index.html`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 justify-self-start text-(--color-neutral-500) transition-colors hover:text-(--color-text-primary) hover:underline"
                    >
                      <ActionIcon name="preview" />
                      preview
                    </a>
                  ) : (
                    <Link
                      href={`/landings/${slug}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 justify-self-start text-(--color-neutral-500) transition-colors hover:text-(--color-text-primary) hover:underline"
                    >
                      <ActionIcon name="preview" />
                      preview
                    </Link>
                  )}
                  {design ? (
                    <>
                      <span />
                      <span />
                      <span />
                    </>
                  ) : (
                    <>
                      <Link
                        href={`/edit/${slug}`}
                        className="inline-flex items-center gap-1.5 justify-self-start text-(--color-neutral-500) transition-colors hover:text-(--color-text-primary) hover:underline"
                      >
                        <ActionIcon name="edit" />
                        edit
                      </Link>
                      <Link
                        href={`/approve/${slug}`}
                        className="inline-flex items-center gap-1.5 justify-self-start text-(--color-neutral-500) transition-colors hover:text-(--color-text-primary) hover:underline"
                      >
                        <ActionIcon name="approve" />
                        approve
                      </Link>
                      <a
                        href={`/api/handoff/${slug}`}
                        download={`landing-${slug}.zip`}
                        className="inline-flex items-center gap-1.5 justify-self-start text-(--color-neutral-500) transition-colors hover:text-(--color-text-primary) hover:underline"
                        title="Скачать ZIP-архив для разработчика"
                      >
                        <ActionIcon name="handoff" />
                        handoff
                      </a>
                    </>
                  )}
                  {design ? (
                    <span className="justify-self-end rounded-full bg-(--color-action-primary-soft) px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-(--color-text-accent)">
                      Design
                    </span>
                  ) : (
                    <span />
                  )}
                </div>
              </li>
            ))}
            </ul>
          </details>
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
