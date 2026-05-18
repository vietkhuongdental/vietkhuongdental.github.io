interface Props {
  isFilled?: boolean;
  className?: string;
}

export function HealthRecordDetailIcon({
  isFilled = false,
  className = ''
}: Props) {
  return isFilled ? (
    <div className={className}>
      <FilledHealthRecordDetail />
    </div>
  ) : (
    <div className={className}>
      <UnfilledHealthRecordDetail />
    </div>
  );
}

function FilledHealthRecordDetail() {
  return (
    <svg
      fill="none"
      height="100%"
      viewBox="0 0 42 52"
      width="100%"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M26 23.5H11M16 33.5H11M31 13.5H11M41 13V39C41 43.2004 41 45.3006 40.1825 46.9049C39.4635 48.3161 38.3161 49.4635 36.9049 50.1825C35.3006 51 33.2004 51 29 51H13C8.79961 51 6.69941 51 5.09507 50.1825C3.68386 49.4635 2.5365 48.3161 1.81745 46.9049C1 45.3006 1 43.2004 1 39V13C1 8.79961 1 6.69941 1.81745 5.09507C2.5365 3.68386 3.68386 2.5365 5.09507 1.81745C6.69941 1 8.79961 1 13 1H29C33.2004 1 35.3006 1 36.9049 1.81745C38.3161 2.5365 39.4635 3.68386 40.1825 5.09507C41 6.69941 41 8.79961 41 13Z"
        stroke="#E56200"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="3"
      />
    </svg>
  );
}

function UnfilledHealthRecordDetail() {
  return (
    <svg
      fill="none"
      height="100%"
      viewBox="0 0 42 52"
      width="100%"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M26 23.5H11M16 33.5H11M31 13.5H11M41 13V39C41 43.2004 41 45.3006 40.1825 46.9049C39.4635 48.3161 38.3161 49.4635 36.9049 50.1825C35.3006 51 33.2004 51 29 51H13C8.79961 51 6.69941 51 5.09507 50.1825C3.68386 49.4635 2.5365 48.3161 1.81745 46.9049C1 45.3006 1 43.2004 1 39V13C1 8.79961 1 6.69941 1.81745 5.09507C2.5365 3.68386 3.68386 2.5365 5.09507 1.81745C6.69941 1 8.79961 1 13 1H29C33.2004 1 35.3006 1 36.9049 1.81745C38.3161 2.5365 39.4635 3.68386 40.1825 5.09507C41 6.69941 41 8.79961 41 13Z"
        stroke="#140900"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="5"
      />
    </svg>
  );
}
