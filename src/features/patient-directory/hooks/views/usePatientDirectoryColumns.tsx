import type { PatientDirectoryResponse } from '@/features/patient-directory/interface';
import { DataTableColumnHeader } from '@/shared/components/blocks/DataTable/DataTableColumnHeader';
import { Tag } from '@/shared/components/ui/Tag';
import { cn } from '@/shared/libs/utils';
import type { ColumnDef } from '@tanstack/react-table';

interface Props {
  selectedDiseases: string[];
}

export const usePatientDirectoryColumns = ({ selectedDiseases }: Props) => {
  const columns: ColumnDef<PatientDirectoryResponse>[] = [
    {
      accessorKey: 'ehr',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Health records" />
      ),
      cell: ({ row }) => (
        <span className="whitespace-nowrap rounded-sm px-2 text-lg text-link-default">
          <a href={`/health-record-view/${row.original.id}`}>
            {row.original.anonymizedName}
          </a>
        </span>
      ),
      enableSorting: false
    },
    {
      accessorKey: 'age',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Age Range" />
      ),
      cell: ({ row }) => (
        <span className="whitespace-nowrap text-md">
          {row.original.ageRange.minAge} - {row.original.ageRange.maxAge}
        </span>
      ),
      enableSorting: false
    },
    {
      accessorKey: 'country',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Country" />
      ),
      cell: ({ row }) => (
        <span className="whitespace-nowrap text-md">
          {row.getValue('country')}
        </span>
      ),
      enableSorting: false
    },
    {
      accessorKey: 'r-value',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Match rare disease and R-value"
        />
      ),
      cell: ({ row }) => (
        <div className="flex flex-row gap-2">
          {row.original.matchingDiseases.map((disease, index) =>
            selectedDiseases.length > 1 ? (
              <div
                className={cn(
                  'flex flex-row items-center gap-1',
                  index !== row.original.matchingDiseases.length - 1 &&
                    'border-r pr-2'
                )}
                key={disease.orphaCode}
              >
                <span className="whitespace-nowrap">{disease.name}</span>
                <Tag
                  color="orange"
                  key={disease.orphaCode}
                  label={disease.confidence.toFixed(4)}
                  size="lg"
                />
              </div>
            ) : (
              <Tag
                color="orange"
                key={disease.orphaCode}
                label={disease.confidence.toFixed(4)}
                size="lg"
              />
            )
          )}
        </div>
      ),
      enableSorting: false
    }
  ];

  return {
    columns
  };
};
