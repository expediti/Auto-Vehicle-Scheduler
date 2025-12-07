import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function calculateServiceDates(purchaseDate: Date) {
  const dates = {
    firstService: new Date(purchaseDate),
    secondService: new Date(purchaseDate),
    thirdService: new Date(purchaseDate),
  };

  dates.firstService.setMonth(dates.firstService.getMonth() + 7);
  dates.secondService.setMonth(dates.secondService.getMonth() + 15);
  dates.thirdService.setMonth(dates.thirdService.getMonth() + 23);

  return dates;
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
}
