export interface CommonResponse<T> {
  code: string;
  data: T;
  message: string;
}

export interface CommonErrorResponse {
  code: string;
  message: string;
}

export const CODE_SUCCESS = '000';

export class APIError extends Error {
  public code: string;
  public responseData: CommonErrorResponse;

  constructor(response: CommonErrorResponse) {
    super(response.message || '알 수 없는 서버 오류가 발생했습니다.');
    this.name = 'ApiError';

    this.code = response.code;
    this.responseData = response;
  }
}
