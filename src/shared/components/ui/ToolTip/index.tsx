import { TooltipIcon } from '@/assets/icons/tooltip-icon';
import * as Tooltip from '@radix-ui/react-tooltip';

interface Props {
  content?: React.ReactNode;
}

export default function ToolTip({ content }: Props) {
  return (
    <Tooltip.Provider delayDuration={100}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <span>
            <TooltipIcon />
          </span>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            align="start"
            className="z-[2000] h-full w-fit flex-wrap rounded bg-background-default px-3 py-2 text-xs text-text-default shadow-[0_0_10px_rgba(0,0,0,0.2)]"
            side="top"
            sideOffset={5}
          >
            {content}
            <Tooltip.Arrow className="fill-white" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}
