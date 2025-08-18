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
import CounterTracker from "@/components/CounterTrackerInput";
import NameInput from "@/components/NameInput";
import BarTrackerInput from "@/components/BarTrackerInput";
import ValueButtonTrackerInput from "@/components/ValueButtonTrackerInput";
import { HeartCrackIcon, HeartPulseIcon } from "lucide-react";

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

  function handleStatInputChange(
    name: StatMetadataID,
    target: HTMLInputElement,
    previousValue: number,
  ) {
    const value = getNewStatValue(name, target.value, previousValue);

    setToken((prev) => ({ ...prev, [name]: value }) satisfies Token);
    writeTokenValueToItem(token.item.id, [[name, value]]);
  }

  function setStatValues(
    values: [id: StatMetadataID, value: number | boolean][],
  ) {
    setToken((prev) => ({ ...prev, ...Object.entries(values) }));
    writeTokenValueToItem(token.item.id, values);
  }

  function toggleHide() {
    const name: StatMetadataID = "gmOnly";
    if (!isStatMetadataId(name)) throw "Error: invalid input name.";

    const value = !token.gmOnly;
    setToken((prev) => ({ ...prev, [name]: value }) satisfies Token);
    writeTokenValueToItem(token.item.id, [[name, value]]);
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
    <div className="">
      <NameInput
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
      />
    </div>
  );

  const StatsMenu: React.JSX.Element = (
    <div className="text-text-primary dark:text-text-primary-dark">
      <div className="grid grid-cols-2 justify-around gap-x-2 gap-y-2">
        <div
          className={cn("col-span-2", {
            "col-span-1": token.type === "MONSTER",
          })}
        >
          <BarTrackerInput
            label={"Stamina"}
            labelTitle={`Winded Value: ${Math.trunc(token.staminaMaximum / 2)}`}
            color="RED"
            parentValue={token.stamina.toString()}
            parentMax={token.staminaMaximum.toString()}
            valueUpdateHandler={(target) =>
              handleStatInputChange(STAMINA_METADATA_ID, target, token.stamina)
            }
            maxUpdateHandler={(target) =>
              handleStatInputChange(
                STAMINA_MAXIMUM_METADATA_ID,
                target,
                token.staminaMaximum,
              )
            }
          />
        </div>
        <ValueButtonTrackerInput
          label={"Temporary Stamina"}
          color="GREEN"
          parentValue={token.temporaryStamina}
          updateHandler={(target) =>
            handleStatInputChange(
              TEMP_STAMINA_METADATA_ID,
              target,
              token.temporaryStamina,
            )
          }
          buttonProps={{
            title: "Apply to Stamina",
            children: <HeartCrackIcon />,
            className: token.temporaryStamina < 0 ? "" : "hidden",
            onClick: () => {
              if (token.temporaryStamina >= 0) return;
              setStatValues([
                [STAMINA_METADATA_ID, token.stamina + token.temporaryStamina],
                [TEMP_STAMINA_METADATA_ID, 0],
              ]);
            },
          }}
        />

        {token.type !== "MONSTER" && (
          <>
            <CounterTracker
              label={"Heroic Resource"}
              color="BLUE"
              parentValue={token.heroicResource}
              updateHandler={(target) =>
                handleStatInputChange(
                  HEROIC_RESOURCE_METADATA_ID,
                  target,
                  token.heroicResource,
                )
              }
              incrementHandler={() =>
                setStatValues([
                  [HEROIC_RESOURCE_METADATA_ID, token.heroicResource + 1],
                ])
              }
              decrementHandler={() =>
                setStatValues([
                  [HEROIC_RESOURCE_METADATA_ID, token.heroicResource - 1],
                ])
              }
            />
            <CounterTracker
              label={"Surges"}
              color="GOLD"
              parentValue={token.surges}
              updateHandler={(target) =>
                handleStatInputChange(SURGES_METADATA_ID, target, token.surges)
              }
              incrementHandler={() =>
                setStatValues([[SURGES_METADATA_ID, token.surges + 1]])
              }
              decrementHandler={() =>
                setStatValues([[SURGES_METADATA_ID, token.surges - 1]])
              }
            />
            <ValueButtonTrackerInput
              label={"Recoveries"}
              labelTitle={`Recovery Value: ${Math.trunc(token.staminaMaximum / 3)}`}
              parentValue={token.recoveries}
              updateHandler={(target) =>
                handleStatInputChange(
                  RECOVERIES_METADATA_ID,
                  target,
                  token.recoveries,
                )
              }
              buttonProps={{
                title: "Spend Recovery",
                children: <HeartPulseIcon />,
                onClick: () => {
                  if (token.recoveries <= 0) return;
                  if (token.staminaMaximum <= 0) return;
                  if (token.stamina >= token.staminaMaximum) return;
                  const staminaIncrease = Math.trunc(token.staminaMaximum / 3);
                  const newStamina = token.stamina + staminaIncrease;
                  setStatValues([
                    [
                      STAMINA_METADATA_ID,
                      newStamina < token.staminaMaximum
                        ? newStamina
                        : token.staminaMaximum,
                    ],
                    [RECOVERIES_METADATA_ID, token.recoveries - 1],
                  ]);
                },
              }}
            />
          </>
        )}
      </div>
    </div>
  );

  const HideButton: React.JSX.Element = (
    <div className="flex size-full justify-center">
      <Button
        variant={"ghost"}
        className={cn(
          "text-text-primary dark:text-text-primary-dark dark:hover:bg-mirage-50/15 flex text-sm font-normal active:rounded-[18px]",
        )}
        onClick={() => toggleHide()}
      >
        {token.gmOnly ? (
          <div className="text-primary-800 hover:text-primary-800 dark:text-primary-dark-300 dark:hover:text-primary-dark-300 inline-flex items-center gap-2">
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
    <div className="space-y-3 overflow-hidden px-2 py-2">
      {nameTagsEnabled && NameField}
      {StatsMenu}
      {role === "GM" && (
        <div className="flex size-full justify-center">{HideButton}</div>
      )}
    </div>
  );
}
