import OBR, { Metadata } from "@owlbear-rodeo/sdk";
import { getPluginId } from "@/getPluginId";
import { Roll, Trackers } from "./types";
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
  bonus: number,
  edges: number,
  banes: number,
  playerName: string,
  rollValues?: number[],
): Roll {
  // Validate Input
  const naturalBonus = bonus;
  if (!validEdgeValue(edges)) throw new Error("Invalid Edges Value");
  if (!validEdgeValue(banes)) throw new Error("Invalid Banes Value");

  // Make roll
  if (rollValues === undefined) rollValues = powerRollDice();
  let total = 0;
  for (const roll of rollValues) {
    total += roll;
  }
  const naturalResult = total;
  const critical = naturalResult >= 19;

  // Apply single edges
  const netEdges = edges - banes;
  bonus += getBonusFromNetEdges(netEdges);
  const rollResult = naturalResult + bonus;

  // Get tier
  let tier = 0;
  if (critical) tier = 3;
  else if (rollResult < 12) tier = 1;
  else if (rollResult < 17) tier = 2;
  else tier = 3;

  // Apply double edges
  switch (netEdges) {
    case -2:
      if (tier > 1) tier -= 1;
      break;
    case 2:
      if (tier < 3) tier += 1;
      break;
  }

  return {
    timeStamp: Date.now(),
    playerName,
    bonus: naturalBonus,
    netEdges,
    critical,
    tier,
    total: rollResult,
    rolls: rollValues,
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

function validEdgeValue(value: number) {
  const validEdgeOrBane = [0, 1, 2];
  if (!validEdgeOrBane.includes(value)) return false;
  return true;
}

function powerRollDice() {
  const rolls: number[] = [];
  for (let i = 0; i < 2; i++) {
    const value = Math.trunc(Math.random() * 10) + 1;
    rolls.push(value);
  }
  return rolls;
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
