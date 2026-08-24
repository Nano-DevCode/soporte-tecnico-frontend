import { soporteTecnicoApi } from '../../api/soporteTecnicoApi';
import type { FeatureFlag } from '../interfaces/feature-flags.types';

export const getFeatureFlags = async (): Promise<FeatureFlag[]> => {
  const { data } = await soporteTecnicoApi.get<FeatureFlag[]>('/feature-flags');
  return data;
};

export const toggleFeatureFlag = async (id: string, enabled: boolean): Promise<FeatureFlag> => {
  const { data } = await soporteTecnicoApi.patch<FeatureFlag>(`/feature-flags/${id}/toggle`, { enabled });
  return data;
};

export const executeSeed = async (): Promise<{ message: string }> => {
  const { data } = await soporteTecnicoApi.get<{ message: string }>('/feature-flags-seed');
  return data;
};
