import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import './globals.css';

/**
 * Roboto — фирменный шрифт Kaiten (design-system V01). Подключается через
 * next/font: файлы самохостятся Next'ом, внешнего запроса в рантайме нет.
 * Подмножество cyrillic обязательно — весь копирайт лендингов на русском.
 * Переменная `--font-roboto` подхватывается токеном `--font-sans` (tokens.css).
 */
const roboto = Roboto({
  subsets: ['cyrillic', 'latin'],
  // 600 (SemiBold) обязателен: на нём стоят все заголовки DS (font-semibold).
  // Без него браузер синтезировал начертание из соседнего веса.
  weight: ['400', '500', '600', '700'],
  variable: '--font-roboto',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Контент-завод Кайтен — LLM harness for landings',
  description: 'Управляемый контур вокруг LLM для генерации SaaS-лендингов',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={roboto.variable} suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
