import type { PicklistOption } from '@/shared/components/blocks/Picklist';

interface Props {
  data: PicklistOption;
}

export default function DiseaseDescription({ data }: Props) {
  return (
    <div className="flex w-fit flex-col items-start justify-center gap-2 p-2">
      <div className="rounded-md border border-border-info px-2 text-sm font-normal text-border-info">
        {data.value} {/* orphaCode */}
      </div>
      <div className="text-md font-semibold">{data.label}</div>
      <div className="flex flex-row gap-2 border-b py-2">
        <div className="text-sm font-semibold text-text-subtle">Synonyms</div>
        <div className="w-[320px] text-sm font-normal text-text-subtle">
          {data.synonyms || ` Not available`}
        </div>
      </div>
      <div className="flex flex-row gap-2 py-2">
        <div className="text-sm font-semibold text-text-subtle">
          Description
        </div>
        <div className="w-[320px] text-sm font-normal text-text-subtle">
          {data.description || 'Not available'}
        </div>
      </div>
    </div>
  );
}
