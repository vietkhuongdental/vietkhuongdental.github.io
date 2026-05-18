import type { PicklistOption } from '@/shared/components/blocks/Picklist';

interface Props {
  data: PicklistOption;
}

export default function SymptomDescription({ data }: Props) {
  return (
    <div className="flex w-fit flex-col items-start justify-center gap-2">
      <div className="rounded-md border border-border-info px-2 text-sm font-normal text-border-info">
        HPO ID | {data.hpoId}
      </div>
      <div className="text-md font-semibold">{data.label}</div>
      <div className="flex flex-row gap-2 border-b py-2">
        <div className="text-sm font-semibold text-text-subtle">Synonym</div>
        <div className="w-[320px] text-sm font-normal text-text-subtle">
          {data.synonyms}
        </div>
      </div>
      <div className="flex flex-row gap-2 border-b py-2">
        <div className="text-sm font-semibold text-text-subtle">Definition</div>
        <div className="w-[320px] text-sm font-normal text-text-subtle">
          {data.description}
        </div>
      </div>
      <div className="flex flex-row gap-2 border-b py-2">
        <div className="text-sm font-semibold text-text-subtle">Comment</div>
        <div className="w-[320px] text-sm font-normal text-text-subtle">
          {data.comment}
        </div>
      </div>
    </div>
  );
}
