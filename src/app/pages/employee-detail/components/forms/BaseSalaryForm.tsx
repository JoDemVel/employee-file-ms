import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { toast } from 'sonner';
import { BaseSalaryService } from '@/rest-client/services/BaseSalaryService';
import type { BaseSalaryResponse } from '@/rest-client/interface/response/BaseSalaryResponse';

const baseSalaryService = new BaseSalaryService();

const formSchema = z.object({
  amount: z
    .string()
    .min(1, 'El monto es obligatorio')
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: 'El monto debe ser un número mayor a 0',
    }),
  startDate: z
    .string()
    .min(1, 'La fecha de inicio es obligatoria')
    .refine((date) => {
      const parsedDate = new Date(date);
      return !isNaN(parsedDate.getTime());
    }, 'Fecha inválida'),
  endDate: z
    .string()
    .optional()
    .refine((date) => {
      if (!date) return true;
      const parsedDate = new Date(date);
      return !isNaN(parsedDate.getTime());
    }, 'Fecha inválida'),
});

type BaseSalaryFormValues = z.infer<typeof formSchema>;

interface BaseSalaryFormProps {
  employeeId: string;
  onSave?: (newBaseSalary: BaseSalaryResponse) => void;
}

export function BaseSalaryForm({ employeeId, onSave }: BaseSalaryFormProps) {
  const [loading, setLoading] = useState(false);

  const form = useForm<BaseSalaryFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: '',
      startDate: '',
      endDate: '',
    },
  });

  const onSubmit = async (values: BaseSalaryFormValues) => {
    try {
      setLoading(true);

      const newBaseSalary = await baseSalaryService.createBaseSalary({
        employeeId,
        amount: Number(values.amount),
        startDate: values.startDate,
        endDate: values.endDate || undefined,
      });

      toast.success('Salario base creado', {
        description: `Se creó correctamente: ${new Intl.NumberFormat('es-BO', {
          style: 'currency',
          currency: 'BOB',
        }).format(newBaseSalary.amount)}`,
      });

      if (onSave) {
        onSave(newBaseSalary);
      }

      form.reset();
    } catch (error) {
      console.error('Error al crear el salario base:', error);
      toast.error('Error al crear el salario base', {
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
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Monto (BOB)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="Ej: 5000.00"
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
          name="startDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fecha de inicio</FormLabel>
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

        <FormField
          control={form.control}
          name="endDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fecha de fin (opcional)</FormLabel>
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

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? 'Guardando...' : 'Crear salario base'}
        </Button>
      </form>
    </Form>
  );
}