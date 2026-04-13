export interface BackendError {
  message: string | string[];
  error: string;
  statusCode: number;
}