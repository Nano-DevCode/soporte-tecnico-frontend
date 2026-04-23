export interface CenterManager {
    id:               string;
    names:            string;
    first_last_name:  string;
    second_last_name: string;
    is_active:        boolean;
    rfc:              string;
    created_at:       Date | undefined;
    updated_at:       Date | undefined;
}

export type CreateCenterManagerPayload = Omit<
  CenterManager, 
  'id' | 'is_active' | 'created_at' | 'updated_at'
>;