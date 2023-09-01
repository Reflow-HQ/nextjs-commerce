export class ReflowApiError extends Error {
  endpoint?: string;
  status?: number;
  body?: object;
}
