import { parse } from "node-html-parser";
import { writeFile } from "node:fs/promises";

const wikiPages = {
  1: "https://wiki.hypixel.net/Catacombs_Floor_I",
  2: "https://wiki.hypixel.net/Catacombs_Floor_II",
  3: "https://wiki.hypixel.net/Catacombs_Floor_III",
  4: "https://wiki.hypixel.net/Catacombs_Floor_IV",
  5: "https://wiki.hypixel.net/Catacombs_Floor_V",
  6: "https://wiki.hypixel.net/Catacombs_Floor_VI",
  7: "https://wiki.hypixel.net/Catacombs_Floor_VII",
};

const treasureTalismanMapping = {
  A: "None",
  B: "Talisman",
  C: "Ring",
  D: "Artifact",
};

const bossLuckMapping = {
  1: "0",
  2: "1",
  3: "3",
  4: "5",
  5: "10",
};

const chestMapping = {
  0: "Wood Chest",
  1: "Gold Chest",
  2: "Diamond Chest",
  3: "Emerald Chest",
  4: "Obsidian Chest",
  5: "Bedrock Chest",
};

let floors = {};

function parseDropRates(elements) {
  return elements.querySelectorAll('div[class^="dungeon-loot-"]').map((r) => {
    const identifier = r.classNames.split(" ")[0].split("-")[2];
    const treasureTalisLevel = treasureTalismanMapping[identifier.charAt(0)];
    const bossLuckLevel = bossLuckMapping[identifier.charAt(1)];

    return {
      talisman: treasureTalisLevel,
      luck: bossLuckLevel,
      chance: r.textContent,
    };
  });
}

for (const floor of Object.keys(wikiPages)) {
  const page = wikiPages[floor];
  console.log("Parsing", page, "...");
  const content = await fetch(page).then((response) => response.text());

  const document = parse(content, "text/html");

  const tables = document.querySelectorAll(
    ".hp-tabcontent>table.wikitable:first-child"
  );
  for (const [tableIndex, table] of tables.entries()) {
    const isMasterMode = tableIndex >= tables.length / 2;
    const floorString = `${isMasterMode ? "M" : "F"}${floor}`;
    const chestString = chestMapping[tableIndex % (tables.length / 2)];

    const lootItems = table.querySelectorAll("tr");
    for (const lootItem of lootItems) {
      const columns = lootItem.querySelectorAll("td");
      const [itemName, cost, baseRate, sPlusRate] = columns;

      if (!itemName) continue;

      const entry = {
        chest: chestString,
        itemName: itemName.textContent.trim(),
        cost: cost.textContent.trim(),
        base: parseDropRates(baseRate),
        sPlus: parseDropRates(sPlusRate),
      };
      if (!floors[floorString]) {
        floors[floorString] = [];
      }
      floors[floorString].push(entry);
    }
  }
}

// Write data to a file
const generatedData = JSON.stringify(floors);
console.log(generatedData);
await writeFile("../website/public/data.json", generatedData);
