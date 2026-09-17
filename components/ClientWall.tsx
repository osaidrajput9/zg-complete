/* Client wall — typographic chips, no logos. Hover brightens.
   Publication permission for these names is granted in the PRD. */

export default function ClientWall({
  names,
  note,
}: {
  names: string[];
  note?: string;
}) {
  return (
    <div data-lift-group>
      <ul className="flex flex-wrap gap-2">
        {names.map((name) => (
          <li
            key={name}
            data-lift
            className="rounded-surface border border-line px-4 py-3 text-[0.9375rem] tracking-[-0.005em] text-mist transition-colors duration-[var(--hover-duration)] ease-[var(--hover-ease)] hover:border-line-strong hover:bg-fill-hover hover:text-cream"
          >
            {name}
          </li>
        ))}
      </ul>
      {note && (
        <p className="type-mono mt-8 text-steel" data-lift>
          {note}
        </p>
      )}
    </div>
  );
}
