import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/shared/components/ui/DropdownMenu';

interface ActionSelectProps {
  iconTrigger: React.ReactNode;
  itemList: {
    description?: string;
    disabled?: boolean;
    icon?: React.ReactNode;
    label: string;
    onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  }[];
}

export function ActionSelectOption({
  iconTrigger,
  itemList
}: ActionSelectProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="cursor-pointer" asChild>
        <button className="h-fit p-1 hover:bg-background-overlay-dark">
          {iconTrigger}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {itemList?.map((item) => (
          <DropdownMenuItem
            className="cursor-pointer text-md"
            disabled={item.disabled}
            key={item.label}
            onClick={item.onClick}
          >
            {item.icon || null}
            <span>{item.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
