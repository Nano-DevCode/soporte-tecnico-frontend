export interface UserFormData {
  email: string;
  password?: string;
  name: string;
  paternalSurname: string;
  maternalSurname: string;
  num_control: string;
  rfc: string;
  idTelegram?: string;
  roleId: string;
  departmentId: string;
  coordinationId?: string;
}

export const USER_REGEX = {
  password: /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
  lettersOnly: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
  numericOnly: /^[0-9]+$/,
  alphanumeric: /^[a-zA-Z0-9]+$/,
  rfc: /^[A-Z0-9]+$/,
  uuidV4: /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
};