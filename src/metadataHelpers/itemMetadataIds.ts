export type StatMetadataID =
  | "stamina"
  | "staminaMaximum"
  | "temporaryStamina"
  | "heroicResource"
  | "gmOnly";

export const STAMINA_METADATA_ID: StatMetadataID = "stamina";
export const STAMINA_MAXIMUM_METADATA_ID: StatMetadataID = "staminaMaximum";
export const TEMP_STAMINA_METADATA_ID: StatMetadataID = "temporaryStamina";
export const HEROIC_RESOURCE_METADATA_ID: StatMetadataID = "heroicResource";
export const GM_ONLY_METADATA_ID: StatMetadataID = "gmOnly";

export const statMetadataIDs: StatMetadataID[] = [
  STAMINA_METADATA_ID,
  STAMINA_MAXIMUM_METADATA_ID,
  TEMP_STAMINA_METADATA_ID,
  HEROIC_RESOURCE_METADATA_ID,
  GM_ONLY_METADATA_ID,
];

export type TokenSortingMetadataID = "group" | "index";

export const GROUP_METADATA_ID: TokenSortingMetadataID = "group";
export const INDEX_METADATA_ID: TokenSortingMetadataID = "index";
