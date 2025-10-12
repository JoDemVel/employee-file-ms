import { useNavigate } from 'react-router';
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
import { DataTableColumnsTexts } from '@/constants/localize';
import type { Employee } from '@/rest-client/interface/Employee';

export function Actions({ employee }: { employee: Employee }) {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/employees/${employee.id}`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">{DataTableColumnsTexts.openMenu}</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{DataTableColumnsTexts.actions}</DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() => navigator.clipboard.writeText(employee.id)}
        >
          {DataTableColumnsTexts.copyId}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={handleViewDetails}>
          {DataTableColumnsTexts.viewDetails}
        </DropdownMenuItem>
        <DropdownMenuItem>{DataTableColumnsTexts.editUser}</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
