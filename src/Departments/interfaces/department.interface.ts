export interface DepartmentResponse {
  data: Department[];
  meta: Meta;
}

export interface Department {
  id?: string;
  name: string;
  priority: number;
  status?: boolean;
  folio: string;
  acronym: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Meta {
  total: number;
  page: number;
  lastPage: number;
}