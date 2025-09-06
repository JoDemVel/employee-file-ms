
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { toast } from 'sonner';
import { 
  SalaryEventService
} from '@/rest-client/services/SalaryEventService';
import type { SalaryEventResponse } from '@/rest-client/interface/response/SalaryEventResponse';

// Constantes para cálculos
const DAILY_WORK_VALUE = 83.33;
const ABSENCE_MULTIPLIER = 2;

// Tipos específicos para el formulario
export const AbsencePermissionType = {
  PERMISSION: 'PERMISSION',
  ABSENCE: 'ABSENCE',
} as const;
type AbsencePermissionType = (typeof AbsencePermissionType)[keyof typeof AbsencePermissionType];

export const PermissionDuration = {
  HALF_DAY: 'HALF_DAY',
  FULL_DAY: 'FULL_DAY',
} as const;
type PermissionDuration = (typeof PermissionDuration)[keyof typeof PermissionDuration];

const salaryEventService = new SalaryEventService();

const formSchema = z.object({
  type: z.nativeEnum(AbsencePermissionType),
  date: z
    .string()
    .min(1, 'La fecha es obligatoria')
    .refine((date) => {
      const parsedDate = new Date(date);
      return !isNaN(parsedDate.getTime());
    }, 'Fecha inválida'),
  duration: z
    .nativeEnum(PermissionDuration)
    .optional(),
  reason: z
    .string()
    .optional(),
  description: z
    .string()
    .optional(),
}).refine((data) => {
  // Si es permiso, la duración es obligatoria
  if (data.type === AbsencePermissionType.PERMISSION && !data.duration) {
    return false;
  }
  return true;
}, {
  message: 'La duración es obligatoria para permisos',
  path: ['duration'],
});

type AbsencePermissionFormValues = z.infer<typeof formSchema>;

interface AbsencePermissionFormProps {
  employeeId: string;
  onSave?: (newEvent: SalaryEventResponse) => void;
}

// Helper functions
const calculateDeduction = (type: AbsencePermissionType, duration?: PermissionDuration): number => {
  if (type === AbsencePermissionType.ABSENCE) {
    return DAILY_WORK_VALUE * ABSENCE_MULTIPLIER; // Falta = 83.33 * 2 = 166.66
  } else if (type === AbsencePermissionType.PERMISSION) {
    const multiplier = duration === PermissionDuration.HALF_DAY ? 0.5 : 1;
    return DAILY_WORK_VALUE * multiplier; // Permiso = 83.33 * 0.5 o * 1
  }
  return 0;
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('es-BO', {
    style: 'currency',
    currency: 'BOB',
    minimumFractionDigits: 2,
  }).format(value);

export function AbsencePermissionForm({ employeeId, onSave }: AbsencePermissionFormProps) {
  const [loading, setLoading] = useState(false);

  const form = useForm<AbsencePermissionFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: undefined,
      date: '',
      duration: undefined,
      reason: '',
      description: '',
    },
  });

  const watchedType = form.watch('type');
  const watchedDuration = form.watch('duration');

  // Calcular descuento en tiempo real
  const currentDeduction = watchedType ? calculateDeduction(watchedType, watchedDuration) : 0;

  const onSubmit = async (values: AbsencePermissionFormValues) => {
    try {
      setLoading(true);

      const deductionAmount = calculateDeduction(values.type, values.duration);
      
      // Crear descripción detallada
      let detailedDescription = '';
      if (values.type === AbsencePermissionType.PERMISSION) {
        const durationText = values.duration === PermissionDuration.HALF_DAY ? 'medio día' : '1 día';
        detailedDescription = `Permiso ${durationText}`;
      } else {
        detailedDescription = 'Falta';
      }
      
      if (values.reason) {
        detailedDescription += ` - ${values.reason}`;
      }
      
      if (values.description) {
        detailedDescription += ` - ${values.description}`;
      }

      // Crear evento salarial como deducción
      const newEvent = await salaryEventService.createSalaryEvent({
        employeeId,
        type: "DEDUCTION",
        description: detailedDescription,
        amount: deductionAmount,
        frequency: "ONE_TIME",
        startDate: values.date,
        endDate: values.date,
      });

      const typeLabel = values.type === AbsencePermissionType.ABSENCE ? 'Falta' : 'Permiso';
      toast.success(`${typeLabel} registrado`, {
        description: `Se registró correctamente. Descuento: ${formatCurrency(deductionAmount)}`,
      });

      if (onSave) {
        onSave(newEvent);
      }

      form.reset();
    } catch (error) {
      console.error('Error al registrar:', error);
      toast.error('Error al registrar', {
        description: 'Ocurrió un error al intentar guardar.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 max-w-md"
      >
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo</FormLabel>
              <Select 
                onValueChange={(value) => {
                  field.onChange(value);
                  if (value === "ABSENCE") {
                    form.setValue('duration', undefined);
                  }
                }} 
                value={field.value}
                disabled={loading}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona el tipo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={AbsencePermissionType.PERMISSION}>
                    Permiso
                  </SelectItem>
                  <SelectItem value={AbsencePermissionType.ABSENCE}>
                    Falta
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fecha</FormLabel>
              <FormControl>
                <Input
                  type="date"
                  {...field}
                  disabled={loading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {watchedType === AbsencePermissionType.PERMISSION && (
          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duración</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  value={field.value}
                  disabled={loading}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona la duración" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={PermissionDuration.HALF_DAY}>
                      Medio día (Bs. {formatCurrency(DAILY_WORK_VALUE * 0.5).replace('BOB', '').trim()})
                    </SelectItem>
                    <SelectItem value={PermissionDuration.FULL_DAY}>
                      1 día (Bs. {formatCurrency(DAILY_WORK_VALUE).replace('BOB', '').trim()})
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="reason"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Motivo (opcional)</FormLabel>
              <FormControl>
                <Input
                  placeholder="Ej: Cita médica, asuntos personales..."
                  {...field}
                  disabled={loading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción adicional (opcional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Detalles adicionales..."
                  {...field}
                  disabled={loading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Vista previa del descuento */}
        {currentDeduction > 0 && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm font-medium text-red-800">
              Descuento calculado: {formatCurrency(currentDeduction)}
            </p>
            <p className="text-xs text-red-600">
              {watchedType === AbsencePermissionType.ABSENCE 
                ? `Falta: Bs. ${DAILY_WORK_VALUE} × ${ABSENCE_MULTIPLIER} = Bs. ${currentDeduction.toFixed(2)}`
                : `Permiso: Bs. ${DAILY_WORK_VALUE} × ${watchedDuration === PermissionDuration.HALF_DAY ? '0.5' : '1'} = Bs. ${currentDeduction.toFixed(2)}`
              }
            </p>
          </div>
        )}

        <Button type="submit" disabled={loading || currentDeduction === 0} className="w-full">
          {loading ? 'Registrando...' : 'Registrar'}
        </Button>
      </form>
    </Form>
  );
}