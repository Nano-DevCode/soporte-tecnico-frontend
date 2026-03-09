import { CustomPagination } from "@/components/custom/CustomPagination"
import { CustomTitle } from "@/components/custom/CustomTitle"
import { CustomTableSolicitudDepartamento } from "../components/CustomTableSolicitudDepartamento"

export interface User {
  id: number;
  correo: string;
  nombre: string;
  primerApellido: string;
  segundoApellido: string;
  rol: string;
  avatar: string;
  estado: 0 | 1;
}

const mockUsers: User[] = [
  {
    id: 1,
    correo: "manuel.santiago@example.com",
    nombre: "Manuel Eduardo",
    primerApellido: "Santiago",
    segundoApellido: "Feria",
    rol: "Admin",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Manuel",
    estado: 1,
  },
  {
    id: 2,
    correo: "ana.garcia@example.com",
    nombre: "Ana",
    primerApellido: "García",
    segundoApellido: "López",
    rol: "Soporte",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ana",
    estado: 1,
  },
  {
    id: 3,
    correo: "usuario.prueba@example.com",
    nombre: "Juan",
    primerApellido: "Pérez",
    segundoApellido: "Martínez",
    rol: "Usuario",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Juan",
    estado: 0,
  },
  {
    id: 4,
    correo: "admin.sistema@example.com",
    nombre: "Elena",
    primerApellido: "Rodríguez",
    segundoApellido: "Sánchez",
    rol: "Admin",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Elena",
    estado: 1,
  }
];

export const ListaDepartamentoSolicitudes = () => {
  return (
    <>
      <CustomTitle 
        title="Mis Solicitudes"
        description="Aqui podras ver todo tu historia de solicitudes que realizaste y estas por realizar"/>
        <CustomTableSolicitudDepartamento users={mockUsers}/>
      <CustomPagination totalPages={7}/>
    </>
  )
}
