
import {
  RollPlus
} from ".";
import { AbilityScores } from "./AbilityScores";

import DataUtilities from "../utilities/data_utilities";
import { DataUtilitiesClass } from "../utilities/data_utilities_class";


export class Attack {
  attack_rolls: RollPlus[];
  damage_rolls: RollPlus[];
  bonus_action: boolean;
  type: string;
  attack_string: string;
  damage_string: string;

  constructor(obj?: any) {
    this.bonus_action = obj ? obj.bonus_action : false;
    this.type = obj ? obj.type : "";
    this.attack_rolls = [];
    // obj ? new RollPlus(obj.attack_rolls) : new RollPlus();
    this.damage_rolls = []; 
    // obj ? new RollPlus(obj.damage_rolls) : new RollPlus();
    this.attack_string = "";
    this.damage_string = "";
    this.data_util = DataUtilities.getInstance();
    this.recalc_attack_string(null);
    this.recalc_damage_string(null);
  }

  data_util: DataUtilitiesClass;

  recalc_attack_string(ability_scores: AbilityScores | null) {
    this.attack_string = "";
    let bonuses = 0;
    this.attack_rolls.forEach(rolls => {
      bonuses += rolls.flat;
      if (ability_scores && !["","None","undefined"].includes(rolls.ability_score)) {
        const mod = ability_scores.getModifier(rolls.ability_score);
        if (mod) {
          bonuses += mod;
        }
      }
      if (rolls.size === 1) {
        bonuses += rolls.count;
      } else if (rolls.size > 1 && rolls.count !== 0) {
        rolls.recalculate_string();
        this.attack_string += this.data_util.add_plus_maybe(rolls.as_string);
      }
    });
    this.attack_string =this.data_util.add_plus_maybe_2_strings(this.attack_string, bonuses, true);
  }

  recalc_damage_string(ability_scores: AbilityScores | null) {
    this.damage_string = "";
    let bonuses = 0;
    this.damage_rolls.filter(o => o.size === 1).forEach(rolls => {
      bonuses += rolls.count;
    });
    this.damage_rolls.forEach(rolls => {
      bonuses += rolls.flat;
      if (ability_scores && !["","None","undefined"].includes(rolls.ability_score)) {
        const mod = ability_scores.getModifier(rolls.ability_score);
        if (mod) {
          bonuses += mod;
        }
      }
      if (rolls.size > 1 && rolls.count !== 0) {
        rolls.recalculate_string();
        this.damage_string = this.data_util.add_plus_maybe_2_strings(this.damage_string, rolls.as_string);
      }
    });
    this.damage_string = this.data_util.add_plus_maybe_2_strings(this.damage_string, bonuses);
  }
}