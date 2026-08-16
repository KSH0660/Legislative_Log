import { bills } from "@/data/bills";
import type { Bill } from "@/types/bill";

export function getAllBills(): Bill[] {
  return [...bills].sort((a, b) => (a.lastUpdated < b.lastUpdated ? 1 : -1));
}

export function getBillBySlug(slug: string): Bill | undefined {
  return bills.find((bill) => bill.slug === slug);
}

export function getAllCategories(): string[] {
  return Array.from(new Set(bills.map((bill) => bill.category)));
}

export function getBillCounts() {
  return {
    total: bills.length,
    inEffect: bills.filter((b) => b.status === "시행").length,
    pending: bills.filter((b) =>
      ["발의", "심사중", "본회의_계류"].includes(b.status),
    ).length,
  };
}
