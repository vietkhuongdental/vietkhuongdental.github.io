// Toast.stories.tsx

import Toast from '@/shared/components/ui/Toast/index';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Toast> = {
  title: 'Shared/Toast',
  component: Toast,
  args: {
    onDismissToast: () => alert('Toast dismissed!')
  },
  argTypes: {
    onDismissToast: { action: 'dismissed' }
  }
};

export default meta;

type Story = StoryObj<typeof Toast>;

export const Default: Story = {
  args: {
    context: {
      id: 'toast-1',
      variant: 'default',
      title: 'Success',
      description: 'Your changes have been saved.',
      action: (
        <button className="hover:text-primary text-sm underline">Undo</button>
      )
    }
  }
};

export const Error: Story = {
  args: {
    context: {
      id: 'toast-2',
      variant: 'error',
      title: 'Error',
      description: 'Something went wrong.'
    }
  }
};

export const WithoutTitle: Story = {
  args: {
    context: {
      id: 'toast-3',
      variant: 'default',
      title: '',
      description: 'This toast has no title.'
    }
  }
};

export const CustomAction: Story = {
  args: {
    context: {
      id: 'toast-4',
      variant: 'default',
      title: 'Custom Action',
      description: 'Try interacting with the custom button.',
      action: <button className="text-xs underline">Try Again</button>
    }
  }
};
