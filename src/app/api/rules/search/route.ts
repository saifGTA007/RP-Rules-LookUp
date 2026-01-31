import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('q')?.toUpperCase() || '';

  // If query is empty, return nothing or a default set
  if (!query) return NextResponse.json([]);

  const results = await prisma.rule.findMany({
    where: {
      OR: [
        { title: { contains: query, mode: 'insensitive' } },
        { content: { contains: query, mode: 'insensitive' } }
      ]
    },
    take: 5 // Limit results for speed
  });

  return NextResponse.json(results);
}