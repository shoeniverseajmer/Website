import { isAxiosError } from 'axios';

/**
 * Turn any thrown value (axios error, Error, unknown) into a clean message safe to
 * show a user. Prefers the backend's `message`, then a validation detail, then a
 * sensible fallback — never a raw stack trace or technical DB string.
 */
export function getApiErrorMessage(error: unknown, fallback = 'Something went wrong. Please try again.'): string {
  if (isAxiosError(error)) {
    if (!error.response) return 'Network error — please check your connection and try again.';
    const data = error.response.data as { message?: string; details?: Array<{ message?: string }> } | undefined;
    if (data?.message) return data.message;
    const firstDetail = data?.details?.find((detail) => detail?.message)?.message;
    if (firstDetail) return firstDetail;
    if (error.response.status === 401) return 'Your session expired. Please log in again.';
    if (error.response.status === 403) return 'You do not have permission to do that.';
    return fallback;
  }
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}
