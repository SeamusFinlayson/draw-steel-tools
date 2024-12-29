import OBR, { Metadata } from "@owlbear-rodeo/sdk";
import { getPluginId } from "@/getPluginId";
import { Action, ActionAppState, StampedDiceRoll, Trackers } from "./types";
import { DiceRoll } from "@dice-roller/rpg-dice-roller";
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
  console.log(metadata);

  return {
    malice: readNumberFromObject(metadata, "malice"),
    heroTokens: readNumberFromObject(metadata, "heroTokens"),
  };
}

/* Dice */

const DICE_METADATA_ID = getPluginId("diceRolls");

export async function setSceneRolls(rolls: StampedDiceRoll[]) {
  await OBR.scene.setMetadata({ [DICE_METADATA_ID]: rolls });
}

export async function getRollsFromScene(sceneMetadata?: Metadata) {
  if (sceneMetadata === undefined)
    sceneMetadata = await OBR.scene.getMetadata();
  const diceRolls = sceneMetadata[DICE_METADATA_ID];
  if (diceRolls === undefined) return [];
  if (!isDiceRollArray(diceRolls)) throw "Error: invalid dice roll array";
  return diceRolls;
}

function isDiceRollArray(rolls: unknown): rolls is StampedDiceRoll[] {
  if (!Array.isArray(rolls)) return false;
  for (const roll of rolls) {
    if (typeof roll?.timeStamp !== "number") return false;
    if (typeof roll?.total !== "number") return false;
    if (typeof roll?.roll !== "string") return false;
    if (typeof roll?.playerName !== "string") return false;
    if (typeof roll?.visibility !== "string") return false;
    if (roll.visibility === "PRIVATE") {
      if (typeof roll?.userId !== "string") return false;
    }
  }
  return true;
}

const MAX_DICE_ROLLS = 100;
export function reducer(state: ActionAppState, action: Action): ActionAppState {
  switch (action.type) {
    case "set-rolls":
      return { ...state, rolls: action.rolls };
    case "add-roll":
      const roll = new DiceRoll(action.diceExpression);
      const rolls = [
        action.visibility === "PRIVATE"
          ? {
              timeStamp: Date.now(),
              total: roll.total,
              roll: roll.toString(),
              playerName: action.playerName,
              visibility: action.visibility,
              playerId: action.playerId,
            }
          : {
              timeStamp: Date.now(),
              total: roll.total,
              roll: roll.toString(),
              playerName: action.playerName,
              visibility: action.visibility,
            },
        ...state.rolls.splice(0, MAX_DICE_ROLLS - 1),
      ];
      setSceneRolls(rolls);
      setTimeout(
        () => action.dispatch({ type: "set-animate-roll", animateRoll: false }),
        500,
      );
      return {
        ...state,
        rolls: rolls,
        value: roll.total,
        animateRoll: true,
      };
    case "set-value":
      return { ...state, value: action.value };
    case "set-animate-roll":
      return { ...state, animateRoll: action.animateRoll };
    default:
      console.log("unhandled action");
      return state;
  }
}
