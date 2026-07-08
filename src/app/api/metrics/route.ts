import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const snapshot = await db.collection("weekly_metrics")
      .orderBy("weekStart", "asc")
      .get();
    const logs = snapshot.docs.map((doc: any, index: number) => {
      const data = doc.data();
      const weekStartRaw = data.weekStart;
      const weekStartDate = weekStartRaw instanceof Date 
        ? weekStartRaw 
        : weekStartRaw?.toDate?.() || new Date(weekStartRaw);

      return {
        id: doc.id,
        week: `Week ${index + 1}`,
        weekStart: weekStartDate.toISOString(),
        connections: data.connections,
        profileViews: data.profileViews,
        searchAppearances: data.searchAppearances,
        postImpressions: data.postImpressions,
        engagementRate: data.engagementRate,
      };
    });
    
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
    const lastEntrySnapshot = await db.collection("weekly_metrics")
      .orderBy("weekStart", "desc")
      .limit(1)
      .get();

    const lastEntry = lastEntrySnapshot.empty ? null : lastEntrySnapshot.docs[0].data();

    let weekStart = new Date();
    if (lastEntry) {
      const lastWeekStartRaw = lastEntry.weekStart;
      const lastWeekStartDate = lastWeekStartRaw instanceof Date 
        ? lastWeekStartRaw 
        : lastWeekStartRaw?.toDate?.() || new Date(lastWeekStartRaw);
        
      weekStart = new Date(lastWeekStartDate);
      weekStart.setDate(weekStart.getDate() + 7);
    }

    const docRef = await db.collection("weekly_metrics").add({
      weekStart,
      connections: parseInt(connections) || 0,
      profileViews: parseInt(profileViews) || 0,
      searchAppearances: parseInt(searchAppearances) || 0,
      postImpressions: parseInt(postImpressions) || 0,
      engagementRate: parseFloat(engagementRate) || 0,
      createdAt: new Date(),
    });

    const newDoc = await docRef.get();
    const metric = {
      id: docRef.id,
      ...newDoc.data(),
    };

    return NextResponse.json(metric);
  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: errMsg }, { status: 500 });
  }
}
