export function Logo({ className = "", color = "white" }: { className?: string; color?: string }) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="50" cy="50" r="20" stroke={color} strokeWidth="6"/>
      <ellipse 
        cx="50" 
        cy="50" 
        rx="45" 
        ry="15" 
        stroke={color} 
        strokeWidth="6" 
        transform="rotate(-30 50 50)"
      />
    </svg>
  )
}