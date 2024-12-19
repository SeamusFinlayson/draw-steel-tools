import { Item } from "@owlbear-rodeo/sdk";

type Token = {
  item: Item;
  stamina: number;
  staminaMaximum: number;
  temporaryStamina: number;
  heroicResource: number;
  gmOnly: boolean;
  group: number;
  index: number;
};
export default Token;
