/* eslint-disable no-nested-ternary */
import CloseIcon from '@/assets/icons/close-icon';
import { SearchIcon } from '@/assets/icons/search-icon';
import type { PicklistOption } from '@/shared/components/blocks/Picklist';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';

export interface MultiPicklistProps {
  options: PicklistOption[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  allowLazyLoad?: boolean;
  loading?: boolean;
  renderOption?: (option: PicklistOption) => React.ReactNode;
  className?: string;
  fetchNextPage?: () => void;
  onSetInputSearch?: (input: string) => void;
  isSearching?: boolean;
}

export function MultiPicklist({
  options,
  value,
  onChange,
  placeholder = 'Search by name',
  allowLazyLoad = false,
  loading = false,
  renderOption,
  className = '',
  fetchNextPage,
  onSetInputSearch,
  isSearching
}: MultiPicklistProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { ref, inView } = useInView();

  // Get selected options for display
  const selectedOptions = options.filter((option) =>
    value.includes(option.value)
  );

  useEffect(() => {
    if (inView) {
      fetchNextPage && fetchNextPage();
    }
  }, [inView]);

  useEffect(() => {
    onSetInputSearch?.(searchTerm);
  }, [searchTerm]);

  // Handle clicking outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm('');
        setFocusedIndex(-1);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle option selection
  const handleOptionSelect = (optionValue: string) => {
    const newValue = value.includes(optionValue)
      ? value.filter((v) => v !== optionValue)
      : [...value, optionValue];
    onChange(newValue);
  };

  // Handle removing selected option
  const handleRemoveOption = (optionValue: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(value.filter((v) => v !== optionValue));
  };

  // Default option renderer
  const defaultRenderOption = (option: PicklistOption) => (
    <div className="group flex w-full flex-row items-center justify-between rounded-md p-2 hover:bg-background-default-hover">
      <div className="flex flex-col gap-1">
        <div className="text-md font-normal text-text-default">
          {option.label}
        </div>
        {option.description ? (
          <div className="text-sm font-normal text-text-description">
            {option.description}
          </div>
        ) : null}
      </div>
    </div>
  );

  return (
    <div
      className={`relative ${className} flex flex-col gap-0`}
      ref={containerRef}
    >
      {/* Main input area */}
      <div
        onClick={() => {
          inputRef.current?.focus();
        }}
        className="flex w-full items-center rounded-lg bg-background-default"
      >
        {/* Search input */}
        <Input
          onChange={(e) => {
            setIsOpen(true);
            setSearchTerm(e.target.value);

            if (!e.target.value) {
              setIsOpen(false);
            }
          }}
          className="w-full placeholder:text-text-placeholder"
          leadingIcon={<SearchIcon />}
          placeholder={placeholder}
          ref={inputRef}
          value={searchTerm}
        />
      </div>

      {/* Selected tags */}
      {selectedOptions.length !== 0 ? (
        <div
          className="flex flex-wrap items-center gap-2 p-2"
          style={{ backgroundColor: 'transparent' }}
        >
          {selectedOptions.map((option) => (
            <div
              className="inline-flex w-fit items-center rounded-lg border bg-background-subtle px-2 py-1 hover:bg-background-default-hover"
              key={option.value}
              title={option.label}
            >
              <span className="w-fit text-sm">
                {option.label.slice(0, 30)}
                {option.label.length > 30 && <>...</>}
              </span>
              <Button
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={(e) => handleRemoveOption(option.value, e)}
                size="sm"
                variant="ghost"
              >
                <CloseIcon />
              </Button>
            </div>
          ))}
        </div>
      ) : null}

      {/* Dropdown */}
      {isOpen ? (
        <div>
          <div
            className="absolute z-50 max-h-[300px] w-full overflow-auto rounded-md border bg-popover p-2 shadow-md"
            ref={dropdownRef}
          >
            {(options.length === 0 ||
              options.length === selectedOptions.length) &&
            !isSearching ? (
              <div className="text-muted-foreground p-2 text-sm">
                No options found
              </div>
            ) : (
              <>
                {isSearching ? (
                  <div className="text-muted-foreground p-2 text-sm">
                    Searching ...
                  </div>
                ) : null}

                {options.map((option, index) => {
                  if (selectedOptions.includes(option)) return null;
                  return (
                    <div
                      className={`hover:text-accent-foreground cursor-pointer hover:bg-accent ${
                        value.includes(option.value) ? 'bg-accent/50' : ''
                      } ${index === focusedIndex ? 'text-accent-foreground bg-accent' : ''}`}
                      key={option.value}
                      onClick={() => handleOptionSelect(option.value)}
                      onMouseEnter={() => setFocusedIndex(index)}
                    >
                      {renderOption
                        ? renderOption(option)
                        : defaultRenderOption(option)}
                    </div>
                  );
                })}
              </>
            )}

            {/* Lazy loading indicator */}
            {allowLazyLoad ? (
              <div
                className="text-muted-foreground px-3 py-2 text-center text-sm"
                ref={ref}
              >
                {loading ? 'Loading...' : null}
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
