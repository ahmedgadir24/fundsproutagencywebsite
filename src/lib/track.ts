import { createClient } from "@/lib/supabase/client";

export function track(
  eventName: string,
  eventData?: Record<string, string | number | boolean>
) {
  try {
    const supabase = createClient();
    const page =
      typeof window !== "undefined" ? window.location.pathname : null;

    supabase
      .from("gp_events")
      .insert({
        event_name: eventName,
        event_data: eventData || {},
        page,
      })
      .then(() => {});
  } catch {
    // silently fail — never block the UI for analytics
  }
}
