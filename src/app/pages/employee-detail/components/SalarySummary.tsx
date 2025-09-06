import { ReusableDialog } from '@/app/shared/components/ReusableDialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { SalarySummaryTexts } from '@/constants/localize';
import type { BaseSalaryResponse } from '@/rest-client/interface/response/BaseSalaryResponse';
import type { SalaryEventResponse } from '@/rest-client/interface/response/SalaryEventResponse';
import { BaseSalaryService } from '@/rest-client/services/BaseSalaryService';
import { SalaryEventService } from '@/rest-client/services/SalaryEventService';
import { BanknoteArrowDown, Loader2, Plus } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { BaseSalaryForm } from './forms/BaseSalaryForm';

type SalarySummaryProps = {
  employeeId: string;
  hireDate: string;
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('es-BO', {
    style: 'currency',
    currency: 'BOB',
    minimumFractionDigits: 2,
  }).format(value);

type DialogContentType = 'BASE_SALARY' | 'DEDUCTION' | null;

const baseSalaryService = new BaseSalaryService();
const salaryEventService = new SalaryEventService();

export function SalarySummary({ employeeId, hireDate }: SalarySummaryProps) {
  const [baseSalary, setBaseSalary] = useState<BaseSalaryResponse | null>(null);
  const [deductions, setDeductions] = useState<SalaryEventResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState<DialogContentType>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [salary, salaryDeductions] = await Promise.all([
          baseSalaryService.getBaseSalaryByEmployee(employeeId),
          salaryEventService.getDeductionsByEmployee(employeeId),
        ]);

        setBaseSalary(salary);
        setDeductions(salaryDeductions);
      } catch (err) {
        console.error('Error fetching salary data:', err);
        setError(
          err instanceof Error
            ? err.message
            : 'Error al cargar datos de salario'
        );
      } finally {
        setLoading(false);
      }
    };

    if (employeeId) {
      fetchData();
    }
  }, [employeeId]);

  // Calcular años trabajados desde la fecha de contratación
  const calculateYearsWorked = (hireDate: string): number => {
    console.log(hireDate);
    const today = new Date();
    const hire = new Date(hireDate);
    const diffTime = today.getTime() - hire.getTime();
    const diffYears = diffTime / (1000 * 60 * 60 * 24 * 365.25);
    return Math.floor(diffYears);
  };

  // Calcular bono de antigüedad
  const calculateSeniorityBonus = (
    baseSalaryAmount: number,
    yearsWorked: number
  ): number => {
    const bonusRate = yearsWorked * 0.05;
    return Math.round(baseSalaryAmount * bonusRate * 100) / 100; // Redondear a 2 decimales
  };

  // Separar deducciones por tipo
  const separateDeductionsByType = (deductions: SalaryEventResponse[]) => {
    const permissions = deductions.filter((d) =>
      d.description?.toLowerCase().includes('permiso')
    );
    const absences = deductions.filter((d) =>
      d.description?.toLowerCase().includes('falta')
    );
    const others = deductions.filter(
      (d) =>
        !d.description?.toLowerCase().includes('permiso') &&
        !d.description?.toLowerCase().includes('falta')
    );

    return { permissions, absences, others };
  };

  // Calcular totales
  const yearsWorked = calculateYearsWorked(hireDate);
  const seniorityBonus = baseSalary
    ? calculateSeniorityBonus(baseSalary.amount, yearsWorked)
    : 0;

  const { permissions, absences, others } =
    separateDeductionsByType(deductions);

  const totalPermissions = permissions.reduce(
    (sum, perm) => sum + perm.amount,
    0
  );
  const totalAbsences = absences.reduce(
    (sum, absence) => sum + absence.amount,
    0
  );
  const totalOtherDeductions = others.reduce(
    (sum, other) => sum + other.amount,
    0
  );
  const totalDeductions =
    totalPermissions + totalAbsences + totalOtherDeductions;

  // Calcular deducción de Gestora (12.71% del salario base + bono)
  const gestionDeduction = baseSalary
    ? Math.round((baseSalary.amount + seniorityBonus) * 0.1271 * 100) / 100
    : 0;

  const salarioFinal = baseSalary
    ? baseSalary.amount + seniorityBonus - gestionDeduction - totalDeductions
    : 0;

  const handleOpen = (type: DialogContentType) => {
    setDialogContent(type);
    setDialogOpen(true);
  };

  const handleBaseSalaryCreated = (newBaseSalary: BaseSalaryResponse) => {
    setBaseSalary(newBaseSalary);
    setDialogOpen(false);
    toast.success('Salario base creado', {
      description: `Se creó correctamente: ${formatCurrency(
        newBaseSalary.amount
      )}`,
    });
  };

  const renderDialogContent = useMemo(() => {
    switch (dialogContent) {
      case 'BASE_SALARY':
        return (
          <BaseSalaryForm
            employeeId={employeeId}
            onSave={handleBaseSalaryCreated}
          />
        );
      case 'DEDUCTION':
        // return <DeductionForm onSubmit={() => {}} />;
        return null; // Placeholder until DeductionForm is implemented
      default:
        return null;
    }
  }, [dialogContent, employeeId]);

  const getDialogTitle = () => {
    switch (dialogContent) {
      case 'BASE_SALARY':
        return 'Crear Salario Base';
      case 'DEDUCTION':
        return 'Registrar Deducción';
      default:
        return '';
    }
  };

  const getDialogDescription = () => {
    switch (dialogContent) {
      case 'BASE_SALARY':
        return 'Establece el salario base para el empleado';
      case 'DEDUCTION':
        return 'Ingresa los detalles de la deducción';
      default:
        return '';
    }
  };

  if (loading) {
    return (
      <section className="flex flex-col gap-6 p-4">
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Cargando salario...</span>
        </div>
      </section>
    );
  }

  if (error && !baseSalary) {
    return (
      <section className="flex flex-col gap-6 p-4">
        <div className="flex justify-between">
          <span className="text-xl font-bold">{SalarySummaryTexts.title}</span>
          <Button
            className="w-60"
            variant="outline"
            onClick={() => handleOpen('BASE_SALARY')}
          >
            <Plus />
            <span>Crear Salario Base</span>
          </Button>
        </div>
        <div className="text-center p-8 border rounded-xl">
          <p className="text-muted-foreground mb-4">
            No se encontró salario base para este empleado
          </p>
          <Button onClick={() => handleOpen('BASE_SALARY')}>
            <Plus className="mr-2 h-4 w-4" />
            Crear Salario Base
          </Button>
        </div>
        <ReusableDialog
          title={getDialogTitle()}
          description={getDialogDescription()}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
        >
          {renderDialogContent}
        </ReusableDialog>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-6 p-4">
      <ReusableDialog
        title={getDialogTitle()}
        description={getDialogDescription()}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      >
        {renderDialogContent}
      </ReusableDialog>

      <div className="flex justify-between">
        <div>
          <span className="text-xl font-bold">{SalarySummaryTexts.title}</span>
        </div>
        <section className="flex gap-4">
          <Button
            className="w-60"
            variant="outline"
            onClick={() => handleOpen('BASE_SALARY')}
            disabled={!baseSalary}
          >
            <Plus />
            <span>Actualizar Salario Base</span>
          </Button>
          <Button
            className="w-40"
            onClick={() => handleOpen('DEDUCTION')}
            disabled={!baseSalary}
          >
            <BanknoteArrowDown />
            <span>{SalarySummaryTexts.addDeduction}</span>
          </Button>
        </section>
      </div>

      {/* Detalle */}
      {baseSalary && (
        <section className="flex flex-col gap-2 rounded-xl border p-4">
          <span className="text-lg font-semibold">Detalle de cálculo</span>
          <Separator />

          {/* Ingresos */}
          <div className="flex justify-between text-sm">
            <span>Salario base</span>
            <span>{formatCurrency(baseSalary.amount)}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span>Bono de Antigüedad ({yearsWorked} años × 5%)</span>
            <span>{formatCurrency(seniorityBonus)}</span>
          </div>

          {/* Deducción de Gestora */}
          <Separator className="my-2" />
          <span className="text-sm font-medium text-red-600">
            Deducciones Obligatorias
          </span>

          <div className="flex justify-between text-sm">
            <span className="text-red-600">Gestora (12.71%)</span>
            <span className="text-red-600">
              -{formatCurrency(gestionDeduction)}
            </span>
          </div>

          {/* Deducciones */}
          {totalDeductions > 0 && (
            <>
              <Separator className="my-2" />
              <span className="text-sm font-medium text-red-600">
                Otras Deducciones
              </span>

              {totalPermissions > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-red-600">
                    Permisos ({permissions.length})
                  </span>
                  <span className="text-red-600">
                    -{formatCurrency(totalPermissions)}
                  </span>
                </div>
              )}

              {totalAbsences > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-red-600">
                    Faltas ({absences.length})
                  </span>
                  <span className="text-red-600">
                    -{formatCurrency(totalAbsences)}
                  </span>
                </div>
              )}

              {totalOtherDeductions > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-red-600">
                    Otras deducciones ({others.length})
                  </span>
                  <span className="text-red-600">
                    -{formatCurrency(totalOtherDeductions)}
                  </span>
                </div>
              )}
            </>
          )}

          <Separator className="my-2" />
          <div className="flex justify-between font-bold text-base">
            <span>Salario Final</span>
            <span className={salarioFinal < 0 ? 'text-red-600' : ''}>
              {formatCurrency(salarioFinal)}
            </span>
          </div>
        </section>
      )}
    </section>
  );
}
