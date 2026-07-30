import { cn } from '../../primitives/cn';
import { DarkTerminal, ResultCard, TPrompt, TFlag, TStr, TNum, TOk } from './DarkTerminal';

/**
 * Блок «Данные остаются у вас» лендинга Kaiten CLI: безопасный режим только для
 * чтения. Терминал показывает --read-only (чтение локально проходит, запись
 * блокируется), результат — карта-щит «Режим только для чтения · Активен» (щит
 * с замком взят из FeatureMocksV01, тайл «Роли и права доступа»).
 * Домен: cli-community-edition.
 */
export function CliSafeModeMock() {
  return (
    <div aria-hidden className="mx-auto w-full max-w-[600px] space-y-3">
      <DarkTerminal title="bash — кайтен@ваш-сервер">
        <div className="ln">
          <TPrompt />
          <span>export</span>
          <TStr>KAITEN_CLI_READ_ONLY=1</TStr>
        </div>
        <div className="ln">
          <TPrompt />
          <span>cards get</span>
          <TFlag>--card-id</TFlag>
          <TNum>128</TNum>
        </div>
        <TOk>
          прочитано локально · <TNum>0</TNum> запросов к API
        </TOk>
        <div className="ln">
          <TPrompt />
          <span>cards update</span>
          <TFlag>--card-id</TFlag>
          <TNum>128</TNum>
          <TFlag>--column</TFlag>
          <TStr>&quot;Готово&quot;</TStr>
        </div>
        <div className="ln" style={{ color: '#ff9a9a' }}>
          <span>✗ заблокировано: режим только для чтения</span>
        </div>
      </DarkTerminal>

      <ResultCard>
        <div className="flex items-center gap-4">
          <ShieldLock />
          <div className="min-w-0 flex-1">
            <div className="text-[14px] font-semibold text-(--color-text-primary)">
              Режим только для чтения
            </div>
            <div className="mt-0.5 text-[11.5px] text-(--color-text-secondary)">
              Запись заблокирована · данные на вашем диске
            </div>
          </div>
          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-(--color-green-12) px-2.5 py-1 text-[10px] font-semibold text-green-700">
            <span className="h-1.5 w-1.5 rounded-full bg-green-600" />
            Активен
          </span>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <StatusRow ok label="Чтение" value="разрешено" />
          <StatusRow label="Запись" value="заблокирована" />
        </div>
      </ResultCard>
    </div>
  );
}

/** Щит с замком — фиолетовый, из FeatureMocksV01 (тайл «Роли и права доступа»). */
function ShieldLock() {
  return (
    <svg width="52" height="59" viewBox="0 0 58 66" fill="none" className="shrink-0">
      <path d="M29 3 L54 13 V32 C54 49 43 60 29 64 C15 60 4 49 4 32 V13 Z" fill="#7d4ccf" />
      <rect x="20" y="31" width="18" height="15" rx="2.5" fill="#fff" />
      <path d="M23 31 V26 a6 6 0 0 1 12 0 V31" fill="none" stroke="#fff" strokeWidth="2.5" />
      <rect x="27.5" y="36.5" width="3" height="5" rx="1.5" fill="#7d4ccf" />
    </svg>
  );
}

function StatusRow({ ok, label, value }: { ok?: boolean; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 rounded-(--radius-lg) border border-[#ededed] bg-(--color-surface-card) px-3 py-2">
      <span
        className={cn(
          'inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full',
          ok ? 'bg-(--color-green-100) text-(--color-neutral-000)' : 'bg-(--color-neutral-200) text-(--color-text-secondary)',
        )}
      >
        {ok ? (
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4">
            <path d="M5 12l5 5L20 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
            <rect x="5" y="11" width="14" height="9" rx="2" />
            <path d="M8 11V8a4 4 0 0 1 8 0v3" strokeLinecap="round" />
          </svg>
        )}
      </span>
      <div className="min-w-0">
        <div className="text-[10.5px] text-(--color-text-secondary)">{label}</div>
        <div className="truncate text-[11.5px] font-medium text-(--color-text-primary)">{value}</div>
      </div>
    </div>
  );
}
