interface Props {
  className?: string;
  strokeColor?: string;
}

export function GenderIcon({ className = '', strokeColor = '#000000' }: Props) {
  return (
    <div className={className}>
      <svg
        fill="none"
        height="36"
        viewBox="0 0 37 36"
        width="37"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M18.3334 22C21.6471 22 24.3334 19.3137 24.3334 16C24.3334 12.6863 21.6471 10 18.3334 10C15.0197 10 12.3334 12.6863 12.3334 16C12.3334 19.3137 15.0197 22 18.3334 22ZM18.3334 22V29M22.8217 11.5858L26.4074 8M23.3334 7L27.3334 7V11M15.3334 26L21.3334 26"
          stroke={strokeColor}
          strokeLinecap="round"
          strokeWidth="2"
        />
      </svg>
    </div>
  );
}
