import { HttpHeader } from './http-header.type';

export interface HttpResponse {
  payload: string;
  statusCode: number;
  header: HttpHeader;
}
