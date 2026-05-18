interface Props {
  color?: string;
}

export function ErrorIcon({ color = '#AC0C22' }: Props) {
  return (
    <svg
      fill="none"
      height="20"
      viewBox="0 0 20 20"
      width="20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10.0001 6.66675V10.0001M10.0001 13.3334H10.0084M18.3334 10.0001C18.3334 14.6025 14.6025 18.3334 10.0001 18.3334C5.39771 18.3334 1.66675 14.6025 1.66675 10.0001C1.66675 5.39771 5.39771 1.66675 10.0001 1.66675C14.6025 1.66675 18.3334 5.39771 18.3334 10.0001Z"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}
