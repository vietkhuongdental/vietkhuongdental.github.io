import ChevronLeftIcon from '@/shared/assets/icons/chevron-left-icon/chevron-left-icon.svg?react';
import ChevronRightIcon from '@/shared/assets/icons/chevron-right-icon/chevron-right-icon.svg?react';
import DropdownIcon from '@/shared/assets/icons/dropdown-icon/dropdown-icon.svg?react';
import { Button } from '@/shared/components/ui/Button';
import type { ViewType } from '@/shared/components/ui/Calendar';
import {
  generateYearOptions,
  months
} from '@/shared/components/ui/Calendar/helpers';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/shared/components/ui/DropdownMenu';
import { type Dispatch, type SetStateAction } from 'react';

interface Props {
  selectedDate: Date | undefined;
  currentDate: Date;
  setSelectedDate: Dispatch<SetStateAction<Date | undefined>>;
  setCurrentDate: Dispatch<SetStateAction<Date>>;
  setView: Dispatch<SetStateAction<ViewType>>;
}

const MonthView = ({
  selectedDate,
  currentDate,
  setSelectedDate,
  setCurrentDate,
  setView
}: Props) => {
  const handlePrevious = () => {
    const newDate = new Date(currentDate);
    newDate.setFullYear(newDate.getFullYear() - 1);
    setCurrentDate(newDate);
  };

  const handleMonthSelect = (monthIndex: number) => {
    const newDate = new Date(
      currentDate.getFullYear(),
      monthIndex,
      selectedDate?.getDate()
    );
    setCurrentDate(newDate);
    setSelectedDate(newDate);
    setView('date');
  };

  const handleSelectYear = (year: number) => {
    const newDate = new Date(currentDate);
    newDate.setFullYear(year);
    setCurrentDate(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(currentDate);
    newDate.setFullYear(newDate.getFullYear() + 1);
    setCurrentDate(newDate);
  };

  return (
    <div className="space-y-4">
      {/* Header with navigation */}
      <div className="flex items-center justify-between">
        <Button
          className="h-8 w-8 rounded-full hover:bg-button-primary-bg-hover/25"
          onClick={handlePrevious}
          size="sm"
          variant="ghost"
        >
          <ChevronLeftIcon />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              className="text-icon-brand-primary"
              trailingIcon={<DropdownIcon />}
              variant="ghost"
            >
              {currentDate.getFullYear()}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {generateYearOptions(currentDate).map((year) => (
              <DropdownMenuItem
                key={year}
                onClick={() => handleSelectYear(year)}
                // className={isCurrrent}
              >
                {year}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          className="h-8 w-8 rounded-full hover:bg-button-primary-bg-hover/25"
          onClick={handleNext}
          size="sm"
          variant="ghost"
        >
          <ChevronRightIcon />
        </Button>
      </div>

      {/* Months grid */}
      <div className="grid grid-cols-3 gap-3">
        {months.map((month, index) => (
          <Button
            className="h-12 cursor-pointer rounded-lg text-sm font-normal text-text-default hover:bg-background-brand-primary-hover hover:text-text-inverse"
            key={month}
            onClick={() => handleMonthSelect(index)}
            variant="ghost"
          >
            {month}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default MonthView;
