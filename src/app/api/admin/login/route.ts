import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const { password } = await req.json();

  const isMatch = await bcrypt.compare(password, process.env.ADMIN_HASH!);

  if (isMatch) {
    const cookieStore = await cookies();
    cookieStore.set('admin_session', 'authenticated', { 
      httpOnly: true, 
      secure: true, 
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 // 24 hours
    });
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: 'Invalid Password' }, { status: 401 });
}