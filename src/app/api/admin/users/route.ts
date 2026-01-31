import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const users = await prisma.authorizedUser.findMany({
      orderBy: { lastAccess: 'desc' }
    });
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error: 'FETCH_ERROR' }, { status: 500 });
  }
}