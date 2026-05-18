/* eslint-disable react-hooks/rules-of-hooks */
import { DatePickerInput } from '@/shared/components/blocks/DatePickerInput';
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

const meta: Meta<typeof DatePickerInput> = {
  title: 'Components/DatePickerInput',
  component: DatePickerInput,
  tags: ['autodocs'],
  // parameters: {
  //   layout: 'center'
  // },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default']
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg']
    }
  },
  args: {
    variant: 'default',
    size: 'md',
    className: '',
    isDisabled: false,
    isError: false,
    isWarning: false
  }
};

export default meta;

type Story = StoryObj<typeof DatePickerInput>;

export const Default: Story = {
  render: () => {
    const [date, setDate] = useState<string | undefined>();
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          height: '100vh',
          width: '',
          paddingTop: '2rem'
        }}
      >
        <DatePickerInput
          date={date ? new Date(date) : undefined}
          placeholder="Please select date"
          setDate={setDate}
        />
      </div>
    );
  }
};
