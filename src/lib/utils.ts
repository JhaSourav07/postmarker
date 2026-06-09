import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function parseApiResponse(response: Response): Promise<any> {
  const contentType = response.headers.get("content-type");
  let data: any = null;
  if (contentType && contentType.includes("application/json")) {
    try {
      data = await response.json();
    } catch (_) {
      // Ignore JSON parse error if it fails
    }
  }

  if (!response.ok) {
    const errorMsg = data?.error || `Server error (${response.status}: ${response.statusText || "Unknown Error"})`;
    throw new Error(errorMsg);
  }

  return data;
}
