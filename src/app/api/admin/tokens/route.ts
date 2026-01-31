import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET() {
  const unclaimed = await prisma.inviteToken.findMany({
    where: { isUsed: false },
    orderBy: { createdAt: 'desc' }
  });
  return NextResponse.json(unclaimed);
}