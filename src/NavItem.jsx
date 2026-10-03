import { useState } from 'react';

export default function NavItem({ href = '#', children }) {
  const [cycle, setCycle] = useState(0);
  return (
    <a
      href={href}
      onMouseEnter={() => setCycle((c) => c + 1)}
      className="relative inline-block overflow-hidden text-sm font-medium text-white/64 transition-colors hover:text-white"
    >
      <span key={`o${cycle}`} className={`block ${cycle ? 'fly-out-up' : ''}`}>{children}</span>
      <span key={`i${cycle}`} aria-hidden className={`absolute inset-0 block translate-y-[150%] ${cycle ? 'fly-in-up' : ''}`}>{children}</span>
    </a>
  );
}
