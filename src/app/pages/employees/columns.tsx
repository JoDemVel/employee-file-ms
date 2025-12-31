import type { ColumnDef } from '@tanstack/react-table';
import { DataTableColumnsTexts } from '@/constants/localize';
import { formatDate, formatDateHireDate } from '@/lib/formatters';
import { Actions } from './Actions';
import type { EmployeeResponse } from '@/rest-client/interface/response/EmployeeResponse';

export const columns: ColumnDef<EmployeeResponse>[] = [
  {
    id: 'fullName',
    header: () => (
      <span className="pl-4">{DataTableColumnsTexts.employee}</span>
    ),
    cell: ({ row }) => {
      const { firstName, lastName, hireDate } = row.original;
      const formattedDate = formatDate(hireDate, 'es-ES');

      return (
        <section className="pl-4">
          <span className="font-medium">
            {firstName} {lastName}
          </span>
          <span className="block">
            {DataTableColumnsTexts.hiredOn}
            <span className="text-sm text-muted-foreground">
              {formattedDate}
            </span>
          </span>
        </section>
      );
    },
  },
  {
    accessorKey: 'departmentName',
    header: DataTableColumnsTexts.department,
    cell: ({ row }) => {
      const { departmentName } = row.original;

      return (
        <span className="text-muted-foreground">
          {departmentName ?? 'No definido'}
        </span>
      );
    },
  },
  {
    accessorKey: 'positionName',
    header: DataTableColumnsTexts.position,
    cell: ({ row }) => {
      const position =
        (row.getValue('positionName') as string) ?? 'No definido';
      return (
        <span className="text-muted-foreground">
          {position?.charAt(0).toUpperCase() + position?.slice(1)}
        </span>
      );
    },
  },
  {
    accessorKey: 'contact',
    header: DataTableColumnsTexts.contact,
    cell: ({ row }) => {
      const { email, phone } = row.original;

      return (
        <span className="flex flex-col">
          <span className="text-sm text-muted-foreground">{email}</span>
          <span className="text-sm text-muted-foreground">{phone}</span>
        </span>
      );
    },
  },
  {
    accessorKey: 'seniority',
    header: DataTableColumnsTexts.seniority,
    cell: ({ row }) => {
      const { hireDate } = row.original;
      const formattedHireDate = formatDateHireDate(new Date(hireDate));

      return (
        <span className="text-sm text-muted-foreground">
          {formattedHireDate}
        </span>
      );
    },
  },
  {
    id: 'actions',
    header: DataTableColumnsTexts.actions,
    cell: ({ row }) => {
      const employee = row.original;

      return <Actions employee={employee} />;
    },
  },
];
