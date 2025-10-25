import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import type { BranchResponse } from '@/rest-client/interface/response/BranchResponse';
import { BranchService } from '@/rest-client/services/BranchService';

const BOLIVIAN_CITIES = [
  'La Paz',
  'Cochabamba',
  'Santa Cruz',
  'Potosí',
  'Oruro',
  'Sucre',
  'Tarija',
  'Beni',
  'Pando',
];

const branchService = new BranchService();

const formSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  description: z.string().min(1, 'La descripción es obligatoria'),
  location: z.string().min(2, 'La ubicación es obligatoria'),
  city: z.string().min(1, 'La ciudad es obligatoria'),
  country: z.literal('Bolivia', { message: 'El país debe ser Bolivia' }),
});

type BranchFormValues = z.infer<typeof formSchema>;

interface BranchFormProps {
  onSave?: (newBranch: BranchResponse) => void;
}

export default function BranchForm({ onSave }: BranchFormProps) {
  const [loading, setLoading] = useState(false);

  const form = useForm<BranchFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      location: '',
      city: '',
      country: 'Bolivia',
    },
  });

  const onSubmit = async (values: BranchFormValues) => {
    try {
      setLoading(true);

      const newBranch = await branchService.createBranch({
        ...values,
      });

      toast('Sucursal creada', {
        description: `Se creó correctamente: ${newBranch.name}`,
      });

      if (onSave) {
        onSave(newBranch);
      }

      form.reset();
    } catch (error) {
      console.error('Error al crear la sucursal:', error);
      toast.error('Error al crear la sucursal', {
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
                  placeholder="Nombre de la sucursal"
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
                  placeholder="Descripción de la sucursal"
                  {...field}
                  disabled={loading}
                  className="resize-none"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ubicación</FormLabel>
              <FormControl>
                <Input
                  placeholder="Ej: Av. Principal 123"
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
          name="country"
          render={() => (
            <FormItem>
              <FormLabel>País</FormLabel>
              <FormControl>
                <Input value="Bolivia" disabled={true} readOnly />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ciudad</FormLabel>
              <Select
                value={field.value}
                onValueChange={field.onChange}
                disabled={loading}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una ciudad" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {BOLIVIAN_CITIES.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={loading}>
          {loading ? 'Guardando...' : 'Crear sucursal'}
        </Button>
      </form>
    </Form>
  );
}
