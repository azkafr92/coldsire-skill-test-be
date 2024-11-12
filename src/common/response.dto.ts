export interface Metadata {
  total_items: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface ResponseDto<T> {
  statusCode: number;
  message: string;
  data?: T;
  meta?: Metadata;
}
