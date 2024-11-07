import { HttpHeader } from './http-header.type';

export interface HttpMethodHandler {
  payload: string;
  statusCode: number;
  header: HttpHeader;
}
