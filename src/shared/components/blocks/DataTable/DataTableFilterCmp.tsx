import FilterIcon from '@/assets/icons/filter-icon';
import { Button } from '@/shared/components/ui/Button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/shared/components/ui/Popover/index';
import type { Dispatch, SetStateAction } from 'react';

export interface DataTableFilterCmpProps {
  maintContent: React.ReactNode;
  title?: string;
  isOpen?: boolean;
  isFiltering?: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export function DataTableFilterCmp({
  maintContent,
  title = 'Filter',
  isOpen = false,
  isFiltering = false,
  setIsOpen
}: DataTableFilterCmpProps) {
  return (
    <Popover onOpenChange={setIsOpen} open={isOpen}>
      <PopoverTrigger asChild>
        <Button
          leadingIcon={<FilterIcon isFilled={isFiltering} />}
          variant="outline"
        >
          Filter {isFiltering ? 'applied' : ''}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="h-fit w-80 flex-1 p-0">
        <div className="flex items-center justify-between border-b p-4">
          <h3 className="text-lg font-semibold">{title}</h3>
          <Button
            className="h-4 w-4"
            onClick={() => setIsOpen(false)}
            variant="ghost"
          >
            X
          </Button>
        </div>
        <div className="h-full space-y-6 overflow-hidden">{maintContent}</div>
      </PopoverContent>
    </Popover>
  );
}
