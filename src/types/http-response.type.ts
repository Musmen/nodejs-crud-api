import { HttpHeader } from './http-header.type.ts';

export interface HttpResponse {
  payload: string;
  statusCode: number;
  header: HttpHeader;
}
