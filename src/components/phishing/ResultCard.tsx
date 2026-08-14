import { AlertTriangle, CheckCircle2, Info, ShieldAlert } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import type { ScanResult } from "@/lib/url-analysis";
import { cn } from "@/lib/utils";

const riskStyles: Record<ScanResult["riskLevel"], string> = {
  Low: "border-success/40 bg-success/10 text-success",
  Medium: "border-warning/40 bg-warning/10 text-warning",
  High: "border-danger/40 bg-danger/10 text-danger",
};

export function ResultCard({ result }: { result: ScanResult }) {
  const phishing = result.prediction === "Potentially Phishing";

  return (
    <section
      aria-live="polite"
      className="animate-in fade-in slide-in-from-bottom-2 rounded-2xl border border-border bg-panel p-5 shadow-elevated duration-500 sm:p-7"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <span
            className={cn(
              "grid size-11 place-items-center rounded-xl border",
              phishing ? "border-danger/40 bg-danger/10 text-danger" : "border-success/40 bg-success/10 text-success",
            )}
          >
            {phishing ? <ShieldAlert className="size-5" /> : <CheckCircle2 className="size-5" />}
          </span>
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Demo prediction</p>
            <h2 className="text-2xl font-bold">{result.prediction}</h2>
            <p className="mt-1 break-all font-mono text-xs text-muted-foreground">{result.url}</p>
          </div>
        </div>

        <span
          className={cn(
            "rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide",
            riskStyles[result.riskLevel],
          )}
        >
          {result.riskLevel} risk
        </span>
      </div>

      <div className="mt-6">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Model confidence (mock)</span>
          <span className="font-mono font-semibold">{result.confidence}%</span>
        </div>
        <Progress value={result.confidence} className="mt-2 h-2" />
      </div>

      <div className="mt-6">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Why this result</h3>
        <ul className="mt-3 space-y-2">
          {result.reasons.map((reason) => (
            <li key={reason} className="flex gap-2 text-sm text-foreground/90">
              <AlertTriangle className="mt-0.5 size-4 shrink-0 text-warning" />
              <span>{reason}</span>
            </li>
          ))}
        </ul>
      </div>

      <p className="mt-6 flex gap-2 rounded-xl border border-warning/30 bg-warning/10 p-3 text-xs text-foreground/90">
        <Info className="mt-0.5 size-4 shrink-0 text-warning" />
        <span>
          This is an automated demo prediction generated from URL structure rules only. It is not a guarantee that a
          website is safe or unsafe. Always verify independently before entering personal data.
        </span>
      </p>
    </section>
  );
}
