interface Props {
  className?: string;
  strokeColor?: string;
}

export function LocationIcon({
  className = '',
  strokeColor = '#000000'
}: Props) {
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
          d="M18.6667 19C20.3236 19 21.6667 17.6569 21.6667 16C21.6667 14.3431 20.3236 13 18.6667 13C17.0099 13 15.6667 14.3431 15.6667 16C15.6667 17.6569 17.0099 19 18.6667 19Z"
          stroke={strokeColor}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        />
        <path
          d="M18.6667 28C22.6667 24 26.6667 20.4183 26.6667 16C26.6667 11.5817 23.085 8 18.6667 8C14.2485 8 10.6667 11.5817 10.6667 16C10.6667 20.4183 14.6667 24 18.6667 28Z"
          stroke={strokeColor}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        />
      </svg>
    </div>
  );
}
