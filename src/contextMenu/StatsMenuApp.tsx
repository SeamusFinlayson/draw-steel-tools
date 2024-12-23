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
import Input from "../components/BubbleInput";
import NameInput from "../components/NameInput";
import IconButton from "../components/IconButton";
import MagicIcon from "../components/MagicIcon";
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
import { StatMetadataID } from "@/metadataHelpers/itemMetadataIds";
import { XIcon } from "@/components/icons/XIcon";
import PartiallyControlledInput from "@/components/PartiallyControlledInput";
import { Plus } from "@/components/icons/Plus";

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
      <Input
        name="Name"
        label={"Name"}
        color="WHITE"
        labelStyle="PLACEHOLDER"
        parentValue={tokenName}
        updateHandler={(target) => {
          const newName = target.value.trim();
          const updateName = newName !== "";
          setTokenName(newName);
          writeNameToSelectedItem(newName, updateName);
        }}
        animateOnlyWhenRootActive={true}
      />

      <div className="right-0 top-0 text-text-primary-dark">
        <IconButton
          Icon={tokenName === "" ? MagicIcon : XIcon}
          onClick={() => {
            if (tokenName === "")
              getSelectedItemNameProperty().then((name) => {
                setTokenName(name);
                writeNameToSelectedItem(name);
              });
            else {
              setTokenName("");
              writeNameToSelectedItem("");
            }
          }}
          padding=""
          animateOnlyWhenRootActive={true}
        ></IconButton>
      </div>
    </div>
  );

  const [surgeCount, setSurgeCount] = useState(0);

  const StatsMenu: React.JSX.Element = (
    <div className="px-1 text-text-primary dark:text-text-primary-dark">
      <div className="flex w-full justify-around gap-2">
        <Input
          clearContentOnFocus
          name="stamina"
          label={"Stamina"}
          color="RED"
          parentValue={token.stamina.toString()}
          showParentValue
          updateHandler={(target) => handleStatUpdate(target, token.stamina)}
          animateOnlyWhenRootActive={true}
        />
        <div className="flex items-end pb-[18px] text-text-secondary dark:text-text-secondary-dark">
          /
        </div>
        <Input
          clearContentOnFocus
          name={"staminaMaximum"}
          label={"Stamina Maximum"}
          labelStyle="HIDDEN"
          color="RED"
          parentValue={token.staminaMaximum.toString()}
          showParentValue
          updateHandler={(target) =>
            handleStatUpdate(target, token.staminaMaximum)
          }
          animateOnlyWhenRootActive={true}
        />
      </div>
      <div className="grid grid-cols-2 justify-around gap-x-2">
        <Input
          clearContentOnFocus
          name="temporaryStamina"
          label={"Temporary Stamina"}
          color="GREEN"
          parentValue={token.temporaryStamina.toString()}
          showParentValue
          updateHandler={(target) =>
            handleStatUpdate(target, token.temporaryStamina)
          }
          animateOnlyWhenRootActive={true}
        />
        <Input
          clearContentOnFocus
          name={"heroicResource"}
          label={"Heroic Resource"}
          color="BLUE"
          parentValue={token.heroicResource.toString()}
          showParentValue
          updateHandler={(target) =>
            handleStatUpdate(target, token.heroicResource)
          }
          animateOnlyWhenRootActive={true}
        />
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
