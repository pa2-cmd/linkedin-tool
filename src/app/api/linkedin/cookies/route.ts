/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/firebase";

export async function POST(request: Request) {
  try {
    const session = (await getServerSession(authOptions)) as { linkedinId?: string } | null;
    const body = await request.json();
    const { liAt, jSessionId } = body;

    if (!liAt || !jSessionId) {
      return NextResponse.json({ error: "li_at and JSESSIONID are required" }, { status: 400 });
    }

    let profileId = session?.linkedinId;

    if (!profileId) {
      // Fallback: update the first connected profile in development/mock mode
      const profilesSnapshot = await db.collection("linked_profiles").limit(1).get();
      if (!profilesSnapshot.empty) {
        profileId = profilesSnapshot.docs[0].id;
      }
    }

    if (!profileId) {
      return NextResponse.json(
        { error: "No connected profile found to bind cookies to. Please log in first." },
        { status: 401 }
      );
    }

    await db.collection("linked_profiles").doc(profileId).update({
      liAtCookie: liAt,
      jSessionId: jSessionId,
      updatedAt: new Date(),
    });

    return NextResponse.json({ success: true, profileId });
  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : String(err);
    console.error("Cookies Sync Endpoint error:", errMsg);
    return NextResponse.json({ error: errMsg }, { status: 500 });
  }
}
