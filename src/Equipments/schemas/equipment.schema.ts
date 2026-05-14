import { z } from 'zod';

export const equipmentSchema = z.object({
  num_inventario: z.string().min(1, "Requerido"),
  id_model: z.string().uuid("Seleccione un modelo"),
  id_type_equipment: z.number(), // 1: Computer, 2: Network, 3: Printer, etc.
  id_responsable: z.string().uuid("Seleccione responsable"),
  id_departament: z.string().uuid("Seleccione departamento"),
  status: z.boolean().default(true),
  description: z.string(),

  // Objetos opcionales según el tipo
  computer: z.object({
    id_type_equipment_computer: z.string().uuid(),
    id_type_storage: z.string().uuid(),
    id_type_operating_system: z.string().uuid(),
    id_processor: z.string().uuid(),
    ram: z.string(),
    capacity_storage: z.string(),
    available_storage: z.string(),
  }).optional(),

  printer: z.object({
    id_type_printing: z.string().uuid(),
    id_type_function: z.string().uuid(),
    color: z.boolean(),
    model_toner: z.string(),
  }).optional(),

  network: z.object({
    id_type_equipment_network: z.string().uuid(),
    number_ports: z.number().int(),
    PoE: z.boolean(),
  }).optional(),
}).refine((data) => {
  // VALIDACIÓN LÓGICA: Si no es 1, 2 o 3, la descripción no puede estar vacía
  const isStandard = [1, 2, 3].includes(data.id_type_equipment);
  if (!isStandard && data.description.trim() === "") {
    return false;
  }
  return true;
}, {
  message: "La descripción es obligatoria para este tipo de equipo",
  path: ["description"]
});