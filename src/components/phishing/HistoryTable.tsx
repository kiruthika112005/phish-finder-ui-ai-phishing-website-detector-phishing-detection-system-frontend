import { History } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { ScanResult } from "@/lib/url-analysis";
import { cn } from "@/lib/utils";

const riskTone: Record<ScanResult["riskLevel"], string> = {
  Low: "border-success/40 bg-success/10 text-success",
  Medium: "border-warning/40 bg-warning/10 text-warning",
  High: "border-danger/40 bg-danger/10 text-danger",
};

export function HistoryTable({ history }: { history: ScanResult[] }) {
  return (
    <section className="rounded-2xl border border-border bg-card p-5 shadow-elevated sm:p-7">
      <div className="flex items-center gap-2">
        <History className="size-5 text-primary" />
        <h2 className="text-lg font-bold">Recent scans</h2>
      </div>

      {history.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">No scans yet in this session.</p>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>URL</TableHead>
                <TableHead>Prediction</TableHead>
                <TableHead>Risk level</TableHead>
                <TableHead className="text-right">Date / time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="max-w-[220px] truncate font-mono text-xs">{item.url}</TableCell>
                  <TableCell
                    className={cn(
                      "text-sm font-medium",
                      item.prediction === "Potentially Phishing" ? "text-danger" : "text-success",
                    )}
                  >
                    {item.prediction}
                  </TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        "rounded-full border px-2.5 py-0.5 text-xs font-semibold",
                        riskTone[item.riskLevel],
                      )}
                    >
                      {item.riskLevel}
                    </span>
                  </TableCell>
                  <TableCell className="text-right text-xs text-muted-foreground">
                    {new Date(item.scannedAt).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </section>
  );
}
