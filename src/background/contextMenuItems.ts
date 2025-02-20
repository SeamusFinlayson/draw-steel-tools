import OBR from "@owlbear-rodeo/sdk";
import { getPluginId } from "../getPluginId";
import menuIcon from "@/menuIcon";
import { Settings } from "@/metadataHelpers/settingMetadataHelpers";
import { getSelectedItems } from "@/metadataHelpers/itemMetadataHelpers";

const NAME_HEIGHT = 44;
const HERO_STATS_HEIGHT = 192;
const MONSTER_STATS_HEIGHT = 128;
const HIDE_HEIGHT = 40;
const PADDING = 8;

export default async function createContextMenuItems(
  settings: Settings,
  themeMode: "DARK" | "LIGHT",
) {
  createPlayerMenu(themeMode, settings.nameTags);
  createGmMenu(themeMode, settings.nameTags);
  // createDamageToolContextItem(themeMode);
  createAddStats();
  createRemoveStats();
}

function createPlayerMenu(
  themeMode: "DARK" | "LIGHT",
  nameTagsEnabled: boolean,
) {
  OBR.contextMenu.create({
    id: getPluginId("player-menu"),
    icons: [
      {
        icon: menuIcon,
        label: "Edit Stats",
        filter: {
          every: [
            { key: "layer", value: "CHARACTER", coordinator: "||" },
            { key: "layer", value: "MOUNT" },
            { key: "type", value: "IMAGE" },
            {
              key: ["metadata", getPluginId("metadata"), "gmOnly"],
              value: true,
              operator: "!=",
            },
            {
              key: ["metadata", getPluginId("metadata"), "type"],
              value: "MONSTER",
              operator: "!=",
            },
            {
              key: ["metadata", getPluginId("metadata")],
              value: undefined,
              operator: "!=",
            },
          ],
          permissions: ["UPDATE"],
          roles: ["PLAYER"],
          max: 1,
        },
      },
    ],
    embed: {
      url: `/src/contextMenu/contextMenu.html?themeMode=${themeMode}`,
      height: (nameTagsEnabled ? NAME_HEIGHT : 0) + HERO_STATS_HEIGHT + PADDING,
    },
  });

  OBR.contextMenu.create({
    id: getPluginId("player-menu-monster"),
    icons: [
      {
        icon: menuIcon,
        label: "Edit Stats",
        filter: {
          every: [
            { key: "layer", value: "CHARACTER", coordinator: "||" },
            { key: "layer", value: "MOUNT" },
            { key: "type", value: "IMAGE" },
            {
              key: ["metadata", getPluginId("metadata"), "gmOnly"],
              value: true,
              operator: "!=",
            },
            {
              key: ["metadata", getPluginId("metadata"), "type"],
              value: "MONSTER",
              operator: "==",
            },
            {
              key: ["metadata", getPluginId("metadata")],
              value: undefined,
              operator: "!=",
            },
          ],
          permissions: ["UPDATE"],
          roles: ["PLAYER"],
          max: 1,
        },
      },
    ],
    embed: {
      url: `/src/contextMenu/contextMenu.html?themeMode=${themeMode}`,
      height:
        (nameTagsEnabled ? NAME_HEIGHT : 0) + MONSTER_STATS_HEIGHT + PADDING,
    },
  });
}

function createGmMenu(themeMode: "DARK" | "LIGHT", nameTagsEnabled: boolean) {
  OBR.contextMenu.create({
    id: getPluginId("gm-menu"),
    icons: [
      {
        icon: menuIcon,
        label: "Edit Stats",
        filter: {
          every: [
            { key: "layer", value: "CHARACTER", coordinator: "||" },
            { key: "layer", value: "MOUNT" },
            { key: "type", value: "IMAGE" },
            {
              key: ["metadata", getPluginId("metadata")],
              value: undefined,
              operator: "!=",
            },
            {
              key: ["metadata", getPluginId("metadata"), "type"],
              value: "MONSTER",
              operator: "!=",
            },
          ],
          roles: ["GM"],
          max: 1,
        },
      },
    ],
    embed: {
      url: `/src/contextMenu/contextMenu.html?themeMode=${themeMode}`,
      height:
        (nameTagsEnabled ? NAME_HEIGHT : 0) +
        HERO_STATS_HEIGHT +
        PADDING +
        HIDE_HEIGHT,
    },
  });

  OBR.contextMenu.create({
    id: getPluginId("gm-menu-monster"),
    icons: [
      {
        icon: menuIcon,
        label: "Edit Stats",
        filter: {
          every: [
            { key: "layer", value: "CHARACTER", coordinator: "||" },
            { key: "layer", value: "MOUNT" },
            { key: "type", value: "IMAGE" },
            {
              key: ["metadata", getPluginId("metadata")],
              value: undefined,
              operator: "!=",
            },
            {
              key: ["metadata", getPluginId("metadata"), "type"],
              value: "MONSTER",
              operator: "==",
            },
          ],
          roles: ["GM"],
          max: 1,
        },
      },
    ],
    embed: {
      url: `/src/contextMenu/contextMenu.html?themeMode=${themeMode}`,
      height:
        (nameTagsEnabled ? NAME_HEIGHT : 0) +
        MONSTER_STATS_HEIGHT +
        PADDING +
        HIDE_HEIGHT,
    },
  });
}

function createAddStats() {
  OBR.contextMenu.create({
    id: getPluginId("add-hero"),
    icons: [
      {
        icon: menuIcon,
        label: "Add Hero",
        filter: {
          every: [
            { key: "layer", value: "CHARACTER", coordinator: "||" },
            { key: "layer", value: "MOUNT" },
            { key: "type", value: "IMAGE" },
            {
              key: ["metadata", getPluginId("metadata")],
              value: undefined,
              operator: "==",
            },
          ],
          // roles: ["GM"],
        },
      },
    ],
    onClick: async () => {
      const selectedItems = await getSelectedItems();
      OBR.scene.items.updateItems(
        selectedItems.map((item) => item.id),
        (items) => {
          items.forEach((item) => {
            item.metadata[getPluginId("metadata")] = { type: "HERO" };
          });
        },
      );
    },
  });

  OBR.contextMenu.create({
    id: getPluginId("add-monster"),
    icons: [
      {
        icon: menuIcon,
        label: "Add NPC",
        filter: {
          every: [
            { key: "layer", value: "CHARACTER", coordinator: "||" },
            { key: "layer", value: "MOUNT" },
            { key: "type", value: "IMAGE" },
            {
              key: ["metadata", getPluginId("metadata")],
              value: undefined,
              operator: "==",
            },
          ],
          roles: ["GM"],
        },
      },
    ],
    onClick: async () => {
      const selectedItems = await getSelectedItems();
      OBR.scene.items.updateItems(
        selectedItems.map((item) => item.id),
        (items) => {
          items.forEach((item) => {
            item.metadata[getPluginId("metadata")] = {
              type: "MONSTER",
              gmOnly: true,
            };
          });
        },
      );
    },
  });
}

function createRemoveStats() {
  OBR.contextMenu.create({
    id: getPluginId("remove-stats"),
    icons: [
      {
        icon: menuIcon,
        label: "Remove Stats",
        filter: {
          some: [
            { key: "layer", value: "CHARACTER", coordinator: "||" },
            { key: "layer", value: "MOUNT" },
            { key: "type", value: "IMAGE" },
            {
              key: ["metadata", getPluginId("metadata")],
              value: undefined,
              operator: "!=",
            },
          ],
          roles: ["GM"],
        },
      },
      {
        icon: menuIcon,
        label: "Remove Stats",
        filter: {
          some: [
            { key: "layer", value: "CHARACTER", coordinator: "||" },
            { key: "layer", value: "MOUNT" },
            { key: "type", value: "IMAGE" },
            {
              key: ["metadata", getPluginId("metadata")],
              value: undefined,
              operator: "!=",
            },
          ],
          every: [
            {
              key: ["metadata", getPluginId("metadata"), "gmOnly"],
              value: true,
              operator: "!=",
            },
          ],
          max: 1,
          roles: ["PLAYER"],
        },
      },
    ],
    onClick: async () => {
      const selectedItems = await getSelectedItems();
      OBR.scene.items.updateItems(
        selectedItems.map((item) => item.id),
        (items) => {
          items.forEach((item) => {
            item.metadata[getPluginId("metadata")] = undefined;
          });
        },
      );
    },
  });
}
