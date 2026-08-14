import { Globe, Hash, Layers, Lock, Ruler, Server } from "lucide-react";
import type { UrlFeatures } from "@/lib/url-analysis";
import { cn } from "@/lib/utils";

type Item = {
  label: string;
  value: string;
  icon: typeof Globe;
  tone: "neutral" | "good" | "warn";
};

export function FeatureGrid({ features }: { features: UrlFeatures }) {
  const items: Item[] = [
    { label: "URL length", value: `${features.length} characters`, icon: Ruler, tone: features.length > 75 ? "warn" : "neutral" },
    {
      label: "HTTPS status",
      value: features.isHttps ? "Enabled" : "Not enabled",
      icon: Lock,
      tone: features.isHttps ? "good" : "warn",
    },
    {
      label: "Special characters",
      value: `${features.specialCharCount} found`,
      icon: Hash,
      tone: features.specialCharCount > 15 ? "warn" : "neutral",
    },
    {
      label: "Subdomains",
      value: `${features.subdomainCount}`,
      icon: Layers,
      tone: features.subdomainCount > 2 ? "warn" : "neutral",
    },
    {
      label: "Suspicious keywords",
      value: features.suspiciousKeywords.length ? features.suspiciousKeywords.join(", ") : "None detected",
      icon: Globe,
      tone: features.suspiciousKeywords.length ? "warn" : "good",
    },
    {
      label: "IP address usage",
      value: features.usesIpAddress ? "Raw IP address" : "Domain name",
      icon: Server,
      tone: features.usesIpAddress ? "warn" : "good",
    },
  ];

  return (
    <section className="rounded-2xl border border-border bg-card p-5 shadow-elevated sm:p-7">
      <h2 className="text-lg font-bold">URL analysis</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Structural characteristics extracted from the address. These will become the feature inputs for the ML model.
      </p>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <div key={item.label} className="rounded-xl border border-border/80 bg-secondary/40 p-4">
            <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground">
              <item.icon className="size-4" />
              {item.label}
            </div>
            <p
              className={cn(
                "mt-2 break-words text-sm font-semibold",
                item.tone === "good" && "text-success",
                item.tone === "warn" && "text-warning",
              )}
            >
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
