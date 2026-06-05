import type { NextFunction, Request, Response } from 'express';
import { supabaseAdmin } from '../config/supabase';
import { ApiError } from '../utils/apiError';

export interface AuthedRequest extends Request {
  user?: {
    id: string;
    email?: string;
    role?: string;
  };
}

export async function requireAuth(request: AuthedRequest, response: Response, next: NextFunction) {
  const token = request.headers.authorization?.replace('Bearer ', '');
  if (!token || !supabaseAdmin) {
    next(new ApiError(401, 'Authentication required'));
    return;
  }

  const { data, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !data.user) {
    next(new ApiError(401, 'Invalid session'));
    return;
  }

  request.user = {
    id: data.user.id,
    email: data.user.email,
    role: String(data.user.user_metadata.role ?? 'customer')
  };
  next();
}

export function requireAdmin(request: AuthedRequest, response: Response, next: NextFunction) {
  if (request.user?.role !== 'admin' && request.user?.role !== 'operator') {
    next(new ApiError(403, 'Admin access required'));
    return;
  }
  next();
}
