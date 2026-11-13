import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { cn, initialsOf, useApp, useToast } from "@/lib/core";
import { DashShell } from "@/components/shell";
import { Avatar, Button, EmptyState, Pill, Segmented } from "@/components/ui";
import { businesses, conversationSeeds, notices, threads } from "@/mocks/data";

type Message = { from: "them" | "me"; text: string; time: string };
type Filter = "all" | "Customer" | "Business" | "Employer" | "Support";

export default function Messages() {
  const [params, setParams] = useSearchParams();
  const toast = useToast();
  const { user, readNotices, markNoticeRead } = useApp();
  const view = params.get("view") === "notifications" ? "notifications" : "chat";
  const role = user?.role ?? "customer";

  const [filter, setFilter] = useState<Filter>("all");
  const [activeId, setActiveId] = useState(params.get("business") ? "m-01" : threads[0].id);
  const [conversations, setConversations] = useState<Record<string, Message[]>>(
    Object.fromEntries(threads.map((thread) => [thread.id, conversationSeeds[thread.id] ?? []])),
  );
  const [draft, setDraft] = useState("");
  const [search, setSearch] = useState("");

  const filteredThreads = threads.filter((thread) => {
    const matchesFilter = filter === "all" || thread.kind === filter;
    const term = search.trim().toLowerCase();
    const matchesTerm = !term || thread.name.toLowerCase().includes(term) || thread.preview.toLowerCase().includes(term);
    return matchesFilter && matchesTerm;
  });

  const activeThread = threads.find((thread) => thread.id === activeId) ?? threads[0];
  const activeMessages = conversations[activeThread.id] ?? [];
  const linkedBusiness = businesses.find((business) => business.name === activeThread.name);
  const unreadCount = notices.filter((notice) => !notice.read && !readNotices.includes(notice.id)).length;

  const setView = (next: "chat" | "notifications") => {
    const paramsNext = new URLSearchParams(params);
    if (next === "notifications") paramsNext.set("view", "notifications");
    else paramsNext.delete("view");
    setParams(paramsNext, { replace: true });
  };

  const send = () => {
    const text = draft.trim();
    if (!text) return;
    setConversations((prev) => ({
      ...prev,
      [activeThread.id]: [...(prev[activeThread.id] ?? []), { from: "me", text, time: "Now" }],
    }));
    setDraft("");
    window.setTimeout(() => {
      setConversations((prev) => ({
        ...prev,
        [activeThread.id]: [
          ...(prev[activeThread.id] ?? []),
          {
            from: "them",
            text: "Thank you, I have received your message. I will confirm the details shortly.",
            time: "Now",
          },
        ],
      }));
    }, 1200);
  };

  return (
    <DashShell role={role}>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground-950 md:text-[26px]">Messages and notifications</h1>
          <p className="mt-1 text-[13px] text-foreground-500">Customer enquiries, employer replies, verification updates and financial opportunities in one inbox.</p>
        </div>
        <div className="flex items-center gap-2">
          <Pill tone="accent">{unreadCount} unread</Pill>
          <Segmented
            options={[{ value: "chat", label: "Messages" }, { value: "notifications", label: "Notifications" }]}
            value={view}
            onChange={(next) => setView(next as "chat" | "notifications")}
          />
        </div>
      </div>

      {view === "chat" ? (
        <div className="overflow-hidden rounded-2xl border border-background-200 bg-background-50">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Thread list */}
            <div className="border-b border-background-200 lg:col-span-4 lg:border-b-0 lg:border-r">
              <div className="border-b border-background-200 p-3">
                <div className="relative">
                  <i className="ri-search-line pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-foreground-400" aria-hidden="true" />
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search conversations"
                    aria-label="Search conversations"
                    className="h-9 w-full rounded-lg border border-background-300 bg-background-50 pl-9 pr-3 text-[12.5px] placeholder:text-foreground-400 focus:border-accent-500 focus:outline-none"
                  />
                </div>
                <div className="mt-2 flex gap-1 overflow-x-auto pb-0.5">
                  {(["all", "Customer", "Business", "Employer", "Support"] as Filter[]).map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setFilter(item)}
                      className={cn(
                        "cursor-pointer whitespace-nowrap rounded-full border px-2.5 py-1 text-[10.5px] font-medium transition-colors",
                        filter === item ? "border-primary-500 bg-primary-500 text-background-50" : "border-background-200 text-foreground-600",
                      )}
                    >
                      {item === "all" ? "All" : item}
                    </button>
                  ))}
                </div>
              </div>

              <div className="max-h-[260px] overflow-y-auto lg:max-h-[560px]">
                {filteredThreads.map((thread) => (
                  <button
                    key={thread.id}
                    type="button"
                    onClick={() => setActiveId(thread.id)}
                    className={cn(
                      "flex w-full cursor-pointer items-start gap-2.5 border-b border-background-100 px-3 py-3 text-left transition-colors",
                      activeThread.id === thread.id ? "bg-accent-50/60" : "hover:bg-background-100",
                    )}
                  >
                    <Avatar initials={initialsOf(thread.name)} size="sm" tone={thread.kind === "Support" ? "navy" : thread.kind === "Employer" ? "teal" : "slate"} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-[12px] font-semibold text-foreground-950">{thread.name}</p>
                        <span className="shrink-0 text-[9.5px] text-foreground-400">{thread.time}</span>
                      </div>
                      <p className="truncate text-[10.5px] text-foreground-500">{thread.preview}</p>
                      <div className="mt-1 flex items-center gap-1.5">
                        <span className="rounded bg-background-100 px-1.5 py-0.5 text-[9px] text-foreground-500">{thread.kind}</span>
                        {thread.unread ? <span className="rounded-full bg-accent-600 px-1.5 text-[9px] font-semibold text-background-50">{thread.unread}</span> : null}
                      </div>
                    </div>
                  </button>
                ))}
                {filteredThreads.length === 0 ? (
                  <p className="px-4 py-8 text-center text-[11.5px] text-foreground-500">No conversations match this filter.</p>
                ) : null}
              </div>
            </div>

            {/* Conversation */}
            <div className="flex min-h-[420px] flex-col lg:col-span-8">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-background-200 px-4 py-3">
                <div className="flex items-center gap-2.5">
                  <Avatar initials={initialsOf(activeThread.name)} size="sm" tone="teal" />
                  <div>
                    <p className="text-[12.5px] font-semibold text-foreground-950">{activeThread.name}</p>
                    <p className="text-[10.5px] text-foreground-500">{activeThread.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {linkedBusiness ? <Pill tone="verified" icon="ri-verified-badge-line">Verified</Pill> : null}
                  <Button size="sm" variant="ghost" icon="ri-information-line" onClick={() => toast("Conversation details opened. Shared files and request history appear here.")}>Details</Button>
                </div>
              </div>

              <div className="flex-1 space-y-2.5 overflow-y-auto bg-background-100/50 px-4 py-4">
                {activeMessages.map((message, index) => (
                  <div key={`${message.time}-${index}`} className={cn("flex", message.from === "me" ? "justify-end" : "justify-start")}>
                    <div
                      className={cn(
                        "max-w-[80%] rounded-xl px-3 py-2 text-[12px] leading-relaxed",
                        message.from === "me" ? "bg-primary-500 text-background-50" : "border border-background-200 bg-background-50 text-foreground-800",
                      )}
                    >
                      {message.text}
                      <span className={cn("mt-1 block text-[9px]", message.from === "me" ? "text-background-200" : "text-foreground-400")}>{message.time}</span>
                    </div>
                  </div>
                ))}
                {activeMessages.length === 0 ? (
                  <p className="py-10 text-center text-[11.5px] text-foreground-500">Start the conversation with a short message.</p>
                ) : null}
              </div>

              <div className="border-t border-background-200 p-3">
                <div className="flex items-end gap-2">
                  <textarea
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" && !event.shiftKey) {
                        event.preventDefault();
                        send();
                      }
                    }}
                    rows={2}
                    maxLength={500}
                    placeholder="Write a message. Enter sends, Shift and Enter adds a new line."
                    aria-label="Message"
                    className="min-h-[42px] flex-1 resize-none rounded-xl border border-background-300 bg-background-50 px-3 py-2 text-[12.5px] placeholder:text-foreground-400 focus:border-accent-500 focus:outline-none"
                  />
                  <Button onClick={send} icon="ri-send-plane-2-line" className="h-10">Send</Button>
                </div>
                <p className="mt-1.5 text-[10px] text-foreground-400">Messages in this demonstration stay in your browser.</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <div className="overflow-hidden rounded-2xl border border-background-200 bg-background-50">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-background-200 px-4 py-3">
                <p className="text-[13px] font-semibold text-foreground-950">All notifications</p>
                <Button size="sm" variant="ghost" icon="ri-check-double-line" onClick={() => { notices.forEach((notice) => { if (!readNotices.includes(notice.id)) markNoticeRead(notice.id); }); toast("All notifications marked as read."); }}>
                  Mark all read
                </Button>
              </div>
              <div className="divide-y divide-background-100">
                {notices.map((notice) => {
                  const isRead = notice.read || readNotices.includes(notice.id);
                  const icons: Record<string, string> = {
                    application: "ri-file-list-3-line",
                    message: "ri-chat-3-line",
                    verification: "ri-shield-check-line",
                    finance: "ri-line-chart-line",
                    opportunity: "ri-sparkling-line",
                  };
                  return (
                    <div key={notice.id} className={cn("flex items-start gap-3 p-4", !isRead && "bg-accent-50/40")}>
                      <span className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", isRead ? "bg-background-100 text-foreground-500" : "bg-accent-100 text-accent-700")}>
                        <i className={icons[notice.kind]} aria-hidden="true" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-[12.5px] font-semibold text-foreground-950">{notice.title}</p>
                          {!isRead ? <span className="h-1.5 w-1.5 rounded-full bg-accent-600" /> : null}
                        </div>
                        <p className="mt-0.5 text-[11.5px] leading-relaxed text-foreground-600">{notice.body}</p>
                        <p className="mt-1 text-[10px] text-foreground-400">{notice.time}</p>
                      </div>
                      {!isRead ? (
                        <button type="button" onClick={() => markNoticeRead(notice.id)} className="shrink-0 cursor-pointer text-[10.5px] font-semibold text-accent-700 hover:underline">
                          Mark read
                        </button>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="space-y-4 lg:col-span-4">
            <div className="rounded-2xl border border-background-200 bg-background-50 p-4">
              <p className="text-[13px] font-semibold text-foreground-950">Notification settings</p>
              <div className="mt-3 space-y-2.5">
                {[
                  { label: "Customer enquiries", detail: "Instant" },
                  { label: "Job application updates", detail: "Instant" },
                  { label: "Verification changes", detail: "Daily" },
                  { label: "Financial opportunities", detail: "Weekly" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between gap-2 text-[11.5px]">
                    <span className="text-foreground-600">{item.label}</span>
                    <span className="rounded-md bg-background-100 px-2 py-0.5 text-[10px] font-medium text-foreground-700">{item.detail}</span>
                  </div>
                ))}
              </div>
              <Button size="sm" variant="outline" className="mt-3" onClick={() => toast("Notification preferences saved.")}>Update preferences</Button>
            </div>

            <div className="rounded-2xl border border-background-200 bg-primary-950 p-4">
              <p className="text-[12.5px] font-semibold text-background-50">Eko AI can summarize your inbox</p>
              <p className="mt-1 text-[11px] leading-relaxed text-background-300">Ask what needs a reply today and get a short, prioritised list.</p>
              <Link to="/ai"><Button size="sm" variant="accent" className="mt-2.5" icon="ri-sparkling-line">Ask Eko AI</Button></Link>
            </div>
          </div>
        </div>
      )}

      {view === "chat" && threads.length === 0 ? (
        <EmptyState icon="ri-chat-3-line" title="No conversations yet" body="Enquiries from customers and employers will appear here." />
      ) : null}
    </DashShell>
  );
}