import { useParams, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { EquipmentForm } from "../components/CustomEquipmentForm";
import { useEquipments } from "../hooks/useCreate-UpdateEquipment";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getEquipmentByIdAction } from "../actions/get-equipment.actions";
import type { EquipmentPayload } from "../actions/post-equipment.action";
import { CustomBackToList } from "@/components/custom/CustomBackToList";
import { sileo } from "sileo";
import { isAxiosError } from "axios";

export const UpdateEquipmentPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const { updateEquipmentAsync, isUpdating } = useEquipments();

    const { data: equipment, isLoading, isError } = useQuery({
        queryKey: ["equipment", id],
        queryFn: () => getEquipmentByIdAction(id!),
        enabled: !!id,
        retry: 1,
        placeholderData: (previousData) => previousData,
    });

    const handleUpdate = async (formData: EquipmentPayload) => {
        if (!id) return;

        // Quitamos el "return" inicial para permitir que el flujo continúe tras el éxito
        await sileo.promise(
            updateEquipmentAsync({
                id,
                payload: formData
            }), 
            {
                loading: {
                    title: "Actualizando equipo...",
                    description: "Por favor, espere un momento mientras se guardan los cambios."
                },
                success: {
                    title: "¡Equipo actualizado!",
                    description: "Los cambios se guardaron correctamente en el inventario.",
                    duration: 4000
                },
                error: (err) => {
                    let backendMessage = "Ocurrió un error inesperado al intentar actualizar.";

                        const errorObj = err as Record<string, unknown>;
                        // 1. SI TU "ACTION" DEVOLVIÓ/LANZÓ EL OBJETO DE DATOS DIRECTO (Lo que se ve en tu consola)
                        if (errorObj && errorObj.message && typeof errorObj.message === "string")
                            {
                            backendMessage = errorObj.message;
                        }
                        // 2. SI EL MENSAJE VIENE EN UN ARREGLO DENTRO DEL OBJETO PLANO
                        else if (errorObj && Array.isArray(errorObj.message)) {
                            backendMessage = errorObj.message.join(", ");
                        }
                        // 3. RESPALDO: Por si acaso en algún entorno sí llega como un AxiosError clásico
                        else if (isAxiosError(err) && err.response?.data) {
                            const msg = err.response.data.message;
                            backendMessage = Array.isArray(msg) ? msg.join(", ") : msg;
                        }

    return {
        title: "Error al actualizar equipo",
        description: backendMessage, // <-- Aquí ya tendrá el texto real extraído de la consola
        duration: 6000
    };
                }
            }
        );

        // Al igual que en el create, si "sileo.promise" falla, lanzará una excepción
        // bloqueando esta línea. Solo redirigirá si la actualización fue exitosa.
        navigate("/equipments");
    };

    if (isLoading && !equipment) {
        return (
            <div className="flex flex-col items-center justify-center min-h-400px">
                <Loader2 className="animate-spin mb-2 text-primary" size={40} />
                <p className="font-medium text-muted-foreground">Cargando información del equipo...</p>
            </div>
        );
    }

    if (isError || !equipment) {
        return (
            <div className="max-w-md mx-auto mt-20 text-center p-8 bg-red-50 rounded-2xl border border-red-100">
                <h2 className="text-red-800 font-bold text-xl mb-2">Equipo no encontrado</h2>
                <p className="text-red-600/80 mb-6">El registro que intentas editar no existe o no se pudo recuperar.</p>
                <Button variant="outline" onClick={() => navigate("/equipments")} className="border-red-200 text-red-700 hover:bg-red-100">
                    Listar Equipos
                </Button>
            </div>
        );
    }

    return (
        <div className="p-8 space-y-6">
            <CustomBackToList 
                onBack={() => navigate('/equipments')} 
                backLabel={"Listar Equipos"} 
                actionUrl="equipments" 
                // Aseguramos que use la categoría correcta si existe en la URL original
                // actionUrl={location.search.includes('category') ? `equipments${location.search}` : "equipments"}
            />
            
            <EquipmentForm
                onSubmit={handleUpdate}
                isSubmitting={isUpdating}
                initialData={equipment}
                mode="update"
            />
        </div>
    );
};

// import { useParams, useNavigate } from "react-router";
// import { useQuery } from "@tanstack/react-query";
// import { EquipmentForm } from "../components/CustomEquipmentForm";
// import { useEquipments } from "../hooks/useCreate-UpdateEquipment";
// import { Loader2 } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { getEquipmentByIdAction } from "../actions/get-equipment.actions";
// import type { EquipmentPayload } from "../actions/post-equipment.action";
// import { CustomBackToList } from "@/components/custom/CustomBackToList";
// import { sileo } from "sileo";
// import { isAxiosError } from "axios";

// export const UpdateEquipmentPage = () => {
//     const { id } = useParams();
//     const navigate = useNavigate();

//     const { updateEquipmentAsync, isUpdating } = useEquipments();

//     const { data: equipment, isLoading, isError } = useQuery({
//         queryKey: ["equipment", id],
//         queryFn: () => getEquipmentByIdAction(id!),
//         enabled: !!id,
//         retry: 1,
//         placeholderData: (previousData) => previousData,
//     });

//     const handleUpdate = async (formData: EquipmentPayload) => {
//         if (!id) return;

//         // Agregamos el return de la promesa para que el formulario sepa si falló o no
//         return await sileo.promise(
//             updateEquipmentAsync({
//                 id,
//                 payload: formData
//             }), 
//             {
//                 loading: {
//                     title: "Actualizando equipo...",
//                     description: "Por favor, espere un momento mientras se guardan los cambios."
//                 },
//                 success: {
//                     title: "¡Equipo actualizado!",
//                     description: "Los cambios se guardaron correctamente en el inventario.",
//                     duration: 4000
//                 },
//                 error: (err) => {
//                     let backendMessage = "Ocurrió un error inesperado al intentar actualizar.";

//                     if (isAxiosError(err) && err.response?.data) {
//                         const msg = err.response.data.message;
//                         backendMessage = Array.isArray(msg) ? msg.join(", ") : msg;
//                     }

//                     return {
//                         title: "Error al actualizar equipo",
//                         description: backendMessage,
//                         duration: 6000
//                     };
//                 }
//             }
//         );
//         navigate("/equipments");
//     };

//     if (isLoading && !equipment) {
//         return (
//             <div className="flex flex-col items-center justify-center min-h-[400px]">
//                 <Loader2 className="animate-spin mb-2 text-primary" size={40} />
//                 <p className="font-medium text-muted-foreground">Cargando información del equipo...</p>
//             </div>
//         );
//     }

//     if (isError || !equipment) {
//         return (
//             <div className="max-w-md mx-auto mt-20 text-center p-8 bg-red-50 rounded-2xl border border-red-100">
//                 <h2 className="text-red-800 font-bold text-xl mb-2">Equipo no encontrado</h2>
//                 <p className="text-red-600/80 mb-6">El registro que intentas editar no existe o no se pudo recuperar.</p>
//                 <Button variant="outline" onClick={() => navigate("/equipments")} className="border-red-200 text-red-700 hover:bg-red-100">
//                     Listar Equipos
//                 </Button>
//             </div>
//         );
//     }

//     return (
//         <div className="p-8 space-y-6">
//             <CustomBackToList 
//                 onBack={() => navigate('/equipments')} 
//                 backLabel={"Listar Equipos"} 
//                 actionUrl="equipments" 
//             />
            
//             <EquipmentForm
//                 onSubmit={handleUpdate}
//                 isSubmitting={isUpdating}
//                 initialData={equipment}
//                 mode="update"
//             />
//         </div>
//     );
// };
// import { useParams, useNavigate } from "react-router";
// import { useQuery } from "@tanstack/react-query";
// import { EquipmentForm } from "../components/CustomEquipmentForm";
// import { useEquipments } from "../hooks/useCreate-UpdateEquipment";
// import { Loader2 } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { getEquipmentByIdAction } from "../actions/get-equipment.actions";
// import type { EquipmentPayload } from "../actions/post-equipment.action";
// import { CustomBackToList } from "@/components/custom/CustomBackToList";
// import { sileo } from "sileo";
// import { isAxiosError } from "axios";

// export const UpdateEquipmentPage = () => {
//     const { id } = useParams();
//     const navigate = useNavigate();

//     const { updateEquipmentAsync, isUpdating } = useEquipments();

//     const { data: equipment, isLoading, isError } = useQuery({
//         queryKey: ["equipment", id],
//         queryFn: () => getEquipmentByIdAction(id!),
//         enabled: !!id,
//         retry: 1,
//         placeholderData: (previousData) => previousData,
//     });

//     const handleUpdate = async (formData: EquipmentPayload) => {
//         if (!id) return;
//             // Envolvemos con await para detener el flujo en caso de error del backend
//             await sileo.promise(
//                 updateEquipmentAsync({
//                     id,
//                     payload: formData
//                 }), 
//                 {
//                     loading: {
//                         title: "Actualizando equipo...",
//                         description: "Por favor, espere un momento mientras se guardan los cambios."
//                     },
//                     success: {
//                         title: "¡Equipo actualizado!",
//                         description: "Los cambios se guardaron correctamente en el inventario.",
//                         duration: 4000
//                     },
//                     error: (err) => {
//                         let backendMessage = "Ocurrió un error inesperado al intentar actualizar.";

//                         // Tipamos el error con BackendError para acceder de forma segura a .message
//                         if (isAxiosError(err) && err.response?.data) {
//                             const msg = err.response.data.message;
//                             // Une los errores del ValidationPipe de NestJS si es un array, si no usa el string
//                             backendMessage = Array.isArray(msg) ? msg.join(", ") : msg;
//                         }

//                         return {
//                             title: "Error al actualizar equipo",
//                             description: backendMessage,
//                             duration: 6000
//                         };
//                     }
//                 }
//             );

//             // Solo se ejecuta si la promesa de actualización fue exitosa
//             navigate("/equipments");

//     };

//     if (isLoading && !equipment) {
//         return (
//             <div className="flex flex-col items-center justify-center min-h-[400px]">
//                 <Loader2 className="animate-spin mb-2 text-primary" size={40} />
//                 <p className="font-medium text-muted-foreground">Cargando información del equipo...</p>
//             </div>
//         );
//     }

//     if (isError || !equipment) {
//         return (
//             <div className="max-w-md mx-auto mt-20 text-center p-8 bg-red-50 rounded-2xl border border-red-100">
//                 <h2 className="text-red-800 font-bold text-xl mb-2">Equipo no encontrado</h2>
//                 <p className="text-red-600/80 mb-6">El registro que intentas editar no existe o no se pudo recuperar.</p>
//                 <Button variant="outline" onClick={() => navigate("/equipments")} className="border-red-200 text-red-700 hover:bg-red-100">
//                     Listar Equipos
//                 </Button>
//             </div>
//         );
//     }

//     return (
//         <div className="p-8 space-y-6">
//             <CustomBackToList 
//                 onBack={() => navigate('/equipments')} 
//                 backLabel={"Listar Equipos"} 
//                 actionUrl="equipments" 
//             />
            
//             <EquipmentForm
//                 onSubmit={handleUpdate}
//                 isSubmitting={isUpdating}
//                 initialData={equipment}
//                 mode="update"
//             />
//         </div>
//     );
// };

// import { useParams, useNavigate } from "react-router";
// import { useQuery } from "@tanstack/react-query";
// import { EquipmentForm } from "../components/CustomEquipmentForm";
// import { useEquipments } from "../hooks/useCreate-UpdateEquipment";
// import { Loader2 } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { getEquipmentByIdAction } from "../actions/get-equipment.actions";
// import type { EquipmentPayload } from "../actions/post-equipment.action";
// import { CustomBackToList } from "@/components/custom/CustomBackToList";
// import { sileo } from "sileo";
// import { isAxiosError } from "axios";

// export const UpdateEquipmentPage = () => {
//     const { id } = useParams();
//     const navigate = useNavigate();

//     const { updateEquipmentAsync, isUpdating } = useEquipments();

//     const { data: equipment, isLoading, isError } = useQuery({
//         queryKey: ["equipment", id],
//         queryFn: () => getEquipmentByIdAction(id!),
//         enabled: !!id,
//         retry: 1,
//         placeholderData: (previousData) => previousData,
//     });

//     const handleUpdate = async (formData: EquipmentPayload) => {
//         if (!id) return;

//         // Envolvemos la promesa asíncrona con el manejador de notificaciones visuales
//         await sileo.promise(
//             updateEquipmentAsync({
//                 id,
//                 payload: formData
//             }), 
//             {
//                 loading: {
//                     title: "Actualizando equipo...",
//                     description: "Por favor, espere un momento mientras se guardan los cambios."
//                 },
//                 success: {
//                     title: "¡Equipo actualizado!",
//                     description: "Los cambios se guardaron correctamente en el inventario.",
//                     duration: 4000
//                 },
//                 error: (err) => {
//                     let backendMessage = "Ocurrió un error inesperado al intentar actualizar.";

//                     // Estructuramos e interceptamos el ValidationPipe de NestJS
//                     if (isAxiosError(err) && err.response?.data) {
//                         const msg = err.response.data.message;
//                         backendMessage = Array.isArray(msg) ? msg.join(", ") : msg;
//                     }

//                     return {
//                         title: "Error al actualizar equipo",
//                         description: backendMessage,
//                         duration: 6000
//                     };
//                 }
//             }
//         );

//         // Al igual que en la creación, solo redirige si la promesa fue exitosa
//         navigate("/equipments");
//     };

//     if (isLoading && !equipment) {
//         return (
//             <div className="flex flex-col items-center justify-center min-h-[400px]">
//                 <Loader2 className="animate-spin mb-2 text-primary" size={40} />
//                 <p className="font-medium text-muted-foreground">Cargando información del equipo...</p>
//             </div>
//         );
//     }

//     if (isError || !equipment) {
//         return (
//             <div className="max-w-md mx-auto mt-20 text-center p-8 bg-red-50 rounded-2xl border border-red-100">
//                 <h2 className="text-red-800 font-bold text-xl mb-2">Equipo no encontrado</h2>
//                 <p className="text-red-600/80 mb-6">El registro que intentas editar no existe o no se pudo recuperar.</p>
//                 <Button variant="outline" onClick={() => navigate("/equipments")} className="border-red-200 text-red-700 hover:bg-red-100">
//                     Listar Equipos
//                 </Button>
//             </div>
//         );
//     }

//     return (
//         <div className="p-8 space-y-6">
//             <CustomBackToList 
//                 onBack={() => navigate('/equipments')} 
//                 backLabel={"Listar Equipos"} 
//                 actionUrl="equipments" 
//             />
            
//             <EquipmentForm
//                 onSubmit={handleUpdate}
//                 isSubmitting={isUpdating}
//                 initialData={equipment}
//                 mode="update"
//             />
//         </div>
//     );
// };
// import { useParams, useNavigate } from "react-router";
// import { useQuery } from "@tanstack/react-query";
// import { EquipmentForm } from "../components/CustomEquipmentForm";
// import { useEquipments } from "../hooks/useCreate-UpdateEquipment";
// import { Loader2 } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { getEquipmentByIdAction } from "../actions/get-equipment.actions";
// import type { EquipmentPayload } from "../actions/post-equipment.action";
// import { CustomBackToList } from "@/components/custom/CustomBackToList";

// export const UpdateEquipmentPage = () => {
//     const { id } = useParams();
//     const navigate = useNavigate();

//     const { updateEquipmentAsync, isUpdating } = useEquipments();

//     const { data: equipment, isLoading, isError } = useQuery({
//         queryKey: ["equipment", id],
//         queryFn: () => getEquipmentByIdAction(id!),
//         enabled: !!id,
//         retry: 1,
//         placeholderData: (previousData) => previousData,
//     });

//     // 1. AJUSTE EN LA FUNCIÓN DE ENVÍO
//     const handleUpdate = async (formData: EquipmentPayload) => {
//         try {
//             if (!id) return;

//             // El hook useEquipments espera { id, payload }
//             // Cambiamos 'data: formData' por 'payload: formData' para que coincida con el hook
//             await updateEquipmentAsync({
//                 id,
//                 payload: formData
//             });

//             navigate("/equipments");
//         } catch (error) {
//             console.error("Error en el flujo de actualización:", error);
//         }
//     };

//     if (isLoading && !equipment) {
//         return (
//             <div className="flex flex-col items-center justify-center min-h-400px">
//                 <Loader2 className="animate-spin  mb-2" size={40} />
//                 <p className=" font-medium">Cargando información del equipo...</p>
//             </div>
//         );
//     }

//     if (isError || !equipment) {
//         return (
//             <div className="max-w-md mx-auto mt-20 text-center p-8 bg-red-50 rounded-2xl border border-red-100">
//                 <h2 className="text-red-800 font-bold text-xl mb-2">Equipo no encontrado</h2>
//                 <p className="text-red-600/80 mb-6">El registro que intentas editar no existe o no se pudo recuperar.</p>
//                 <Button variant="outline" onClick={() => navigate("/equipments")} className="border-red-200 text-red-700 hover:bg-red-100">
//                     Listar Equipos
//                 </Button>
//             </div>
//         );
//     }

//     return (
//         <div className="py-8 space-y-10">

//             <CustomBackToList onBack={() => navigate('/equipments')} backLabel={"Listar Equipos"} actionUrl="equipments" />
//             {/* <p className="text-semibold text-muted-foreground text-center">
//                 Modificando: <span className="font-bold text-foreground">{equipment.num_inventario || "Sin inventario"}</span>
//             </p> */}
//             {/* 2. AJUSTE EN LAS PROPS DEL FORMULARIO */}
//             <EquipmentForm
//                 onSubmit={handleUpdate}
//                 isSubmitting={isUpdating}
//                 initialData={equipment}
//                 mode="update" // Cambiado de "create" a "update"
//             />
//         </div>
//     );
// };