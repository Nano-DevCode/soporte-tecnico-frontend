export type FeatureCategory = 'ui' | 'productivity' | 'tickets' | 'system';
export type FeatureBadge = 'Beta' | 'Experimental' | 'Próximamente';

export interface FeatureFlag {
  id: string;
  title: string;
  description: string;
  category: FeatureCategory;
  badge?: FeatureBadge;
  iconName?: string;
  enabled: boolean;
}
