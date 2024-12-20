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
import BubbleInput from "../components/BubbleInput";
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
    <div className="grid grid-cols-[1fr,auto,1fr] place-items-center">
      <div></div>
      <div className="w-[144px]">
        <NameInput
          updateHandler={(target) => {
            const updateName = target.value.replaceAll(" ", "") !== "";
            writeNameToSelectedItem(target.value, updateName);
          }}
          inputProps={{
            placeholder: "Name",
            value: tokenName,
            onChange: (e) => {
              setTokenName(e.target.value);
            },
          }}
          animateOnlyWhenRootActive={true}
        ></NameInput>
      </div>
      {tokenName === "" && (
        <div className="right-0 top-0">
          <IconButton
            Icon={MagicIcon}
            onClick={() => {
              getSelectedItemNameProperty().then((name) => {
                setTokenName(name);
                writeNameToSelectedItem(name);
              });
            }}
            padding=""
            animateOnlyWhenRootActive={true}
          ></IconButton>
        </div>
      )}
    </div>
  );

  const StatsMenu: React.JSX.Element = (
    <div className="px-1 text-text-primary dark:text-text-primary-dark">
      <div className="flex w-full justify-around gap-2">
        <BubbleInput
          name="stamina"
          label={"Stamina"}
          color="RED"
          parentValue={token.stamina}
          updateHandler={(target) => handleStatUpdate(target, token.stamina)}
          animateOnlyWhenRootActive={true}
        />
        <div className="flex items-end pb-[18px] text-text-secondary dark:text-text-secondary-dark">
          /
        </div>
        <BubbleInput
          name={"staminaMaximum"}
          label={"Stamina Maximum"}
          hideLabel
          color="RED"
          parentValue={token.staminaMaximum}
          updateHandler={(target) =>
            handleStatUpdate(target, token.staminaMaximum)
          }
          animateOnlyWhenRootActive={true}
        />
      </div>
      <div className="flex w-full justify-around gap-2">
        <BubbleInput
          name="temporaryStamina"
          label={"Temporary Stamina"}
          color="GREEN"
          parentValue={token.temporaryStamina}
          updateHandler={(target) =>
            handleStatUpdate(target, token.temporaryStamina)
          }
          animateOnlyWhenRootActive={true}
        />
        <BubbleInput
          name={"heroicResource"}
          label={"Heroic Resource"}
          color="BLUE"
          parentValue={token.heroicResource}
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
