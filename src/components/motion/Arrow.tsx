/** The template's button arrow: on hover of the parent link (`.arrowHost`),
 *  one arrow slides out to the right as a second slides in from the left. */
export function Arrow({ className }: { className?: string }) {
  const path = <path d="M4 12h15M13 6l6 6-6 6" />;
  return (
    <span className={`arrow ${className ?? ""}`} aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        {path}
      </svg>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        {path}
      </svg>
    </span>
  );
}
