import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RefreshCw, Plus } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { ReusableDialog } from '@/app/shared/components/ReusableDialog';
import DepartmentForm from './DepartmentForm';
import type { DepartmentResponse } from '@/rest-client/interface/response/DepartmentResponse';
import { DepartmentService } from '@/rest-client/services/DepartmentService';

const departmentService = new DepartmentService();

export function DepartmentsPage() {
  const [departments, setDepartments] = useState<DepartmentResponse[]>([]);
  const [filtered, setFiltered] = useState<DepartmentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      await departmentService.getDepartments().then((res) => {
        setDepartments(res);
        setFiltered(res);
        setError(null);
      });
    } catch (e) {
      setError(
        'Error loading departments' +
          (e instanceof Error ? `: ${e.message}` : '')
      );
      setDepartments([]);
      setFiltered([]);
    } finally {
      setLoading(false);
    }
  };

  const onSave = async (newDepartment: DepartmentResponse) => {
    setDepartments((prev) => [newDepartment, ...prev]);
    setFiltered((prev) => [newDepartment, ...prev]);
    setDialogOpen(false);
  };

  useEffect(() => {
    const query = search.trim().toLowerCase();
    setFiltered(
      departments.filter((d) => d.name.toLowerCase().includes(query))
    );
  }, [search, departments]);

  useEffect(() => {
    fetchDepartments();
  }, []);

  return (
    <div className="container mx-auto">
      <ReusableDialog
        title="Agregar departamento"
        description="Completa los detalles del nuevo departamento"
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      >
        <DepartmentForm onSave={onSave} />
      </ReusableDialog>

      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Departamentos</h1>
          <p className="text-muted-foreground">Gestiona los departamentos</p>
        </div>
        <Button
          onClick={() => {
            setDialogOpen(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Agregar departamento
        </Button>
      </div>

      <Input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Buscar departamento..."
        disabled={loading}
        className="w-full sm:max-w-sm mb-4"
      />

      {loading && (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-10 w-full rounded-md" />
          ))}
        </div>
      )}

      {error && (
        <div className="text-center text-destructive mt-4">
          <p>{error}</p>
          <Button onClick={fetchDepartments} className="mt-2">
            <RefreshCw className="mr-2 h-4 w-4" />
            Reintentar
          </Button>
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <p className="text-muted-foreground">
          No se encontraron departamentos.
        </p>
      )}

      {!loading && !error && (
        <ul className="space-y-2">
          {filtered.map((dept) => (
            <li key={dept.id} className="p-4 bg-card rounded-md shadow-sm">
              <p className="font-medium">{dept.name}</p>
              <p className="text-sm text-muted-foreground">
                {dept.description || 'Sin descripción'}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
