import { FloorLootTable } from "@/app/types/LootTable";
import data from "../../../../../public/data.json";

export type LootAPIResponse = {
  item: string;
  cost: string;
  base: `${string}%`;
  sPlus: `${string}%`;
}[];

export const GET = (
  request: Request,
  { params }: { params: { floor: string } }
) => {
  // @ts-ignore
  const floorData = data[params.floor];

  const casted = floorData as FloorLootTable[];

  const { searchParams } = new URL(request.url);
  const talisman = searchParams.get("talisman");
  const bossLuck = searchParams.get("luck");
  const chest = searchParams.get("chest");

  const response = casted
    .filter((it) => it.chest == chest)
    .map((it) => {
      const baseChance = it.base.find(
        (entry) => entry.talisman == talisman && entry.luck == bossLuck
      );
      const sPlusChance = it.sPlus.find(
        (entry) => entry.talisman == talisman && entry.luck == bossLuck
      );
      return {
        item: it.itemName,
        cost: it.cost,
        base: baseChance?.chance,
        sPlus: sPlusChance?.chance,
      };
    });

  return new Response(JSON.stringify(response), {
    headers: { "Content-Type": "application/json" },
  });
};
