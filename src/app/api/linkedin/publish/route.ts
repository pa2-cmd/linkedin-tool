import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const session = (await getServerSession(authOptions)) as { linkedinId?: string } | null;
    let profile = null;

    if (session && session.linkedinId) {
      profile = await prisma.linkedProfile.findUnique({
        where: { linkedinId: session.linkedinId },
      });
    }

    if (!profile) {
      profile = await prisma.linkedProfile.findFirst();
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
        await prisma.postHistory.update({
          where: { id: postId },
          data: { status: "published" },
        });
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
