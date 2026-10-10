export default function BookmarkIcon({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size * 1.25} viewBox="0 0 12 15" aria-hidden>
      <path d="M1.5 0h9A1.5 1.5 0 0 1 12 1.5V15l-6-3.6L0 15V1.5A1.5 1.5 0 0 1 1.5 0Z" fill="currentColor" />
    </svg>
  );
}
