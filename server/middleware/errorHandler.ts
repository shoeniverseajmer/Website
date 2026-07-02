import type { ErrorRequestHandler } from 'express';
import { ApiError } from '../utils/apiError';

// Map raw Postgres/Supabase error codes (SQLSTATE) to clear, human messages so the
// admin UI never shows technical text like "duplicate key value violates unique
// constraint ...". https://www.postgresql.org/docs/current/errcodes-appendix.html
const friendlyForDbError = (code: string | undefined, rawMessage: string): { status: number; message: string } | null => {
  switch (code) {
    case '23505': {
      // unique_violation — tailor the copy to the field where we can tell.
      if (/slug|name/i.test(rawMessage)) return { status: 409, message: 'Something with a similar name already exists. Try a different name.' };
      if (/email/i.test(rawMessage)) return { status: 409, message: 'That email is already in use.' };
      return { status: 409, message: 'This already exists. Please use a different value.' };
    }
    case '23503':
      return { status: 409, message: 'This item is linked to other records and cannot be changed right now.' };
    case '23502':
      return { status: 400, message: 'A required field is missing. Please fill in all required fields.' };
    case '23514':
      return { status: 400, message: 'A value is outside the allowed range (for example, price or stock cannot be negative).' };
    case '22P02':
    case '22003':
      return { status: 400, message: 'One of the values has an invalid format. Please check your inputs.' };
    default:
      return null;
  }
};

export const errorHandler: ErrorRequestHandler = (error, _request, response, _next) => {
  console.error(error);

  if (error instanceof ApiError) {
    response.status(error.status).json({ message: error.message, details: error.details });
    return;
  }

  // Supabase/Postgres errors carry a SQLSTATE `code` field.
  const friendly = friendlyForDbError(error?.code, String(error?.message ?? ''));
  if (friendly) {
    response.status(friendly.status).json({ message: friendly.message });
    return;
  }

  const status = typeof error?.status === 'number' ? error.status : 500;
  response.status(status).json({
    message: status >= 500 ? 'Something went wrong on our end. Please try again.' : error?.message ?? 'Request failed'
  });
};
