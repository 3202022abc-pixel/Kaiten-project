import { cn } from '../../primitives/cn';
import { DarkTerminal, ResultCard, TPrompt, TFlag, TNum, TOk } from './DarkTerminal';

/**
 * Локальные снимки и метрики Kaiten CLI: команда snapshot build один раз читает
 * пространство, а query metrics считает поток задач по снимку без обращений к
 * API. Терминал сверху, таблица результата по доскам снизу. Одна ось цвета —
 * «локально / без сети» (зелёный). Терминал — в едином стиле DarkTerminal.
 * Домен: cli-community-edition.
 */
export function CliSnapshotMetricsMock() {
  return (
    <div aria-hidden className="mx-auto w-full max-w-[600px] space-y-3">
      <DarkTerminal title="bash — кайтен@ваш-сервер">
        {/* сбор снимка */}
        <div className="ln">
          <TPrompt />
          <TFlag>--json</TFlag>
          <span>snapshot build</span>
          <TFlag>--name</TFlag>
          <TNum>team-q1</TNum>
          <TFlag>--preset</TFlag>
          <TNum>analytics</TNum>
        </div>
        <div className="ln ind">
          <TFlag>--window-start</TFlag>
          <span>2026-01-01</span>
          <TFlag>--window-end</TFlag>
          <span>2026-03-31</span>
        </div>
        <TOk>
          снимок team-q1 собран · <TNum>1</TNum> чтение из API
        </TOk>

        {/* расчёт метрик */}
        <div className="ln" style={{ marginTop: 10 }}>
          <TPrompt />
          <TFlag>--json</TFlag>
          <span>query metrics</span>
          <TFlag>--metric</TFlag>
          <TNum>throughput</TNum>
          <TFlag>--group-by</TFlag>
          <TNum>board_id</TNum>
        </div>
      </DarkTerminal>

      {/* результат: поток задач по доскам — бар-чарт (стиль CrmAnalyticsMock) */}
      <ResultCard>
        <div className="mb-3 flex items-center justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-(--color-text-secondary)">
            Поток задач за квартал · завершено
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-(--color-green-12) px-2 py-0.5 text-[10px] font-semibold text-green-700">
            <OfflineGlyph />
            без обращений к API
          </span>
        </div>

        <div className="space-y-2.5">
          {BOARDS.map((b) => (
            <MetricBar key={b.board} board={b.board} value={b.value} width={b.width} />
          ))}
        </div>
      </ResultCard>
    </div>
  );
}

const BOARDS = [
  { board: 'Разработка · спринты', value: 128, width: 'w-[60%]' },
  { board: 'Поддержка · заявки', value: 214, width: 'w-full' },
  { board: 'Инфраструктура', value: 57, width: 'w-[27%]' },
];

function MetricBar({ board, value, width }: { board: string; value: number; width: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-36 shrink-0 truncate text-[11.5px] font-medium text-(--color-text-primary)">
        {board}
      </span>
      <div className="relative h-5 flex-1 overflow-hidden rounded-md bg-(--color-neutral-200)">
        <div className={cn('h-full rounded-md bg-(--color-action-primary)', width)} />
      </div>
      <span className="w-9 shrink-0 text-right font-mono text-[12px] font-semibold text-(--color-text-primary) tabular-nums">
        {value}
      </span>
    </div>
  );
}

function OfflineGlyph() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" className="text-green-700">
      <path d="M4 4l16 16M8.8 8.9A9 9 0 003 12M12 20h.01M8.5 15.5a5 5 0 016.4-.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
