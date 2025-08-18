import OBR, { Metadata } from "@owlbear-rodeo/sdk";
import { getPluginId } from "@/getPluginId";
import { DieResult, Roll, Trackers } from "./types";
import {
  getPluginMetadata,
  readNumberFromObject,
} from "@/metadataHelpers/metadataHelpers";

/* Broadcast */

export const COMMAND_INPUT_ID = "commandInput";
export const BROADCAST_CHANNEL = getPluginId("channel");
export const TOGGLE_ACTION_OPEN = "toggleActionOpen";
export const DICE_ROLL = "diceRoll";

/* Trackers */

const TRACKER_METADATA_ID = getPluginId("trackers");

export function writeTrackersToScene(trackers: Trackers) {
  OBR.scene.setMetadata({ [TRACKER_METADATA_ID]: trackers });
}

export async function getTrackersFromScene(sceneMetadata?: Metadata) {
  if (sceneMetadata === undefined)
    sceneMetadata = await OBR.scene.getMetadata();

  const metadata = getPluginMetadata(sceneMetadata, TRACKER_METADATA_ID);

  return {
    malice: readNumberFromObject(metadata, "malice"),
    heroTokens: readNumberFromObject(metadata, "heroTokens"),
  };
}

export function powerRoll(
  args: {
    bonus: number;
    hasSkill: boolean;
    netEdges: number;
    playerName: string;
  } & (
    | {
        rollMethod: "rollNow";
        dice: "2d10" | "3d10kh2" | "3d10kl2";
      }
    | {
        rollMethod: "givenValues";
        dieValues: number[];
        selectionStrategy: "highest" | "lowest";
      }
  ),
): Roll {
  // Validate Input
  const naturalBonus = args.bonus;
  if (!validNetEdgesValue(args.netEdges))
    throw new Error("Invalid Edges Value");

  // Get die results
  let dieResults: DieResult[];
  if (args.rollMethod === "rollNow") {
    dieResults = getDieResults(
      powerRollDice(args.dice !== "2d10" ? 3 : 2),
      args.dice !== "3d10kl2" ? "highest" : "lowest",
    );
  } else {
    dieResults = getDieResults(args.dieValues, args.selectionStrategy);
  }

  // Add selected dice to total
  let naturalResult = 0;
  for (const dieResult of dieResults) {
    if (!dieResult.dropped) naturalResult += dieResult.value;
  }
  const critical = naturalResult >= 19;

  // Apply single edges
  let totalBonus =
    naturalBonus +
    getBonusFromNetEdges(args.netEdges) +
    (args.hasSkill ? 2 : 0);
  const total = naturalResult + totalBonus;

  // Get tier
  let tier = 0;
  if (critical) tier = 3;
  else if (total < 12) tier = 1;
  else if (total < 17) tier = 2;
  else tier = 3;

  // Apply double edges
  switch (args.netEdges) {
    case -2:
      if (tier > 1) tier -= 1;
      break;
    case 2:
      if (tier < 3) tier += 1;
      break;
  }

  return {
    timeStamp: Date.now(),
    playerName: args.playerName,
    bonus: naturalBonus,
    hasSkill: args.hasSkill,
    netEdges: args.netEdges,
    critical,
    tier,
    total,
    dieResults,
  };
}

export function getBonusFromNetEdges(netEdges: number) {
  switch (netEdges) {
    case -1:
      return -2;
    case 1:
      return 2;
  }
  return 0;
}

function validNetEdgesValue(value: number) {
  const validEdgeOrBane = [-2, -1, 0, 1, 2];
  if (!validEdgeOrBane.includes(value)) return false;
  return true;
}

function powerRollDice(quantity: number) {
  const dieValues: number[] = [];
  for (let i = 0; i < quantity; i++) {
    const value = Math.trunc(Math.random() * 10) + 1;
    dieValues.push(value);
  }
  return dieValues;
}

function getDieResults(
  dieValues: number[],
  selectionStrategy: "highest" | "lowest",
): DieResult[] {
  return dieValues
    .sort((a, b) => a - b)
    .map((val, index) => ({
      value: val,
      dropped:
        selectionStrategy === "lowest"
          ? index >= 2
          : index < dieValues.length - 2,
    }));
}

export const netEdgesTextAndLabel = (
  netEdges: number,
): {
  text: string;
  label: string;
} => {
  switch (netEdges) {
    case -2:
      return { text: "-1 Tier", label: "Double Bane" };
    case -1:
      return { text: "-2", label: "Bane" };
    case 1:
      return { text: "+2", label: "Edge" };
    case 2:
      return { text: "+1 Tier", label: "Double Edge" };
  }

  return { text: "", label: "" };
};
