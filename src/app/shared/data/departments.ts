import type { Department } from '../interfaces/department';

export const departments: Department[] = [
  {
    id: 'dept-001',
    name: 'Recursos Humanos',
    description:
      'Departamento encargado de la gestión del personal, contratación y relaciones laborales.',
    companyId: 'comp-0',
  },
  {
    id: 'dept-002',
    name: 'Tecnología de la Información',
    description:
      'Responsable de la infraestructura tecnológica, soporte técnico y desarrollo de software.',
    companyId: 'comp-1',
  },
  {
    id: 'dept-003',
    name: 'Marketing',
    description:
      'Encargado de las estrategias de publicidad, promoción y estudios de mercado.',
    companyId: 'comp-0',
  },
  {
    id: 'dept-004',
    name: 'Ventas',
    description:
      'Focalizado en la comercialización de productos y servicios, y la relación con los clientes.',
    companyId: 'comp-1',
  },
  {
    id: 'dept-005',
    name: 'Finanzas',
    description:
      'Administra los recursos financieros, contabilidad, presupuestos e inversiones.',
    companyId: 'comp-0',
  },
  {
    id: 'dept-006',
    name: 'Operaciones',
    description:
      'Gestiona la producción, logística y la cadena de suministro de la empresa.',
    companyId: 'comp-1',
  },
  {
    id: 'dept-007',
    name: 'Legal',
    description:
      'Provee asesoramiento legal y se encarga del cumplimiento normativo y los contratos.',
    companyId: 'comp-0',
  },
  {
    id: 'dept-008',
    name: 'Innovación y Desarrollo',
    description:
      'Dedicado a la investigación y creación de nuevos productos y tecnologías.',
    companyId: 'comp-1',
  },
];
