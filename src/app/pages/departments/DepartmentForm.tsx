import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { toast } from 'sonner';
import type { DepartmentResponse } from '@/rest-client/interface/response/DepartmentResponse';
import { DepartmentService } from '@/rest-client/services/DepartmentService';

const departmentService = new DepartmentService();

const formSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  description: z.string().min(1, 'La descripción es obligatoria'),
});

type DepartmentFormValues = z.infer<typeof formSchema>;

interface DepartmentFormProps {
  onSave?: (newDepartment: DepartmentResponse) => void;
}

export default function DepartmentForm({ onSave }: DepartmentFormProps) {
  const [loading, setLoading] = useState(false);

  const form = useForm<DepartmentFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  const onSubmit = async (values: DepartmentFormValues) => {
    try {
      setLoading(true);

      const newDepartment = await departmentService.createDepartment({
        ...values,
      });

      toast('Departamento creado', {
        description: `Se creó correctamente: ${newDepartment.name}`,
      });

      if (onSave) {
        onSave(newDepartment);
      }

      form.reset();
    } catch (error) {
      console.error('Error al crear el departamento:', error);
      toast.error('Error al crear el departamento', {
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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input
                  placeholder="Nombre del departamento"
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
              <FormLabel>Descripción</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Descripción (opcional)"
                  {...field}
                  disabled={loading}
                  className="resize-none"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={loading}>
          {loading ? 'Guardando...' : 'Crear departamento'}
        </Button>
      </form>
    </Form>
  );
}
