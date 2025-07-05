import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function formatTimeWindow(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`;
  } else if (minutes < 1440) {
    const hours = Math.round(minutes / 60);
    return `${hours} hour${hours !== 1 ? 's' : ''}`;
  } else if (minutes < 10080) {
    const days = Math.round(minutes / 1440);
    return `${days} day${days !== 1 ? 's' : ''}`;
  } else if (minutes < 43200) {
    const weeks = Math.round(minutes / 10080);
    return `${weeks} week${weeks !== 1 ? 's' : ''}`;
  } else {
    const months = Math.round(minutes / 43200);
    return `${months} month${months !== 1 ? 's' : ''}`;
  }
}
