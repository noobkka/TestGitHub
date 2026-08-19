import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { getCalendarEvents } from "@/lib/calendar";

export const dynamic = "force-dynamic";

export async function GET(request:Request) {
  if(process.env.VERCEL_ENV==="production"&&request.headers.get("user-agent")!=="vercel-cron/1.0") return NextResponse.json({ok:false,error:"Unauthorized"},{status:401});
  revalidateTag("game-calendar",{expire:0});
  const calendar=await getCalendarEvents();
  return NextResponse.json({ok:!calendar.usingFallback,events:calendar.events.length,syncedAt:calendar.syncedAt,usingFallback:calendar.usingFallback});
}
