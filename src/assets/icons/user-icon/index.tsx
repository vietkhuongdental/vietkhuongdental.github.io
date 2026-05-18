interface Props {
  isFilled?: boolean;
}

export function UserIcon({ isFilled = false }: Props) {
  return isFilled ? <FilledUser /> : <UnfilledUser />;
}

function FilledUser() {
  return (
    <svg
      fill="none"
      height="20"
      viewBox="0 0 18 20"
      width="18"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M17 19C17 17.6044 17 16.9067 16.8278 16.3389C16.44 15.0605 15.4395 14.06 14.1611 13.6722C13.5933 13.5 12.8956 13.5 11.5 13.5H6.5C5.10444 13.5 4.40665 13.5 3.83886 13.6722C2.56045 14.06 1.56004 15.0605 1.17224 16.3389C1 16.9067 1 17.6044 1 19M13.5 5.5C13.5 7.98528 11.4853 10 9 10C6.51472 10 4.5 7.98528 4.5 5.5C4.5 3.01472 6.51472 1 9 1C11.4853 1 13.5 3.01472 13.5 5.5Z"
        stroke="#E56200"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function UnfilledUser() {
  return (
    <svg
      fill="none"
      height="20"
      viewBox="0 0 18 20"
      width="18"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M17 19C17 17.6044 17 16.9067 16.8278 16.3389C16.44 15.0605 15.4395 14.06 14.1611 13.6722C13.5933 13.5 12.8956 13.5 11.5 13.5H6.5C5.10444 13.5 4.40665 13.5 3.83886 13.6722C2.56045 14.06 1.56004 15.0605 1.17224 16.3389C1 16.9067 1 17.6044 1 19M13.5 5.5C13.5 7.98528 11.4853 10 9 10C6.51472 10 4.5 7.98528 4.5 5.5C4.5 3.01472 6.51472 1 9 1C11.4853 1 13.5 3.01472 13.5 5.5Z"
        stroke="#140900"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}
