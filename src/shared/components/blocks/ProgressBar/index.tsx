import { useEffect, useMemo, useState } from 'react';

interface ProgressBarProps {
  current: number;
  goal: number;
}

export const ProgressBar = ({ current, goal }: ProgressBarProps) => {
  const percentage = useMemo(
    () => Math.min(Math.max((current / goal) * 100, 0), 100),
    [current, goal]
  );

  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (percentage === 100) {
      setTimeout(() => {
        setIsSuccess(true);
      }, 1000);
    }
  }, [percentage]);

  if (isSuccess) return null;
  return (
    <div className="flex w-full flex-col gap-2">
      <div className="relative w-full overflow-visible">
        {/* Bar background */}
        <div className="h-1 w-full rounded-full bg-background-inactive" />

        {/* Progress fill */}
        <div
          style={{
            width: `${percentage}%`,
            transitionDuration: `${goal > 100000000 && percentage !== 100 ? '10s' : '1s'}`
          }}
          className="absolute left-0 top-0 h-1 rounded-full bg-background-brand-primary transition-all ease-in-out"
        />
      </div>
    </div>
  );
};
