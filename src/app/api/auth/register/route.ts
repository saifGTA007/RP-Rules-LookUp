// src/app/api/auth/register/route.ts
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { username, password, hardwareHash, token } = await req.json();

    // 1. Validate the token first
    const tokenRecord = await prisma.inviteToken.findUnique({
      where: { token: token }
    });

    if (!tokenRecord || tokenRecord.isUsed || tokenRecord.isRevoked) {
      return NextResponse.json({ error: "INVALID OR REVOKED TOKEN" }, { status: 400 });
    }

    // 2. Create the user with the NEW password field
    const newUser = await prisma.authorizedUser.create({
      data: {
        username: username,
        password: password, // This fixes the TS error
        hardwareHash: hardwareHash,
      }
    });

    // 3. Mark token as used
    await prisma.inviteToken.update({
      where: { token: token },
      data: { isUsed: true }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: "USERNAME TAKEN" }, { status: 400 });
    }
    return NextResponse.json({ error: "SERVER ERROR" }, { status: 500 });
  }
}