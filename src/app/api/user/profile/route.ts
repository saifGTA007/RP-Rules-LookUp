import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const cookieStore = await cookies();
    const hardwareHash = cookieStore.get('user_session')?.value;

    if (!hardwareHash) {
      return NextResponse.json({ error: "No session found" }, { status: 401 });
    }

    const user = await prisma.authorizedUser.findUnique({
      where: { hardwareHash: hardwareHash },
      select: { username: true } // Only return the username for security
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ username: user.username });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}