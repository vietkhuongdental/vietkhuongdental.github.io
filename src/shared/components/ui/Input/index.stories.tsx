import type { Meta, StoryObj } from '@storybook/react';
import { EyeOff, Mail } from 'lucide-react';

import { Input } from './index';

const meta = {
  title: 'Components/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default']
    },
    inputSize: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg']
    },
    onClick: { action: 'clicked' }
  },
  args: {
    variant: 'default',
    inputSize: 'md',
    className: '',
    placeholder: 'Please input your name',
    isDisabled: false,
    isError: false,
    isWarning: false
  }
} satisfies Meta<typeof Input>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithIcons: Story = {
  args: {
    leadingIcon: <Mail className="h-5 w-5" />,
    trailingIcon: <EyeOff className="h-5 w-5" />
  }
};

export const WithPrefixSuffix: Story = {
  args: {
    prefix: <>$</>,
    suffix: <>.00</>
  }
};
