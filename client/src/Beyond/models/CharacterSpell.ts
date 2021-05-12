
import { v4 as uuidv4 } from "uuid";
import { 
  Spell, 
  SpellAsAbility, 
  Character,
  CharacterClass, 
  CharacterFeat, 
  CharacterItem, 
  CharacterRace,
  IStringNumOrStringHash, 
  Potence,
  Attack,
  AbilityScores
} from ".";

export class CharacterSpell {
  true_id: string;
  _name: string;
  spell_id: string;
  spell: Spell | SpellAsAbility | null;
  customizations: IStringNumOrStringHash;
  source_type: string; // Class, Race, Feat, or Item
  source_id: string;
  source_name: string;
  always_known: boolean; // If this is true then it can't be unprepared, and it doesn't count against their spells prepared
  ritual: boolean;
  ritual_only: boolean;
  at_will: boolean;
  spellcasting_ability: string;
  spell_dc: number;
  spell_attack: number;
  bonus_damage: number;
  // This holds bonus damage from features
  attack: Attack;
  // These two are for Spell Books like Wizards have.
  // If they don't have a spell book 
  // then if it's not prepared/known then they just 
  // don't have a CharacterSpell for it.
  prepared: boolean | null;
  extra: boolean | null; // False if they learn at level up (free).  True if they transcribed it to get an extra spell.
  attack_string: string;
  damage_string: string;
  use_spellcasting_modifier: boolean = false;

  constructor(obj?: any) {
    this.true_id = obj && obj.true_id ? obj.true_id : uuidv4().toString();
    this._name = obj ? `${obj.name}` : "";
    this.spell_id = obj ? obj.spell_id : "";
    this.spell = obj && obj.spell ? new Spell(obj.spell) : null;
    this.customizations = obj ? obj.customizations : {};
    this.source_type = obj ? obj.source_type : "";
    this.source_id = obj ? obj.source_id : "";
    this.source_name = obj ? obj.source_name : "";
    this.always_known = obj ? obj.always_known : false;
    this.ritual = obj && obj.ritual ? obj.ritual : false;
    this.ritual_only = this.ritual && obj && obj.ritual_only ? obj.ritual_only : false;
    this.at_will = obj && obj.at_will ? obj.at_will : false;
    this.spellcasting_ability = obj && obj.spellcasting_ability ? obj.spellcasting_ability : "";
    this.spell_attack = obj && obj.spell_attack ? obj.spell_attack : "";
    this.attack = obj && obj.attack ? obj.attack : new Attack();
    this.bonus_damage = obj && obj.bonus_damage ? obj.bonus_damage : 0;
    this.spell_dc = obj && obj.spell_dc ? obj.spell_dc : "";
    this.prepared = obj ? obj.prepared : null;
    this.extra = obj ? obj.extra : null;
    this.attack_string = "";
    this.damage_string = "";
    this.recalc_attack_string(null);
  }

  get the_spell(): Spell | null {
    let the_spell: Spell | null = null;
    if (this.spell instanceof Spell) {
      the_spell = this.spell;
    } else if (this.spell instanceof SpellAsAbility) {
      the_spell = this.spell.spell;
    }
    return the_spell;
  }

  get name(): string {
    if (this._name === "") {
      if (this.spell) {
        return this.spell.name;
      }
    }
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }

  get level(): number {
    if (this.the_spell) {
      return this.the_spell.level;
    } else {
      return -1;
    }
  }

  get level_and_school(): string {
    let the_spell = this.the_spell;
    if (the_spell) {
      if (the_spell.level === 0) {
        return `${the_spell.school} Cantrip`;
      } else {
        return `${this.level_string} Level ${the_spell.school}`;
      }
    }
    return "";
  }

  get level_string(): string {
    const level = this.level;
    let level_str = "";
    if (level === 0) {
      level_str = "Cantrip";
    } else if (level === 1) {
      level_str = "1st";
    } else if (level === 2) {
      level_str = "2nd";
    } else if (level === 3) {
      level_str = "3rd";
    } else {
      level_str = `${level}th`;
    }
    return level_str;
  }

  get casting_time_string(): string {
    let the_spell = this.the_spell;
    if (the_spell) {
      const casting_time = the_spell.casting_time;
      if (casting_time === "A") {
        return "Action";
      } else if (casting_time === "BA") {
        return "Bonus Action";
      } else if (casting_time === "BA") {
        return "Reaction";
      } else {
        return casting_time;
      }
    }
    return "";
  }

  get use_attack(): boolean {
    if (this.the_spell && !["Summon"].includes(this.the_spell.effect.type) && !["None","undefined"].includes(this.the_spell.effect.attack_type)) {
      if (this.the_spell.effect.attack_type !== "Save") {
        return true;
      } 
    }
    return false;
  }

  get concentration(): boolean {
    if (this.the_spell) {
      return this.the_spell.concentration;
    } 
    return false;
  }

  use_string(character: Character) {
    console.log(character);
    return "Cast";
  }

  disabled(character: Character, level: number = -1) {
    if (this.spell) {
      const filtered_slots = character.slots.filter(o => 
        o.level === level && o.used < o.total
      );
      return filtered_slots.length > 0;
    }
    return true;
  }

  recalc_attack_string(ability_scores: AbilityScores | null): void {
    if (this.the_spell && !["None","Utility","Healing","Max HP","Temp HP","Bonus Roll","Self Condition","Summon"].includes(this.effect_string)) {
      this.attack_string = "";
      let bonuses = 0;
      let save = "";
      if (this.spell instanceof Spell) {
        if (this.spell.effect.attack_type === "Save" && this.spell.saving_throw_ability_score) {
          save = this.spell.saving_throw_ability_score;
        }
      } else if (this.spell instanceof SpellAsAbility && this.spell.spell) {
        if (this.spell.spell.effect.attack_type === "Save" && this.spell.spell.saving_throw_ability_score) {
          save = this.spell.spell.saving_throw_ability_score;
        }
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

  get range_string(): string {
    let range_string = "--";
    if (this.the_spell) {
      if (this.the_spell.range && this.the_spell.range.length > 0) {
        range_string = this.the_spell.range;
      }
      if (this.the_spell.range_2 && this.the_spell.range_2.length > 0) {
        if (range_string.length > 0) {
          range_string += "/";
        }
        range_string += this.the_spell.range_2;
      }
    }
    return range_string;
  }

  get components_string(): string {
    let components_string = "";
    if (this.the_spell) {
      if (this.the_spell.components.includes("V")) {
        components_string = "V";
      }
      if (this.the_spell.components.includes("S")) {
        if (components_string.length > 0) {
          components_string += ", ";
        }
        components_string += "S";
      }
      if (this.the_spell.components.includes("M")) {
        if (components_string.length > 0) {
          components_string += ", ";
        }
        components_string += "M";
        components_string += ` (${this.the_spell.material_component})`;
      }
    }
    return components_string;
  }

  get duration_string(): string {
    let duration_string = "";
    if (this.the_spell) {
      duration_string = this.the_spell.duration;
    }
    return duration_string;
  }

  get effect_string(): string {
    let effect_string = "";
    if (this.the_spell) {
      effect_string = this.the_spell.effect.type === "None" ? "Utility" : this.the_spell.effect.type;
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
    this.attack.damage_rolls.filter(o => o.size === 1).forEach(rolls => {
      bonuses += rolls.count;
    });
    this.attack.damage_rolls.forEach(rolls => {
      bonuses += rolls.flat;
      if (ability_scores && !["","None","undefined"].includes(rolls.ability_score)) {
        const mod = ability_scores.getModifier(rolls.ability_score);
        if (mod) {
          bonuses += mod;
        }
      }
      if (rolls.size > 1 && rolls.count !== 0) {
        rolls.recalculate_string();
        if (damage_string.length > 0 && rolls.as_string.length > 0 && rolls.as_string[0] !== "-") {
          damage_string += `+${rolls.as_string}`;
        } else {
          damage_string += rolls.as_string;
        }
      }
    });
    if (bonuses > 0) {
      damage_string = `${damage_string}+${bonuses}`;
    } else if (bonuses < 0) {
      damage_string = `${damage_string}${bonuses}`;
    } else if (damage_string === "") {
      damage_string = "0";
    }
    return damage_string;
  }

  get_potence(slot_level: number, char: Character): Potence | null {
    if (this.the_spell) {
      if (!["Control","Utility"].includes(this.effect_string)) {
        let level = -1;
        if (this.the_spell.effect.potence_type === "Slot") {
          level = slot_level;
        } else if (this.the_spell.effect.potence_type === "Character") {
          level = char.character_level;
        } else if (this.the_spell.effect.potence_type === "Class" && this.source_type === "Class") {
          const class_finder = char.classes.filter(o => o.game_class_id === this.source_id);
          if (class_finder.length === 1) {
            level = class_finder[0].level;
          }
        }
        let potence_finder: Potence[] = [];
        potence_finder = this.the_spell.effect.potences.filter(o => o.level === level);
        if (potence_finder.length === 0) {
          potence_finder = this.the_spell.effect.potences.filter(o => o.level < level);
          if (potence_finder.length > 0) {
            const max_level = Math.max(...potence_finder.map(o => { return o.level }));
            potence_finder = this.the_spell.effect.potences.filter(o => o.level === max_level);
          }
        } 
        if (potence_finder.length === 1) {
          const potence = new Potence(potence_finder[0]);
          if (this.use_spellcasting_modifier || (this.the_spell && this.the_spell.effect.add_modifier.toLowerCase() === "true")) {
            potence.rolls.ability_score = this.spellcasting_ability;
          } else {
            potence.rolls.ability_score = "";
          }
          return potence;
        }
      }
    }
    return null;
  }

  self_condition() {
    const cond_ids: string[] = [];
    if (this.spell instanceof Spell && this.spell.effect.type === "Self Condition") {
      this.spell.effect.conditions_applied.forEach(cond_id => {
        cond_ids.push(cond_id);
      });
    } else if (this.spell instanceof SpellAsAbility && this.spell.spell && this.spell.spell.effect.type === "Self Condition") {
      this.spell.spell.effect.conditions_applied.forEach(cond_id => {
        cond_ids.push(cond_id);
      });
    }
    return cond_ids;
  }

  toDBObj = () => {
    return {
      true_id: this.true_id,
      spell_id: this.spell_id,
      name: this._name,
      customizations: this.customizations,
      source_type: this.source_type,
      source_id: this.source_id,
      source_name: this.source_name,
      always_known: this.always_known,
      prepared: this.prepared,
      extra: this.extra
    };
  }

  copySpell(copyMe: Spell | SpellAsAbility) {
    if (copyMe instanceof Spell) {
      this.spell_id = copyMe._id;
    } else if (copyMe.spell_id) {
      this.spell_id = copyMe.spell_id;
      if (copyMe.spell) {
        this.name = copyMe.spell.name;
      }
      if (copyMe.slot_override === "At Will") {
        this.at_will = true;
      }
      if (copyMe.casting_time_override !== "Normal") {
        console.log(copyMe);
      }
      if (copyMe.components_override.length > 0) {
        console.log(copyMe);
      }
      if (copyMe.resource_consumed !== "None") {
        console.log(copyMe);
      }
    }
    this.spell = copyMe;
  }

  connectSpell(spell: Spell | SpellAsAbility) {
    this.spell = spell;
  }

  connectSource(source: CharacterClass | CharacterRace | CharacterFeat | CharacterItem) {
    if (source instanceof CharacterClass) {
      this.source_type = "Class";
      this.source_id = source.game_class_id;
      this.spellcasting_ability = source.spellcasting_ability;
      this.spell_attack = source.spell_attack;
      this.spell_dc = source.spell_dc;
      if (source.game_class) {
        this.source_name = source.game_class.name;
        if (this.spell && this.spell.ritual && source.ritual_casting) {
          this.ritual = true;
        }
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
}