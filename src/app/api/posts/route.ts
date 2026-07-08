import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    let query: any = db.collection("posts");
    if (status) {
      query = query.where("status", "==", status);
    }
    
    const postsSnapshot = await query.orderBy("scheduledFor", "asc").get();
    const posts = postsSnapshot.docs.map((doc: any) => {
      const data = doc.data();
      const scheduledForRaw = data.scheduledFor;
      const scheduledForDate = scheduledForRaw instanceof Date 
        ? scheduledForRaw 
        : scheduledForRaw?.toDate?.() || (scheduledForRaw ? new Date(scheduledForRaw) : null);

      return {
        id: doc.id,
        ...data,
        scheduledFor: scheduledForDate ? scheduledForDate.toISOString() : null,
        createdAt: data.createdAt instanceof Date 
          ? data.createdAt.toISOString() 
          : data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
      };
    });

    return NextResponse.json(posts);
  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: errMsg }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { topic, format, content, scheduledFor, status = "scheduled", tone = "professional" } = body;

    const docRef = await db.collection("posts").add({
      topic,
      format,
      content,
      scheduledFor: scheduledFor ? new Date(scheduledFor) : null,
      status,
      tone,
      createdAt: new Date(),
    });

    const newDoc = await docRef.get();
    const post = {
      id: docRef.id,
      ...newDoc.data(),
    };

    return NextResponse.json(post);
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
      return NextResponse.json({ error: "Post ID is required" }, { status: 400 });
    }

    await db.collection("posts").doc(id).delete();

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: errMsg }, { status: 500 });
  }
}
