import { cn } from '@/shared/libs/utils';

interface RowProps {
  flex?: boolean;
  classes?: string;
  mode?: string;
  children: React.ReactNode;
}

const Row: React.FC<RowProps> = ({ flex, mode, classes, children }) => {
  const flexClassStyle =
    'flex w-full flex-col flex-wrap items-center justify-start md:flex-row';
  const gridClassStyle =
    'grid grid-cols-4 gap-6 sm:grid-cols-8 md:grid-cols-12';

  return (
    <div
      className={cn(
        {
          [flexClassStyle]: flex,
          [gridClassStyle]: !flex
        },
        mode,
        classes
      )}
    >
      {children}
    </div>
  );
};

export default Row;
