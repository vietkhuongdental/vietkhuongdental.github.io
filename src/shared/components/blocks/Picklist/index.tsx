import DropdownIcon from '@/shared/assets/icons/dropdown-icon/dropdown-icon.svg?react';
import { Input } from '@/shared/components/ui/Input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger
} from '@/shared/components/ui/Select';

export interface PicklistOption {
  [key: string]: string;
  value: string;
  label: string;
}

interface PicklistProps {
  options: PicklistOption[];
  value?: string;
  onSetValue?: (value: string) => void;
  placeholder?: string;
  className?: string;
  size?: 'lg' | 'md' | 'sm' | null;
  isDisabled?: boolean;
  isError?: boolean;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
}

export const Picklist = ({
  options,
  value,
  onSetValue,
  placeholder = 'Select an option',
  className,
  size = 'lg',
  isDisabled = false,
  isError = false,
  leadingIcon,
  trailingIcon = <DropdownIcon />
}: PicklistProps) => (
  <Select onValueChange={onSetValue} value={value}>
    <SelectTrigger asChild>
      <Input
        value={
          options.find((option) => option.value === value)?.label || undefined
        }
        className={className}
        inputSize={size}
        isDisabled={isDisabled}
        isError={isError}
        leadingIcon={leadingIcon}
        placeholder={placeholder}
        trailingIcon={trailingIcon}
        type="text"
        variant="default"
        readOnly
      />
    </SelectTrigger>
    <SelectContent className="text-neutral-colorText z-[2500] max-h-[240px] border bg-background-default shadow-lg">
      <SelectGroup>
        {options.map((option) => (
          <SelectItem
            className="focus:bg-transparent data-[highlighted]:bg-background-brand-primary-subtle data-[state=checked]:bg-background-brand-primary-hover data-[state=checked]:text-text-inverse"
            key={option.value}
            value={option.value}
          >
            <div className="flex w-full items-center justify-between">
              <span className={className}>{option.label}</span>
            </div>
          </SelectItem>
        ))}
      </SelectGroup>
    </SelectContent>
  </Select>
);
