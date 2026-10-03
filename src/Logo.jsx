export default function Logo({ size = 28 }) {
  return (
    <svg width={size * 2.4} height={size} viewBox="0 0 96 40" fill="none" aria-label="WISA">
      <path d="M2 6l8 28 8-18 8 18 8-28" stroke="#fff" strokeWidth="3.5" strokeLinejoin="round" strokeLinecap="round" />
      <path d="M44 6v28M54 12c0-4 14-4 14 0s-14 8-14 12 14 4 14 0" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M72 34L84 6l10 28M76 24h14" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
