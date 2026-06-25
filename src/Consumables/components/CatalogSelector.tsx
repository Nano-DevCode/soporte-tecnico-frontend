import { useMemo } from "react";
import { InfiniteScrollSelectconsumables } from "./infinite-scroll-selectconsu";

interface Option {
  id: string | number;
  name: string;
}

interface UseCatalogFactoryResult {
  options: Option[];
  isLoading: boolean;
  isFetchingNextPage: boolean;
  searchTerm: string;
  setSearch: (term: string) => void;
  setSelectedId: (id: string | null) => void;
  fetchNextPage: () => void;
  hasNextPage: boolean;
  onCreate: (data: { name: string }) => Promise<Option>;
}

interface CatalogSelectorProps {
  hookResult: UseCatalogFactoryResult;
  value: Option | null;
  onChange: (value: Option | null) => void;
  placeholder?: string;
  allowCreate?: boolean;
  onCreate?: (name: string) => void;
  disabled?: boolean;
}

export const CatalogSelector = ({
  hookResult,
  value,
  onChange,
  placeholder,
  allowCreate = false,
  onCreate,
  disabled = false,
}: CatalogSelectorProps) => {
  const {
    options,
    isLoading,
    isFetchingNextPage,
    setSearch,
    setSelectedId,
    fetchNextPage,
    hasNextPage,
  } = hookResult;

  // Se envuelve en useMemo para mantener una referencia de memoria idéntica
  const normalizedOptions = useMemo(() => {
    return options.map((item) => ({
      id: String(item.id),
      name: item.name || "",
    }));
  }, [options]);

  // Se estabiliza el objeto value mapeado de forma segura
  const normalizedValue = useMemo(() => {
    return value ? { id: String(value.id), name: value.name || "" } : null;
  }, [value]);

  // Manejador intermedio para actualizar el ID en el acto cuando el usuario interactúe
  const handleSelectChange = (newValue: Option | null) => {
    setSelectedId(newValue?.id ? String(newValue.id) : null);
    onChange(newValue);
  };

  return (
    <InfiniteScrollSelectconsumables
      options={normalizedOptions}
      value={normalizedValue}
      onChange={handleSelectChange}
      onSearch={setSearch}
      fetchNextPage={fetchNextPage}
      hasNextPage={hasNextPage}
      isFetchingNextPage={isFetchingNextPage}
      isLoading={isLoading}
      placeholder={placeholder}
      allowCreate={allowCreate}
      onCreate={onCreate}
      disabled={disabled}
    />
  );
};
// import { useMemo, useEffect } from "react";
// import { InfiniteScrollSelectconsumables } from "./infinite-scroll-selectconsu";

// interface Option {
//   id: string | number;
//   name: string;
// }

// interface UseCatalogFactoryResult {
//   options: Option[];
//   isLoading: boolean;
//   isFetchingNextPage: boolean;
//   searchTerm: string;
//   setSearch: (term: string) => void;
//   setSelectedId: (id: string | null) => void;
//   fetchNextPage: () => void;
//   hasNextPage: boolean;
//   onCreate: (data: { name: string }) => Promise<Option>;
// }

// interface CatalogSelectorProps {
//   hookResult: UseCatalogFactoryResult;
//   value: Option | null;
//   onChange: (value: Option | null) => void;
//   placeholder?: string;
//   allowCreate?: boolean;
//   onCreate?: (name: string) => void;
//   disabled?: boolean;
// }

// export const CatalogSelector = ({
//   hookResult,
//   value,
//   onChange,
//   placeholder,
//   allowCreate = false,
//   onCreate,
//   disabled = false,
// }: CatalogSelectorProps) => {
//   const {
//     options,
//     isLoading,
//     isFetchingNextPage,
//     setSearch,
//     setSelectedId,
//     fetchNextPage,
//     hasNextPage,
//   } = hookResult;

//   // Sync selected id from the controlled value when it changes
//   useEffect(() => {
//     setSelectedId(value?.id ? String(value.id) : null);
//   }, [value, setSelectedId]);

//   // Se envuelve en useMemo para mantener una referencia de memoria idéntica si los datos no cambian
//   const normalizedOptions = useMemo(() => {
//     return options.map((item) => ({
//       id: String(item.id),
//       name: item.name || "",
//     }));
//   }, [options]);

//   // Se estabiliza el objeto value mapeado de forma segura
//   const normalizedValue = useMemo(() => {
//     return value ? { id: String(value.id), name: value.name || "" } : null;
//   }, [value]);

//   // Manejador intermedio para actualizar el ID en el acto cuando el usuario interactúe
//   const handleSelectChange = (newValue: Option | null) => {
//     setSelectedId(newValue?.id ? String(newValue.id) : null);
//     onChange(newValue);
//   };

//   return (
//     <InfiniteScrollSelectconsumables
//       options={normalizedOptions}
//       value={normalizedValue}
//       onChange={handleSelectChange}
//       onSearch={setSearch}
//       fetchNextPage={fetchNextPage}
//       hasNextPage={hasNextPage}
//       isFetchingNextPage={isFetchingNextPage}
//       isLoading={isLoading}
//       placeholder={placeholder}
//       allowCreate={allowCreate}
//       onCreate={onCreate}
//       disabled={disabled}
//     />
//   );
// };