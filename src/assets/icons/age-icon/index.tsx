interface Props {
  className?: string;
  strokeColor?: string;
}

export function AgeIcon({ className = '', strokeColor = '#000000' }: Props) {
  return (
    <div className={className}>
      <svg
        fill="none"
        height="36"
        viewBox="0 0 36 36"
        width="36"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M10.3807 28.7109H14.5229V23.188C15.2854 23.188 15.9037 22.5698 15.9037 21.8073V19.0458C15.9037 17.1394 14.3582 15.594 12.4518 15.594C10.5454 15.594 9 17.1394 9 19.0458V21.8073C9 22.5698 9.61823 23.188 10.3807 23.188V28.7109Z"
          stroke={strokeColor}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeMiterlimit="10"
          strokeWidth="2"
        />
        <path
          d="M21.1881 28.7109H25.3303V21.1169C25.6965 21.1169 26.0476 20.9712 26.3064 20.7124C26.5657 20.4535 26.711 20.1021 26.711 19.7362V14.9037C26.711 12.9972 25.1656 11.4518 23.2592 11.4518C21.3527 11.4518 19.8074 12.9972 19.8074 14.9037V19.7362C19.8074 20.1021 19.9527 20.4535 20.2119 20.7124C20.4708 20.9712 20.8219 21.1169 21.1881 21.1169V28.7109Z"
          stroke={strokeColor}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeMiterlimit="10"
          strokeWidth="2"
        />
        <path
          d="M12.4518 12.1419C13.4045 12.1419 14.1777 12.9152 14.1777 13.8679C14.1777 14.8202 13.4045 15.5938 12.4518 15.5938C11.4991 15.5938 10.7258 14.8202 10.7258 13.8679C10.7258 12.9152 11.4991 12.1419 12.4518 12.1419Z"
          stroke={strokeColor}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeMiterlimit="10"
          strokeWidth="2"
        />
        <path
          d="M23.2591 7.99985C24.2118 7.99985 24.9851 8.77307 24.9851 9.72578C24.9851 10.6781 24.2118 11.4517 23.2591 11.4517C22.3064 11.4517 21.5332 10.6781 21.5332 9.72578C21.5332 8.77307 22.3064 7.99985 23.2591 7.99985Z"
          stroke={strokeColor}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeMiterlimit="10"
          strokeWidth="2"
        />
      </svg>
    </div>
  );
}
