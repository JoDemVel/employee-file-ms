import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarX, Clock, Plus, Loader2, Edit2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { ReusableDialog } from '@/app/shared/components/ReusableDialog';
import { toast } from 'sonner';
import { AbsencePermissionForm } from './forms/AbsencePermissionForm';
import { AbsenceService } from '@/rest-client/services/AbsenceService';
import type { AbsenceResponse } from '@/rest-client/interface/response/AbsenceResponse';

export const AbsencePermissionType = {
  PERMISSION: 'PERMISSION',
  ABSENCE: 'ABSENCE',
} as const;
export type AbsencePermissionType =
  (typeof AbsencePermissionType)[keyof typeof AbsencePermissionType];

export const PermissionDuration = {
  HALF_DAY: 'HALF_DAY',
  FULL_DAY: 'FULL_DAY',
} as const;
export type PermissionDuration =
  (typeof PermissionDuration)[keyof typeof PermissionDuration];

type AbsencePermissionSectionProps = {
  employeeId: string;
  employeeName?: string;
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('es-BO', {
    style: 'currency',
    currency: 'BOB',
    minimumFractionDigits: 2,
  }).format(value);

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('es-BO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const getAbsenceTypeFromDescription = (
  description: string
): AbsencePermissionType => {
  return description.toLowerCase().includes('falta')
    ? AbsencePermissionType.ABSENCE
    : AbsencePermissionType.PERMISSION;
};

const getDurationFromDescription = (
  description: string
): PermissionDuration => {
  return description.toLowerCase().includes('medio')
    ? PermissionDuration.HALF_DAY
    : PermissionDuration.FULL_DAY;
};

const canEditAbsence = (absenceDate: string): boolean => {
  const absence = new Date(absenceDate);
  const today = new Date();

  const absenceMonth = absence.getMonth();
  const absenceYear = absence.getFullYear();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  // Mismo mes
  if (absenceMonth === currentMonth && absenceYear === currentYear) {
    return true;
  }

  // Primeros 5 días del mes siguiente
  const nextMonth = new Date(absenceYear, absenceMonth + 1, 1);
  const fifthDayOfNextMonth = new Date(
    absenceYear,
    absenceMonth + 1,
    5,
    23,
    59,
    59
  );

  return today >= nextMonth && today <= fifthDayOfNextMonth;
};

const absenceService = new AbsenceService();

export function AbsencePermissionSection({
  employeeId,
  employeeName,
}: AbsencePermissionSectionProps) {
  const [absenceEvents, setAbsenceEvents] = useState<AbsenceResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const fetchAbsenceEvents = async () => {
      try {
        setLoading(true);
        setError(null);
        const deductions = await absenceService.getAbsencesByEmployee(
          employeeId
        );
        const absenceDeductions = deductions.filter(
          (event) =>
            event.description &&
            (event.description.toLowerCase().includes('permiso') ||
              event.description.toLowerCase().includes('falta'))
        );
        setAbsenceEvents(absenceDeductions);
      } catch (err) {
        console.error('Error fetching absence events:', err);
        setError(
          err instanceof Error
            ? err.message
            : 'Error al cargar permisos y faltas'
        );
      } finally {
        setLoading(false);
      }
    };

    if (employeeId) {
      fetchAbsenceEvents();
    }
  }, [employeeId]);

  const handleAbsenceCreated = (newAbsence: AbsenceResponse) => {
    const isAbsence = getAbsenceTypeFromDescription(
      newAbsence.description || ''
    );
    const typeLabel =
      isAbsence === AbsencePermissionType.ABSENCE ? 'Falta' : 'Permiso';

    setAbsenceEvents([newAbsence, ...absenceEvents]);
    setDialogOpen(false);

    toast.success(`${typeLabel} registrado`, {
      description: `Se registró correctamente. Descuento: ${formatCurrency(
        newAbsence.deductionAmount
      )}`,
    });
  };

  const permissions = absenceEvents.filter(
    (event) =>
      event.description && event.description.toLowerCase().includes('permiso')
  );

  const absences = absenceEvents.filter(
    (event) =>
      event.description && event.description.toLowerCase().includes('falta')
  );

  const totalDeductions = absenceEvents.reduce(
    (sum, event) => sum + event.deductionAmount,
    0
  );

  if (loading) {
    return (
      <section className="flex flex-col gap-6 p-4">
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Cargando permisos y faltas...</span>
        </div>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-6 p-4">
      <ReusableDialog
        title="Registrar Permiso o Falta"
        description="Registra un nuevo permiso o falta para el empleado"
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      >
        <AbsencePermissionForm
          employeeId={employeeId}
          onSave={handleAbsenceCreated}
        />
      </ReusableDialog>

      <div className="flex justify-between">
        <div>
          <span className="text-xl font-bold">Permisos y Faltas</span>
          {employeeName && (
            <p className="text-sm text-muted-foreground">{employeeName}</p>
          )}
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Registrar Permiso/Falta
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="rounded-2xl shadow-md">
          <CardContent className="p-6 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-600" />
              <span className="text-sm text-muted-foreground">Permisos</span>
            </div>
            <span className="text-2xl font-semibold">{permissions.length}</span>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-md">
          <CardContent className="p-6 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <CalendarX className="h-4 w-4 text-red-600" />
              <span className="text-sm text-muted-foreground">Faltas</span>
            </div>
            <span className="text-2xl font-semibold">{absences.length}</span>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-md bg-red-50">
          <CardContent className="p-6 flex flex-col gap-2">
            <span className="text-sm text-muted-foreground">
              Total Descuentos
            </span>
            <span className="text-2xl font-bold text-red-700">
              {formatCurrency(totalDeductions)}
            </span>
          </CardContent>
        </Card>
      </div>

      {absenceEvents.length > 0 ? (
        <section className="flex flex-col gap-2 rounded-xl border p-4">
          <span className="text-lg font-semibold">
            Historial de Permisos y Faltas
          </span>
          <Separator />

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {absenceEvents.map((event) => {
              const isAbsence = getAbsenceTypeFromDescription(
                event.description || ''
              );
              const isPermission = !isAbsence;
              const duration = isPermission
                ? getDurationFromDescription(event.description || '')
                : null;
              const isEditable = canEditAbsence(event.date);

              return (
                <div
                  key={event.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3 flex-1">
                    {isAbsence ? (
                      <CalendarX className="h-5 w-5 text-red-600 flex-shrink-0" />
                    ) : (
                      <Clock className="h-5 w-5 text-blue-600 flex-shrink-0" />
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge
                          variant={isAbsence ? 'destructive' : 'secondary'}
                        >
                          {isAbsence ? 'Falta' : 'Permiso'}
                        </Badge>
                        {duration && (
                          <Badge variant="outline">
                            {duration === PermissionDuration.HALF_DAY
                              ? 'Medio día'
                              : '1 día'}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm font-medium">
                        {formatDate(event.date)}
                      </p>
                      {event.description && (
                        <p className="text-xs text-muted-foreground truncate">
                          {event.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                    <div className="text-right">
                      <p className="text-sm font-semibold text-red-600">
                        -{formatCurrency(event.deductionAmount)}
                      </p>
                    </div>
                    {isEditable && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          // Lógica para editar
                        }}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ) : (
        <div className="text-center p-8 border rounded-xl">
          <CalendarX className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">
            No hay permisos o faltas registradas
          </p>
          <Button onClick={() => setDialogOpen(true)} variant="outline">
            <Plus className="mr-2 h-4 w-4" />
            Registrar el primero
          </Button>
        </div>
      )}

      {error && (
        <div className="text-center p-4 border border-red-200 bg-red-50 rounded-xl">
          <p className="text-red-600">Error: {error}</p>
        </div>
      )}
    </section>
  );
}
