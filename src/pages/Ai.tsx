import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { LANGUAGES, cn, useToast } from "@/lib/core";
import { Button, Pill, SectionLabel } from "@/components/ui";
import { businesses, jobs } from "@/mocks/data";

type Mode = "customer" | "business" | "seeker" | "finance";

interface ChatMessage {
  id: number;
  from: "user" | "ai";
  text: string;
}

const modeOptions: Array<{ id: Mode; label: string; icon: string }> = [
  { id: "customer", label: "Find a service", icon: "ri-map-pin-2-line" },
  { id: "business", label: "Grow my business", icon: "ri-store-2-line" },
  { id: "seeker", label: "Find work", icon: "ri-briefcase-4-line" },
  { id: "finance", label: "Understand my finances", icon: "ri-line-chart-line" },
];

const suggestionsByMode: Record<Mode, string[]> = {
  customer: [
    "Find a mechanic near Yaba",
    "I need a tailor for a wedding in 5 days",
    "Which plumber is open right now?",
  ],
  business: [
    "How do I get more customer enquiries?",
    "How does business verification work?",
    "What makes a good service price?",
  ],
  seeker: [
    "Which jobs match my tailoring skills?",
    "How can I improve my match percentage?",
    "Show apprenticeship opportunities in Abuja",
  ],
  finance: [
    "What is an Economic Trust Profile?",
    "How do I improve my savings behaviour?",
    "Which credit products fit a small workshop?",
  ],
};

const greetings: Record<string, string> = {
  English:
    "Hello, I am Eko AI. I can help you find nearby businesses, understand opportunities, or make sense of your financial activity. What would you like to do?",
  "Nigerian Pidgin":
    "How far, na Eko AI be this. I fit help you find shop or worker near you, find work, or explain your money matter. Wetin you wan do?",
  Yoruba:
    "E kaaro, Eko AI ni mi. Mo le ran yin lowo lati wa oja tabi onise nitosi, wa ise, tabi loye oro owo yin. Kini e fe se?",
  Hausa:
    "Sannu, ni ne Eko AI. Zan iya taimaka maka ka sami kasuwa ko ma aikaci kusa da kai, samun aiki, ko fahimtar harkar kudinka. Me kake so ka yi?",
  Igbo:
    "Ndewo, abụ m Eko AI. Enwere m ike inyere gị aka ịchọta azụmahịa ma ọ bụ onye ọrụ dị nso, ịchọta ọrụ, ma ọ bụ ịghọta ego gị. Gịnị ka ị chọrọ ime?",
};

function buildAnswer(input: string, mode: Mode, language: string): string {
  const text = input.toLowerCase();
  const mechanic = businesses.find((business) => business.category === "mechanics");
  const tailor = businesses.find((business) => business.category === "tailors");
  const plumber = businesses.find((business) => business.category === "plumbers");
  const topJob = [...jobs].sort((a, b) => b.match - a.match)[0];

  const pidgin = language === "Nigerian Pidgin";
  const yoruba = language === "Yoruba";
  const hausa = language === "Hausa";
  const igbo = language === "Igbo";

  if (text.includes("mechanic") || text.includes("car") || text.includes("修理")) {
    return pidgin
      ? `${mechanic?.name} dey ${mechanic?.distanceKm} km from you for Yaba. Dem open now, rating ${mechanic?.rating} from ${mechanic?.reviewCount} customers.\n\nYou fit call dem or send request. If you wan directions, I go open map for you.`
      : `${mechanic?.name} is ${mechanic?.distanceKm} km from your location in Yaba and is open now. Rating ${mechanic?.rating} from ${mechanic?.reviewCount} reviews, verified.\n\nServices start from ${mechanic?.services[3]?.price}. You can send a service request or open directions.`;
  }

  if (text.includes("tailor") || text.includes("sew") || text.includes("wedding") || text.includes("aso")) {
    return yoruba
      ? `${tailor?.name} wa ni ${tailor?.address}. Wọn máa ń ṣe aṣọ ẹbi ní ọjọ́ márùn-ún. Ìdíyelé ${tailor?.rating}.\n\nẸ lè pe wọn tààrà tàbí fi ìbéèrè iṣẹ́ ránṣẹ́.`
      : `${tailor?.name} in ${tailor?.area} handles aso ebi sets in about seven days, with a free measurement and one fitting adjustment. They are verified with a ${tailor?.rating} rating.\n\nFor a five day deadline, message them first to confirm capacity before paying a deposit.`;
  }

  if (text.includes("plumber") || text.includes("leak") || text.includes("pipe")) {
    return `${plumber?.name} covers ${plumber?.area} and responds to leaks within three hours. Emergency call out is ${plumber?.services[3]?.price}.\n\nThey are verified, and you can request a service directly from the profile.`;
  }

  if (text.includes("job") || text.includes("work") || text.includes("apprent") || text.includes("employ")) {
    return hausa
      ? `${topJob.title} a ${topJob.employer} ya dace da kai da kashi ${topJob.match} bisa dari. Yana kusa da kai kuma ana biya ${topJob.salaryMin.toLocaleString("en-NG")} Naira kowace wata.\n\nKa buɗe shafin ayyuka don neman ƙarin.`
      : `${topJob.title} at ${topJob.employer} is your strongest match at ${topJob.match} percent. It is in ${topJob.area}, ${topJob.city}, and pays between ₦${topJob.salaryMin.toLocaleString("en-NG")} and ₦${topJob.salaryMax.toLocaleString("en-NG")} per month.\n\nThe main reason is that the role uses skills already on your profile. Open the opportunities page to apply in one tap.`;
  }

  if (text.includes("trust") || text.includes("credit") || text.includes("loan") || text.includes("save") || text.includes("money")) {
    return igbo
      ? `Economic Trust Profile na-eleba ọrụ azụmahịa gị, usoro ego na ụdị nchekwa gị. Ọ bụghị akara kredit, ọ dịghịkwa ekwe nkwa mgbazinye.\n\nIji mee ka ọ dị mma, dekọọ ahịa gị kwa ụbọchị ma debe ego obere oge niile.`
      : `Your Economic Trust Profile looks at four things: business activity, income consistency, transaction depth and savings behaviour. It currently sits at 78 in the Building band.\n\nIt is not a credit score and it does not guarantee a loan. Recording three more weeks of daily transactions is the fastest way to improve income consistency.`;
  }

  if (text.includes("enquir") || text.includes("customer") || text.includes("grow") || text.includes("visibility")) {
    return `${mode === "business" ? "Three actions usually move the needle fastest." : "Here is what works for most businesses."}\n\n1. Add four or more clear daylight photos, which typically lifts enquiries by around 40 percent.\n2. Keep your open hours accurate so you appear only when you can respond.\n3. Reply to every new request within two hours and ask happy customers for a review.\n\nYour profile currently receives about 96 views a week.`;
  }

  if (text.includes("verif") || text.includes("badge") || text.includes("document")) {
    return `Verification needs a business document and a location proof. Our team checks the name, address and category, usually within 48 hours.\n\nOnce approved, the badge appears on your card and profile, and verified customers can send requests. You can start the process from your business profile tab.`;
  }

  if (text.includes("price") || text.includes("charge") || text.includes("cost")) {
    return `Price from your cost, not from guesswork. Add materials, transport, your time and a small buffer for rework, then compare with three nearby businesses in the same category.\n\nCustomers respond better to a clear starting price plus what changes it, for example "from ₦18,000, depending on the car model".`;
  }

  return `I can help with three things right now: finding a trusted business near you, matching your skills to open work, or explaining the activity behind your financial profile.\n\nTry asking "find a plumber near me", "which jobs match my skills", or "how do I improve my trust profile".`;
}

export default function Ai() {
  const toast = useToast();
  const [language, setLanguage] = useState("English");
  const [mode, setMode] = useState<Mode>("customer");
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([{ id: 1, from: "ai", text: greetings.English }]);
  const endRef = useRef<HTMLDivElement | null>(null);
  const nextId = useRef(2);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, typing]);

  const send = (value?: string) => {
    const text = (value ?? input).trim();
    if (!text) return;
    setMessages((prev) => [...prev, { id: nextId.current++, from: "user", text }]);
    setInput("");
    setTyping(true);
    const reply = buildAnswer(text, mode, language);
    window.setTimeout(() => {
      setMessages((prev) => [...prev, { id: nextId.current++, from: "ai", text: reply }]);
      setTyping(false);
    }, 900);
  };

  const changeLanguage = (next: string) => {
    setLanguage(next);
    setMessages((prev) => [...prev, { id: nextId.current++, from: "ai", text: greetings[next] ?? greetings.English }]);
    toast(`Eko AI will now reply in ${next}.`);
  };

  return (
    <section className="mx-auto w-full max-w-[1320px] px-4 py-8 md:px-8 md:py-12">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <SectionLabel>Eko AI</SectionLabel>
          <h1 className="font-display mt-2 text-[28px] text-foreground-950 md:text-[38px]">One assistant for the whole ecosystem.</h1>
          <p className="mt-2 max-w-2xl text-[13.5px] leading-relaxed text-foreground-600">
            Ask about nearby services, opportunities, your business or your financial activity. Eko AI works in English, Nigerian Pidgin, Yoruba, Hausa and Igbo.
          </p>

          <div className="mt-5 overflow-hidden rounded-2xl border border-background-200 bg-background-50">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-background-200 bg-background-100/60 px-4 py-3">
              <div className="flex items-center gap-2.5">
                <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-primary-500 text-background-50">
                  <i className="ri-sparkling-line" aria-hidden="true" />
                  <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-background-50 bg-accent-500" />
                </span>
                <div>
                  <p className="text-[12.5px] font-semibold text-foreground-950">Eko AI assistant</p>
                  <p className="text-[10px] text-accent-700">Online · simulated responses</p>
                </div>
              </div>
              <select
                value={language}
                onChange={(event) => changeLanguage(event.target.value)}
                aria-label="Assistant language"
                className="h-8 cursor-pointer rounded-lg border border-background-300 bg-background-50 px-2 text-[11px] font-medium text-foreground-700 focus:outline-none"
              >
                {LANGUAGES.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-wrap gap-1.5 border-b border-background-200 px-4 py-2.5">
              {modeOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setMode(option.id)}
                  className={cn(
                    "flex cursor-pointer items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10.5px] font-medium transition-colors",
                    mode === option.id ? "border-primary-500 bg-primary-500 text-background-50" : "border-background-300 text-foreground-600 hover:border-primary-300",
                  )}
                >
                  <i className={option.icon} aria-hidden="true" />
                  {option.label}
                </button>
              ))}
            </div>

            <div className="h-[360px] space-y-3 overflow-y-auto px-4 py-4 md:h-[420px]">
              {messages.map((message) => (
                <div key={message.id} className={cn("flex gap-2.5", message.from === "user" ? "justify-end" : "justify-start")}>
                  {message.from === "ai" ? (
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary-500 text-[12px] text-background-50">
                      <i className="ri-sparkling-line" aria-hidden="true" />
                    </span>
                  ) : null}
                  <div
                    className={cn(
                      "max-w-[86%] whitespace-pre-line rounded-xl px-3.5 py-2.5 text-[12.5px] leading-relaxed",
                      message.from === "user" ? "bg-primary-500 text-background-50" : "border border-background-200 bg-background-100/60 text-foreground-800",
                    )}
                  >
                    {message.text}
                  </div>
                </div>
              ))}
              {typing ? (
                <div className="flex items-center gap-2.5">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary-500 text-[12px] text-background-50">
                    <i className="ri-sparkling-line" aria-hidden="true" />
                  </span>
                  <div className="flex items-center gap-1 rounded-xl border border-background-200 bg-background-100/60 px-3 py-2.5">
                    {[0, 1, 2].map((dot) => (
                      <span key={dot} className="h-1.5 w-1.5 animate-pulse rounded-full bg-foreground-400" style={{ animationDelay: `${dot * 0.15}s` }} />
                    ))}
                  </div>
                </div>
              ) : null}
              <div ref={endRef} />
            </div>

            <div className="border-t border-background-200 p-3">
              <div className="mb-2 flex flex-wrap gap-1.5">
                {suggestionsByMode[mode].map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => send(suggestion)}
                    className="cursor-pointer rounded-full border border-background-300 bg-background-50 px-2.5 py-1 text-[10.5px] text-foreground-600 transition-colors hover:border-accent-400 hover:text-accent-800"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
              <div className="flex items-end gap-2">
                <textarea
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !event.shiftKey) {
                      event.preventDefault();
                      send();
                    }
                  }}
                  rows={2}
                  maxLength={400}
                  placeholder="Ask Eko AI anything about services, work or money"
                  aria-label="Message Eko AI"
                  className="min-h-[44px] flex-1 resize-none rounded-xl border border-background-300 bg-background-50 px-3 py-2 text-[12.5px] placeholder:text-foreground-400 focus:border-accent-500 focus:outline-none"
                />
                <Button onClick={() => send()} icon="ri-send-plane-2-line" className="h-10">Send</Button>
              </div>
              <p className="mt-1.5 text-[10px] text-foreground-400">Responses are simulated for this demonstration and should not be treated as financial advice.</p>
            </div>
          </div>
        </div>

        <aside className="space-y-4 lg:col-span-4">
          <div className="rounded-2xl border border-background-200 bg-background-50 p-4">
            <p className="text-[13px] font-semibold text-foreground-950">What Eko AI can do</p>
            <ul className="mt-3 space-y-3">
              {[
                { icon: "ri-map-pin-2-line", title: "Find local services", body: "Match your problem to a nearby verified business." },
                { icon: "ri-store-2-line", title: "Grow a business", body: "Suggest pricing, visibility and review improvements." },
                { icon: "ri-briefcase-4-line", title: "Match opportunities", body: "Explain why a role fits your skills and location." },
                { icon: "ri-line-chart-line", title: "Explain finances", body: "Translate activity into plain language and next steps." },
              ].map((item) => (
                <li key={item.title} className="flex items-start gap-2.5">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent-50 text-accent-700">
                    <i className={item.icon} aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-[12px] font-semibold text-foreground-900">{item.title}</p>
                    <p className="mt-0.5 text-[10.5px] leading-relaxed text-foreground-500">{item.body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-background-200 bg-background-50 p-4">
            <p className="text-[13px] font-semibold text-foreground-950">Languages</p>
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {LANGUAGES.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => changeLanguage(item)}
                  className={cn(
                    "cursor-pointer rounded-full border px-2.5 py-1 text-[10.5px] font-medium transition-colors",
                    language === item ? "border-accent-500 bg-accent-50 text-accent-800" : "border-background-300 text-foreground-600",
                  )}
                >
                  {item}
                </button>
              ))}
            </div>
            <p className="mt-2 text-[10.5px] leading-relaxed text-foreground-500">Switch language at any point. The conversation keeps its history.</p>
          </div>

          <div className="rounded-2xl border border-background-200 bg-primary-950 p-4">
            <Pill tone="accent" icon="ri-shield-check-line">Trust first</Pill>
            <p className="mt-2 text-[12px] font-semibold text-background-50">Advice with a disclaimer</p>
            <p className="mt-1 text-[11px] leading-relaxed text-background-300">Eko AI explains financial activity but never approves credit or promises an outcome. Offers always come from licensed partners.</p>
            <Link to="/finance"><Button size="sm" variant="outline" className="mt-2.5 border-background-50/25 bg-transparent text-background-50 hover:border-accent-400 hover:text-accent-200">Open financial dashboard</Button></Link>
          </div>
        </aside>
      </div>
    </section>
  );
}