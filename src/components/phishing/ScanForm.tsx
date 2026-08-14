import { useState, type FormEvent } from "react";
import { Loader2, Search, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { urlSchema } from "@/lib/url-analysis";

type Props = {
  loading: boolean;
  onScan: (url: string) => void;
  clearAfterScan: boolean;
  onClearAfterScanChange: (value: boolean) => void;
};

export function ScanForm({ loading, onScan, clearAfterScan, onClearAfterScanChange }: Props) {
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const parsed = urlSchema.safeParse(value);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Invalid URL");
      return;
    }
    setError(null);
    onScan(parsed.data);
    if (clearAfterScan) setValue("");
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="rounded-2xl border border-border bg-panel p-4 shadow-elevated sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Enter website URL (e.g., https://example.com)"
              aria-label="Website URL"
              aria-invalid={Boolean(error)}
              maxLength={2048}
              className="h-12 pl-9 font-mono text-sm"
            />
          </div>
          <Button type="submit" disabled={loading} className="h-12 px-6 text-sm font-semibold">
            {loading ? (
              <>
                <Loader2 className="size-4 animate-spin" /> Analyzing…
              </>
            ) : (
              <>
                <ShieldCheck className="size-4" /> Check URL
              </>
            )}
          </Button>
        </div>

        {error ? (
          <p role="alert" className="mt-3 text-sm text-destructive">
            {error}
          </p>
        ) : null}

        <div className="mt-4 flex items-center gap-3 border-t border-border/70 pt-4">
          <Switch id="clear-after-scan" checked={clearAfterScan} onCheckedChange={onClearAfterScanChange} />
          <Label htmlFor="clear-after-scan" className="text-sm text-muted-foreground">
            Clear the input after each scan
          </Label>
        </div>
      </div>
    </form>
  );
}
