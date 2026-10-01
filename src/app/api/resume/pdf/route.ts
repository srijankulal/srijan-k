import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const pdfPath = path.resolve(process.cwd(), 'public', 'Srijan_Kulal_Resume.pdf');

  if (fs.existsSync(pdfPath)) {
    const fileBuffer = fs.readFileSync(pdfPath);
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="Srijan_Kulal_Resume.pdf"',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  }

  return NextResponse.json({ error: 'Resume PDF not found' }, { status: 404 });
}
