import type { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { User } from '@/app/shared/interfaces/user';
import { DataTableColumnsTexts } from '@/constants/localize';
import { formatDate, formatDateHireDate } from '@/lib/formatters';

export const columns: ColumnDef<User>[] = [
  {
    id: 'fullName',
    header: DataTableColumnsTexts.employee,
    cell: ({ row }) => {
      const { firstName, lastName, hireDate } = row.original;
      const formattedDate = formatDate(hireDate, 'es-ES');

      return (
        <section>
          <span className="font-medium">
            {firstName} {lastName}
          </span>
          <div className="text-sm text-muted-foreground">{formattedDate}</div>
        </section>
      );
    },
  },
  {
    accessorKey: 'department',
    header: DataTableColumnsTexts.department,
    cell: ({ row }) => {
      const { department } = row.original;

      return <span className="text-muted-foreground">{department}</span>;
    },
  },
  {
    accessorKey: 'position',
    header: DataTableColumnsTexts.position,
    cell: ({ row }) => {
      const position = row.getValue('position') as string;
      return (
        <span className="text-muted-foreground">
          {position.charAt(0).toUpperCase() + position.slice(1)}
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
      const user = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">{DataTableColumnsTexts.openMenu}</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>
              {DataTableColumnsTexts.actions}
            </DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(user.id)}
            >
              {DataTableColumnsTexts.copyId}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              {DataTableColumnsTexts.viewDetails}
            </DropdownMenuItem>
            <DropdownMenuItem>
              {DataTableColumnsTexts.editUser}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
