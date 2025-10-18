import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, RefreshCw } from 'lucide-react';
import type { BranchResponse } from '@/rest-client/interface/response/BranchResponse';
import { ReusableDialog } from '@/app/shared/components/ReusableDialog';
import BranchForm from './BranchForm';

const branchService = new (
  await import('@/rest-client/services/BranchService')
).BranchService();

export function BranchesPage() {
  const [branches, setBranches] = useState<BranchResponse[]>([]);
  const [filtered, setFiltered] = useState<BranchResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

  const fetchBranches = async () => {
    try {
      setLoading(true);
      await branchService.getBranches().then((res) => {
        setBranches(res);
        setFiltered(res);
        setError(null);
      });
    } catch (e) {
      setError(
        'Error loading branches' +
          (e instanceof Error ? `: ${e.message}` : '')
      );
      setBranches([]);
      setFiltered([]);
    } finally {
      setLoading(false);
    }
  };

  const onSave = async (newBranch: BranchResponse) => {
    setBranches((prev) => [newBranch, ...prev]);
    setFiltered((prev) => [newBranch, ...prev]);
    setDialogOpen(false);
  };

  useEffect(() => {
    const query = search.trim().toLowerCase();
    setFiltered(
      branches.filter((b) =>
        b.name.toLowerCase().includes(query) ||
        b.city.toLowerCase().includes(query) ||
        b.country.toLowerCase().includes(query)
      )
    );
  }, [search, branches]);

  useEffect(() => {
    fetchBranches();
  }, []);

  return (
    <div className="container mx-auto">
      <ReusableDialog
        title="Agregar sucursal"
        description="Completa los detalles de la nueva sucursal"
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      >
        <BranchForm onSave={onSave} />
      </ReusableDialog>

      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sucursales</h1>
          <p className="text-muted-foreground">Gestiona las sucursales</p>
        </div>
        <Button
          onClick={() => {
            setDialogOpen(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Agregar sucursal
        </Button>
      </div>

      <Input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Buscar por nombre, ciudad o país..."
        disabled={loading}
        className="w-full sm:max-w-sm mb-4"
      />

      {loading && (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-md" />
          ))}
        </div>
      )}

      {error && (
        <div className="text-center text-destructive mt-4">
          <p>{error}</p>
          <Button onClick={fetchBranches} className="mt-2">
            <RefreshCw className="mr-2 h-4 w-4" />
            Reintentar
          </Button>
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <p className="text-muted-foreground">
          No se encontraron sucursales.
        </p>
      )}

      {!loading && !error && (
        <ul className="space-y-2">
          {filtered.map((branch) => (
            <li key={branch.id} className="p-4 bg-card rounded-md shadow-sm">
              <p className="font-medium">{branch.name}</p>
              <p className="text-sm text-muted-foreground mb-2">
                {branch.description || 'Sin descripción'}
              </p>
              <div className="grid grid-cols-3 gap-4 text-xs text-muted-foreground">
                <div>
                  <p className="font-semibold text-foreground">Ubicación</p>
                  <p>{branch.location}</p>
                </div>
                <div>
                  <p className="font-semibold text-foreground">Ciudad</p>
                  <p>{branch.city}</p>
                </div>
                <div>
                  <p className="font-semibold text-foreground">País</p>
                  <p>{branch.country}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}