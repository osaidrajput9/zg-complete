/**
 * One glyph set, drawn on a 16px grid at a single optical weight.
 * DESIGN.md is explicit that icon styles are never mixed on a screen, so
 * every icon on the site comes from here and nothing sets its own stroke.
 */

const STROKE = 1.5;

type IconProps = { className?: string; size?: number };

function Svg({ size = 16, className, children }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 16 16"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={STROKE}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      {children}
    </svg>
  );
}

export function ChevronDown(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M4 6.5 8 10.5 12 6.5" />
    </Svg>
  );
}

export function Phone(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M5.2 1.8 6.6 4.6 5.3 6a9.4 9.4 0 0 0 4.7 4.7l1.4-1.3 2.8 1.4v2.4c0 .5-.4.9-.9.8A12.6 12.6 0 0 1 1.9 2.9c0-.5.3-.9.8-.9h2.5Z" />
    </Svg>
  );
}

export function Check(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M2.5 8.4 6.1 12 13.5 4.6" />
    </Svg>
  );
}

export function Menu(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M2.5 5.5h11M2.5 10.5h11" />
    </Svg>
  );
}

export function Close(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M4 4l8 8M12 4l-8 8" />
    </Svg>
  );
}

export function ArrowRight(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M2.5 8h11M9.5 4l4 4-4 4" />
    </Svg>
  );
}
