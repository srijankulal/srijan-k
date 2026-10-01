import { NextRequest } from 'next/server';

export function getAdminSecret(): string {
  return process.env.ADMIN_SECRET || process.env.POSTS_PORTAL_SECRET || 'srijan-posts-sec-2026-auth';
}

export function isAuthorizedAdmin(req: NextRequest, bodyToken?: string): boolean {
  const secret = getAdminSecret();
  const url = new URL(req.url);
  const queryToken = url.searchParams.get('token') || url.searchParams.get('key');
  const authHeader = req.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
  const cookieToken = req.cookies.get('admin_token')?.value;

  return (
    queryToken === secret ||
    authHeader === secret ||
    bodyToken === secret ||
    cookieToken === secret
  );
}
