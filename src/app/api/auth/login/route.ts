import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(req: Request) {
  try {
    const { username, password, hardwareHash } = await req.json();

    const user = await prisma.authorizedUser.findUnique({
      where: { username }
    });

    console.log('foundUser with username ', username,' ? : ', user)

    if (!user || user.password !== password) {
      return NextResponse.json({ error: "INVALID CREDENTIALS" }, { status: 401 });
    }

    // Check if the PC being used is the one they registered with
    if (user.hardwareHash !== hardwareHash) {
      console.log("invalid hardwareHash")
      console.log("got   : ", hardwareHash)
      console.log("found : ", user.hardwareHash)
      return NextResponse.json({ error: "UNAUTHORIZED HARDWARE" }, { status: 403 });
    }

    if (user.isRevoked) {
      return NextResponse.json({ error: "ACCOUNT REVOKED" }, { status: 403 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "SERVER ERROR" }, { status: 500 });
  }
}