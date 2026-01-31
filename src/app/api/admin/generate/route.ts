import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { randomBytes } from 'crypto';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(req: Request) {
  const token = Math.random().toString(36).substring(2, 10).toUpperCase();

  const newToken = await prisma.inviteToken.create({
    data: {
      token: token,
      recipient: "OPEN_INVITE",
      isUsed: false
    }
  });

  return NextResponse.json(newToken);
}