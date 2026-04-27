interface Props {
  width?: number | string
  height?: number | string
  className?: string
}

export function Printer3DIcon({ width = "100%", height = "100%", className }: Props) {
  return (
    <svg
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      className={className}
    >
      <rect x="28" y="30" width="10" height="110" rx="5" fill="#1A8FE3" opacity="0.9"/>
      <rect x="162" y="30" width="10" height="110" rx="5" fill="#1A8FE3" opacity="0.9"/>
      <rect x="24" y="26" width="152" height="14" rx="7" fill="#1A8FE3"/>
      <rect x="24" y="138" width="152" height="12" rx="6" fill="#1A8FE3"/>
      <rect x="32" y="140" width="136" height="4" rx="2" fill="white" opacity="0.15"/>
      <rect x="32" y="68" width="136" height="8" rx="4" fill="#2B2D35"/>
      <rect x="82" y="58" width="36" height="28" rx="6" fill="#2B2D35"/>
      <rect x="86" y="62" width="14" height="6" rx="3" fill="white" opacity="0.15"/>
      <polygon points="95,86 105,86 100,100" fill="#F5821F"/>
      <circle cx="100" cy="102" r="3" fill="#F5821F" opacity="0.8"/>
      <rect x="68" y="116" width="64" height="6" rx="2" fill="#F5821F" opacity="0.5"/>
      <rect x="70" y="110" width="60" height="6" rx="2" fill="#F5821F" opacity="0.65"/>
      <rect x="72" y="104" width="56" height="6" rx="2" fill="#F5821F" opacity="0.8"/>
      <rect x="74" y="98"  width="52" height="6" rx="2" fill="#F5821F"/>
      <circle cx="158" cy="46" r="14" fill="none" stroke="#1A8FE3" strokeWidth="4" opacity="0.5"/>
      <circle cx="158" cy="46" r="6" fill="#1A8FE3" opacity="0.4"/>
      <circle cx="100" cy="58" r="2.5" fill="#F5821F" opacity="0.7"/>
      <circle cx="92"  cy="54" r="1.5" fill="#1A8FE3" opacity="0.6"/>
      <circle cx="108" cy="54" r="1.5" fill="#F5821F" opacity="0.6"/>
    </svg>
  )
}
