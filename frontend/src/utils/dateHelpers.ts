// utils/dateHelpers.ts
export const formatYearMonth = (timestamp: string | Date): string => {
  const date = typeof timestamp === "string" ? new Date(timestamp) : timestamp;

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
  }).format(date);
};

export function toIsoDateTime(ym: string): string {
  if (!ym) return "";
  const [year, month] = ym.split("-");
  return `${year}-${month}-01T00:00:00Z`; 
}

