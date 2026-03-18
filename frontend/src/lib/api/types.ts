// src/lib/api/types.ts
export type ApiErrorResponse = {
  statusCode: number;
  code?: string;
  message: string | string[];
  path?: string;
  timestamp?: string;
};

export type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: ApiErrorResponse; userMessage: string };

export function mapErrorToUserMessage(err: ApiErrorResponse): string {
  const msg = Array.isArray(err.message) ? err.message[0] : (err.message ?? '');

  switch (err.code) {
    case 'STUDENT_ALREADY_ASSIGNED':
      return 'Dieser Student ist bereits einem anderen Computer zugeordnet.';

    case 'UNIQUE_NAME':
      return 'Es existiert bereits ein Computer mit diesem Namen.';

    case 'VALIDATION_ERROR':
      return 'Bitte prüfen Sie Ihre Eingaben.';

    default:
      // Fallback, falls nichts passt
      if (err.statusCode === 400) {
        return 'Die Anfrage war ungültig. Bitte Eingaben prüfen.';
      }
      if (err.statusCode === 404) {
        return 'Der gewünschte Eintrag wurde nicht gefunden.';
      }
      if (err.statusCode >= 500) {
        return 'Auf dem Server ist ein Fehler aufgetreten. Bitte später erneut versuchen.';
      }
      return msg || 'Es ist ein unerwarteter Fehler aufgetreten.';
  }
}
