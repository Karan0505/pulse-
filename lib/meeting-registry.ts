export type ScheduledMeeting = {
  id: string;
  name: string;
  email: string;
  date: string;
  time: string;
  description: string;
  createdAt: string;
};

const MEETINGS_STORAGE_KEY = "pulse_scheduled_meetings";
const NOTIFICATIONS_STORAGE_KEY = "pulse_notifications_data";

export function getSavedMeetings(): ScheduledMeeting[] {
  if (typeof window !== "undefined") {
    try {
      const saved = localStorage.getItem(MEETINGS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error("Error reading meetings registry:", e);
    }
  }
  return [
    {
      id: "m-seed-1",
      name: "Sarah Chen",
      email: "sarah.chen@github.dev",
      date: "2026-07-29",
      time: "10:30 AM",
      description: "Discussion on API performance optimization and team review latency.",
      createdAt: new Date().toISOString(),
    },
  ];
}

export function saveMeeting(meetingData: {
  name: string;
  email: string;
  date: string;
  time: string;
  description?: string;
}): ScheduledMeeting[] {
  const newMeeting: ScheduledMeeting = {
    id: `m-${Date.now()}`,
    name: meetingData.name || "Guest User",
    email: meetingData.email || "guest@company.com",
    date: meetingData.date || new Date().toISOString().split("T")[0],
    time: meetingData.time || "10:00 AM",
    description: meetingData.description || "30-Min Intro Call & Demo Walkthrough",
    createdAt: new Date().toISOString(),
  };

  const currentMeetings = getSavedMeetings();
  const updatedMeetings = [newMeeting, ...currentMeetings];

  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(MEETINGS_STORAGE_KEY, JSON.stringify(updatedMeetings));

      // Create notification for Admin & Editor in pulse_notifications_data
      const rawNotifs = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
      let notifs = rawNotifs ? JSON.parse(rawNotifs) : [];
      if (!Array.isArray(notifs)) notifs = [];

      const newNotification = {
        id: `n-${Date.now()}`,
        title: `🗓️ Meeting Scheduled by ${newMeeting.name}`,
        body: `${newMeeting.name} (${newMeeting.email}) booked a 30-min call for ${newMeeting.date} at ${newMeeting.time}. Topic: "${newMeeting.description}".`,
        time: "Just now",
        read: false,
      };

      const updatedNotifs = [newNotification, ...notifs];
      localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(updatedNotifs));

      // Broadcast events so dashboard topbar bell & notifications page update instantly
      window.dispatchEvent(new Event("pulse_meetings_updated"));
      window.dispatchEvent(new Event("pulse_notifications_updated"));
    } catch (e) {
      console.error("Error saving meeting:", e);
    }
  }

  return updatedMeetings;
}
