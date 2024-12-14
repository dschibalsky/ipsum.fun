import { pageviewTracker } from "@/util/pageviews";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const slug = body.slug;

  if (!slug) {
    return NextResponse.json({ error: "Slug not found" }, { status: 400 });
  }

  const ip = req.ip;
  const views = pageviewTracker.incrementPageview(slug, ip);

  return NextResponse.json({ views });
}
