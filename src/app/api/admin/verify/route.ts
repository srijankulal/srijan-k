import { NextRequest, NextResponse } from 'next/server';
import { isAuthorizedAdmin } from '@/lib/adminAuth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json();
    if (isAuthorizedAdmin(req, token)) {
      const response = NextResponse.json({ success: true, message: 'Authenticated' });
      response.cookies.set('admin_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
      });
      return response;
    }
    return NextResponse.json({ error: 'Unauthorized: Invalid access token' }, { status: 401 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Authentication error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  if (isAuthorizedAdmin(req)) {
    return NextResponse.json({ authenticated: true });
  }
  return NextResponse.json({ authenticated: false }, { status: 401 });
}
