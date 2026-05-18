import Calendar from '@/shared/components/ui/Calendar';
import type { inputVariants } from '@/shared/components/ui/Input';
import { Input } from '@/shared/components/ui/Input';
import {
  Popover,
  PopoverContent,
  PopoverPortal,
  PopoverTrigger
} from '@/shared/components/ui/Popover/index';
import { formattedDate } from '@/shared/libs/utils';
import type { VariantProps } from 'class-variance-authority';
import { CalendarIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

interface DatePickerInputProps {
  date?: Date;
  setDate?: (date: string) => void;
  placeholder?: string;
  className?: string;
  size?: 'lg' | 'md' | 'sm';
  variant?: VariantProps<typeof inputVariants>['variant'];
  isDisabled?: boolean;
  isError?: boolean;
  isWarning?: boolean;
  leadingIcon?: React.ReactNode;
  acceptRange?: { maxDate?: Date; minDate?: Date };
}

export function DatePickerInput({
  date,
  setDate,
  placeholder = 'Select date',
  isDisabled = false,
  isError = false,
  isWarning = false,
  variant,
  size = 'lg',
  className,
  leadingIcon,
  acceptRange
}: DatePickerInputProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(date);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setSelectedDate(date ? new Date(date) : undefined);
  }, [date]);

  const handleSelectDate = (date: Date) => {
    setSelectedDate(date);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    const localDate = `${year}-${month}-${day}`;

    setDate?.(localDate);
    setOpen(false);
  };

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger asChild>
        <Input
          className={className}
          inputSize={size}
          isDisabled={isDisabled}
          isError={isError}
          isWarning={isWarning}
          leadingIcon={leadingIcon}
          onChange={() => {}}
          placeholder={placeholder}
          trailingIcon={<CalendarIcon />}
          type="text"
          value={date ? formattedDate(date.toString()) : ''}
          variant={variant}
        />
      </PopoverTrigger>
      <PopoverPortal>
        <PopoverContent align="start" className="z-[2000] w-[340px] p-0">
          <Calendar
            acceptRange={acceptRange}
            handleSelectDate={handleSelectDate}
            initDate={selectedDate || new Date()}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
          />
        </PopoverContent>
      </PopoverPortal>
    </Popover>
  );
}
