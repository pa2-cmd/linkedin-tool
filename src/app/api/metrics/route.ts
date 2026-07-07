import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const metrics = await prisma.weeklyMetrics.findMany({
      orderBy: { weekStart: "asc" },
    });
    
    // Map database records to the frontend WeeklyLog format
    const logs = metrics.map((m, index) => ({
      id: m.id,
      week: `Week ${index + 1}`,
      weekStart: m.weekStart.toISOString(),
      connections: m.connections,
      profileViews: m.profileViews,
      searchAppearances: m.searchAppearances,
      postImpressions: m.postImpressions,
      engagementRate: m.engagementRate,
    }));
    
    return NextResponse.json(logs);
  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: errMsg }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { connections, profileViews, searchAppearances, postImpressions, engagementRate = 0 } = body;

    // Determine the next weekStart date (7 days after the last entry, or today)
    const lastEntry = await prisma.weeklyMetrics.findFirst({
      orderBy: { weekStart: "desc" },
    });

    let weekStart = new Date();
    if (lastEntry) {
      weekStart = new Date(lastEntry.weekStart);
      weekStart.setDate(weekStart.getDate() + 7);
    }

    const metric = await prisma.weeklyMetrics.create({
      data: {
        weekStart,
        connections: parseInt(connections) || 0,
        profileViews: parseInt(profileViews) || 0,
        searchAppearances: parseInt(searchAppearances) || 0,
        postImpressions: parseInt(postImpressions) || 0,
        engagementRate: parseFloat(engagementRate) || 0,
      },
    });

    return NextResponse.json(metric);
  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: errMsg }, { status: 500 });
  }
}
