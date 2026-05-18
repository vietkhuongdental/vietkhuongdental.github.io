import Calendar from '@/shared/components/ui/Calendar';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Calendar> = {
  title: 'Components/Calendar',
  component: Calendar,
  tags: ['autodocs'],
  argTypes: {
    viewType: {
      control: 'radio',
      options: ['date', 'month']
    },
    className: {
      control: false
    },
    handleSelectDate: { action: 'date-selected' }
  }
};

export default meta;

type Story = StoryObj<typeof Calendar>;

export const Default: Story = {
  args: {
    initDate: new Date(),
    viewType: 'date'
  }
};

export const MonthView: Story = {
  args: {
    initDate: new Date(),
    viewType: 'month'
  }
};
