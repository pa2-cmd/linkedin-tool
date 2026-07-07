import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

function initDynamicUrl(req: Request) {
  const host = req.headers.get("host") || "localhost:3000";
  const proto = req.headers.get("x-forwarded-proto") || "http";
  process.env.NEXTAUTH_URL = `${proto}://${host}`;
}

export async function GET(req: Request, ctx: { params: Record<string, string | string[]> }) {
  initDynamicUrl(req);
  return NextAuth(authOptions)(req, ctx);
}

export async function POST(req: Request, ctx: { params: Record<string, string | string[]> }) {
  initDynamicUrl(req);
  return NextAuth(authOptions)(req, ctx);
}
