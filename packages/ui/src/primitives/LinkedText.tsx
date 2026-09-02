/**
 * LinkedText — фирменная фиолетовая ссылка внутри обычного абзаца.
 *
 * Общий помощник для секций, где часть описания ведёт наружу (`MediaCopy`).
 * Работает как `AccentText`, только вместо цветного span рендерит `<a>`.
 *
 * Поиск подстроки устойчив к неразрывным пробелам: типографский трансформер
 * (`ruNbsp`) подставляет   уже на рендере, поэтому в спеке текст ссылки
 * пишется обычными пробелами.
 *
 * Если ссылка не задана или её текст не найден — рендерится обычный текст.
 */
export function LinkedText({
  text,
  link,
}: {
  text: string;
  link?: { text: string; href: string };
}) {
  if (!link) return <>{text}</>;

  const plain = (s: string) => s.replace(/ /g, ' ');
  const at = plain(text).indexOf(plain(link.text));
  if (at < 0) return <>{text}</>;

  return (
    <>
      {text.slice(0, at)}
      <a
        href={link.href}
        className="text-(--color-text-accent) underline decoration-(--color-text-accent)/30 underline-offset-2 transition-colors hover:decoration-(--color-text-accent)"
      >
        {text.slice(at, at + link.text.length)}
      </a>
      {text.slice(at + link.text.length)}
    </>
  );
}
