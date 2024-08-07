import { StatusCode } from '~/utils/enum';

export interface IBaseResponse {
  status: keyof typeof StatusCode;
  success: boolean;
  message: string;
  data: any;
}

export interface IBaseResponseBody {
  success: boolean;
  message: string;
  data: any;
}
