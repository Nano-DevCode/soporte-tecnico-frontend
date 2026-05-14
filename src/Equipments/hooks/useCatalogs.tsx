/* eslint-disable @typescript-eslint/no-explicit-any */
import { InfiniteScrollSelect } from "../components/infinite-scroll-select";

interface CatalogSelectorProps {
    hook: any; 
    value: { id: string; name: string } | null;
    onChange: (val: { id: string; name: string } | null) => void;
    placeholder?: string;
    allowCreate?: boolean;
    disabled?: boolean; 
}

export const CatalogSelector = ({
    hook,
    value,
    onChange,
    placeholder,
    allowCreate = true,
    disabled = false,
}: CatalogSelectorProps) => {
    const { 
        options, 
        isLoading, 
        setSearch, 
        fetchNextPage, 
        hasNextPage, 
        isCreating, 
        onCreate 
    } = hook;

    // Transformación básica para asegurar que el componente reciba un string en 'name'
    const formattedOptions = options.map((opt: any) => ({
        id: opt.id,
        name: opt.name || opt.model  || "Sin nombre"
    }));

    const handleCreate = async (name: string) => {
        try {
            const newItem = await onCreate(name);
            if (newItem) {
                onChange({
                    id: newItem.id,
                    name: newItem.name || newItem.model ||  name
                });
            }
        } catch (error) {
            console.error("Error al crear elemento:", error);
        }
    };

    return (
        <InfiniteScrollSelect
            options={formattedOptions}
            value={value} 
            onChange={onChange}
            onSearch={setSearch}
            fetchNextPage={fetchNextPage}
            hasNextPage={hasNextPage}
            isLoading={isLoading || isCreating}
            placeholder={placeholder}
            // allowCreate={allowCreate}
            allowCreate={allowCreate && !disabled}
            onCreate={handleCreate}
            isFetchingNextPage={false} 
            disabled={disabled}
        />
    );
};

// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { InfiniteScrollSelect } from "../components/infinite-scroll-select";

// interface CatalogSelectorProps {
//     hook: any; 
//     value: { id: string; name: string } | null;
//     onChange: (val: { id: string; name: string } | null) => void;
//     placeholder?: string;
//     allowCreate?: boolean;
// }

// export const CatalogSelector = ({
//     hook,
//     value,
//     onChange,
//     placeholder,
//     allowCreate = true,
// }: CatalogSelectorProps) => {
//     const { 
//         options, 
//         isLoading, 
//         setSearch, 
//         fetchNextPage, 
//         hasNextPage, 
//         isCreating, 
//         onCreate 
//     } = hook;

//     // Mantenemos la transformación mínima para asegurar que siempre haya un 'name'
//     // Pero sin concatenaciones complejas de procesador aquí.
//     const formattedOptions = options.map((opt: any) => ({
//         id: opt.id,
//         name: opt.name || opt.model || "Sin nombre"
//     }));

//     const handleCreate = async (name: string) => {
//         try {
//             const newItem = await onCreate(name);
//             if (newItem) {
//                 onChange({
//                     id: newItem.id,
//                     name: newItem.name || newItem.model || name
//                 });
//             }
//         } catch (error) {
//             console.error("Error al crear elemento:", error);
//         }
//     };

//     return (
//         <InfiniteScrollSelect
//             options={formattedOptions}
//             value={value} 
//             onChange={onChange}
//             onSearch={setSearch}
//             fetchNextPage={fetchNextPage}
//             hasNextPage={hasNextPage}
//             isLoading={isLoading || isCreating}
//             placeholder={placeholder}
//             allowCreate={allowCreate}
//             onCreate={handleCreate}
//             isFetchingNextPage={false} 
//         />
//     );
// };

// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { InfiniteScrollSelect } from "../components/infinite-scroll-select";

// interface CatalogSelectorProps {
//     hook: any; 
//     value: { id: string; name: string } | null;
//     onChange: (val: { id: string; name: string } | null) => void;
//     placeholder?: string;
//     allowCreate?: boolean;
//     extraElement?: React.ReactNode; 
// }

// export const CatalogSelector = ({
//     hook,
//     value,
//     onChange,
//     placeholder,
//     allowCreate = true,
//     extraElement,
// }: CatalogSelectorProps) => {
//     const { options, isLoading, setSearch, fetchNextPage, hasNextPage, isCreating, onCreate } = hook;

//     // 1. Formateamos las opciones para que el scroll muestre Brand + Model
//     const formattedOptions = options.map((opt: any) => ({
//         id: opt.id,
//         // Si tiene 'name' (Marcas, OS), lo usa. Si no, concatena (Procesadores).
//         name: opt.name || `${opt.brand} ${opt.model} ${opt.description || ''}`.trim()
//     }));

//     // 2. IMPORTANTE: Ajustamos el valor seleccionado para que coincida con el formato
//     // Esto evita que el select se vea vacío al seleccionar un procesador existente
//     const selectedValue = value 
//         ? formattedOptions.find((opt: any) => opt.id === value.id) || value 
//         : null;

//     const handleCreate = async (name: string) => {
//         try {
//             const newItem = await onCreate(name);
//             if (newItem) {
//                 onChange({
//                     id: newItem.id,
//                     name: newItem.name || `${newItem.brand} ${newItem.model}`.trim()
//                 });
//             }
//         } catch (error) {
//             console.error("Error al crear elemento:", error);
//         }
//     };

//     return (
//         <InfiniteScrollSelect
//             options={formattedOptions}
//             value={selectedValue} // Usamos el valor verificado
//             onChange={onChange}
//             onSearch={setSearch}
//             fetchNextPage={fetchNextPage}
//             hasNextPage={hasNextPage}
//             isLoading={isLoading || isCreating}
//             placeholder={placeholder}
//             allowCreate={allowCreate}
//             onCreate={handleCreate}
//             isFetchingNextPage={false} 
//             // 3. Pasamos el botón extra al final de la lista
//             footer={extraElement} 
//         />
//     );
// };