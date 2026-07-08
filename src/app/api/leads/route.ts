/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const snapshot = await db.collection("leads").orderBy("createdAt", "desc").get();
    const leads = snapshot.docs.map((doc: any) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt instanceof Date 
          ? data.createdAt.toISOString() 
          : data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
      };
    });
    return NextResponse.json(leads);
  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: errMsg }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, headline, location, profileUrl, company, status = "prospect", notes } = body;

    if (!name || !profileUrl) {
      return NextResponse.json({ error: "Name and Profile URL are required" }, { status: 400 });
    }

    const docRef = await db.collection("leads").add({
      name,
      headline: headline || "",
      location: location || "",
      profileUrl,
      company: company || "",
      status,
      notes: notes || "",
      createdAt: new Date(),
    });

    const newDoc = await docRef.get();
    const lead = {
      id: docRef.id,
      ...newDoc.data(),
    };

    return NextResponse.json(lead);
  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: errMsg }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status, notes } = body;

    if (!id) {
      return NextResponse.json({ error: "Lead ID is required" }, { status: 400 });
    }

    const leadRef = db.collection("leads").doc(id);
    const updateData: any = {};
    if (status !== undefined) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;

    await leadRef.update(updateData);
    
    const updatedDoc = await leadRef.get();
    return NextResponse.json({ id, ...updatedDoc.data() });
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
      return NextResponse.json({ error: "Lead ID is required" }, { status: 400 });
    }

    await db.collection("leads").doc(id).delete();
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: errMsg }, { status: 500 });
  }
}
