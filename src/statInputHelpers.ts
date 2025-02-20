import OBR from "@owlbear-rodeo/sdk";
import { getPluginId } from "./getPluginId";
import {
  HEROIC_RESOURCE_METADATA_ID,
  STAMINA_METADATA_ID,
  STAMINA_MAXIMUM_METADATA_ID,
  StatMetadataID,
  TEMP_STAMINA_METADATA_ID,
  statMetadataIDs,
} from "./metadataHelpers/itemMetadataIds";

export function isStatMetadataId(id: string): id is StatMetadataID {
  return statMetadataIDs.includes(id as StatMetadataID);
}

export async function writeTokenValueToItem(
  itemId: string,
  id: StatMetadataID,
  value: number | boolean,
) {
  await OBR.scene.items.updateItems([itemId], (items) => {
    // Throw error if more than one token selected
    if (items.length > 1) {
      throw "Selection exceeded max length, expected 1, got: " + items.length;
    }

    // Modify item
    for (let item of items) {
      const itemMetadata = item.metadata[getPluginId("metadata")];
      item.metadata[getPluginId("metadata")] = {
        ...(typeof itemMetadata === "object" ? itemMetadata : {}),
        ...{ [id]: value },
      };
    }
  });
}

export function getNewStatValue(
  id: StatMetadataID,
  inputContent: string,
  previousValue: number,
): number {
  return restrictValueRange(id, inlineMath(inputContent, previousValue));
}

export function inlineMath(
  inputContent: string,
  previousValue: number,
): number {
  let doInlineMath = true;
  if (inputContent.startsWith("=")) {
    inputContent = inputContent.substring(1).trim();
    doInlineMath = false;
  }

  const newValue = parseFloat(inputContent);

  if (Number.isNaN(newValue)) return 0;
  if (
    doInlineMath &&
    (inputContent.startsWith("+") || inputContent.startsWith("-"))
  ) {
    return Math.trunc(previousValue + Math.trunc(newValue));
  }

  return newValue;
}

function restrictValueRange(id: StatMetadataID, value: number): number {
  switch (id) {
    case STAMINA_METADATA_ID:
    case STAMINA_MAXIMUM_METADATA_ID:
      if (value > 9999) {
        value = 9999;
      } else if (value < -999) {
        value = -999;
      }
      break;
    case TEMP_STAMINA_METADATA_ID:
    case HEROIC_RESOURCE_METADATA_ID:
      if (value > 999) {
        value = 999;
      } else if (value < -999) {
        value = -999;
      }
      break;
    default:
      break;
  }
  return value;
}
