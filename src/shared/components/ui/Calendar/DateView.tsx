// import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import ChevronLeftIcon from '@/shared/assets/icons/chevron-left-icon/chevron-left-icon.svg?react';
import ChevronRightIcon from '@/shared/assets/icons/chevron-right-icon/chevron-right-icon.svg?react';
import DropdownIcon from '@/shared/assets/icons/dropdown-icon/dropdown-icon.svg?react';
import { Button } from '@/shared/components/ui/Button';
import {
  generateCalendarDays,
  generateYearOptions,
  months,
  weekDays
} from '@/shared/components/ui/Calendar/helpers';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/shared/components/ui/DropdownMenu';
import { cn } from '@/shared/libs/utils';
import type { Dispatch, SetStateAction } from 'react';
import { useCallback, useMemo } from 'react';

interface Props {
  selectedDate: Date | undefined;
  currentDate: Date;
  acceptRange?: { maxDate?: Date; minDate?: Date };
  setSelectedDate: Dispatch<SetStateAction<Date | undefined>>;
  setCurrentDate: Dispatch<SetStateAction<Date>>;
  onSelectDate: (date: Date) => number | void;
}

const DateView = ({
  selectedDate,
  currentDate,
  acceptRange,
  setSelectedDate,
  setCurrentDate,
  onSelectDate
}: Props) => {
  const calendarDays = useMemo(
    () => generateCalendarDays(currentDate),
    [currentDate]
  );

  const handleDateSelect = useCallback(
    (day: Date) => {
      setSelectedDate(day);
      onSelectDate(day);
    },
    [currentDate]
  );

  const handlePrevious = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setCurrentDate(newDate);
  };

  const isDaySelected = useCallback(
    (day: Date) =>
      day.getDate() === selectedDate?.getDate() &&
      day.getMonth() === selectedDate?.getMonth() &&
      day.getFullYear() === selectedDate?.getFullYear(),
    [selectedDate]
  );

  const handleYearChange = (year: number) => {
    const newDate = new Date(currentDate);
    newDate.setFullYear(year);
    setCurrentDate(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setCurrentDate(newDate);
  };

  return (
    <div className="gap-2">
      {/* Header with navigation */}
      <div className="flex items-center justify-between">
        <Button
          className="h-8 w-8 rounded-full p-1 hover:bg-button-primary-bg-hover/25"
          onClick={handlePrevious}
          size="sm"
          variant="ghost"
        >
          <ChevronLeftIcon />
        </Button>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                className="text-icon-brand-primary"
                trailingIcon={<DropdownIcon />}
                variant="ghost"
              >
                {months[currentDate.getMonth()]}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="z-[2500]">
              {months.map((month, index) => (
                <DropdownMenuItem
                  onClick={() => {
                    const newDate = new Date(currentDate);
                    newDate.setMonth(index);
                    setCurrentDate(newDate);
                  }}
                  key={month}
                >
                  <span className="h-full w-full">{month}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button trailingIcon={<DropdownIcon />} variant="ghost">
                <span className="font-normal text-text-description">
                  {currentDate.getFullYear()}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="z-[2500]">
              {generateYearOptions(new Date()).map((year) => (
                <DropdownMenuItem
                  isSelected={year === currentDate.getFullYear()}
                  key={year}
                  onClick={() => handleYearChange(year)}
                >
                  {year}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Button
          className="h-8 w-8 rounded-full p-1 hover:bg-button-primary-bg-hover/25"
          onClick={handleNext}
          size="sm"
          variant="ghost"
        >
          <ChevronRightIcon />
        </Button>
      </div>

      {/* Calendar grid */}
      <div className="gap-2">
        {/* Week days header */}
        <div className="grid grid-cols-7">
          {weekDays.map((day) => (
            <div
              className="text-center text-xs font-bold text-text-default"
              key={day}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7">
          {calendarDays.map((day, index) => (
            <Button
              className={cn(
                'h-10 w-10 cursor-pointer rounded-full p-0 text-sm font-normal text-text-default hover:bg-background-brand-primary-hover hover:text-text-inverse',
                !day.isCurrentMonth && 'text-text-disable',
                day.isCurrentMonth && '',
                day.isToday && 'bg-background-alt',
                isDaySelected(day.fullDate) &&
                  'bg-background-brand-primary text-text-inverse'
              )}
              isDisabled={
                (acceptRange?.maxDate && day.fullDate > acceptRange?.maxDate) ||
                (acceptRange?.minDate && day.fullDate < acceptRange?.minDate)
              }
              key={index}
              onClick={() => handleDateSelect(day.fullDate)}
              variant="ghost"
            >
              <span className="font-normal">{day.date}</span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DateView;
