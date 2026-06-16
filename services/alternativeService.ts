import { getRealAlternatives } from "@/lib/getRealAlternatives";

export async function fetchRealAlternatives(productName: string) {
  return getRealAlternatives(productName);
}