import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Loader2, ShieldHalf } from "lucide-react";
import { ScanForm } from "@/components/phishing/ScanForm";
import { ResultCard } from "@/components/phishing/ResultCard";
import { FeatureGrid } from "@/components/phishing/FeatureGrid";
import { HistoryTable } from "@/components/phishing/HistoryTable";
import { SafetyTips } from "@/components/phishing/SafetyTips";
import { runDemoAnalysis, type ScanResult } from "@/lib/url-analysis";

const title = "AI-Based Phishing Website Detection System";
const description =
  "Analyze a website URL and identify potential phishing risks using machine learning. Demo interface with mock predictions.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: `${title} | URL Risk Analyzer` },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: Index,
});

function Index() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [history, setHistory] = useState<ScanResult[]>([]);
  const [clearAfterScan, setClearAfterScan] = useState(true);

  function handleScan(url: string) {
    setLoading(true);
    setResult(null);
    // Placeholder for the future Flask ML backend call.
    window.setTimeout(() => {
      const scan = runDemoAnalysis(url);
      setResult(scan);
      setHistory((prev) => [scan, ...prev].slice(0, 8));
      setLoading(false);
    }, 900);
  }

  return (
    <main className="min-h-screen bg-hero">
      <div className="relative">
        <div aria-hidden className="pointer-events-none absolute inset-0 grid-lines" />

        <div className="relative mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
          <header className="flex flex-col items-center gap-4 text-center">
            <span className="grid size-14 place-items-center rounded-2xl border border-primary/40 bg-primary/10 text-primary shadow-glow">
              <ShieldHalf className="size-7" />
            </span>
            <span className="rounded-full border border-border bg-secondary/50 px-3 py-1 text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Demo build · mock predictions
            </span>
            <h1 className="text-balance text-3xl font-bold sm:text-4xl md:text-5xl">{title}</h1>
            <p className="max-w-2xl text-pretty text-sm text-muted-foreground sm:text-base">
              Analyze a website URL and identify potential phishing risks using machine learning. The ML model and Flask
              backend are not connected yet, so results shown here are simulated from URL structure rules.
            </p>
          </header>

          <div className="mt-8 space-y-6">
            <ScanForm
              loading={loading}
              onScan={handleScan}
              clearAfterScan={clearAfterScan}
              onClearAfterScanChange={setClearAfterScan}
            />

            {loading ? (
              <div className="flex items-center justify-center gap-3 rounded-2xl border border-border bg-card p-10 text-sm text-muted-foreground shadow-elevated">
                <Loader2 className="size-4 animate-spin text-primary" />
                Running demo analysis on the submitted URL…
              </div>
            ) : null}

            {result && !loading ? (
              <>
                <ResultCard result={result} />
                <FeatureGrid features={result.features} />
              </>
            ) : null}

            <HistoryTable history={history} />
            <SafetyTips />
          </div>

          <footer className="mt-10 text-center text-xs text-muted-foreground">
            Academic project prototype. Predictions are illustrative only and must not be relied on for security
            decisions.
          </footer>
        </div>
      </div>
    </main>
  );
}
