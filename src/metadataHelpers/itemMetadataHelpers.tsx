import OBR, { isImage, Item } from "@owlbear-rodeo/sdk";

import {
  STAMINA_METADATA_ID,
  STAMINA_MAXIMUM_METADATA_ID,
  TEMP_STAMINA_METADATA_ID,
  HEROIC_RESOURCE_METADATA_ID,
  GM_ONLY_METADATA_ID,
  GROUP_METADATA_ID,
  INDEX_METADATA_ID,
} from "./itemMetadataIds";
import Token from "./TokenType";
import {
  getPluginMetadata,
  readBooleanFromObject,
  readNumberFromObject,
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
  return tokenFactory(
    item,
    readNumberFromObject(metadata, STAMINA_METADATA_ID),
    readNumberFromObject(metadata, STAMINA_MAXIMUM_METADATA_ID),
    readNumberFromObject(metadata, TEMP_STAMINA_METADATA_ID),
    readNumberFromObject(metadata, HEROIC_RESOURCE_METADATA_ID),
    readBooleanFromObject(metadata, GM_ONLY_METADATA_ID),
    readNumberFromObject(metadata, GROUP_METADATA_ID),
    readNumberFromObject(metadata, INDEX_METADATA_ID, -1),
  );
}

export function tokenFactory(
  item: Item,
  health: number,
  maxHealth: number,
  tempHealth: number,
  armorClass: number,
  hideStats: boolean,
  group: number,
  index: number,
): Token {
  return {
    item,
    stamina: health,
    staminaMaximum: maxHealth,
    temporaryStamina: tempHealth,
    heroicResource: armorClass,
    gmOnly: hideStats,
    group,
    index,
  };
}
