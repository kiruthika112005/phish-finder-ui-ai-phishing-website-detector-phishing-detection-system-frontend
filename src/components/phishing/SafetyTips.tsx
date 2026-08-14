import { Eye, KeyRound, Link2, Lock, Siren } from "lucide-react";

const tips = [
  {
    icon: Eye,
    title: "Check the domain name carefully",
    body: "Look for misspellings, extra words, or unusual endings that imitate a familiar brand.",
  },
  {
    icon: KeyRound,
    title: "Never enter passwords via suspicious links",
    body: "Open the site yourself instead of signing in through a link you received.",
  },
  {
    icon: Siren,
    title: "Be wary of urgent messages",
    body: "Pressure to act immediately and share sensitive information is a classic social-engineering tactic.",
  },
  {
    icon: Lock,
    title: "HTTPS is not a safety guarantee",
    body: "A padlock only means the connection is encrypted — phishing sites can have valid certificates too.",
  },
  {
    icon: Link2,
    title: "When unsure, go direct",
    body: "Type the official address in your browser or use a saved bookmark instead of clicking a link.",
  },
];

export function SafetyTips() {
  return (
    <section className="rounded-2xl border border-border bg-card p-5 shadow-elevated sm:p-7">
      <h2 className="text-lg font-bold">Safety tips</h2>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {tips.map((tip) => (
          <article
            key={tip.title}
            className="rounded-xl border border-border/80 bg-secondary/40 p-4 transition-colors hover:border-primary/50"
          >
            <div className="flex items-center gap-2">
              <tip.icon className="size-4 text-accent" />
              <h3 className="text-sm font-semibold">{tip.title}</h3>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{tip.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
