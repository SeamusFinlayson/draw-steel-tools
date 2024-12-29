import React from "react";

export type StampedDiceRoll =
  | {
      timeStamp: number;
      total: number;
      roll: string;
      playerName: string;
      visibility: "PUBLIC" | "GM";
    }
  | {
      timeStamp: number;
      total: number;
      roll: string;
      playerName: string;
      visibility: "PRIVATE";
      playerId: string;
    };

export type ActionAppState = {
  rolls: StampedDiceRoll[];
  value: number | null;
  animateRoll: boolean;
};

export type Action =
  | {
      type: "set-rolls";
      rolls: StampedDiceRoll[];
    }
  | {
      type: "add-roll";
      diceExpression: string;
      playerName: string;
      visibility: "PUBLIC" | "GM";
      dispatch: React.Dispatch<Action>;
    }
  | {
      type: "add-roll";
      diceExpression: string;
      playerName: string;
      visibility: "PRIVATE";
      playerId: string;
      dispatch: React.Dispatch<Action>;
    }
  | {
      type: "set-value";
      value: number | null;
    }
  | {
      type: "set-animate-roll";
      animateRoll: boolean;
    };

export type Trackers = {
  malice: number;
  heroTokens: number;
};
