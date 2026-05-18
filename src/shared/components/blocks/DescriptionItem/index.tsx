interface Props {
  icon?: React.ReactNode;
  title: string;
  description: string;
}

export default function DescriptionItem({ icon, title, description }: Props) {
  return (
    <div className="flex flex-row items-start gap-3">
      <div className="flex aspect-square w-8 items-center justify-center">
        {icon}
      </div>
      <div className="flex w-full min-w-0 flex-col">
        <span className="text-sm font-normal text-text-subtle">{title}</span>
        <span className="break-words text-md font-normal text-text-default">
          {description}
        </span>
      </div>
    </div>
  );
}
