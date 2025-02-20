import OBR, { isImage, Item } from "@owlbear-rodeo/sdk";

import {
  STAMINA_METADATA_ID,
  STAMINA_MAXIMUM_METADATA_ID,
  TEMP_STAMINA_METADATA_ID,
  HEROIC_RESOURCE_METADATA_ID,
  GM_ONLY_METADATA_ID,
  GROUP_METADATA_ID,
  INDEX_METADATA_ID,
  SURGES_METADATA_ID,
  RECOVERIES_METADATA_ID,
  TYPE_METADATA_ID,
} from "./itemMetadataIds";
import Token from "./TokenType";
import {
  getPluginMetadata,
  readBooleanFromObject,
  readNumberFromObject,
  readStringFromObject,
} from "./metadataHelpers";

// parse stats

export async function getSelectedItems(selection?: string[]): Promise<Item[]> {
  if (selection === undefined) selection = await OBR.player.getSelection();
  if (selection === undefined) return [];
  const selectedItems = await OBR.scene.items.getItems(selection);
  return selectedItems;
}

export function parseItems(items: Item[]): Token[] {
  const validItems = items.filter((item) => itemFilter(item));

  const Tokens: Token[] = [];
  for (const item of validItems) Tokens.push(parseItem(item));

  return Tokens;
}

/** Returns true for images on the mount and character layers */
export function itemFilter(item: Item) {
  return (
    isImage(item) && (item.layer === "CHARACTER" || item.layer === "MOUNT")
  );
}

export function parseItem(item: Item): Token {
  const metadata = getPluginMetadata(item.metadata);
  return {
    item,
    stamina: readNumberFromObject(metadata, STAMINA_METADATA_ID),
    staminaMaximum: readNumberFromObject(metadata, STAMINA_MAXIMUM_METADATA_ID),
    temporaryStamina: readNumberFromObject(metadata, TEMP_STAMINA_METADATA_ID),
    heroicResource: readNumberFromObject(metadata, HEROIC_RESOURCE_METADATA_ID),
    surges: readNumberFromObject(metadata, SURGES_METADATA_ID),
    recoveries: readNumberFromObject(metadata, RECOVERIES_METADATA_ID),
    gmOnly: readBooleanFromObject(metadata, GM_ONLY_METADATA_ID),
    group: readNumberFromObject(metadata, GROUP_METADATA_ID),
    index: readNumberFromObject(metadata, INDEX_METADATA_ID, -1),
    type: readStringFromObject(metadata, TYPE_METADATA_ID, "UNSET") as
      | "HERO"
      | "MONSTER"
      | "UNSET",
  };
}
