import "../index.css";
import "./editStatsStyle.css";
import Token from "../metadataHelpers/TokenType";
import { useEffect, useState } from "react";
import {
  getNewStatValue,
  isStatMetadataId,
  writeTokenValueToItem,
} from "../statInputHelpers";
import OBR from "@owlbear-rodeo/sdk";
import {
  getSelectedItems,
  parseItems,
} from "../metadataHelpers/itemMetadataHelpers";
import TrackerInput from "../components/TrackerInput";
import { Button } from "@/components/ui/button";
import BookLock from "@/components/icons/BookLock";
import BookOpen from "@/components/icons/BookOpen";
import { cn } from "@/lib/utils";
import {
  getName,
  getSelectedItemNameProperty,
  writeNameToSelectedItem,
} from "@/metadataHelpers/nameHelpers";
import getGlobalSettings from "@/background/getGlobalSettings";
import {
  HEROIC_RESOURCE_METADATA_ID,
  RECOVERIES_METADATA_ID,
  STAMINA_MAXIMUM_METADATA_ID,
  STAMINA_METADATA_ID,
  StatMetadataID,
  SURGES_METADATA_ID,
  TEMP_STAMINA_METADATA_ID,
} from "@/metadataHelpers/itemMetadataIds";
import Counter from "@/components/Counter";
import NameInput from "@/components/NameInput";

export default function StatsMenuApp({
  initialToken,
  initialTokenName,
  initialNameTagsEnabled,
  role,
}: {
  initialToken: Token;
  initialTokenName: string;
  initialNameTagsEnabled: boolean;
  role: "GM" | "PLAYER";
}): React.JSX.Element {
  const [token, setToken] = useState<Token>(initialToken);

  useEffect(
    () =>
      OBR.scene.items.onChange(() => {
        const updateStats = (tokens: Token[]) => {
          let currentToken = tokens[0];
          setToken(currentToken);
        };
        getSelectedItems().then((selectedItems) => {
          updateStats(parseItems(selectedItems));
          setTokenName(getName(selectedItems[0]));
        });
      }),
    [],
  );

  function handleStatUpdate(target: HTMLInputElement, previousValue: number) {
    const name = target.name;
    if (!isStatMetadataId(name)) throw "Error: invalid input name.";

    const value = getNewStatValue(name, target.value, previousValue);

    setToken((prev) => ({ ...prev, [name]: value }) as Token);
    writeTokenValueToItem(token.item.id, name, value);
  }

  function setStatValue(name: string, value: number) {
    if (!isStatMetadataId(name)) throw "Error: invalid input name.";
    setToken((prev) => ({ ...prev, [name]: value }) as Token);
    writeTokenValueToItem(token.item.id, name, value);
  }

  function toggleHide() {
    const name: StatMetadataID = "gmOnly";
    if (!isStatMetadataId(name)) throw "Error: invalid input name.";

    const value = !token.gmOnly;
    setToken((prev) => ({ ...prev, [name]: value }) as Token);
    writeTokenValueToItem(token.item.id, name, value);
  }

  const [tokenName, setTokenName] = useState(initialTokenName);

  const [nameTagsEnabled, setNameTagsEnabled] = useState(
    initialNameTagsEnabled,
  );

  useEffect(() =>
    OBR.scene.onMetadataChange(async (sceneMetadata) => {
      const nameTagsEnabled = (
        await getGlobalSettings(undefined, sceneMetadata, undefined)
      ).settings.nameTags;
      setNameTagsEnabled(nameTagsEnabled);
    }),
  );
  useEffect(() =>
    OBR.room.onMetadataChange(async (roomMetadata) => {
      const nameTagsEnabled = (
        await getGlobalSettings(undefined, undefined, roomMetadata)
      ).settings.nameTags;
      setNameTagsEnabled(nameTagsEnabled);
    }),
  );

  const NameField: React.JSX.Element = (
    <div className="flex min-h-10 items-center gap-3 px-1 pb-1">
      <NameInput
        name="Name"
        label={"Name"}
        labelStyle="PLACEHOLDER"
        parentValue={tokenName}
        onActionClick={
          tokenName === ""
            ? () =>
                getSelectedItemNameProperty().then((name) => {
                  setTokenName(name);
                  writeNameToSelectedItem(name);
                })
            : () => {
                setTokenName("");
                writeNameToSelectedItem("");
              }
        }
        updateHandler={(target: HTMLInputElement) => {
          const newName = target.value.trim();
          const updateName = newName !== "";
          setTokenName(newName);
          writeNameToSelectedItem(newName, updateName);
        }}
        animateOnlyWhenRootActive
      />
    </div>
  );

  const StatsMenu: React.JSX.Element = (
    <div className="px-1 text-text-primary dark:text-text-primary-dark">
      <div className="flex w-full justify-around gap-2">
        <TrackerInput
          clearContentOnFocus
          name={STAMINA_METADATA_ID}
          label={"Stamina"}
          color="RED"
          parentValue={token.stamina.toString()}
          showParentValue
          updateHandler={(target) => handleStatUpdate(target, token.stamina)}
          animateOnlyWhenRootActive
        />
        <div className="flex items-end pb-[18px] text-text-secondary dark:text-text-secondary-dark">
          /
        </div>
        <TrackerInput
          clearContentOnFocus
          name={STAMINA_MAXIMUM_METADATA_ID}
          label={"Stamina Maximum"}
          labelStyle="HIDDEN"
          color="RED"
          parentValue={token.staminaMaximum.toString()}
          showParentValue
          updateHandler={(target) =>
            handleStatUpdate(target, token.staminaMaximum)
          }
          animateOnlyWhenRootActive
        />
      </div>
      <div className="grid grid-cols-2 justify-around gap-x-2">
        <TrackerInput
          clearContentOnFocus
          name={TEMP_STAMINA_METADATA_ID}
          label={"Temporary Stamina"}
          color="GREEN"
          parentValue={token.temporaryStamina.toString()}
          showParentValue
          updateHandler={(target) =>
            handleStatUpdate(target, token.temporaryStamina)
          }
          animateOnlyWhenRootActive
        />
        {token.type !== "MONSTER" && (
          <Counter
            clearContentOnFocus
            name={HEROIC_RESOURCE_METADATA_ID}
            label={"Heroic Resource"}
            labelStyle={"VISIBLE"}
            color="BLUE"
            parentValue={token.heroicResource}
            showParentValue
            updateHandler={(target) =>
              handleStatUpdate(target, token.heroicResource)
            }
            incrementHandler={() =>
              setStatValue(
                HEROIC_RESOURCE_METADATA_ID,
                token.heroicResource + 1,
              )
            }
            decrementHandler={() =>
              setStatValue(
                HEROIC_RESOURCE_METADATA_ID,
                token.heroicResource - 1,
              )
            }
            animateOnlyWhenRootActive
          />
        )}
        {token.type !== "MONSTER" && (
          <Counter
            clearContentOnFocus
            name={SURGES_METADATA_ID}
            label={"Surges"}
            color="GOLD"
            labelStyle={"VISIBLE"}
            parentValue={token.surges}
            showParentValue
            updateHandler={(target) => handleStatUpdate(target, token.surges)}
            incrementHandler={() =>
              setStatValue(SURGES_METADATA_ID, token.surges + 1)
            }
            decrementHandler={() =>
              setStatValue(SURGES_METADATA_ID, token.surges - 1)
            }
            animateOnlyWhenRootActive
          />
        )}
        {token.type !== "MONSTER" && (
          <Counter
            clearContentOnFocus
            name={RECOVERIES_METADATA_ID}
            label={"Recoveries"}
            labelStyle={"VISIBLE"}
            parentValue={token.recoveries}
            showParentValue
            updateHandler={(target) =>
              handleStatUpdate(target, token.recoveries)
            }
            incrementHandler={() =>
              setStatValue(RECOVERIES_METADATA_ID, token.recoveries + 1)
            }
            decrementHandler={() =>
              setStatValue(RECOVERIES_METADATA_ID, token.recoveries - 1)
            }
            animateOnlyWhenRootActive
          />
        )}
      </div>
    </div>
  );

  const HideButton: React.JSX.Element = (
    <div className="flex size-full justify-center">
      <Button
        variant={"ghost"}
        className={cn(
          "flex rounded-full text-sm font-normal text-text-primary dark:text-text-primary-dark dark:hover:bg-mirage-50/15",
        )}
        onClick={() => toggleHide()}
      >
        {token.gmOnly && true ? (
          <div className="inline-flex items-center gap-2 text-primary-800 hover:text-primary-800 dark:text-primary-dark-300 dark:hover:text-primary-dark-300">
            <BookLock size={20} />
            <div className="uppercase">Director Only</div>
          </div>
        ) : (
          <div className="inline-flex items-center gap-2">
            <BookOpen size={20} />
            <div className="uppercase">Shared</div>
          </div>
        )}
      </Button>
    </div>
  );

  return (
    <div className="space-y-1 overflow-hidden px-2 py-1">
      {nameTagsEnabled && NameField}
      {StatsMenu}
      {role === "GM" && HideButton}
    </div>
  );
}
