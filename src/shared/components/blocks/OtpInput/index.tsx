import type React from 'react';
import { useEffect, useRef } from 'react';

interface OTPInputProps {
  length: number;
  value: string[];
  onChange: (otp: string[]) => void;
  onComplete?: (otp: string) => void;
}

export const OTPInput: React.FC<OTPInputProps> = ({
  length,
  value,
  onChange,
  onComplete
}) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Focus the first empty input or the first input if all are filled
    const firstEmptyIndex = value.findIndex((v) => !v);
    const indexToFocus = firstEmptyIndex === -1 ? 0 : firstEmptyIndex;
    inputRefs.current[indexToFocus]?.focus();
  }, []);

  const handleChange = (index: number, digit: string) => {
    // Only allow numbers
    if (!/^\d*$/.test(digit)) return;

    const newOtp = [...value];
    newOtp[index] = digit.substring(0, 1);
    onChange(newOtp);

    // Auto-focus next input
    if (digit && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Check if OTP is complete
    const newOtpValue = newOtp.join('');

    if (newOtpValue.length === length && onComplete) {
      onComplete(newOtpValue);
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    // Move to previous input on backspace if current input is empty
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').trim();

    // Check if pasted content is a valid number with the correct length
    if (new RegExp(`^\\d{${length}}$`).test(pastedData)) {
      const digits = pastedData.split('');
      onChange(digits);

      // Focus the last input
      inputRefs.current[length - 1]?.focus();

      // Call onComplete if provided
      if (onComplete) {
        onComplete(pastedData);
      }
    }
  };

  return (
    <div className="flex gap-2">
      {Array.from({ length }).map((_, index) => (
        <input
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          aria-label={`Digit ${index + 1}`}
          className="h-14 w-full rounded-md border text-center text-xl font-medium outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
          inputMode="numeric"
          key={index}
          maxLength={1}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={index === 0 ? handlePaste : undefined}
          type="text"
          value={value[index] || ''}
        />
      ))}
    </div>
  );
};
