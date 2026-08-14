import { z } from "zod";

export const urlSchema = z
  .string()
  .trim()
  .min(4, { message: "Please enter a URL." })
  .max(2048, { message: "URL must be less than 2048 characters." })
  .refine(
    (value) => {
      try {
        const parsed = new URL(/^https?:\/\//i.test(value) ? value : `https://${value}`);
        return parsed.hostname.includes(".") && !/\s/.test(parsed.hostname);
      } catch {
        return false;
      }
    },
    { message: "Enter a valid URL, e.g. https://example.com" },
  );

export const SUSPICIOUS_KEYWORDS = [
  "login",
  "verify",
  "secure",
  "account",
  "update",
  "banking",
  "confirm",
  "password",
  "free",
  "bonus",
  "gift",
  "wallet",
];

export type UrlFeatures = {
  normalizedUrl: string;
  hostname: string;
  length: number;
  isHttps: boolean;
  specialCharCount: number;
  subdomainCount: number;
  suspiciousKeywords: string[];
  usesIpAddress: boolean;
  hasAtSymbol: boolean;
  hyphenInDomain: boolean;
};

export function extractFeatures(rawUrl: string): UrlFeatures {
  const withProtocol = /^https?:\/\//i.test(rawUrl.trim()) ? rawUrl.trim() : `https://${rawUrl.trim()}`;
  const parsed = new URL(withProtocol);
  const hostname = parsed.hostname.toLowerCase();
  const labels = hostname.split(".").filter(Boolean);

  return {
    normalizedUrl: parsed.toString(),
    hostname,
    length: withProtocol.length,
    isHttps: parsed.protocol === "https:",
    specialCharCount: (withProtocol.replace(/^https?:\/\//i, "").match(/[^a-zA-Z0-9]/g) ?? []).length,
    subdomainCount: Math.max(labels.length - 2, 0),
    suspiciousKeywords: SUSPICIOUS_KEYWORDS.filter((k) => withProtocol.toLowerCase().includes(k)),
    usesIpAddress: /^\d{1,3}(\.\d{1,3}){3}$/.test(hostname),
    hasAtSymbol: withProtocol.includes("@"),
    hyphenInDomain: hostname.includes("-"),
  };
}

export type RiskLevel = "Low" | "Medium" | "High";

export type ScanResult = {
  id: string;
  url: string;
  features: UrlFeatures;
  prediction: "Legitimate" | "Potentially Phishing";
  riskLevel: RiskLevel;
  confidence: number;
  reasons: string[];
  scannedAt: string;
};

/**
 * DEMO heuristic only — placeholder for the future Flask ML backend.
 * This is not a trained model and must not be presented as one.
 */
export function runDemoAnalysis(rawUrl: string): ScanResult {
  const features = extractFeatures(rawUrl);
  const reasons: string[] = [];
  let score = 0;

  if (!features.isHttps) {
    score += 20;
    reasons.push("The URL does not use HTTPS, so traffic may not be encrypted.");
  }
  if (features.usesIpAddress) {
    score += 30;
    reasons.push("The address uses a raw IP instead of a domain name, a common phishing pattern.");
  }
  if (features.length > 75) {
    score += 15;
    reasons.push("The URL is unusually long, which can be used to hide the real destination.");
  }
  if (features.subdomainCount > 2) {
    score += 15;
    reasons.push(`It contains ${features.subdomainCount} subdomains, which may imitate a trusted brand.`);
  }
  if (features.suspiciousKeywords.length > 0) {
    score += Math.min(features.suspiciousKeywords.length * 8, 24);
    reasons.push(`Sensitive keywords detected: ${features.suspiciousKeywords.join(", ")}.`);
  }
  if (features.specialCharCount > 15) {
    score += 10;
    reasons.push("A high number of special characters was found in the address.");
  }
  if (features.hasAtSymbol) {
    score += 15;
    reasons.push("The URL contains an '@' symbol, which can redirect to a different host.");
  }
  if (features.hyphenInDomain) {
    score += 8;
    reasons.push("Hyphens in the domain are often used to mimic well-known brands.");
  }

  if (reasons.length === 0) {
    reasons.push("No common phishing indicators were found in the URL structure.");
  }

  score = Math.min(score, 96);
  const riskLevel: RiskLevel = score >= 55 ? "High" : score >= 30 ? "Medium" : "Low";
  const prediction = score >= 45 ? "Potentially Phishing" : "Legitimate";
  const confidence = Math.round(prediction === "Potentially Phishing" ? 55 + score * 0.4 : 100 - score - 4);

  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    url: features.normalizedUrl,
    features,
    prediction,
    riskLevel,
    confidence: Math.max(52, Math.min(confidence, 98)),
    reasons,
    scannedAt: new Date().toISOString(),
  };
}
