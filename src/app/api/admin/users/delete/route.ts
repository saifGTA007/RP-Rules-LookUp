import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    await prisma.authorizedUser.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'DELETE_FAILED' }, { status: 500 });
  }
}