import { memo } from 'react'; // <-- Agregamos memo
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useSearchParams } from 'react-router';
import { useTranslation } from 'react-i18next';

interface Props {
  totalPages: number;
}

export const CustomPagination = memo(({ totalPages }: Props) => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  const queryPage = searchParams.get('page') || '1';
  const currentPage = isNaN(+queryPage) ? 1 : +queryPage;
  
  const queryLimit = searchParams.get('limit') || '10';

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', newPage.toString());
    setSearchParams(newParams);
  };

  const handleLimitChange = (value: string) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('limit', value);
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const renderPageNumbers = () => {
    // Si totalPages es 0 o menor, regresamos array vacío
    if (totalPages <= 0) return [];
    
    if (totalPages <= 6) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    let startPage = Math.max(2, currentPage - 2);
    let endPage = Math.min(totalPages - 1, currentPage + 1);

    // Ajuste cuando estás al inicio
    if (currentPage <= 3) {
      startPage = 2;
      endPage = 5;
    }

    // Ajuste cuando estás al final
    if (currentPage >= totalPages - 2) {
      startPage = totalPages - 4;
      endPage = totalPages - 1;
    }

    const pages: (number | string)[] = [];

    // Siempre primera
    pages.push(1);

    if (startPage > 2) {
      pages.push('ellipsis-start');
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (endPage < totalPages - 1) {
      pages.push('ellipsis-end');
    }

    // Siempre última
    pages.push(totalPages);

    return pages;
  };

  // Si no hay páginas, no renderizamos el componente
  if (totalPages <= 0) return null;

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-4 sm:flex-row sm:gap-8">
      
      {/* Selector de Registros */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span className="whitespace-nowrap">{t("custom_pagination_rows_per_page")}</span>
        <Select 
          value={queryLimit} 
          // defaultValue='10' <-- Quitamos esto, el value ya hace el trabajo en Radix
          onValueChange={handleLimitChange}
        >
          <SelectTrigger className="h-8 w-17.5">
            <SelectValue placeholder={queryLimit} />
          </SelectTrigger>
          <SelectContent side="top">
            {[5, 10, 20, 50, 100].map((pageSize) => (
              <SelectItem key={pageSize} value={`${pageSize}`}>
                {pageSize}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Botones de Paginación */}
      <div className="flex items-center gap-1 overflow-x-auto">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 shrink-0"
          disabled={currentPage <= 1} // Ajustado para mayor seguridad
          onClick={() => handlePageChange(currentPage - 1)}
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">{t("custom_pagination_previous")}</span>
        </Button>

        {renderPageNumbers().map((pageNum) => {
          if (pageNum === 'ellipsis-start' || pageNum === 'ellipsis-end') {
            return (
              // Usamos pageNum directamente (es un string único en este contexto)
              <span key={pageNum as string} className="flex h-8 w-8 items-center justify-center shrink-0">
                <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
              </span>
            );
          }

          return (
            <Button
              key={pageNum as number} // <-- ¡Usamos el número de página como KEY!
              variant={currentPage === pageNum ? 'default' : 'outline'}
              size="icon"
              className="h-8 w-8 shrink-0"
              onClick={() => handlePageChange(pageNum as number)}
            >
              {pageNum}
            </Button>
          );
        })}

        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 shrink-0"
          disabled={currentPage >= totalPages} 
          onClick={() => handlePageChange(currentPage + 1)}
        >
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">{t("custom_pagination_next")}</span> 
        </Button>

      </div>
    </div>
  );
});
