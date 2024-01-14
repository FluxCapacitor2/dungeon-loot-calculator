import { items } from "@/constants/items";

export const revalidate = 3600; // Every hour

export const GET = async () => {
  const pricesResponse = await fetch("https://lb.tricked.pro/lowestbins", {
    next: {
      revalidate: 120,
    },
  });

  const data = (await pricesResponse.json()) as Record<string, number>;
  const lastModified = pricesResponse.headers.get("last-modified");

  const pricesSubset: Record<string, number> = {};
  for (const item of Object.values(items)) {
    pricesSubset[item] = data[item];
  }

  return new Response(JSON.stringify({ lastModified, prices: pricesSubset }), {
    headers: { "Content-Type": "application/json" },
  });
};
