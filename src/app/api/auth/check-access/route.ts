import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { hardwareHash } = await req.json();

    if (!hardwareHash) {
      return NextResponse.json({ authorized: false, error: 'NO_FINGERPRINT' }, { status: 400 });
    }

    // Lookup the device in our database
    const user = await prisma.authorizedUser.findUnique({
      where: { hardwareHash }
    });

    // If device doesn't exist
    if (!user) {
      return NextResponse.json({ authorized: false, reason: 'DEVICE_NOT_RECOGNIZED' });
    }

    // If device is revoked
    if (user.isRevoked) {
      return NextResponse.json({ authorized: false, reason: 'ACCESS_REVOKED_BY_ADMIN' });
    }

    // Update last access time (optional but helpful for logs)
    await prisma.authorizedUser.update({
      where: { id: user.id },
      data: { lastAccess: new Date() }
    });

    return NextResponse.json({ authorized: true, username: user.username });
  } catch (error) {
    return NextResponse.json({ authorized: false, error: 'SERVER_ERROR' }, { status: 500 });
  }
}