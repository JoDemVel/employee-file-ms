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
import type { AbsenceResponse } from '@/rest-client/interface/response/AbsenceResponse';
import { AbsenceService } from '@/rest-client/services/AbsenceService';

// Tipos específicos para el formulario
export const AbsencePermissionType = {
  PERMISSION: 'PERMISSION',
  ABSENCE: 'ABSENCE',
} as const;
type AbsencePermissionType =
  (typeof AbsencePermissionType)[keyof typeof AbsencePermissionType];

export const PermissionDuration = {
  HALF_DAY: 'HALF_DAY',
  FULL_DAY: 'FULL_DAY',
} as const;
type PermissionDuration =
  (typeof PermissionDuration)[keyof typeof PermissionDuration];

const absenceService = new AbsenceService();

const formSchema = z.object({
  type: z.nativeEnum(AbsencePermissionType),
  date: z
    .string()
    .min(1, 'La fecha es obligatoria')
    .refine((date) => {
      const parsedDate = new Date(date);
      return !isNaN(parsedDate.getTime());
    }, 'Fecha inválida'),
  duration: z.nativeEnum(PermissionDuration),
  reason: z.string().optional(),
  description: z.string().optional(),
});

type AbsencePermissionFormValues = z.infer<typeof formSchema>;

interface AbsencePermissionFormProps {
  employeeId: string;
  onSave?: (newEvent: AbsenceResponse) => void;
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('es-BO', {
    style: 'currency',
    currency: 'BOB',
    minimumFractionDigits: 2,
  }).format(value);

export function AbsencePermissionForm({
  employeeId,
  onSave,
}: AbsencePermissionFormProps) {
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

  const onSubmit = async (values: AbsencePermissionFormValues) => {
    try {
      setLoading(true);

      // Crear descripción detallada
      let detailedDescription = '';
      const durationText =
        values.duration === PermissionDuration.HALF_DAY ? 'medio día' : '1 día';

      if (values.type === AbsencePermissionType.PERMISSION) {
        detailedDescription = `Permiso ${durationText}`;
      } else {
        detailedDescription = `Falta ${durationText}`;
      }

      if (values.reason) {
        detailedDescription += ` - ${values.reason}`;
      }

      if (values.description) {
        detailedDescription += ` - ${values.description}`;
      }

      // El backend calcula los descuentos
      const newEvent = await absenceService.createAbsence({
        employeeId,
        type: values.type,
        duration: values.duration,
        date: values.date,
        description: detailedDescription,
        reason: values.reason,
      });

      const typeLabel =
        values.type === AbsencePermissionType.ABSENCE ? 'Falta' : 'Permiso';
      toast.success(`${typeLabel} registrado`, {
        description: `Se registró correctamente. Descuento: ${formatCurrency(
          newEvent.deductionAmount
        )}`,
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
                onValueChange={field.onChange}
                value={field.value || ''}
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
                <Input type="date" {...field} disabled={loading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="duration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Duración</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value || ''}
                disabled={loading}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona la duración" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={PermissionDuration.HALF_DAY}>
                    Medio día
                  </SelectItem>
                  <SelectItem value={PermissionDuration.FULL_DAY}>
                    1 día
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

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

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? 'Registrando...' : 'Registrar'}
        </Button>
      </form>
    </Form>
  );
}
