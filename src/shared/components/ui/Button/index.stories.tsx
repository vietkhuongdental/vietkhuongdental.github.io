import type { Meta, StoryObj } from '@storybook/react';
import { Plus } from 'lucide-react';

import { Button } from './index';

const meta = {
  title: 'Components/Button',
  component: Button,
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: [
        'primary',
        'secondary',
        'outline',
        'outlineInverse',
        'ghost',
        'link',
        'danger'
      ]
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg']
    },
    leadingIcon: {
      control: false
    },
    trailingIcon: {
      control: false
    },
    onClick: { action: 'clicked' }
  },
  args: {
    children: 'Click Me',
    variant: 'primary',
    size: 'md',
    isDisabled: false
  }
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithIcons: Story = {
  args: {
    leadingIcon: <Plus />,
    trailingIcon: <Plus />
  }
};
