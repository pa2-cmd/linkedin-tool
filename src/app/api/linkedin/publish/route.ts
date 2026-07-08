import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/firebase";

export async function POST(request: Request) {
  try {
    const session = (await getServerSession(authOptions)) as { linkedinId?: string } | null;
    let profile: any = null;

    if (session && session.linkedinId) {
      const doc = await db.collection("linked_profiles").doc(session.linkedinId).get();
      profile = doc.exists ? { id: doc.id, ...doc.data() } : null;
    }

    if (!profile) {
      const profilesSnapshot = await db.collection("linked_profiles").limit(1).get();
      profile = profilesSnapshot.empty
        ? null
        : { id: profilesSnapshot.docs[0].id, ...profilesSnapshot.docs[0].data() };
    }

    if (!profile) {
      return NextResponse.json(
        { error: "No connected LinkedIn profile found. Please connect your account in Settings." },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { content, postId } = body;

    if (!content || !content.trim()) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }

    const response = await fetch("https://api.linkedin.com/rest/posts", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${profile.accessToken}`,
        "LinkedIn-Version": "202606",
        "X-Restli-Protocol-Version": "2.0.0",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        author: `urn:li:person:${profile.linkedinId}`,
        commentary: content,
        visibility: "PUBLIC",
        distribution: {
          feedDistribution: "MAIN_FEED",
        },
        lifecycleState: "PUBLISHED",
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("LinkedIn API error:", errorText);
      return NextResponse.json(
        { error: `LinkedIn API error: ${response.statusText} (${errorText})` },
        { status: response.status }
      );
    }

    if (postId) {
      try {
        await db.collection("posts").doc(postId).update({ status: "published" });
      } catch (dbErr) {
        console.error("Failed to update post status in DB:", dbErr);
      }
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : String(err);
    console.error("Publishing route error:", errMsg);
    return NextResponse.json({ error: errMsg }, { status: 500 });
  }
}
