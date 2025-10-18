import { useEffect, useState } from 'react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import type { PositionResponse } from '@/rest-client/interface/response/PositionResponse';
import type { DepartmentResponse } from '@/rest-client/interface/response/DepartmentResponse';

const departmentService = new (
  await import('@/rest-client/services/DepartmentService')
).DepartmentService();

const positionService = new (
  await import('@/rest-client/services/PositionService')
).PositionService();

const formSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  description: z.string().min(1, 'La descripción es obligatoria'),
  departmentId: z.string().nonempty('Debes seleccionar un departamento'),
});

type PositionFormValues = z.infer<typeof formSchema>;

interface PositionFormProps {
  onSave?: (newPosition: PositionResponse) => void;
}

export default function PositionForm({ onSave }: PositionFormProps) {
  const [departments, setDepartments] = useState<DepartmentResponse[]>([]);
  const [loading, setLoading] = useState(false);

  const form = useForm<PositionFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      departmentId: '',
    },
  });

  useEffect(() => {
    async function fetchDepartments() {
      const data = await departmentService.getDepartments();
      setDepartments(data);
    }

    fetchDepartments();
  }, []);

  const onSubmit = async (values: PositionFormValues) => {
    try {
      setLoading(true);
      const newPosition = await positionService.createPosition({
        ...values,
      });

      toast('Puesto creado', {
        description: `Se creó el puesto: ${values.name}`,
      });

      form.reset();
      if (onSave) {
        onSave(newPosition);
      }
    } catch (error) {
      console.error('Error al crear el puesto:', error);
      toast.error('Error al crear el puesto', {
        description: 'Ocurrió un error inesperado.',
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
              <FormLabel>Nombre del puesto</FormLabel>
              <FormControl>
                <Input
                  placeholder="Ej: Gerente de Ventas"
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
                  placeholder="Opcional..."
                  {...field}
                  disabled={loading}
                  className="h-16 resize-none"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="departmentId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Departamento</FormLabel>
              <Select
                value={field.value}
                onValueChange={field.onChange}
                disabled={loading || departments.length === 0}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un departamento" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {departments.map((department) => (
                    <SelectItem key={department.id} value={department.id}>
                      {department.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={loading}>
          {loading ? 'Guardando...' : 'Crear puesto'}
        </Button>
      </form>
    </Form>
  );
}
