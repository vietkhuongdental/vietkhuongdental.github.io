import DateView from '@/shared/components/ui/Calendar/DateView';
import MonthView from '@/shared/components/ui/Calendar/MonthView';
import { cn } from '@/shared/libs/utils';
import type { Dispatch, SetStateAction } from 'react';
import { useState } from 'react';

export type ViewType = 'date' | 'month';

interface CalendarProps {
  selectedDate: Date | undefined;
  setSelectedDate: Dispatch<SetStateAction<Date | undefined>>;
  initDate?: Date;
  viewType?: ViewType;
  handleSelectDate: (date: Date) => void;
  className?: string;
  acceptRange?: { maxDate?: Date; minDate?: Date };
}

const Calendar = ({
  selectedDate,
  setSelectedDate,
  initDate = new Date(),
  handleSelectDate,
  className,
  viewType = 'date',
  acceptRange
}: CalendarProps) => {
  const [currentDate, setCurrentDate] = useState(initDate);
  const [view, setView] = useState<ViewType>(viewType);

  return (
    <div
      className={cn(
        'w-full max-w-sm rounded-lg bg-white p-3 shadow-lg',
        className
      )}
    >
      {view === 'date' && (
        <DateView
          acceptRange={acceptRange}
          currentDate={currentDate}
          onSelectDate={handleSelectDate}
          selectedDate={selectedDate}
          setCurrentDate={setCurrentDate}
          setSelectedDate={setSelectedDate}
        />
      )}

      {view === 'month' && (
        <MonthView
          currentDate={currentDate}
          selectedDate={selectedDate}
          setCurrentDate={setCurrentDate}
          setSelectedDate={setSelectedDate}
          setView={setView}
        />
      )}
    </div>
  );
};

export default Calendar;
