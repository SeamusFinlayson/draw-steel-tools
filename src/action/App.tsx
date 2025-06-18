import "../index.css";
import { useCallback, useEffect, useRef, useState } from "react";
import { Roll, Trackers } from "./types";
import {
  getBonusFromNetEdges,
  getTrackersFromScene,
  netEdgesTextAndLabel,
  powerRoll,
  writeTrackersToScene,
} from "./helpers";
import OBR, { Metadata } from "@owlbear-rodeo/sdk";
import { addThemeToBody } from "@/colorHelpers";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { inlineMath } from "@/statInputHelpers";
import { Button } from "@/components/ui/button";
import IntegerButtonGroup from "./IntegerButtonGroup";
import DiceStylePicker from "./DiceStylePicker";
import { Minus, PlugZap, Plus, Settings2, UnplugIcon } from "lucide-react";

import { getPluginId } from "@/getPluginId";
import MoreDropDown from "./MoreDropDown";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { createRollRequest, useDiceRoller } from "./diceCommunicationHelpers";
import { DiceProtocol } from "@/diceProtocol";
import { Separator } from "@/components/ui/separator";
import TrackerInput from "@/components/ActionInput";

export default function App(): React.JSX.Element {
  // Internal State
  const [edges, setEdges] = useState(0);
  const [banes, setBanes] = useState(0);
  const [bonus, setBonus] = useState(0);
  const [result, setResult] = useState<Roll>({
    timeStamp: 0,
    playerName: "",
    bonus: 0,
    netEdges: 0,
    critical: false,
    tier: 0,
    total: 0,
    rolls: [0, 0],
  });

  const [diceStyle, setDiceStyle] = useState<DiceProtocol.DieStyle>();

  const divRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!divRef.current) return;
    divRef;
    const resizeObserver = new ResizeObserver((entries) => {
      if (entries.length > 0) {
        const height = entries[0].borderBoxSize[0].blockSize;
        OBR.action.setHeight(height + 65);
      }
    });
    resizeObserver.observe(divRef.current);
    return () => {
      OBR.action.setHeight(600);
      resizeObserver.disconnect();
    };
  }, [divRef]);

  // Scene State
  const [trackers, setTrackers] = useState<Trackers>({
    malice: 0,
    heroTokens: 0,
  });

  const [playerRole, setPlayerRole] = useState<"PLAYER" | "GM">("PLAYER");
  const [playerName, setPlayerName] = useState("");

  // Handle scene ready
  useEffect(() => {
    const handleReady = (ready: boolean) => {
      if (ready) getTrackersFromScene().then((value) => setTrackers(value));
    };
    OBR.scene.isReady().then(handleReady);
    return OBR.scene.onReadyChange(handleReady);
  }, []);

  // Handle Scene Metadata Changes
  useEffect(() => {
    const handleMetadataChange = (metadata: Metadata) => {
      getTrackersFromScene(metadata).then((value) => setTrackers(value));
    };
    return OBR.scene.onMetadataChange(handleMetadataChange);
  }, []);

  // Sync player
  useEffect(() => {
    const updatePlayerRole = (role: "PLAYER" | "GM") => {
      setPlayerRole(role);
    };
    const updatePlayerName = (name: string) => {
      setPlayerName(name);
    };
    OBR.player.getRole().then(updatePlayerRole);
    OBR.player.getName().then(updatePlayerName);
    return OBR.player.onChange((player) => {
      updatePlayerRole(player.role);
      updatePlayerName(player.name);
    });
  }, []);

  // Sync theme
  useEffect(
    () => OBR.theme.onChange((theme) => addThemeToBody(theme.mode)),
    [],
  );

  // External dice roller
  const handleRollResult = useCallback(
    (data: DiceProtocol.RollResult) => {
      OBR.action.open();
      const rolls = data.result.map((val) => val.result);
      for (let i = 0; i < rolls.length; i++) {
        if (rolls[i] === 0) rolls[i] = 10;
      }
      setResult(powerRoll(bonus, edges, banes, playerName, rolls));
    },
    [bonus, edges, banes, playerName],
  );

  const diceRoller = useDiceRoller({ onRollResult: handleRollResult });
  const [diceConfigHasNeverBeenConnected, setDiceConfigHasNeverBeenConnected] =
    useState(true);

  useEffect(() => {
    if (diceRoller.config !== undefined) {
      setDiceConfigHasNeverBeenConnected(false);
    }
  }, [diceRoller]);

  return (
    <div className="bg-mirage-50/75 dark:bg-mirage-950/55 dark:text-mirage-200 flex h-full flex-col overflow-clip">
      <div className="flex h-[64px] items-center gap-2 p-4">
        <h1 className="w-full text-lg font-bold">Draw Steel Tools</h1>

        <div className="flex gap-2">
          {diceRoller.config === undefined ? (
            diceConfigHasNeverBeenConnected ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    asChild
                    className="size-10 shrink-0 rounded-full"
                    onClick={() => {
                      diceRoller.connect();
                    }}
                    variant={"ghost"}
                    size={"icon"}
                  >
                    <a
                      href="https://connected-dice-homepage.onrender.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img src="/diceExtensionIcon.svg" className="size-6" />
                    </a>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  Get Connected Dice
                </TooltipContent>
              </Tooltip>
            ) : (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    className="size-10 shrink-0 rounded-full"
                    onClick={() => {
                      diceRoller.connect();
                    }}
                    variant={"ghost"}
                    size={"icon"}
                  >
                    <PlugZap />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  Connect Dice Roller
                </TooltipContent>
              </Tooltip>
            )
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  className="size-10 shrink-0 rounded-full"
                  onClick={() => {
                    diceRoller.disconnect();
                    setDiceStyle(undefined);
                  }}
                  variant={"ghost"}
                  size={"icon"}
                >
                  <UnplugIcon />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                Disconnect Dice Roller
              </TooltipContent>
            </Tooltip>
          )}

          <MoreDropDown>
            {playerRole === "GM" && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onFocusCapture={(e) => (e.target.tabIndex = -1)}
                    size={"icon"}
                    variant={"ghost"}
                    className="size-10 shrink-0 rounded-sm"
                    onClick={async () => {
                      const themeMode = (await OBR.theme.getTheme()).mode;
                      OBR.popover.open({
                        id: getPluginId("settings"),
                        url: `/src/settings/settings.html?themeMode=${themeMode}`,
                        height: 500,
                        width: 400,
                      });
                    }}
                  >
                    <Settings2 />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left" sideOffset={8}>
                  {"Settings"}
                </TooltipContent>
              </Tooltip>
            )}
          </MoreDropDown>
        </div>
      </div>

      <div className="flex px-4">
        <Separator />
      </div>

      <ScrollArea className="h-full" type="always">
        <div ref={divRef} className="p-4 pt-2">
          <h1 className="font-bold">Resources</h1>

          <div className="mt-2 flex gap-4">
            {playerRole === "GM" && (
              <TrackerInput
                parentValue={trackers.malice.toString()}
                clearContentOnFocus
                showParentValue
                labelStyle="VISIBLE"
                updateHandler={(target) => {
                  const newTrackers: Trackers = {
                    ...trackers,
                    malice: inlineMath(target.value, trackers.malice),
                  };
                  setTrackers(newTrackers);
                  writeTrackersToScene(newTrackers);
                }}
                name={"Malice"}
                label={"Malice"}
              />
            )}
            <TrackerInput
              parentValue={trackers.heroTokens.toString()}
              clearContentOnFocus
              showParentValue
              labelStyle="VISIBLE"
              updateHandler={(target) => {
                const newTrackers: Trackers = {
                  ...trackers,
                  heroTokens: inlineMath(target.value, trackers.heroTokens),
                };
                setTrackers(newTrackers);
                writeTrackersToScene(newTrackers);
              }}
              name={"Hero Tokens"}
              label={"Hero Tokens"}
            />
          </div>

          <h1 className="mt-2 font-bold">Power Roll</h1>

          <div className="mt-2 grid grid-cols-2 items-end gap-4">
            <div className="w-full space-y-2">
              <h2 className="text-text-secondary dark:text-text-secondary-dark text-xs font-normal">
                Edges
              </h2>
              <IntegerButtonGroup
                startValue={0}
                endValue={2}
                value={edges}
                onClick={(newValue: number) => setEdges(newValue)}
              />
            </div>
            <div className="w-full space-y-2">
              <h2 className="text-text-secondary dark:text-text-secondary-dark text-xs font-normal">
                Bonus
              </h2>
              <div className="flex w-full items-center justify-between gap-1">
                <Button
                  variant={"ghost"}
                  size={"icon"}
                  className="shrink-0 rounded-full dark:hover:bg-white/10"
                  onClick={() => setBonus(bonus - 1)}
                >
                  <Minus />
                </Button>
                <TrackerInput
                  parentValue={bonus.toString()}
                  clearContentOnFocus
                  updateHandler={(target) =>
                    setBonus(inlineMath("=" + target.value, bonus))
                  }
                  name={"Bonus"}
                  label={"Bonus"}
                  labelStyle="NONE"
                  inputProps={{ className: "text-center min-w-8" }}
                />
                <Button
                  variant={"ghost"}
                  size={"icon"}
                  className="shrink-0 rounded-full dark:hover:bg-white/10"
                  onClick={() => setBonus(bonus + 1)}
                >
                  <Plus />
                </Button>
              </div>
            </div>
            <div className="w-full space-y-2">
              <h2 className="text-text-secondary dark:text-text-secondary-dark text-xs font-normal">
                Banes
              </h2>
              <IntegerButtonGroup
                startValue={0}
                endValue={2}
                value={banes}
                onClick={(newValue: number) => setBanes(newValue)}
              />
            </div>
            {diceRoller.config !== undefined &&
              diceRoller.config.styles.length > 0 && (
                <div className="w-full space-y-2">
                  <h2 className="text-text-secondary dark:text-text-secondary-dark text-xs font-normal">
                    Dice Color
                  </h2>

                  <DiceStylePicker
                    currentDieStyle={diceStyle}
                    dieStyles={diceRoller.config.styles}
                    onStyleClick={setDiceStyle}
                  />
                </div>
              )}
            {playerRole === "GM" && diceRoller.config !== undefined && (
              <Button
                className="mt-2 w-full"
                variant={"default"}
                onClick={
                  diceRoller.config === undefined
                    ? () =>
                        setResult(powerRoll(bonus, edges, banes, playerName))
                    : () => {
                        diceRoller.requestRoll(
                          createRollRequest({
                            gmOnly: true,
                            bonus: bonus + getBonusFromNetEdges(edges - banes),
                            styleId: diceStyle?.id,
                            netEdges: edges - banes,
                          }),
                        );
                      }
                }
              >
                Roll Secretly
              </Button>
            )}
            <Button
              className="mt-2 w-full"
              variant={"default"}
              onClick={
                diceRoller.config === undefined
                  ? () => setResult(powerRoll(bonus, edges, banes, playerName))
                  : () => {
                      diceRoller.requestRoll(
                        createRollRequest({
                          gmOnly: false,
                          bonus: bonus + getBonusFromNetEdges(edges - banes),
                          styleId: diceStyle?.id,
                          netEdges: edges - banes,
                        }),
                      );
                    }
              }
            >
              Roll
            </Button>
          </div>
          <div className="mt-6">
            <DiceRollViewer result={result} />
          </div>
        </div>
        <ScrollBar orientation="horizontal" forceMount />
      </ScrollArea>
    </div>
  );
}

const DiceRollViewer = ({ result }: { result: Roll }) => (
  <div className="space-y-2">
    <div>
      <div className="border-text-secondary flex min-h-9 flex-wrap items-center justify-evenly gap-y-2 rounded-t-md border p-2 px-4 dark:border-white/20">
        <TextAndLabel
          text={`${result.rolls[0]}, ${result.rolls[1]}`}
          label="Roll"
        />

        {result.bonus !== 0 && (
          <TextAndLabel
            text={(result.bonus > 0 ? "+" : "") + result.bonus}
            label="Bonus"
          />
        )}

        {result.netEdges !== 0 && (
          <TextAndLabel {...netEdgesTextAndLabel(result.netEdges)} />
        )}
      </div>
      <div className="border-text-secondary bg-mirage-50 dark:bg-mirage-950/70 flex items-center justify-evenly gap-4 rounded-b-md border border-t-0 p-2 px-4 dark:border-white/20">
        <TextAndLabel text={result.total.toString()} label="Total" />
        <TextAndLabel
          text={result.critical ? "Critical" : `${result.tier}`}
          label="Tier"
        />
      </div>
    </div>
  </div>
);

const TextAndLabel = ({ text, label }: { text: string; label: string }) => {
  return (
    <div className="flex flex-col items-center px-3">
      <div className="text-2xs text-text-secondary dark:text-text-secondary-dark">
        {label}
      </div>
      <div className="text-text-primary dark:text-text-primary-dark text-base">
        {text}
      </div>
    </div>
  );
};
