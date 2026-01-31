import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    await prisma.inviteToken.delete({
      where: { id: id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete token" }, { status: 500 });
  }
}