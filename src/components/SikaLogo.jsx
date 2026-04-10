export function SikaLogo({ size = 32, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Background circle */}
      <circle cx="20" cy="20" r="19" fill="#1a1206" stroke="#f59e0b" strokeWidth="1.5" strokeOpacity="0.4" />

      {/* Gold coin base */}
      <circle cx="20" cy="22" r="9" fill="#f59e0b" fillOpacity="0.15" stroke="#f59e0b" strokeWidth="1" strokeOpacity="0.5" />

      {/* Pickaxe handle */}
      <line x1="24" y1="10" x2="16" y2="26" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />

      {/* Pickaxe head */}
      <path
        d="M21 12 L26 9 L28 13 L23 15 Z"
        fill="#f59e0b"
        fillOpacity="0.9"
      />
      {/* Pickaxe spike */}
      <path
        d="M14 25 L17 27 L15 29 L12 27 Z"
        fill="#fbbf24"
        fillOpacity="0.8"
      />

      {/* Coin "S" letterform */}
      <text
        x="20"
        y="26"
        textAnchor="middle"
        fontSize="11"
        fontWeight="bold"
        fontFamily="Georgia, serif"
        fill="#f59e0b"
        fillOpacity="0.9"
      >S</text>
    </svg>
  )
}

export function SikaBrand({ className = "" }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <SikaLogo size={28} />
      <span className="text-lg font-bold leading-none">
        <span className="text-gold-400">Sika</span>
        <span className="text-zinc-200">Track</span>
      </span>
    </div>
  )
}
