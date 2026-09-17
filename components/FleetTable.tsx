/**
 * Fleet table — category, types, what it carries, and how many.
 *
 * A real table, because this is tabular data with headers and a screen
 * reader should be able to navigate it as one. Four columns do not fit
 * legibly at 390px, so the table scrolls inside its own container rather
 * than pushing the page sideways; the container is focusable so the
 * scroll is reachable from the keyboard.
 *
 * Per-type unit counts are an open question in the PRD — only the
 * stainless steel row is confirmed. The rest say so rather than guessing.
 */

export type FleetRow = {
  category: string;
  types: string;
  carries: string;
  /** Confirmed count, or null where the client has not supplied one. */
  units: string | null;
  href?: string;
};

export default function FleetTable({ rows }: { rows: FleetRow[] }) {
  return (
    <>
      {/* Where the table has to scroll, say so. A cut-off column is a
          weak hint on its own. */}
      <p className="type-mono mb-4 text-steel lg:hidden">Scroll the table sideways</p>

      <div
        tabIndex={0}
        role="region"
        aria-label="Fleet by vehicle category"
        className="-mx-[var(--gutter)] overflow-x-auto px-[var(--gutter)] lg:mx-0 lg:px-0"
      >
        <table className="w-full min-w-[720px] border-collapse text-left">
        <caption className="sr-only">
          Vehicle categories, the configurations in each, what they carry, and
          the number of units where confirmed.
        </caption>
        <thead>
          <tr className="border-b border-line-strong">
            <th scope="col" className="type-mono pb-4 pr-6 font-medium text-steel">
              Category
            </th>
            <th scope="col" className="type-mono pb-4 pr-6 font-medium text-steel">
              Types
            </th>
            <th scope="col" className="type-mono pb-4 pr-6 font-medium text-steel">
              Carries
            </th>
            <th scope="col" className="type-mono pb-4 font-medium text-steel">
              Units
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.category} className="border-b border-line align-top" data-lift>
              <th scope="row" className="py-6 pr-6 font-normal">
                {row.href ? (
                  <a
                    href={row.href}
                    className="type-h3 text-cream transition-colors duration-[var(--hover-duration)] ease-[var(--hover-ease)] hover:text-mist"
                  >
                    {row.category}
                  </a>
                ) : (
                  <span className="type-h3 text-cream">{row.category}</span>
                )}
              </th>
              <td className="py-6 pr-6 text-[0.9375rem] text-mist">{row.types}</td>
              <td className="py-6 pr-6 text-[0.9375rem] text-mist">{row.carries}</td>
              <td className="py-6 text-[0.9375rem]">
                {row.units ? (
                  <span className="text-cream tabular-nums">{row.units}</span>
                ) : (
                  <span className="type-mono text-steel">To be confirmed</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
        </table>
      </div>
    </>
  );
}
