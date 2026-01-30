import { z } from "zod";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api/v1";

interface ApiError {
  message: string;
  code?: string;
  details?: unknown;
}

class ApiClientError extends Error {
  constructor(
    public status: number,
    public code?: string,
    public details?: unknown
  ) {
    super();
    this.name = "ApiClientError";
  }
}

/**
 * Typed API client with Zod validation
 * Server = source of truth; validate all responses
 */
export class ApiClient {
  private baseUrl: string;
  private getAuthToken?: () => string | null;

  constructor(baseUrl = API_BASE_URL, getAuthToken?: () => string | null) {
    this.baseUrl = baseUrl;
    this.getAuthToken = getAuthToken;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    schema?: z.ZodSchema<T>
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const token = this.getAuthToken?.();

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        let errorData: ApiError;
        try {
          errorData = await response.json();
        } catch {
          errorData = {
            message: `HTTP ${response.status}: ${response.statusText}`,
            code: response.status.toString(),
          };
        }

        throw new ApiClientError(
          response.status,
          errorData.code,
          errorData.details
        );
      }

      const data = await response.json();

      // Validate response with Zod schema if provided
      if (schema) {
        return schema.parse(data);
      }

      return data as T;
    } catch (error) {
      if (error instanceof ApiClientError) {
        throw error;
      }
      if (error instanceof z.ZodError) {
        throw new Error(`Response validation failed: ${error.message}`);
      }
      throw new Error(`API request failed: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }

  async get<T>(endpoint: string, schema?: z.ZodSchema<T>): Promise<T> {
    return this.request<T>(endpoint, { method: "GET" }, schema);
  }

  async post<T>(
    endpoint: string,
    body?: unknown,
    schema?: z.ZodSchema<T>
  ): Promise<T> {
    return this.request<T>(
      endpoint,
      {
        method: "POST",
        body: body ? JSON.stringify(body) : undefined,
      },
      schema
    );
  }

  async patch<T>(
    endpoint: string,
    body?: unknown,
    schema?: z.ZodSchema<T>
  ): Promise<T> {
    return this.request<T>(
      endpoint,
      {
        method: "PATCH",
        body: body ? JSON.stringify(body) : undefined,
      },
      schema
    );
  }

  async delete<T>(endpoint: string, schema?: z.ZodSchema<T>, body?: unknown): Promise<T> {
    return this.request<T>(
      endpoint,
      {
        method: "DELETE",
        body: body ? JSON.stringify(body) : undefined,
      },
      schema
    );
  }
}

// Default client instance
export const apiClient = new ApiClient();
