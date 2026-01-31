import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(req: Request) {
  try {
    const { id, isRevoked } = await req.json();

    await prisma.authorizedUser.update({
      where: { id },
      data: { isRevoked }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'REVOKE_ACTION_FAILED' }, { status: 500 });
  }
}