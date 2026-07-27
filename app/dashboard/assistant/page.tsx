import { AssistantChat } from "@/components/dashboard/assistant-chat";

export default function AssistantPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight">Pulse Assistant</h1>
        <p className="mt-1 font-body text-sm text-text-muted">
          Ask plain questions about what&apos;s happening across your team.
        </p>
      </div>
      <AssistantChat />
    </div>
  );
}
