    import { useEquipments } from "../hooks/useCreate-UpdateEquipment";
    import { EquipmentForm } from "../components/CustomEquipmentForm";
    import { useNavigate } from "react-router";
    import type { EquipmentPayload } from "../actions/post-equipment.action";
    import { CustomBackToList } from "@/components/custom/CustomBackToList";
    import { sileo } from "sileo";
    import { isAxiosError } from "axios";

    export const CreateEquipmentPage = () => {
        const navigate = useNavigate();
        const { createEquipmentAsync, isCreating } = useEquipments();

        const handleFormSubmit = async (formData: EquipmentPayload) => {
            await sileo.promise(createEquipmentAsync(formData), {
                loading: {
                    title: "Registrando equipo...",
                    description: "Por favor, espere un momento."
                },
                success: {
                    title: "¡Equipo registrado!",
                    description: `El equipo se guardó correctamente en el inventario.`,
                    duration: 4000
                },
                // CAPTURAMOS EL ERROR DE AXIOS AQUÍ PARA EL SILEO
                error: (err) => {
                    let backendMessage = "Ocurrió un error, verifica los espacios del formulario.";

                    if (isAxiosError(err) && err.response?.data) {
                        const msg = err.response.data.message;
                        // Si NestJS devuelve un array de ValidationsPipe, los unimos con comas
                        backendMessage = Array.isArray(msg) ? msg.join(", ") : msg;
                    }

                    return {
                        title: "Error al registrar equipo",
                        description: backendMessage, // <-- Este mensaje saldrá en la alerta de Sileo
                        duration: 6000
                    };
                }
            });

            // Solo redirige si la promesa fue exitosa
            navigate("/equipments");
        };  

        return (
            <div className="p-8">
                <CustomBackToList
                    onBack={() => navigate('/equipments')}
                    backLabel={"Listar Equipos"}
                    actionUrl="equipments"
                />

                <EquipmentForm
                    onSubmit={handleFormSubmit}
                    isSubmitting={isCreating}
                    mode={"create"}
                />
            </div>
        );
    };
// import { useEquipments } from "../hooks/useCreate-UpdateEquipment";
// import { EquipmentForm } from "../components/CustomEquipmentForm";
// import { useNavigate } from "react-router";
// import type { EquipmentPayload } from "../actions/post-equipment.action";
// import { CustomBackToList } from "@/components/custom/CustomBackToList";
// import { sileo } from "sileo";

// export const CreateEquipmentPage = () => {
//     const navigate = useNavigate();
//     const { createEquipmentAsync, isCreating } = useEquipments();

//     const handleFormSubmit = async (formData: EquipmentPayload) => {
//         // Ejecutamos la promesa directamente para que el catch del Formulario
//         // pueda interceptar el objeto AxiosError exacto.
//         await sileo.promise(createEquipmentAsync(formData), {
//             loading: {
//                 title: "Registrando equipo...",
//                 description: "Por favor, espere un momento."
//             },
//             success: {
//                 title: "¡Equipo registrado!",
//                 description: `El equipo se guardó correctamente en el inventario.`,
//                 duration: 4000
//             },
//             error: () => ({
//             // IMPORTANTE: Dejamos el manejo de las alertas por campo al Formulario.
//             // Sileo por defecto silenciará la alerta global si se lanza un error controlado,
//             // pero si quieres una alerta general genérica en barra superior además del input en rojo,
//             // puedes dejar esto configurado aquí de manera sutil:
//             title: "Error al guardar equipo",
//             description: "Verifique los datos ingresados.",
//             duration: 5000

//         })});

//         // Si la promesa de arriba falla, Sileo frena la ejecución,
//         // por lo que el navigate solo se ejecutará si todo salió bien (HTTP 201).
//         navigate("/equipments");
//     };

//     return (
//         <div className="p-8">
//             <CustomBackToList
//                 onBack={() => navigate('/equipments')}
//                 backLabel={"Listar Equipos"}
//                 actionUrl="equipments"
//             />

//             <EquipmentForm
//                 onSubmit={handleFormSubmit}
//                 isSubmitting={isCreating}
//                 mode={"create"}
//             />
//         </div>
//     );
// };
// import { useEquipments } from "../hooks/useCreate-UpdateEquipment";
// import { EquipmentForm } from "../components/CustomEquipmentForm";
// import { useNavigate } from "react-router";
// import type { EquipmentPayload } from "../actions/post-equipment.action";
// import { CustomBackToList } from "@/components/custom/CustomBackToList";
// import { sileo } from "sileo";


// export const CreateEquipmentPage = () => {
//     const navigate = useNavigate();
//     const { createEquipmentAsync, isCreating } = useEquipments();

//     // ESTO ES LO QUE PREGUNTASTE:
//     const handleFormSubmit = async (formData: EquipmentPayload) => {
//         try {
//             // Este se tiene que revisar con los errores a revisar
//             // createEquipmentAsync(formData);
//             await sileo.promise(createEquipmentAsync(formData), {
//                 loading: { title: "Registrando herramienta..." },
//                 success: {
//                     title: "¡Herramienta registrada!",
//                     description: `La herramienta se guardó correctamente.`,
//                     duration: 4000
//                 },
//                 error: {
//                     title: "Error al guardar"}
//             });

//             // 2. Si la API responde OK, rediriges al usuario
//             navigate("/equipments");
//         } catch (err) {
//             // El error ya lo muestra el Toast (configurado en el hook)
//             // Aquí puedes poner lógica extra, como limpiar un campo específico
//             console.error("Error al guardar:", err);
//         }
//     };

//     return (
//         <div className="p-8">
//             <CustomBackToList onBack={() => navigate('/equipments')} backLabel={"Listar Equipos"} actionUrl="equipments" />


//             {/* Le pasas la función al formulario */}
//             <EquipmentForm
//                 onSubmit={handleFormSubmit}
//                 isSubmitting={isCreating} mode={"create"}            />
//         </div>
//     );
// };