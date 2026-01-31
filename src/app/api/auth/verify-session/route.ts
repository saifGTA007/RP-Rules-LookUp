import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // Adjust this path to your prisma client helper

export async function POST(req: Request) {
  try {
    const { hardwareHash } = await req.json();

    if (!hardwareHash) {
      return NextResponse.json({ valid: false }, { status: 400 });
    }

    const user = await prisma.authorizedUser.findUnique({
      where: { hardwareHash: hardwareHash },
    });

    // If the record was deleted or isRevoked is true, access is denied
    if (!user || user.isRevoked) {
      return NextResponse.json({ valid: false }, { status: 401 });
    }

    // Check if the token they used is currently revoked by the admin
    const tokenRecord = await prisma.inviteToken.findFirst({
      where: { recipient: user.username }
    });
    
    if (tokenRecord?.isRevoked) {
      return NextResponse.json({ valid: false }, { status: 401 });
    }

    // Optional: Update last access time
    await prisma.authorizedUser.update({
      where: { hardwareHash: hardwareHash },
      data: { lastAccess: new Date() }
    });

    return NextResponse.json({ valid: true });
  } catch (error) {
    return NextResponse.json({ valid: false }, { status: 500 });
  }
}