
// import { Map } from "./Subclass";
// import { PlayToken } from "./Ability";
import { ASIFeature } from "./ASIFeature";

/**
 * This is a simple increasing of an Ability Score.
 * It has an amount and options.  
 * If the options only has one in it, then it automatically uses it.
 */
export class CharacterASIFeature {
  id: number;
  amount: number;
  selected_option: string;

  constructor(obj?: any) {
    this.id = obj ? obj.id : -1;
    this.amount = obj ? obj.amount : 1;
    this.selected_option = obj ? `${obj.selected_option}` : "";
  }

  toDBObj = () => {
    return {
      amount: this.amount,
      selected_option: this.selected_option
    };
  }

  copy(copyMe: CharacterASIFeature): void {
    this.id = copyMe.id;
    this.amount = copyMe.amount;
    this.selected_option = copyMe.selected_option;
  }

  copyASIFeature(copyMe: ASIFeature): void {
    this.id = copyMe.id;
    this.amount = copyMe.amount;
    this.selected_option = "";
    if (copyMe.options.length === 1) {
      this.selected_option = copyMe.options[0];
    }
  }

  connectASIFeature(copyMe: ASIFeature): void {
    // this.id = copyMe.id;
    // this.amount = copyMe.amount;
    // this.selected_option = "";
    // if (copyMe.options.length === 1) {
    //   this.selected_option = copyMe.options[0];
    // }
  }
}