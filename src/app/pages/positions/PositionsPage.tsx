import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, RefreshCw } from 'lucide-react';
import { ReusableDialog } from '@/app/shared/components/ReusableDialog';
import PositionForm from './PositionForm';
import type { PositionResponse } from '@/rest-client/interface/response/PositionResponse';

const positionService = new (
  await import('@/rest-client/services/PositionService')
).PositionService();

export function PositionsPage() {
  const [positions, setPositions] = useState<PositionResponse[]>([]);
  const [filtered, setFiltered] = useState<PositionResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

  const fetchPositions = async () => {
    try {
      setLoading(true);
      const data = await positionService.getPositions();
      setPositions(data);
      setFiltered(data);
      setError(null);
    } catch (e) {
      setError(
        'Error al cargar los puestos.' +
          (e instanceof Error ? `: ${e.message}` : '')
      );
      setPositions([]);
      setFiltered([]);
    } finally {
      setLoading(false);
    }
  };

  const onSave = async (newPosition: PositionResponse) => {
    setPositions((prev) => [newPosition, ...prev]);
    setFiltered((prev) => [newPosition, ...prev]);
    setDialogOpen(false);
  };

  useEffect(() => {
    fetchPositions();
  }, []);

  useEffect(() => {
    const query = search.trim().toLowerCase();
    setFiltered(positions.filter((p) => p.name.toLowerCase().includes(query)));
  }, [search, positions]);

  return (
    <div className="container mx-auto">
      <ReusableDialog
        title="Agregar puesto"
        description="Completa los detalles del nuevo puesto"
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      >
        <PositionForm onSave={onSave} />
      </ReusableDialog>

      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Puestos</h1>
          <p className="text-muted-foreground">
            Gestiona los cargos del departamento
          </p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Agregar puesto
        </Button>
      </div>

      <Input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Buscar puesto..."
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
          <Button onClick={fetchPositions} className="mt-2">
            <RefreshCw className="mr-2 h-4 w-4" />
            Reintentar
          </Button>
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <p className="text-muted-foreground">No se encontraron puestos.</p>
      )}

      {!loading && !error && (
        <ul className="space-y-2">
          {filtered.map((position) => (
            <li key={position.id} className="p-4 bg-card rounded-md shadow-sm">
              <p className="font-medium">{position.name}</p>
              <p className="text-sm text-muted-foreground">
                {position.description || 'Sin descripción'}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
