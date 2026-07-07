import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const snapshots = await prisma.profileSnapshot.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(snapshots);
  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: errMsg }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { headline, about, experience, skills, score, aiRewrites } = body;

    if (!headline || !about) {
      return NextResponse.json({ error: "Headline and About sections are required" }, { status: 400 });
    }

    const snapshot = await prisma.profileSnapshot.create({
      data: {
        headline,
        about,
        experience,
        skills,
        score: score ? parseInt(score) : null,
        aiRewrites: aiRewrites ? JSON.stringify(aiRewrites) : null,
      },
    });

    return NextResponse.json(snapshot);
  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: errMsg }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }
    await prisma.profileSnapshot.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: errMsg }, { status: 500 });
  }
}

