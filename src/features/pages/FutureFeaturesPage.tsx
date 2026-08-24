import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Sparkles, Search, XCircle, Database, type LucideIcon } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

import { useFeatureFlags, useToggleFeatureFlag, useSeedFeatureFlags } from '../hooks/useFeatureFlags';
import type { FeatureCategory } from '../interfaces/feature-flags.types';

import { CustomTitleCard } from '@/components/custom/CustomTitleCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

const CATEGORIES: { value: FeatureCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'Todas' },
  { value: 'ui', label: 'Interfaz UI' },
  { value: 'productivity', label: 'Productividad' },
  { value: 'tickets', label: 'Tickets' },
  { value: 'system', label: 'Sistema' }
];

export const FutureFeaturesPage = () => {
  const { t } = useTranslation();

  const { data: flags = [], isLoading, isError } = useFeatureFlags();
  const toggleMutation = useToggleFeatureFlag();
  const seedMutation = useSeedFeatureFlags();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<FeatureCategory | 'all'>('all');

  // Filtrado de flags
  const filteredFlags = useMemo(() => {
    return flags.filter((flag) => {
      const matchesSearch = flag.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        flag.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || flag.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [flags, searchQuery, selectedCategory]);

  const activeCount = flags.filter((f) => f.enabled).length;

  const handleToggle = (id: string, currentEnabled: boolean) => {
    toggleMutation.mutate({ id, enabled: !currentEnabled });
  };

  const handleSeed = () => {
    seedMutation.mutate();
  };

  const renderIcon = (iconName?: string) => {
    if (!iconName) return <Sparkles className="h-5 w-5" />;
    const IconComponent = LucideIcons[iconName as keyof typeof LucideIcons] as LucideIcon;
    return IconComponent ? <IconComponent className="h-5 w-5" /> : <Sparkles className="h-5 w-5" />;
  };

  if (isLoading) {
    return (
      <div className="flex w-full h-full min-h-[500px] items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex w-full h-full min-h-[500px] flex-col items-center justify-center text-destructive gap-4">
        <XCircle className="h-12 w-12" />
        <p>Error al cargar los feature flags. Por favor intenta de nuevo.</p>
      </div>
    );
  }

  return (
    <div className="flex w-full max-w-6xl flex-col p-4 md:p-8 mx-auto animate-in fade-in duration-500 gap-6">

      <CustomTitleCard
        title={t('future_features', 'Laboratorio de Funciones')}
        description={t('future_features_description', 'Explora y activa funciones experimentales, en fase beta o de próximo lanzamiento antes que nadie.')}
        icon={Sparkles}
      />

      {/* Panel de Control y Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

        {/* Métricas */}
        <Card className="md:col-span-1 border-primary/20 bg-primary/5">
          <CardContent className="p-4 flex flex-col items-center justify-center h-full text-center space-y-1">
            <span className="text-3xl font-bold text-primary">{activeCount} / {flags.length}</span>
            <span className="text-sm text-muted-foreground font-medium">Funciones Activas</span>
          </CardContent>
        </Card>

        {/* Acciones Rápidas */}
        <Card className="md:col-span-3">
          <CardContent className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4 h-full">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar función..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
              <Button variant="outline" size="sm" onClick={handleSeed} disabled={seedMutation.isPending} className="whitespace-nowrap">
                <Database className="h-4 w-4 mr-2 text-blue-600" /> Inicializar (Seed)
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Píldoras de Categorías */}
      <ScrollArea className="w-full whitespace-nowrap pb-2">
        <div className="flex gap-2">
          {CATEGORIES.map((cat) => (
            <Badge
              key={cat.value}
              variant={selectedCategory === cat.value ? 'default' : 'secondary'}
              className="cursor-pointer px-4 py-1.5 text-sm hover:bg-primary/80 transition-colors"
              onClick={() => setSelectedCategory(cat.value)}
            >
              {cat.label}
            </Badge>
          ))}
        </div>
      </ScrollArea>

      <Separator />

      {/* Listado de Funciones */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-12">
        {filteredFlags.length > 0 ? (
          filteredFlags.map((flag) => {
            return (
              <Card
                key={flag.id}
                className={`transition-all duration-300 ${flag.enabled ? 'border-primary/50 shadow-sm bg-primary/[0.02]' : 'hover:border-border/80'}`}
              >
                <CardContent className="p-5 flex gap-4">

                  <div className={`mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${flag.enabled ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                    {renderIcon(flag.iconName)}
                  </div>

                  <div className="flex flex-col flex-1 gap-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-semibold text-base flex items-center gap-2">
                          {flag.title}
                          {flag.badge && (
                            <Badge variant="outline" className={`text-xs px-2 font-normal ${flag.badge === 'Beta' ? 'border-blue-500/50 text-blue-600 dark:text-blue-400' :
                              flag.badge === 'Experimental' ? 'border-amber-500/50 text-amber-600 dark:text-amber-400' :
                                'border-purple-500/50 text-purple-600 dark:text-purple-400'
                              }`}>
                              {flag.badge}
                            </Badge>
                          )}
                        </h3>
                      </div>

                      <Switch
                        checked={flag.enabled}
                        disabled={toggleMutation.isPending}
                        onCheckedChange={() => handleToggle(flag.id, flag.enabled)}
                        className="mt-1"
                      />
                    </div>

                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {flag.description}
                    </p>

                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <div className="col-span-1 md:col-span-2 py-12 flex flex-col items-center justify-center text-center">
            <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <Search className="h-8 w-8 text-muted-foreground/50" />
            </div>
            <h3 className="text-lg font-medium">No se encontraron funciones</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm">
              Intenta con otra búsqueda o selecciona una categoría diferente.
            </p>
          </div>
        )}
      </div>

    </div>
  );
};

export default FutureFeaturesPage;
