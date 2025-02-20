import { Item } from "@owlbear-rodeo/sdk";

type Token = {
  item: Item;
  stamina: number;
  staminaMaximum: number;
  temporaryStamina: number;
  heroicResource: number;
  surges: number;
  recoveries: number;
  gmOnly: boolean;
  group: number;
  index: number;
  type: "HERO" | "MONSTER" | "UNSET";
};
export default Token;
