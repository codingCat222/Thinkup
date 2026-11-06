import { cookies } from 'next/headers';
import { validateAdminSession } from './db.ts';

export interface AdminAuthResult {
  isAuthenticated: boolean;
  user?: {
    id: number;
    username: string;
    email: string;
    fullName: string;
    role: string;
  };
}

export async function verifyAdminRequest(): Promise<AdminAuthResult> {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('admin_session')?.value;

  if (!sessionToken) {
    return { isAuthenticated: false };
  }

  const result = validateAdminSession(sessionToken);
  if (!result.isValid || !result.user) {
    return { isAuthenticated: false };
  }

  return {
    isAuthenticated: true,
    user: result.user,
  };
}
