export interface MasterLootTable {
  F1: FloorLootTable[];
  M1: FloorLootTable[];
  F2: FloorLootTable[];
  M2: FloorLootTable[];
  F3: FloorLootTable[];
  M3: FloorLootTable[];
  F4: FloorLootTable[];
  M4: FloorLootTable[];
  F5: FloorLootTable[];
  M5: FloorLootTable[];
  F6: FloorLootTable[];
  M6: FloorLootTable[];
  F7: FloorLootTable[];
  M7: FloorLootTable[];
}

export interface FloorLootTable {
  chest: string;
  itemName: string;
  cost: string;
  base: DropChance[];
  sPlus: DropChance[];
}

export interface DropChance {
  talisman: "Talisman" | "Ring" | "Artifact" | "None";
  luck: "0" | "1" | "3" | "5" | "10";
  chance: `${string}%`;
}
