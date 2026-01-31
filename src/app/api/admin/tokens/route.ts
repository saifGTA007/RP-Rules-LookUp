import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const unclaimed = await prisma.inviteToken.findMany({
    where: { isUsed: false },
    orderBy: { createdAt: 'desc' }
  });
  return NextResponse.json(unclaimed);
}