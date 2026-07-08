/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const snapshotsSnapshot = await db.collection("profile_snapshots")
      .orderBy("createdAt", "desc")
      .get();
      
    const snapshots = snapshotsSnapshot.docs.map((doc: any) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt instanceof Date 
          ? data.createdAt.toISOString() 
          : data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
      };
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

    const docRef = await db.collection("profile_snapshots").add({
      headline,
      about,
      experience: experience || null,
      skills: skills || null,
      score: score ? parseInt(score) : null,
      aiRewrites: aiRewrites ? JSON.stringify(aiRewrites) : null,
      createdAt: new Date(),
    });

    const newDoc = await docRef.get();
    const snapshot = {
      id: docRef.id,
      ...newDoc.data(),
    };

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
    await db.collection("profile_snapshots").doc(id).delete();
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: errMsg }, { status: 500 });
  }
}

