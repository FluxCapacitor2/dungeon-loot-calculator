"use client";

import { Footer } from "@/components/Footer";
import { useState } from "react";
import useSWR from "swr";
import { FormattedNumber } from "../components/FormattedNumber";
import { items } from "../constants/items";
import { LootAPIResponse } from "./api/data/[floor]/route";

const fetcher = (...args: Parameters<typeof fetch>) =>
  fetch(...args).then((res) => res.json());

const dateFormat = new Intl.RelativeTimeFormat(undefined);

export default function Home() {
  const [floor, setFloor] = useState("F7");
  const [chest, setChest] = useState("Bedrock Chest");
  const [talisman, setTalisman] = useState("Artifact");
  const [luck, setLuck] = useState("10");

  // Reset the "Chest" dropdown if it's set to Bedrock and a floor under 5 is chosen
  if (parseInt(floor.charAt(1)) < 5 && chest === "Bedrock Chest") {
    setChest("Obsidian Chest");
  }

  const url = `/api/data/${floor}?chest=${encodeURIComponent(
    chest
  )}&talisman=${talisman}&luck=${luck}`;

  const { data: chances } = useSWR<LootAPIResponse>(url, fetcher);
  const { data: priceData } = useSWR<{
    prices: Record<string, number>;
    lastModified: string;
  }>("/api/prices", fetcher);

  const calculateEV = (sPlus = false) => {
    let ev = 0;
    if (chances !== undefined) {
      for (const row of chances) {
        const itemId = items[row.item];
        const price = priceData?.prices?.[itemId];
        const chance = sPlus ? row.sPlus : row.base;
        if (price === undefined) continue;
        const profit = price - parseInt(row.cost.replaceAll(/,/g, ""));
        if (profit < 0) continue;
        ev += (profit * parseFloat(chance)) / 100;
      }
    }
    return ev;
  };

  const [sPlus, setSPlus] = useState(true);
  const kismetPrice = priceData?.prices?.["KISMET_FEATHER"];
  const evAfterReroll = calculateEV(sPlus) - (kismetPrice ?? 0);

  return (
    <main className="flex flex-col prose dark:prose-invert mx-auto">
      <h1 className="mt-24">SkyBlock Dungeon Loot Calculator</h1>
      <h2 className="mt-0">Inputs</h2>
      <form className="flex md:flex-row gap-4">
        <label className="flex flex-col gap-2">
          <span className="font-medium">Floor</span>
          <select
            className="p-2 rounded-md dark:bg-gray-900"
            value={floor}
            onChange={(e) => setFloor(e.currentTarget.value)}
          >
            <option value="F1">F1</option>
            <option value="F2">F2</option>
            <option value="F3">F3</option>
            <option value="F4">F4</option>
            <option value="F5">F5</option>
            <option value="F6">F6</option>
            <option value="F7">F7</option>
            <option value="M1">M1</option>
            <option value="M2">M2</option>
            <option value="M3">M3</option>
            <option value="M4">M4</option>
            <option value="M5">M5</option>
            <option value="M6">M6</option>
            <option value="M7">M7</option>
          </select>
        </label>
        <label className="flex flex-col gap-2">
          <span className="font-medium">Chest</span>
          <select
            className="p-2 rounded-md dark:bg-gray-900"
            value={chest}
            onChange={(e) => setChest(e.currentTarget.value)}
          >
            <option value="Wood Chest">Wood</option>
            <option value="Gold Chest">Gold</option>
            <option value="Diamond Chest">Diamond</option>
            <option value="Emerald Chest">Emerald</option>
            <option value="Obsidian Chest">Obsidian</option>
            <option
              value="Bedrock Chest"
              disabled={parseInt(floor.charAt(1)) < 5}
            >
              Bedrock
            </option>
          </select>
        </label>
        <label className="flex flex-col gap-2">
          <span className="font-medium">Treasure Talisman</span>
          <select
            className="p-2 rounded-md dark:bg-gray-900"
            value={talisman}
            onChange={(e) => setTalisman(e.currentTarget.value)}
          >
            <option value="None">None</option>
            <option value="Talisman">Talisman</option>
            <option value="Ring">Ring</option>
            <option value="Artifact">Artifact</option>
          </select>
        </label>
        <label className="flex flex-col gap-2">
          <span className="font-medium">Boss Luck</span>
          <select
            className="p-2 rounded-md dark:bg-gray-900"
            value={luck}
            onChange={(e) => setLuck(e.currentTarget.value)}
          >
            <option value="0">0</option>
            <option value="1">1</option>
            <option value="3">3</option>
            <option value="5">5</option>
            <option value="10">10</option>
          </select>
        </label>
      </form>
      {!!chances && (
        <>
          <h2>Stats</h2>
          <label>
            <input
              type="checkbox"
              onChange={(e) => setSPlus(e.currentTarget.checked)}
              checked={sPlus}
            />
            <span className="ml-2">S+ run?</span>
          </label>
          <ul>
            <li>
              Expected value per run:{" "}
              <FormattedNumber>{calculateEV(sPlus)}</FormattedNumber>
            </li>
            <li>
              Kismet Price:{" "}
              <FormattedNumber noColor>
                {kismetPrice ?? "Loading..."}
              </FormattedNumber>
            </li>
            <li>
              Expected value after rerolling:{" "}
              {kismetPrice ? (
                <FormattedNumber>{evAfterReroll}</FormattedNumber>
              ) : (
                "Loading..."
              )}
            </li>
            <li>
              {evAfterReroll > 0
                ? "🎉 Rerolling is likely profitable!"
                : "😔 Rerolling is unlikely profitable :("}
            </li>
          </ul>
          <h2>Items</h2>
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Cost</th>
                <th>Chance (Base)</th>
                <th>Chance (S+)</th>
                <th>BIN</th>
                <th>Profit</th>
                <th>EV (S+)</th>
              </tr>
            </thead>
            <tbody>
              {chances.map((row) => {
                const itemId = items[row.item];
                const price = priceData?.prices?.[itemId];
                const profit =
                  (price ?? 0) - parseInt(row.cost.replaceAll(/,/g, ""));
                const ev = (profit * parseFloat(row.sPlus)) / 100;
                return (
                  <tr key={row.item}>
                    <td>{row.item}</td>
                    <td>{row.cost}</td>
                    <td>{row.base}</td>
                    <td>{row.sPlus}</td>
                    <td>
                      <FormattedNumber noColor>{price ?? "-"}</FormattedNumber>
                    </td>
                    <td>
                      <FormattedNumber>{profit}</FormattedNumber>
                    </td>
                    <td>
                      <FormattedNumber>
                        {price ? Math.round(ev) : "-"}
                      </FormattedNumber>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </>
      )}
      <h2 className="mt-12 mb-0">Notes</h2>
      <Footer pricesLastUpdated={new Date(priceData?.lastModified)} />
    </main>
  );
}
