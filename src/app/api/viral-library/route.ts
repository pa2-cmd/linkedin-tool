/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";

export const dynamic = "force-dynamic";

const SEED_VIRAL_POSTS = [
  {
    author: "Justin Welsh",
    category: "Business & Solopreneurship",
    likes: 18200,
    comments: 941,
    shares: 489,
    url: "https://linkedin.com/posts/justin-welsh-systems",
    content: "Building a solo business is 90% systems and 10% talent.\n\nIf you rely on your daily motivation, you will fail when motivation runs dry.\n\nInstead, build simple playbooks:\n1. Choose 1 primary topic.\n2. Write down 5 sub-pillars.\n3. Publish consistently at the same hour every day.\n4. Build templates for your hooks.\n\nSystems keep you going when feelings tell you to stop.",
  },
  {
    author: "Marc Lou",
    category: "Tech & Micro-SaaS",
    likes: 12400,
    comments: 630,
    shares: 198,
    url: "https://linkedin.com/posts/marc-lou-ship-fast",
    content: "Stop coding features nobody asked for.\n\nI built 8 micro-startups in 12 months. 6 failed completely. 2 generated $15k/month.\n\nIf I spent 6 months building each startup, I would have spent 4 years finding my winners.\n\nShip fast. Talk to users. Kill it if nobody pays in 30 days.\n\nWhat are you shipping today?",
  },
  {
    author: "Lenny Rachitsky",
    category: "Product & Growth",
    likes: 9500,
    comments: 421,
    shares: 312,
    url: "https://linkedin.com/posts/lenny-pm-growth",
    content: "How the best products grow:\n\n1. Word of mouth (driven by high retention and customer love).\n2. Product-led growth (loops within the product, e.g., sharing a file).\n3. Content loops (users sharing templates or articles).\n4. Paid acquisition (only when unit economics are fully proven).\n\nIf you don't have product-market fit, spending money on ads is just pouring water into a leaky bucket.",
  }
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    let query: any = db.collection("viral_posts");
    if (category) {
      query = query.where("category", "==", category);
    }

    let snapshot = await query.orderBy("likes", "desc").get();

    // If the database has no viral posts, seed it with starter posts
    if (snapshot.empty && !category) {
      console.log("Seeding viral posts library in Firestore...");
      for (const p of SEED_VIRAL_POSTS) {
        await db.collection("viral_posts").add({
          ...p,
          createdAt: new Date(),
        });
      }
      snapshot = await db.collection("viral_posts").orderBy("likes", "desc").get();
    }

    const posts = snapshot.docs.map((doc: any) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt instanceof Date 
          ? data.createdAt.toISOString() 
          : data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
      };
    });

    return NextResponse.json(posts);
  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : String(err);
    console.error("Viral library GET error:", errMsg);
    return NextResponse.json({ error: errMsg }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { author, content, likes, comments, shares, category, url } = body;

    if (!author || !content || !url) {
      return NextResponse.json({ error: "Author, content, and URL are required" }, { status: 400 });
    }

    const docRef = await db.collection("viral_posts").add({
      author,
      content,
      likes: parseInt(likes) || 0,
      comments: parseInt(comments) || 0,
      shares: parseInt(shares) || 0,
      category: category || "General",
      url,
      createdAt: new Date(),
    });

    const newDoc = await docRef.get();
    const viralPost = {
      id: docRef.id,
      ...newDoc.data(),
    };

    return NextResponse.json(viralPost);
  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: errMsg }, { status: 500 });
  }
}
