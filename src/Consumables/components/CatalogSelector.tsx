import { useEffect } from "react";
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

  // Sincroniza el ID actual con el factory para evitar pérdidas de datos en modo edición
  useEffect(() => {
    if (value?.id) {
      setSelectedId(String(value.id));
    } else {
      setSelectedId(null);
    }
  }, [value?.id, setSelectedId]);

  // Mapeo seguro de los tipos primitivos del backend a la estructura Option
  const normalizedOptions = options.map((item) => ({
    id: String(item.id),
    name: item.name || "",
  }));

  const normalizedValue = value
    ? { id: String(value.id), name: value.name || "" }
    : null;

  return (
    <InfiniteScrollSelectconsumables
      options={normalizedOptions}
      value={normalizedValue}
      onChange={onChange}
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