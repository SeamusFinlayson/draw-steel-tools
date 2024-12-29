import "../index.css";
import { useEffect, useState } from "react";
import { Trackers } from "./types";
import Header from "./Header";
import { getTrackersFromScene, writeTrackersToScene } from "./helpers";
import OBR from "@owlbear-rodeo/sdk";
import { addThemeToBody } from "@/colorHelpers";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { inlineMath } from "@/statInputHelpers";
import TrackerInput from "@/components/TrackerInput";
import { Button } from "@/components/ui/button";
import IntegerButtonGroup from "./IntegerButtonGroup";

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
      // setSceneReady(ready);
      if (ready) getTrackersFromScene().then((value) => setTrackers(value));
    };
    OBR.scene.isReady().then(handleReady);
    return OBR.scene.onReadyChange(handleReady);
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

  return (
    <div className="h-full overflow-clip">
      <div className="flex h-full flex-col justify-between bg-mirage-50/75 dark:bg-mirage-950/55 dark:text-mirage-200">
        <Header playerRole={playerRole} />

        <ScrollArea className="h-full">
          <div className="space-y-2 px-4">
            <h1 className="font-bold">Resources</h1>
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

            <h1 className="font-bold">Power Roll</h1>

            <div className="space-y-2">
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

              <div className="grid grid-cols-2 items-end gap-4">
                <TrackerInput
                  parentValue={bonus.toString()}
                  clearContentOnFocus
                  updateHandler={(target) =>
                    setBonus(inlineMath("=" + target.value, bonus))
                  }
                  name={"Bonus"}
                  label={"Bonus"}
                />
                <Button
                  className="w-16 justify-self-end"
                  variant={"default"}
                  onClick={() =>
                    setResult(powerRoll(bonus, edges, banes, playerName))
                  }
                >
                  Roll
                </Button>
              </div>
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
): Roll {
  // Validate Input
  const naturalBonus = bonus;
  if (!validEdgeValue(edges)) throw new Error("Invalid Edges Value");
  if (!validEdgeValue(banes)) throw new Error("Invalid Banes Value");

  // Make roll
  const diceRoll = powerRollDice();
  const naturalResult = diceRoll.total;
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
      rolls: diceRoll.rolls,
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
    rolls: diceRoll.rolls,
  };
}

function validEdgeValue(value: number) {
  const validEdgeOrBane = [0, 1, 2];
  if (!validEdgeOrBane.includes(value)) return false;
  return true;
}

function powerRollDice() {
  const rolls: number[] = [];
  let total = 0;
  for (let i = 0; i < 2; i++) {
    const value = Math.trunc(Math.random() * 10) + 1;
    total += value;
    rolls.push(value);
  }
  return { total, rolls };
}
