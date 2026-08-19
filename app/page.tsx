import CalendarApp from "./ui/calendar-app";
import { getCalendarEvents } from "@/lib/calendar";

export default async function Home() {
  const calendar=await getCalendarEvents();
  return <CalendarApp events={calendar.events} syncedAt={calendar.syncedAt} usingFallback={calendar.usingFallback} />;
}
