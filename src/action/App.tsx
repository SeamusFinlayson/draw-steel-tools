import "../index.css";
import { useEffect, useState } from "react";
import { Trackers } from "./types";
import { getTrackersFromScene, writeTrackersToScene } from "./helpers";
import OBR, { Metadata } from "@owlbear-rodeo/sdk";
import { addThemeToBody } from "@/colorHelpers";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { inlineMath } from "@/statInputHelpers";
import TrackerInput from "@/components/TrackerInput";
import { Button } from "@/components/ui/button";
import IntegerButtonGroup from "./IntegerButtonGroup";
import {
  CheckForDiceExtensions,
  DiceExtensionResponse,
  DieStyle,
  RollRequest,
  RollResult,
} from "@/diceProtocol";
import DiceStylePicker from "./DiceStylePicker";
import { PlugZap, Settings2, UnplugIcon } from "lucide-react";

import { getPluginId } from "@/getPluginId";
import MoreDropDown from "./MoreDropDown";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const HELLO_DICE_ROLLER_CHANNEL = "drawSteelStatBubble.dice.hello";
const ROLL_RESULT_CHANNEL = "drawSteelStatBubble.dice.replyChannel";

export default function App(): React.JSX.Element {
  const [trackers, setTrackers] = useState<Trackers>({
    malice: 0,
    heroTokens: 0,
  });

  // Scene State
  const [playerRole, setPlayerRole] = useState<"PLAYER" | "GM">("PLAYER");
  const [playerName, setPlayerName] = useState("");
  // const [sceneReady, setSceneReady] = useState(false);

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

  // Sync rolls
  // useEffect(
  //   () =>
  //     OBR.scene.onMetadataChange(async (sceneMetadata) => {
  //       if (sceneReady)
  //         dispatch({
  //           type: "set-rolls",
  //           rolls: await getRollsFromScene(sceneMetadata),
  //         });
  //     }),
  //   [],
  // );

  // Sync theme
  useEffect(
    () => OBR.theme.onChange((theme) => addThemeToBody(theme.mode)),
    [],
  );

  const [edges, setEdges] = useState(0);
  const [banes, setBanes] = useState(0);
  const [bonus, setBonus] = useState(0);
  const [result, setResult] = useState<Roll>({
    timeStamp: 0,
    playerName: "",
    bonus: 0,
    edges: 0,
    banes: 0,
    critical: false,
    tier: 0,
    total: 0,
    rolls: [0, 0],
  });

  // External dice roller messaging
  const [diceRequestChannel, setDiceRequestChannel] = useState<string>();
  const [dieStyles, setDieStyles] = useState<DieStyle[]>();
  const [currentDieStyle, setCurrentDieStyle] = useState<DieStyle>();

  useEffect(
    () =>
      OBR.broadcast.onMessage(HELLO_DICE_ROLLER_CHANNEL, (event) => {
        const data = event.data as DiceExtensionResponse;
        if (!data.dieTypes.includes("D10")) {
          console.error(
            "Error D10 is not supported by the requested dice roller",
          );
          return;
        }
        if (data.structuredFeatures === undefined) {
          console.error(
            "Error structured dice requests are not supported by the dice roller",
          );
          return;
        }
        if (data.styles) setDieStyles(data.styles);
        setDiceRequestChannel(data.requestChannel);
      }),
    [],
  );

  useEffect(() => {
    setTimeout(() => {
      if (diceRequestChannel === undefined) connectToDiceExtension();
    }, 2000);
  }, []);

  useEffect(
    () =>
      OBR.broadcast.onMessage(ROLL_RESULT_CHANNEL, (event) => {
        const data = event.data as RollResult;
        if (data.type !== "structured") {
          console.error("expected structured roll result");
          return;
        }
        OBR.action.open();
        const rolls = data.result.flatMap((result) => Object.values(result));
        for (let i = 0; i < rolls.length; i++) {
          if (rolls[i] === 0) rolls[i] = 10;
        }
        setResult(powerRoll(bonus, edges, banes, playerName, rolls));
      }),
    [bonus, edges, banes, playerName],
  );

  return (
    <div className="h-full overflow-clip">
      <div className="flex h-full flex-col justify-between bg-mirage-50/75 dark:bg-mirage-950/55 dark:text-mirage-200">
        <div className="flex items-center gap-2 p-4 pb-2 pt-4">
          <h1 className="w-full text-base font-bold">Draw Steel Tools</h1>

          <div className="flex gap-2">
            {diceRequestChannel === undefined ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => {
                      connectToDiceExtension();
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
            ) : (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => {
                      setDiceRequestChannel(undefined);
                      setDieStyles(undefined);
                      setCurrentDieStyle(undefined);
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
            {playerRole === "GM" ? (
              <Button
                size={"icon"}
                variant={"ghost"}
                className="shrink-0"
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
            ) : (
              <MoreDropDown />
            )}
          </div>
        </div>

        <ScrollArea className="h-full">
          <div className="space-y-2 px-4">
            <h1 className="pt-4 font-bold">Resources</h1>
            <div className="flex gap-4">
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

            <h1 className="pt-2 font-bold">Power Roll</h1>

            <div className="flex gap-4">
              <div className="w-full space-y-2">
                <h2 className="block text-xs font-normal text-text-secondary dark:text-text-secondary-dark">
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
                <h2 className="block text-xs font-normal text-text-secondary dark:text-text-secondary-dark">
                  Banes
                </h2>
                <IntegerButtonGroup
                  startValue={0}
                  endValue={2}
                  value={banes}
                  onClick={(newValue: number) => setBanes(newValue)}
                />
              </div>
            </div>

            <div className="flex items-end gap-4">
              <TrackerInput
                parentValue={bonus.toString()}
                clearContentOnFocus
                updateHandler={(target) =>
                  setBonus(inlineMath("=" + target.value, bonus))
                }
                name={"Bonus"}
                label={"Bonus"}
              />
              {diceRequestChannel === undefined ? (
                <>
                  <Button
                    className="w-16 justify-self-end"
                    variant={"default"}
                    onClick={() =>
                      setResult(powerRoll(bonus, edges, banes, playerName))
                    }
                  >
                    Roll
                  </Button>
                </>
              ) : (
                <>
                  {dieStyles !== undefined && (
                    <div>
                      <DiceStylePicker
                        currentDieStyle={currentDieStyle}
                        dieStyles={dieStyles}
                        onStyleClick={setCurrentDieStyle}
                      />
                    </div>
                  )}

                  <Button
                    onClick={() => {
                      OBR.broadcast.sendMessage(
                        diceRequestChannel,
                        createRollRequest({
                          style: currentDieStyle?.style,
                          hidden: false,
                        }),
                        {
                          destination: "LOCAL",
                        },
                      );
                    }}
                  >
                    Roll
                  </Button>
                </>
              )}
            </div>
          </div>

          <ScrollBar orientation="horizontal" forceMount />
        </ScrollArea>

        <div className="space-y-2 p-4 pt-1">
          <div>
            <div className="flex min-h-9 flex-wrap items-center justify-evenly gap-x-4 gap-y-2 rounded-t-md border border-mirage-300 p-2 px-4 dark:border-mirage-800">
              <div>{`Roll: ${result.rolls[0]}, ${result.rolls[1]}`}</div>
              {result.bonus !== 0 && (
                <div>{(result.bonus > 0 ? "+" : "") + result.bonus}</div>
              )}
              {result.edges === 1 && <div>Edge</div>}
              {result.edges === 2 && <div>Double Edge</div>}
              {result.banes === 1 && <div>Bane</div>}
              {result.banes === 2 && <div>Double Bane</div>}
            </div>
            <div className="flex h-9 items-center justify-evenly gap-4 rounded-b-md border border-t-0 border-mirage-300 bg-mirage-50 p-2 px-4 dark:border-mirage-800 dark:bg-mirage-950/70">
              <div>{`Tier ${result.tier}`}</div>
              {result.critical && <div>Critical</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

type Roll = {
  timeStamp: number;
  playerName: string;
  bonus: number;
  edges: number;
  banes: number;
  critical: boolean;
  tier: number;
  total: number;
  rolls: number[];
};

function powerRoll(
  bonus: number,
  edges: number,
  banes: number,
  playerName: string,
  rollValues?: number[],
): Roll {
  // Validate Input
  const naturalBonus = bonus;
  if (!validEdgeValue(edges)) throw new Error("Invalid Edges Value");
  if (!validEdgeValue(banes)) throw new Error("Invalid Banes Value");

  // Make roll
  if (rollValues === undefined) rollValues = powerRollDice();
  let total = 0;
  for (const roll of rollValues) {
    total += roll;
  }
  const naturalResult = total;
  if (naturalResult >= 19) {
    return {
      timeStamp: Date.now(),
      playerName,
      bonus: naturalBonus,
      edges,
      banes,
      critical: true,
      tier: 3,
      total: naturalResult,
      rolls: rollValues,
    };
  }

  // Apply single banes
  const netEdges = edges - banes;
  switch (netEdges) {
    case -1:
      bonus -= 2;
      break;
    case 1:
      bonus += 2;
      break;
  }
  const rollResult = naturalResult + bonus;

  // Get tier
  let tier = 0;
  if (rollResult < 12) tier = 1;
  else if (rollResult < 17) tier = 2;
  else tier = 3;

  // Apply double banes
  switch (netEdges) {
    case -2:
      if (tier > 1) tier -= 1;
      break;
    case 2:
      if (tier < 3) tier += 1;
      break;
  }

  return {
    timeStamp: Date.now(),
    playerName,
    bonus: naturalBonus,
    edges,
    banes,
    critical: false,
    tier,
    total: naturalResult,
    rolls: rollValues,
  };
}

function validEdgeValue(value: number) {
  const validEdgeOrBane = [0, 1, 2];
  if (!validEdgeOrBane.includes(value)) return false;
  return true;
}

function powerRollDice() {
  const rolls: number[] = [];
  for (let i = 0; i < 2; i++) {
    const value = Math.trunc(Math.random() * 10) + 1;
    rolls.push(value);
  }
  return rolls;
}

function createRollRequest({
  style,
  hidden,
}: {
  style?: string;
  hidden: boolean;
}): RollRequest {
  return {
    replyChannel: ROLL_RESULT_CHANNEL,
    dice: [
      {
        id: (Math.random() * 1000000).toString(),
        ...(style !== undefined ? { style } : {}),
        type: "D10",
      },
      {
        id: (Math.random() * 1000000).toString(),
        ...(style !== undefined ? { style } : {}),
        type: "D10",
      },
    ],
    hidden,
    type: "structured",
  };
}

function connectToDiceExtension() {
  OBR.broadcast.sendMessage(
    "general.dice.hello",
    {
      replyChannel: HELLO_DICE_ROLLER_CHANNEL,
    } as CheckForDiceExtensions,
    {
      destination: "LOCAL",
    },
  );
}
