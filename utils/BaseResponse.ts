import { StatusCode } from './enum';

export default class BaseResponse {
  status: number;
  success: boolean;
  message: string;
  data: any;

  constructor(status?: number, success?: boolean, message?: string, data?: any) {
    this.status = status || StatusCode.INTERNAL_SERVER_ERROR;
    this.success = success || false;
    this.message = message || '';
    this.data = data || '';
  }

  responseBody() {
    return {
      success: this.success,
      message: this.message,
      data: this.data,
    };
  }
}
