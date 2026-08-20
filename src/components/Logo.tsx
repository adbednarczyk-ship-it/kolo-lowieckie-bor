export function Logo({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      aria-hidden="true"
      fill="none"
    >
      <circle cx="32" cy="32" r="30" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M32 46V28M32 28c-2-8-8-14-14-16 3 5 4 10 3 14-4 1-8-1-11-5 4 8 10 12 16 13M32 28c2-8 8-14 14-16-3 5-4 10-3 14 4 1 8-1 11-5-4 8-10 12-16 13"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M26 48h12"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}
