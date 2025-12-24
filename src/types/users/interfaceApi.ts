// API 响应格式
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}
