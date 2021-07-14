
import { Ability } from "./Ability";
import { SpellAsAbility } from "./SpellAsAbility";
import { ItemAffectingAbility } from "./ItemAffectingAbility";
import { 
  Attack,
  Character,
  CreatureAbility,
  MinionAbility,
  CharacterFeature, 
  IStringNumOrStringHash,
  CharacterClass, 
  CharacterFeat, 
  CharacterItem,
  CharacterRace,
  Potence,
  UpgradableNumber,
  Spell
} from ".";
import { AbilityScores } from "./AbilityScores";

export class CharacterAbility {
  true_id: string;
  ability_type: string; 
  the_ability: Ability | SpellAsAbility | ItemAffectingAbility | CreatureAbility | MinionAbility | null;
  source_type: string; // Class, Race, Feat, or Item
  source_id: string;
  source_name: string;
  spellcasting_ability: string;
  spell_dc: number;
  spell_attack: number;
  attack: Attack;
  attack_string: string;
  damage_string: string;
  use_spellcasting_modifier: boolean = false;
  special_resource_used: number;
  special_resource_amount: number;
  customizations: IStringNumOrStringHash;
  base_slot_level: number; // If it uses spell slots, this is the lowest level

  constructor(obj?: any) {
    this.true_id = obj && obj.true_id ? obj.true_id : "";
    this.ability_type = obj ? obj.ability_type : "";
    switch (this.ability_type) {
      case "Ability":
        this.the_ability = obj ? new Ability(obj.the_ability) : new Ability();
      break;
      case "Creature Ability":
        this.the_ability = obj ? new CreatureAbility(obj.the_ability) : new CreatureAbility();
      break;
      case "Minion Ability":
        this.the_ability = obj ? new MinionAbility(obj.the_ability) : new CreatureAbility();
      break;
      case "Spell as Ability":
        this.the_ability = obj ? new SpellAsAbility(obj.the_ability) : new SpellAsAbility();
      break;
      case "Item Affecting Ability":
        this.the_ability = obj ? new ItemAffectingAbility(obj.the_ability) : new ItemAffectingAbility();
      break;
      default:
        this.the_ability = null;
      break;
    }
    this.spellcasting_ability = obj && obj.spellcasting_ability ? obj.spellcasting_ability : "";
    this.spell_attack = obj && obj.spell_attack ? +obj.spell_attack : 0;
    this.attack = obj && obj.attack ? obj.attack : new Attack();
    this.spell_dc = obj && obj.spell_dc ? +obj.spell_dc : 0;
    this.customizations = obj ? obj.customizations : {};
    this.source_type = obj ? obj.source_type : "";
    this.source_id = obj ? obj.source_id : "";
    this.source_name = obj ? obj.source_name : "";
    this.special_resource_used = obj && obj.special_resource_used ? obj.special_resource_used : 0;
    this.special_resource_amount = -1;
    this.base_slot_level = obj && obj.base_slot_level ? obj.base_slot_level : 1;
    this.attack_string = "";
    this.damage_string = "";
    this.recalc_attack_string(null);
  }

  get name(): string {
    if (this.the_ability) {
      return this.the_ability.name;
    }
    return "";
  }

  get level(): number {
    if (this.the_ability instanceof SpellAsAbility) {
      return this.the_ability.level;
    } else if (this.the_ability instanceof Ability) {
      return this.the_ability.slot_level;
    } else {
      return 0;
    }
  }

  get spell(): Spell | null {
    if (this.the_ability instanceof SpellAsAbility) {
      return this.the_ability.spell;
    } else {
      return null;
    }
  }

  get use_attack(): boolean {
    if (this.the_ability instanceof SpellAsAbility) {
      if (this.spell && 
        !["Summon"].includes(this.spell.effect.type) && 
        !["None","undefined"].includes(this.spell.effect.attack_type)) {
        if (this.spell.effect.attack_type !== "Save") {
          return true;
        } 
      }
      return false;
    } else if (this.the_ability instanceof Ability) {
      if (this.the_ability.attack_bonus > 0) {
        return true;
      }
    }
    return false;
  }

  recalc_attack_string(ability_scores: AbilityScores | null) {
    this.attack_string = "";
    if (this.spell && !["None","Utility","Healing","Max HP","Temp HP","Bonus Roll","Self Condition","Summon"].includes(this.effect_string)) {
      let bonuses = 0;
      let save = "";
      if (this.spell.effect.attack_type === "Save" && this.spell.saving_throw_ability_score) {
        save = this.spell.saving_throw_ability_score;
      }
      this.attack.attack_rolls.forEach(rolls => {
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
          if (rolls.as_string.length > 0 && rolls.as_string[0] !== "-") {
            this.attack_string += `+${rolls.as_string}`;
          } else {
            this.attack_string += rolls.as_string;
          }
        }
      });
      if (!["","None","undefined"].includes(save)) {
        this.attack_string = `${save} ${bonuses}`;
      } else if (bonuses > 0) {
        this.attack_string = `+${bonuses}${this.attack_string}`;
      } else if (bonuses < 0) {
        this.attack_string = `${bonuses}${this.attack_string}`;
      } else if (this.attack_string === "") {
        this.attack_string = "+0";
      }
    } else {
      this.attack_string = "--";
    }
  }

  get at_will(): boolean {
    if (this.the_ability instanceof SpellAsAbility) {
      return this.the_ability.at_will;
    }
    return false;
  }

  get ritual_only(): boolean {
    if (this.the_ability instanceof SpellAsAbility) {
      return this.the_ability.ritual_only;
    }
    return false;
  }

  get range_string(): string {
    let range_string = "--";
    if (this.the_ability) {
      if (this.the_ability instanceof ItemAffectingAbility) {

      } else if (this.the_ability instanceof SpellAsAbility) {
        if (this.the_ability.spell) {
          if (this.the_ability.spell.range && this.the_ability.spell.range.length > 0) {
            range_string = this.the_ability.spell.range;
          }
          if (this.the_ability.spell.range_2 && this.the_ability.spell.range_2.length > 0) {
            if (range_string.length > 0) {
              range_string += "/";
            }
            range_string += this.the_ability.spell.range_2;
          }
        }
      } else {
        if (this.the_ability.range && this.the_ability.range.length > 0) {
          range_string = this.the_ability.range;
        }
        if (this.the_ability.range_2 && this.the_ability.range_2.length > 0) {
          if (range_string.length > 0) {
            range_string += "/";
          }
          range_string += this.the_ability.range_2;
        }
      }
    }
    return range_string;
  }

  get components_string(): string {
    let components_string = "";
    if (this.the_ability) {
      if (this.the_ability instanceof ItemAffectingAbility) {

      } else if (this.the_ability instanceof SpellAsAbility) {
        if (this.the_ability.spell) {
          if (this.the_ability.spell.components) {
            if (this.the_ability.spell.components.includes("V")) {
              components_string = "V";
            }
            if (this.the_ability.spell.components.includes("S")) {
              if (components_string.length > 0) {
                components_string += ", ";
              }
              components_string += "S";
            }
            if (this.the_ability.spell.components.includes("M")) {
              if (components_string.length > 0) {
                components_string += ", ";
              }
              components_string += "M";
              components_string += ` (${this.the_ability.spell.material_component})`;
            }
          }
        }
      } else {
        if (this.the_ability.components) {
          if (this.the_ability.components.includes("V")) {
            components_string = "V";
          }
          if (this.the_ability.components.includes("S")) {
            if (components_string.length > 0) {
              components_string += ", ";
            }
            components_string += "S";
          }
          if (this.the_ability.components.includes("M")) {
            if (components_string.length > 0) {
              components_string += ", ";
            }
            components_string += "M";
            components_string += ` (${this.the_ability.material_component})`;
          }
        }
      }
    }
    return components_string;
  }

  get duration_string(): string {
    let duration_string = "";
    if (this.the_ability) {
      if (this.the_ability instanceof ItemAffectingAbility) {

      } else if (this.the_ability instanceof SpellAsAbility) {
        if (this.the_ability.spell) {
          duration_string = this.the_ability.spell.duration;
        }
      } else {
        duration_string = this.the_ability.duration;
      }
    }
    return duration_string;
  }

  get effect_string(): string {
    let effect_string = "";
    if (this.the_ability) {
      if (this.the_ability instanceof ItemAffectingAbility) {

      } else if (this.the_ability instanceof SpellAsAbility) {
        if (this.the_ability.spell) {
          effect_string = this.the_ability.spell.effect.type === "None" ? "Utility" : this.the_ability.spell.effect.type;
        }
      } else {
        effect_string = this.the_ability.effect.type === "None" ? "Utility" : this.the_ability.effect.type;
      }
    }
    return effect_string;
  }

  get_potence_string(slot_level: number, char: Character): string {
    let damage_string = "";
    let bonuses = 0;
    const potence = this.get_potence(slot_level, char);
    const ability_scores = char.current_ability_scores;
    if (potence) {
      bonuses += potence.rolls.flat;
      if (ability_scores && !["","None","undefined"].includes(potence.rolls.ability_score)) {
        const mod = ability_scores.getModifier(potence.rolls.ability_score);
        if (mod) {
          bonuses += mod;
        }
      }
      if (potence.rolls.size > 1 && potence.rolls.count !== 0) {
        potence.rolls.recalculate_string();
        if (damage_string.length > 0 && potence.rolls.as_string.length > 0 && potence.rolls.as_string[0] !== "-") {
          damage_string += `+${potence.rolls.as_string}`;
        } else {
          damage_string += potence.rolls.as_string;
        }
      }
    }
    if (this.the_ability && !(this.the_ability instanceof ItemAffectingAbility)) {
      if (this.the_ability instanceof SpellAsAbility) {

      } else if (this.the_ability instanceof Ability) {

      } else {
        if (this.the_ability.attack_bonus instanceof UpgradableNumber) {
          bonuses += this.the_ability.attack_bonus.value(char, this.source_id, this.base_slot_level, slot_level);
        } else {

        }
      }
    }
    if (bonuses > 0) {
      damage_string = `${damage_string}+${bonuses}`;
    } else if (bonuses < 0) {
      damage_string = `${damage_string}${bonuses}`;
    } else if (damage_string === "") {
      const self_condition_ids = this.self_condition();
      if (self_condition_ids.length > 0) {
        return "Apply";
      } else {
        damage_string = "0";
      }
    }
    return damage_string;
  }

  get_potence(slot_level: number, char: Character): Potence | null {
    if (this.the_ability) {
      if (this.the_ability instanceof ItemAffectingAbility) {

      } else if (this.the_ability instanceof SpellAsAbility) {
        if (this.the_ability.spell) {
          if (!["Control","Utility"].includes(this.effect_string)) {
            let level = -1;
            if (this.the_ability.spell.effect.potence_type === "Slot") {
              level = slot_level;
            } else if (this.the_ability.spell.effect.potence_type === "Character") {
              level = char.character_level;
            } else if (this.the_ability.spell.effect.potence_type === "Class" && this.source_type === "Class") {
              const class_finder = char.classes.filter(o => o.game_class_id === this.source_id);
              if (class_finder.length === 1) {
                level = class_finder[0].level;
              }
            }
            let potence_finder: Potence[] = [];
            potence_finder = this.the_ability.spell.effect.potences.filter(o => o.level === level);
            if (potence_finder.length === 0) {
              potence_finder = this.the_ability.spell.effect.potences.filter(o => o.level < level);
              if (potence_finder.length > 0) {
                const max_level = Math.max(...potence_finder.map(o => { return o.level }));
                potence_finder = this.the_ability.spell.effect.potences.filter(o => o.level === max_level);
              }
            } 
            if (potence_finder.length === 1) {
              const potence = new Potence(potence_finder[0]);
              if (this.the_ability.spell.effect.add_modifier.toLowerCase() === "true") {
                potence.rolls.ability_score = this.spellcasting_ability;
              } else {
                potence.rolls.ability_score = "";
              }
              return potence;
            }
          }
        }
      } else if (this.the_ability instanceof MinionAbility) {
        return new Potence();
      } else {
        if (!["Control","Utility"].includes(this.effect_string)) {
          let level = -1;
          if (this.the_ability.effect.potence_type === "Slot") {
            level = slot_level;
          } else if (this.the_ability.effect.potence_type === "Character") {
            level = char.character_level;
          } else if (this.the_ability.effect.potence_type === "Class" && this.source_type === "Class") {
            const class_finder = char.classes.filter(o => o.game_class_id === this.source_id);
            if (class_finder.length === 1) {
              level = class_finder[0].level;
            }
          }
          let potence_finder: Potence[] = [];
          potence_finder = this.the_ability.effect.potences.filter(o => o.level === level);
          if (potence_finder.length === 0) {
            potence_finder = this.the_ability.effect.potences.filter(o => o.level < level);
            if (potence_finder.length > 0) {
              const max_level = Math.max(...potence_finder.map(o => { return o.level }));
              potence_finder = this.the_ability.effect.potences.filter(o => o.level === max_level);
            }
          } 
          if (potence_finder.length === 1) {
            const potence = new Potence(potence_finder[0]);
            if (this.the_ability.effect.add_modifier.toLowerCase() === "true") {
              potence.rolls.ability_score = this.spellcasting_ability;
            } else {
              potence.rolls.ability_score = "";
            }
            return potence;
          }
        }
      }
    }
    return null;
  }

  use_string(obj: Character) {
    const the_ability = this.the_ability;
    if ((the_ability instanceof Ability || the_ability instanceof SpellAsAbility) && the_ability.resource_consumed) {
      if (the_ability.resource_consumed === "Special") {
        return `${this.special_resource_used}/${this.special_resource_amount}`;
      } else if (the_ability.resource_consumed === "None") {
        return "At Will";
      } else {
        const resource_finder = obj.resources.filter(o => 
          o.type_id === the_ability.resource_consumed);
        if (resource_finder.length === 1) {
          const resource = resource_finder[0];
          return `${resource.used}/${resource.total}`;
        }
      }
    }
    return "Use";
  }

  get casting_time_string(): string {
    let the_spell = this.the_ability;
    if (the_spell instanceof SpellAsAbility) {
      const casting_time = the_spell.casting_time;
      if (casting_time === "A") {
        return "Action";
      } else if (casting_time === "BA") {
        return "Bonus Action";
      } else if (casting_time === "RA") {
        return "Reaction";
      } else {
        return casting_time;
      }
    }
    return "";
  }

  disabled(obj: Character, level: number = -1) {
    const the_ability = this.the_ability;
    if ((the_ability instanceof Ability || the_ability instanceof SpellAsAbility) && the_ability.resource_consumed) {
      if (the_ability.resource_consumed === "Special") {
        return this.special_resource_used + +the_ability.amount_consumed > +this.special_resource_amount;
      } else if (the_ability.resource_consumed === "Slot") {
        if (level === -1) {
          level = the_ability.slot_level;
        }
        const filtered_slots = obj.slots.filter(o => 
          o.level === level &&
          (the_ability.slot_type === "" || o.type_id === the_ability.slot_type)
        );
        if (filtered_slots.length === 1) {
          const slot = filtered_slots[0];
          return slot.used + +the_ability.amount_consumed > slot.total;
        }
      } else {
        const resource_finder = obj.resources.filter(o => 
          o.type_id === the_ability.resource_consumed);
        if (resource_finder.length === 1) {
          const resource = resource_finder[0];
          return resource.used + +the_ability.amount_consumed > resource.total;
        }
      }
    }
    return true;
  }

  self_condition() {
    const cond_ids: string[] = [];
    if (this.the_ability instanceof Ability && this.the_ability.effect.type === "Self Condition") {
      this.the_ability.effect.conditions_applied.forEach(cond_id => {
        cond_ids.push(cond_id);
      });
    } else if (this.the_ability instanceof SpellAsAbility && this.the_ability.spell && this.the_ability.spell.effect.type === "Self Condition") {
      this.the_ability.spell.effect.conditions_applied.forEach(cond_id => {
        cond_ids.push(cond_id);
      });
    }
    return cond_ids;
  }

  toDBObj = () => {
    let the_ability: any = null;
    switch (this.ability_type) {
      case "Ability":
        the_ability = (this.the_ability as Ability).toDBObj();
      break;
      case "Creature Ability":
        the_ability = (this.the_ability as CreatureAbility).toDBObj();
      break;
      case "Minion Ability":
        the_ability = (this.the_ability as MinionAbility).toDBObj();
      break;
      case "Spell as Ability":
        the_ability = (this.the_ability as SpellAsAbility).toDBObj();
      break;
      case "Item Affecting Ability":
        the_ability = (this.the_ability as ItemAffectingAbility).toDBObj();
      break;
    }
    return {
      true_id: this.true_id,
      ability_type: this.ability_type,
      the_ability,
      customizations: this.customizations,
      source_type: this.source_type,
      source_id: this.source_id,
      source_name: this.source_name,
      special_resource_used: this.special_resource_used,
      base_slot_level: this.base_slot_level
    };
  }

  copyFeature = (feature: CharacterFeature) => {
    if (feature.feature.the_feature instanceof Ability ||
      feature.feature.the_feature instanceof SpellAsAbility ||
      feature.feature.the_feature instanceof ItemAffectingAbility) {
      this.ability_type = feature.feature.feature_type;
      this.the_ability = feature.feature.the_feature;
      if (this.the_ability.description.length === 0) {
        this.the_ability.description = feature.feature.description;
      }
      if (feature.feature.the_feature instanceof SpellAsAbility && feature.feature.the_feature.spellcasting_ability !== "") {
        this.spellcasting_ability = feature.feature.the_feature.spellcasting_ability;
      }
      this.true_id = feature.true_id;
    }
  }

  connectFeature = (feature: CharacterFeature) => {
    this.copyFeature(feature);
  }

  connectSource(source: CharacterClass | CharacterRace | CharacterFeat | CharacterItem) {
    if (source instanceof CharacterClass) {
      this.source_type = "Class";
      this.source_id = source.game_class_id;
      this.spellcasting_ability = source.spellcasting_ability;
      this.spell_attack = +source.spell_attack;
      this.spell_dc = +source.spell_dc;
      if (source.game_class) {
        this.source_name = source.game_class.name;
      }
    } else if (source instanceof CharacterFeat) {
      this.source_type = "Feat";
      this.source_id = source.feat_id;
      if (source.feat) {
        this.source_name = source.feat.name;
      }
    } else if (source instanceof CharacterItem) {
      this.source_type = "Item";
      this.source_id = source.true_id;
      this.source_name = source.name;
    } else if (source instanceof CharacterRace) {
      this.source_type = "Race";
      this.source_id = source.race_id;
      if (source.race) {
        this.source_name = source.race.name;
      }
    }
  }

  calc_special_resource_amount(char: Character) {
    if (this.the_ability && 
      (this.the_ability instanceof Ability || 
        this.the_ability instanceof SpellAsAbility || 
        this.the_ability instanceof ItemAffectingAbility) && 
      this.the_ability.resource_consumed === "Special") {
      this.special_resource_amount = this.the_ability.special_resource_amount.value(char, this.source_id, -1, -1);
    }
  }
}