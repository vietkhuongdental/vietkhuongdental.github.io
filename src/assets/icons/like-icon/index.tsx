interface Props {
  isFilled?: boolean;
}

export function LikeIcon({ isFilled }: Props) {
  return isFilled ? <FilledLikeIcon /> : <UnfilledLikeIcon />;
}

function FilledLikeIcon() {
  return (
    <svg
      fill="none"
      height="22"
      viewBox="0 0 22 22"
      width="22"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M19.3914 18.4562C19.1662 19.9197 17.907 21 16.4262 21H3C1.89543 21 1 20.1046 1 19V12C1 10.8954 1.89543 10 3 10H5.35013C5.74532 10 6.10344 9.76727 6.26394 9.40614L9.78306 1.48812C9.91498 1.1913 10.2093 1 10.5342 1C11.896 1 13 2.10399 13 3.46584V7C13 7.55228 13.4477 8 14 8H17.5032C19.3418 8 20.7479 9.6389 20.4683 11.4562L19.3914 18.4562Z"
        fill="#E2E0F5"
      />
      <path
        d="M6 21V10M1 12V19C1 20.1046 1.89543 21 3 21H16.4262C17.907 21 19.1662 19.9197 19.3914 18.4562L20.4683 11.4562C20.7479 9.6389 19.3418 8 17.5032 8H14C13.4477 8 13 7.55228 13 7V3.46584C13 2.10399 11.896 1 10.5342 1C10.2093 1 9.91498 1.1913 9.78306 1.48812L6.26394 9.40614C6.10344 9.76727 5.74532 10 5.35013 10H3C1.89543 10 1 10.8954 1 12Z"
        stroke="#483FC0"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function UnfilledLikeIcon() {
  return (
    <svg
      fill="none"
      height="24"
      viewBox="0 0 24 24"
      width="24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g>
        <path
          d="M7 22V11M2 13V20C2 21.1046 2.89543 22 4 22H17.4262C18.907 22 20.1662 20.9197 20.3914 19.4562L21.4683 12.4562C21.7479 10.6389 20.3418 9 18.5032 9H15C14.4477 9 14 8.55228 14 8V4.46584C14 3.10399 12.896 2 11.5342 2C11.2093 2 10.915 2.1913 10.7831 2.48812L7.26394 10.4061C7.10344 10.7673 6.74532 11 6.35013 11H4C2.89543 11 2 11.8954 2 13Z"
          stroke="#95908C"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        />
      </g>
    </svg>
  );
}
