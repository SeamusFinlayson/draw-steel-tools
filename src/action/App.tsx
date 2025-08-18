import "../index.css";
import { useCallback, useEffect, useRef, useState } from "react";
import { Roll, Trackers } from "./types";
import {
  getTrackersFromScene,
  powerRoll,
  writeTrackersToScene,
} from "./helpers";
import OBR, { Metadata } from "@owlbear-rodeo/sdk";
import { addThemeToBody } from "@/colorHelpers";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { inlineMath } from "@/statInputHelpers";
import { Button } from "@/components/ui/button";
import DiceStylePicker from "./DiceStylePicker";
import {
  EllipsisVerticalIcon,
  HistoryIcon,
  LoaderCircleIcon,
  MinusIcon,
  PlugZap,
  PlusIcon,
  Settings2,
  SwatchBookIcon,
  UnplugIcon,
  XIcon,
} from "lucide-react";
import { getPluginId } from "@/getPluginId";
import SideBarMenu from "./SideBarMenu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { createRollRequest, useDiceRoller } from "./diceCommunicationHelpers";
import { DiceProtocol } from "@/diceProtocol";
import ActionInput from "@/components/ActionInput";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import PartiallyControlledInput from "@/components/PartiallyControlledInput";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DiceRollViewer } from "./DiceRollViewer";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Toggle } from "@/components/ui/toggle";
import ConnectedDiceIcon from "@/components/icons/ConnectedDiceIcon";

export default function App(): React.JSX.Element {
  // Internal State
  const [edges, setEdges] = useState(0);
  const [banes, setBanes] = useState(0);
  const netEdges = edges - banes;
  const [bonus, setBonus] = useState(0);
  const [hasSkill, setHasSkill] = useState(false);
  const [diceOptions, setDiceOptions] = useState<
    "2d10" | "3d10kh2" | "3d10kl2"
  >("2d10");
  const [rollVisibility, setRollVisibility] = useState<"shared" | "self">(
    "shared",
  );

  const restoreDefaultRollConfig = useCallback(() => {
    setEdges(0);
    setBanes(0);
    setBonus(0);
    setHasSkill(false);
    setDiceOptions("2d10");
    setRollVisibility("shared");
  }, []);

  const [result, setResult] = useState<Roll>();
  const [diceResultViewerOpen, setDiceResultViewerOpen] = useState(false);

  const [selectedDiceStyle, setSelectedDiceStyle] =
    useState<DiceProtocol.DieStyle>();

  const divRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!divRef.current) return;
    divRef;
    const resizeObserver = new ResizeObserver((entries) => {
      if (entries.length > 0) {
        const height = entries[0].borderBoxSize[0].blockSize;
        OBR.action.setHeight(height + 1);
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
    (data: DiceProtocol.PowerRollResult) => {
      OBR.action.open();
      const rolls = data.result.map((val) => val.result);
      for (let i = 0; i < rolls.length; i++) {
        if (rolls[i] === 0) rolls[i] = 10;
      }

      setResult(
        powerRoll({
          bonus: data.rollProperties.bonus,
          hasSkill: data.rollProperties.hasSkill,
          netEdges: data.rollProperties.netEdges,
          playerName,
          rollMethod: "givenValues",
          dieValues: rolls,
          selectionStrategy:
            data.rollProperties.dice === "3d10kl2" ? "lowest" : "highest",
        }),
      );

      restoreDefaultRollConfig();
    },
    [bonus, hasSkill, netEdges, playerName],
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
    <div className="bg-mirage-50/75 dark:bg-mirage-950/50 dark:text-text-primary-dark flex h-full flex-col overflow-clip">
      <ScrollArea className="h-full" type="always">
        <div ref={divRef} className="pb-2">
          <div className="flex h-14 items-center gap-2 px-4">
            <h1 className="w-full text-lg font-bold">Draw Steel Tools</h1>

            <div className="flex gap-2">
              {diceRoller.config === undefined ? (
                diceConfigHasNeverBeenConnected ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button asChild variant={"ghost"} size={"icon"}>
                        <a
                          href="https://seamus-finlayson.ca/pages/connected-dice"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ConnectedDiceIcon />
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
                      onClick={() => {
                        diceRoller.disconnect();
                        setSelectedDiceStyle(undefined);
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

              <SideBarMenu>
                {playerRole === "GM" && (
                  <Button
                    variant={"ghost"}
                    className="h-10 w-full items-center justify-start gap-4 rounded-none px-4"
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
                    <div className="place-items- grid size-6">
                      <Settings2 />
                    </div>
                    <div>Settings</div>
                  </Button>
                )}
              </SideBarMenu>
            </div>
          </div>

          <Accordion
            type="single"
            className="w-full"
            collapsible
            defaultValue="item-2"
            // value={["item-1", "item-2"]}
          >
            <AccordionItem value="item-1">
              <AccordionTrigger
                preview={
                  <>
                    <Badge text={`Malice: ${trackers.malice}`} />
                    <Badge text={`Hero Tokens: ${trackers.heroTokens}`} />
                  </>
                }
              >
                Scene Resources
              </AccordionTrigger>
              <AccordionContent>
                <div className="flex gap-4 px-4">
                  {playerRole === "GM" && (
                    <ActionInput
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
                  <ActionInput
                    parentValue={trackers.heroTokens.toString()}
                    clearContentOnFocus
                    showParentValue
                    labelStyle="VISIBLE"
                    updateHandler={(target) => {
                      const newTrackers: Trackers = {
                        ...trackers,
                        heroTokens: inlineMath(
                          target.value,
                          trackers.heroTokens,
                        ),
                      };
                      setTrackers(newTrackers);
                      writeTrackersToScene(newTrackers);
                    }}
                    name={"Hero Tokens"}
                    label={"Hero Tokens"}
                  />
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger
                alwaysShowPreview
                preview={
                  result === undefined ? (
                    <Badge text={"Make a Roll"} />
                  ) : (
                    <>
                      <Badge text={`Total: ${result.total}`} />
                      <Badge
                        text={
                          result.critical ? "Critical" : `Tier ${result.tier}`
                        }
                      />
                    </>
                  )
                }
              >
                Power Roll
              </AccordionTrigger>
              <AccordionContent className="pb-2">
                <div className="bg-mirage-50 dark:bg-mirage-950 mx-4 space-y-4 rounded-2xl p-4">
                  <div>
                    <Label variant="small" htmlFor="bonusInput">
                      Bonus
                    </Label>
                    <div className="grid grid-cols-3 place-items-stretch gap-1">
                      <Button
                        aria-label="decrement bonus"
                        className="rounded-r-[8px]"
                        onClick={() => setBonus(bonus - 1)}
                      >
                        <MinusIcon />
                      </Button>
                      <PartiallyControlledInput
                        id="bonusInput"
                        className="dark:focus:border-primary-dark focus:border-primary h-9 rounded-[8px] border border-black/20 text-center outline-none focus:border-2 dark:border-white/20"
                        onUserConfirm={(target) =>
                          setBonus(inlineMath("=" + target.value, bonus))
                        }
                        parentValue={bonus.toString()}
                        clearContentOnFocus
                      />
                      <Button
                        aria-label="increment bonus"
                        className="rounded-l-[8px]"
                        onClick={() => setBonus(bonus + 1)}
                      >
                        <PlusIcon />
                      </Button>
                    </div>
                  </div>

                  <div
                    data-two-col={diceRoller.config !== undefined}
                    className="grid gap-2 data-[two-col=true]:grid-cols-2"
                  >
                    <div className="col-span-1">
                      <Label variant="small" htmlFor="skillToggleButton">
                        Skill
                      </Label>
                      <Toggle
                        id="skillToggleButton"
                        pressed={hasSkill}
                        onClick={() => setHasSkill(!hasSkill)}
                      >
                        {hasSkill ? "+2" : "+0"}
                      </Toggle>
                    </div>
                    {diceRoller.config !== undefined && (
                      <div>
                        <Label variant="small" htmlFor="colorPickerTrigger">
                          Dice Color
                        </Label>
                        <DiceStylePicker
                          dialogTrigger={
                            <Button id="colorPickerTrigger" className="w-full">
                              <SwatchBookIcon className="w-10 shrink-0" />
                              <div
                                style={{
                                  backgroundColor: selectedDiceStyle?.color,
                                }}
                                className="outline-text-secondary size-5 rounded-full outline duration-150 dark:outline-white/20"
                              />
                            </Button>
                          }
                          dieStyles={diceRoller.config.styles}
                          onStyleClick={setSelectedDiceStyle}
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <div className="grow">
                      <Label variant="small" htmlFor="edgesButtonGroup">
                        Edges
                      </Label>
                      <ToggleGroup
                        id="edgesButtonGroup"
                        className="w-full"
                        type="single"
                        value={edges.toString()}
                        onValueChange={(val) =>
                          setEdges(val === "" ? 0 : parseFloat(val))
                        }
                      >
                        <ToggleGroupItem aria-label="Edge" value="1">
                          1
                        </ToggleGroupItem>
                        <ToggleGroupItem aria-label="Double Edge" value="2">
                          2
                        </ToggleGroupItem>
                      </ToggleGroup>
                    </div>
                    <div className="grow">
                      <Label variant="small" htmlFor="banesButtonGroup">
                        Banes
                      </Label>
                      <ToggleGroup
                        id="banesButtonGroup"
                        className="w-full"
                        type="single"
                        value={banes.toString()}
                        onValueChange={(val) =>
                          setBanes(val === "" ? 0 : parseFloat(val))
                        }
                      >
                        <ToggleGroupItem aria-label="Bane" value="1">
                          1
                        </ToggleGroupItem>
                        <ToggleGroupItem aria-label="Double Bane" value="2">
                          2
                        </ToggleGroupItem>
                      </ToggleGroup>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Dialog open={diceResultViewerOpen}>
                      <DialogTrigger asChild>
                        <Button
                          disabled={result === undefined}
                          size={"lg"}
                          variant={"ghost"}
                          className="w-10 px-0"
                          onClick={() => setDiceResultViewerOpen(true)}
                        >
                          <HistoryIcon />
                        </Button>
                      </DialogTrigger>
                      <DialogContent
                        showCloseButton={false}
                        onEscapeKeyDown={() => setDiceResultViewerOpen(false)}
                        onPointerDownOutside={() =>
                          setDiceResultViewerOpen(false)
                        }
                      >
                        <DialogHeader>
                          <DialogTitle className="hidden">
                            Roll Result
                          </DialogTitle>
                          <DialogDescription className="hidden">
                            The result of your power roll.
                          </DialogDescription>
                          {result === undefined ? (
                            <div className="grid place-items-center gap-4 p-4">
                              <div className="p-4">
                                <LoaderCircleIcon className="animate-spin" />
                              </div>
                              <div>Rolling Dice</div>
                            </div>
                          ) : (
                            <DiceRollViewer result={result} />
                          )}
                        </DialogHeader>
                      </DialogContent>
                    </Dialog>

                    <Button
                      variant={"primary"}
                      size={"lg"}
                      className="grow"
                      onClick={() => {
                        setDiceResultViewerOpen(true);
                        if (diceRoller.config === undefined) {
                          setResult(
                            powerRoll({
                              playerName,
                              bonus,
                              hasSkill,
                              netEdges,
                              rollMethod: "rollNow",
                              dice: "2d10",
                            }),
                          );
                          restoreDefaultRollConfig();
                        } else {
                          setResult(undefined);
                          diceRoller.requestRoll(
                            createRollRequest({
                              bonus,
                              netEdges,
                              hasSkill,
                              styleId: selectedDiceStyle?.id,
                              dice: "2d10",
                              gmOnly: false,
                            }),
                          );
                        }
                      }}
                    >
                      Roll
                    </Button>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          aria-label="open advanced roll options"
                          variant={"primary"}
                          size={"icon"}
                        >
                          <EllipsisVerticalIcon />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="flex size-full max-w-full flex-col justify-between rounded-none">
                        <div className="space-y-3">
                          <DialogHeader>
                            <DialogTitle>Advanced Roll </DialogTitle>
                            <DialogClose
                              asChild
                              className="absolute top-3.5 right-3.5"
                            >
                              <Button variant={"ghost"} size={"icon"}>
                                <XIcon />
                              </Button>
                            </DialogClose>
                            <DialogDescription>
                              Make a roll with additional configurations
                            </DialogDescription>
                          </DialogHeader>
                          <Separator className="mb-[13px]" />
                          <div>
                            <div className="text-text-secondary dark:text-text-secondary-dark text-sm">
                              Dice Options
                            </div>
                            <RadioGroup
                              value={diceOptions}
                              onValueChange={(val) =>
                                setDiceOptions(
                                  val as "2d10" | "3d10kh2" | "3d10kl2",
                                )
                              }
                            >
                              <div className="flex items-center">
                                <RadioGroupItem value="2d10" id="2d10" />
                                <Label htmlFor="2d10">2d10</Label>
                              </div>
                              <div className="flex items-center">
                                <RadioGroupItem value="3d10kh2" id="3d10kh2" />
                                <Label htmlFor="3d10kh2">
                                  3d10 keep highest 2
                                </Label>
                              </div>
                              <div className="flex items-center">
                                <RadioGroupItem value="3d10kl2" id="3d10kl2" />
                                <Label htmlFor="3d10kl2">
                                  3d10 keep lowest 2
                                </Label>
                              </div>
                            </RadioGroup>
                          </div>

                          {diceRoller.config !== undefined && (
                            <div>
                              <div className="text-text-secondary dark:text-text-secondary-dark text-sm">
                                Roll Visibility
                              </div>
                              <RadioGroup
                                value={rollVisibility}
                                onValueChange={(val) =>
                                  setRollVisibility(val as "shared" | "self")
                                }
                              >
                                <div className="flex items-center">
                                  <RadioGroupItem value="shared" id="shared" />
                                  <Label htmlFor="shared">Shared</Label>
                                </div>
                                <div className="flex items-center">
                                  <RadioGroupItem value="self" id="self" />
                                  <Label htmlFor="self">Self</Label>
                                </div>
                              </RadioGroup>
                            </div>
                          )}
                        </div>
                        <DialogClose asChild>
                          <Button
                            variant={"primary"}
                            size={"lg"}
                            onClick={() => {
                              setDiceResultViewerOpen(true);
                              if (diceRoller.config === undefined) {
                                setResult(
                                  powerRoll({
                                    bonus,
                                    hasSkill,
                                    netEdges,
                                    playerName,
                                    rollMethod: "rollNow",
                                    dice: diceOptions,
                                  }),
                                );
                                restoreDefaultRollConfig();
                              } else {
                                setResult(undefined);
                                diceRoller.requestRoll(
                                  createRollRequest({
                                    bonus,
                                    hasSkill,
                                    styleId: selectedDiceStyle?.id,
                                    netEdges,
                                    dice: diceOptions,
                                    gmOnly: rollVisibility === "self",
                                  }),
                                );
                              }
                            }}
                          >
                            Roll
                          </Button>
                        </DialogClose>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        <ScrollBar orientation="horizontal" forceMount />
      </ScrollArea>
    </div>
  );
}
