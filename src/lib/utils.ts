import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  const d = new Date(date);
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 1) {
    return "Akkurat nå";
  } else if (diffInHours < 24) {
    return `${diffInHours} timer siden`;
  } else if (diffInHours < 48) {
    return "1 dag siden";
  } else {
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} dager siden`;
  }
}

export function formatCurrency(value: string): string {
  return value.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}
