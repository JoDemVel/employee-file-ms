import { useEffect, useState } from 'react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { useConfigStore } from '@/app/shared/stores/useConfigStore';
import type { Department } from '@/app/shared/interfaces/department';
import type { Position } from '@/app/shared/interfaces/position';
import { getMockDepartments } from '@/app/shared/data/mockDepartments';
import { getMockPositionsByDepartment } from '@/app/shared/data/mockPositions';
import { addUser } from '@/app/shared/data/mockUser';
import type { User } from '@/app/shared/interfaces/user';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';

const formSchema = z.object({
  firstName: z.string().min(2, 'Nombre requerido'),
  lastName: z.string().min(2, 'Apellido requerido'),
  department: z.string().nonempty('Departamento requerido'),
  position: z.string().nonempty('Puesto requerido'),
  email: z.string().email('Correo inválido'),
  phone: z.string().min(7, 'Teléfono requerido'),
  hireDate: z.string().nonempty('Fecha de contratación requerida'),
});

type UserFormValues = z.infer<typeof formSchema>;

interface UserFormProps {
  onSave?: (newUser: User) => void;
  user?: User;
}

export default function UserForm({ onSave, user }: UserFormProps) {
  const { companyId } = useConfigStore();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<
    string | null
  >(null);
  const [loading, setLoading] = useState(false);

  const form = useForm<UserFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      department: '',
      position: '',
      email: '',
      phone: '',
      hireDate: '',
    },
  });

  useEffect(() => {
    if (!companyId) return;
    getMockDepartments(companyId).then(setDepartments);
  }, [companyId]);

  useEffect(() => {
    if (!companyId || !selectedDepartmentId) {
      setPositions([]);
      form.setValue('position', '');
      return;
    }

    getMockPositionsByDepartment(selectedDepartmentId, companyId).then(
      setPositions
    );
  }, [selectedDepartmentId, companyId, form]);

  // ✅ NUEVO: cargar datos si hay un `user` recibido
  useEffect(() => {
    if (user) {
      const {
        firstName,
        lastName,
        department,
        position,
        email,
        phone,
        hireDate,
      } = user;

      form.reset({
        firstName,
        lastName,
        department,
        position,
        email,
        phone,
        hireDate: hireDate?.split('T')[0] || '', // ISO format YYYY-MM-DD
      });

      const selectedDept = departments.find((d) => d.name === department);
      setSelectedDepartmentId(selectedDept?.id || null);
    }
  }, [user, departments, form]);

  const onSubmit = async (values: UserFormValues) => {
    try {
      setLoading(true);

      const newUser = {
        ...values,
        companyId: companyId || '',
      };

      const result = await addUser(newUser);

      toast('Usuario creado', {
        description: `${values.firstName} ${values.lastName} ha sido añadido.`,
      });

      if (onSave) {
        onSave(result);
      }

      form.reset();
      setSelectedDepartmentId(null);
    } catch (error) {
      console.error('Error al crear el usuario:', error);
      toast('Error', {
        description: 'No se pudo crear el usuario',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 max-w-xl"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre</FormLabel>
                <FormControl>
                  <Input placeholder="Juan" {...field} disabled={loading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Apellido</FormLabel>
                <FormControl>
                  <Input placeholder="Pérez" {...field} disabled={loading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Correo</FormLabel>
              <FormControl>
                <Input
                  placeholder="correo@ejemplo.com"
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
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Teléfono</FormLabel>
              <FormControl>
                <Input
                  placeholder="+52 123 456 7890"
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
          name="hireDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Fecha de contratación</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={'outline'}
                      className={`w-full pl-3 text-left font-normal ${
                        field.value ? '' : 'text-muted-foreground'
                      }`}
                      disabled={loading}
                    >
                      {field.value
                        ? format(new Date(field.value), 'dd/MM/yyyy')
                        : 'Selecciona una fecha'}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value ? new Date(field.value) : undefined}
                    captionLayout="dropdown"
                    onSelect={(date) => {
                      field.onChange(date?.toISOString().split('T')[0]); // ISO string (yyyy-mm-dd)
                    }}
                    disabled={(date) => date > new Date()}
                    autoFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Departamento */}
        <FormField
          control={form.control}
          name="department"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Departamento</FormLabel>
              <Select
                value={field.value}
                onValueChange={(value) => {
                  field.onChange(value);
                  const selected = departments.find((d) => d.name === value);
                  setSelectedDepartmentId(selected?.id || null);
                }}
                disabled={loading || departments.length === 0}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un departamento" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.name}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Puesto */}
        <FormField
          control={form.control}
          name="position"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Puesto</FormLabel>
              <Select
                value={field.value}
                onValueChange={field.onChange}
                disabled={loading || positions.length === 0}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un puesto" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {positions.map((position) => (
                    <SelectItem key={position.id} value={position.name}>
                      {position.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={loading}>
          {loading ? 'Creando...' : 'Crear usuario'}
        </Button>
      </form>
    </Form>
  );
}
