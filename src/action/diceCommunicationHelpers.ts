import { DiceProtocol } from "@/diceProtocol";
import OBR from "@owlbear-rodeo/sdk";
import { useEffect, useState } from "react";

export function createRollRequest(args: {
  gmOnly: boolean;
  combination?: "HIGHEST" | "LOWEST" | "SUM" | "NONE";
  bonus?: number;
  styleId?: string;
}): DiceProtocol.RollRequest {
  return {
    id: `drawSteelTools-${Date.now()}`,
    replyChannel: DiceProtocol.ROLL_RESULT_CHANNEL,
    ...args,
    dice: [
      {
        id: Math.random().toString(),
        type: "D10",
      },
      {
        id: Math.random().toString(),
        type: "D10",
      },
    ],
  };
}

type DiceRoller = {
  connect: () => void;
  disconnect: () => void;
  onRollResult: (rollResult: DiceProtocol.RollResult) => void;
} & (
  | {
      config: DiceProtocol.DiceRollerConfig;
      requestRoll: (rollRequest: DiceProtocol.RollRequest) => void;
    }
  | {
      config: undefined;
      requestRoll: undefined;
    }
);

function requestDiceRollerConfig() {
  OBR.broadcast.sendMessage(
    DiceProtocol.DICE_ROLLER_HELLO_CHANNEL,
    {},
    { destination: "LOCAL" },
  );
}

export function useDiceRoller({
  onRollResult,
}: {
  onRollResult: (rollResult: DiceProtocol.RollResult) => void;
}): DiceRoller {
  const [config, setConfig] = useState<DiceProtocol.DiceRollerConfig>();

  useEffect(() => {
    // Automatically connect to dice roller at startup
    requestDiceRollerConfig();

    return OBR.broadcast.onMessage(
      DiceProtocol.DICE_CLIENT_HELLO_CHANNEL,
      (event) => {
        const data = event.data as DiceProtocol.DiceRollerConfig;
        if (!data.dieTypes.includes("D10")) {
          console.error(
            "Error D10 is not supported by the requested dice roller",
          );
          return;
        }
        setConfig(data);
      },
    );
  }, []);

  useEffect(
    () =>
      OBR.broadcast.onMessage(DiceProtocol.ROLL_RESULT_CHANNEL, (event) => {
        const data = event.data as DiceProtocol.RollResult;
        onRollResult(data);
      }),
    [onRollResult],
  );
  if (config === undefined) {
    return {
      config,
      connect: requestDiceRollerConfig,
      disconnect: () => setConfig(undefined),
      requestRoll: undefined,
      onRollResult,
    };
  }

  return {
    config,
    connect: requestDiceRollerConfig,
    disconnect: () => setConfig(undefined),
    requestRoll: (rollRequest) => {
      OBR.broadcast.sendMessage(config.rollRequestChannel, rollRequest, {
        destination: "LOCAL",
      });
    },
    onRollResult,
  };
}
