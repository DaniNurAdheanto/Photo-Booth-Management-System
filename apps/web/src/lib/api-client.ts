/**
 * API client to communicate with the Go + Gin Backend service
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  error?: any;
}

export async function fetchFromApi<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const defaultHeaders = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Network error occurred' }));
    throw new Error(errorData.message || `API Error: ${response.status}`);
  }

  return response.json();
}
