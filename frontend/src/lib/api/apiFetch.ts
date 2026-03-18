// src/lib/api/apiFetch.ts
import { ApiErrorResponse, ApiResult, mapErrorToUserMessage } from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export async function apiFetch<T>(
  path: string,
  options: RequestInit & { body?: any } = {},
): Promise<ApiResult<T>> {
  try {
    const { body, headers, ...rest } = options;

    const res = await fetch(`${API_URL}${path}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(headers ?? {}),
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
      ...rest,
    });

    if (!res.ok) {
      let errorBody: any = null;
      try {
        errorBody = await res.json();
      } catch {
        // kein JSON
      }

      const error: ApiErrorResponse = {
        statusCode: res.status,
        message: errorBody?.message ?? res.statusText,
        code: errorBody?.code,
        path: errorBody?.path,
        timestamp: errorBody?.timestamp,
      };

      return {
        ok: false,
        error,
        userMessage: mapErrorToUserMessage(error),
      };
    }

    const data = (await res.json()) as T;
    return { ok: true, data };
  } catch (e: any) {
    const error: ApiErrorResponse = {
      statusCode: 0,
      code: 'NETWORK_ERROR',
      message: e?.message ?? 'Netzwerkfehler',
    };
    return {
      ok: false,
      error,
      userMessage:
        'Es konnte keine Verbindung zum Server hergestellt werden. Bitte überprüfen Sie Ihre Internetverbindung.',
    };
  }
}
