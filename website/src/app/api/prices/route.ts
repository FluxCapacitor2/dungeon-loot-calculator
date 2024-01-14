import { items } from "@/app/constants/items";

export const revalidate = 3600; // Every hour

export const GET = async () => {
  const data = (await fetch("https://lb.tricked.pro/lowestbins", {
    next: {
      revalidate: 86400,
    },
  }).then((response) => response.json())) as Record<string, number>;

  const response: Record<string, number> = {};
  for (const item of Object.values(items)) {
    response[item] = data[item];
  }

  return new Response(JSON.stringify(response), {
    headers: { "Content-Type": "application/json" },
  });
};
