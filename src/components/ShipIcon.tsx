export default function ShipIcon({ size = 28 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      aria-label="AI Event Concierge"
    >
      <circle cx="50" cy="50" r="49" fill="#F79C6A" />
      <rect x="47.5" y="22" width="5" height="38" rx="2.5" fill="white" />
      <path d="M52.5,25 L77,59 L52.5,59 Z" fill="white" />
      <path d="M47.5,27 L25,57 L47.5,57 Z" fill="white" />
      <path d="M52.5,22 L65,16 L52.5,19.5 Z" fill="white" />
      <rect x="19" y="60" width="62" height="4" rx="2" fill="white" />
      <path d="M22,64 L78,64 L72,75 L28,75 Z" fill="white" />
    </svg>
  );
}
