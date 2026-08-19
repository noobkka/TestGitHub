import CalendarApp from "./ui/calendar-app";
import { events } from "@/data/events";

export default function Home() {
  return <CalendarApp events={events} />;
}
