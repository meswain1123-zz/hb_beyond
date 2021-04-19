
import { 
  AbilityScores,
  ModelBase, 
  HitDice, 
  Feature,
  IStringNumHash,
  Ability,
  AbilityEffect,
  Potence,
  Sense,
  CharacterSense,
  DamageMultiplier,
  CreatureAbility
} from ".";

import { CreatureTemplate } from "./CreatureTemplate";

import DataUtilities from "../utilities/data_utilities";

export class Creature extends ModelBase {
  imported_object: any;
  connected: boolean;
  image_url: string;
  // home
  challenge_rating: number;
  xp: number;
  creature_type: string; // Beast, Dragon, Humanoid, etc.
  subtype: string; // Drow, Bronze, etc.
  hit_dice: HitDice;
  max_hit_points: number;
  initiative_modifier: number;
  armor_class: number;
  size: string;
  alignment: string;
  // attributes
  speed: IStringNumHash;
  senses: CharacterSense[];
  passives: IStringNumHash;
  condition_immunities: string[];
  damage_multipliers: DamageMultiplier[];
  tool_proficiencies: IStringNumHash;
  skill_proficiencies: IStringNumHash;
  saving_throws: IStringNumHash;
  languages: string;
  
  ability_scores: AbilityScores;

  actions: Feature[];
  legendary_actions: Feature[];
  special_abilities: Feature[];

  get proficiency_modifier(): number {
    if (this.challenge_rating < 5) {
      return 2;
    } else if (this.challenge_rating < 9) {
      return 3;
    } else if (this.challenge_rating < 13) {
      return 4;
    } else if (this.challenge_rating < 17) {
      return 5;
    } else {
      return 6;
    }
  }

  constructor(obj?: any) {
    super(obj);
    this.imported_object = obj && obj.imported_object ? obj.imported_object : null;
    const data_util = DataUtilities.getInstance();
    this.data_type = "creature";
    this.creature_type = obj ? (obj.creature_type ? data_util.capitalize_firsts(obj.creature_type) : data_util.capitalize_firsts(obj.type)) : "";
    this.subtype = obj ? data_util.capitalize_firsts(obj.subtype) : "";
    this.challenge_rating = obj ? obj.challenge_rating : 0;
    this.image_url = obj && obj.image_url ? obj.image_url : "";
    this.ability_scores = obj ? new AbilityScores(obj.ability_scores) : new AbilityScores();
    this.actions = [];
    if (obj && obj.actions && obj.actions.length > 0) {
      obj.actions.forEach((o: any) => {
        this.actions.push(new Feature(o));
      });
    }
    this.legendary_actions = [];
    if (obj && obj.legendary_actions && obj.legendary_actions.length > 0) {
      obj.legendary_actions.forEach((o: any) => {
        this.legendary_actions.push(new Feature(o));
      });
    }
    this.special_abilities = [];
    if (obj && obj.special_abilities && obj.special_abilities.length > 0) {
      obj.special_abilities.forEach((o: any) => {
        this.special_abilities.push(new Feature(o));
      });
    }
    this.hit_dice = obj ? new HitDice(obj.hit_dice) : new HitDice();
    this.max_hit_points = obj ? obj.max_hit_points : 0;
    this.speed = obj ? obj.speed : {
      walk: 0,
      swim: 0,
      climb: 0,
      fly: 0,
      burrow: 0,
      hover: 0
    };
    this.passives = obj ? obj.passives : {
      passive_perception: 0,
      passive_insight: 0,
      passive_investigation: 0
    };
    this.saving_throws = obj ? obj.saving_throws : {
      STR: 0, DEX: 0, CON: 0, 
      INT: 0, WIS: 0, CHA: 0
    };
    this.languages = obj ? obj.languages : "";
    this.tool_proficiencies = obj ? obj.tool_proficiencies : {};
    this.skill_proficiencies = obj ? obj.skill_proficiencies : {};
    this.initiative_modifier = obj ? obj.initiative_modifier : 0;
    this.armor_class = obj ? obj.armor_class : 0;
    this.size = obj ? obj.size : "Medium";
    this.alignment = obj ? data_util.capitalize_firsts(obj.alignment) : "Neutral";
    this.xp = obj ? obj.xp : 0;
    this.condition_immunities = obj ? obj.condition_immunities : [];
    this.damage_multipliers = [];
    if (obj && obj.damage_multipliers && obj.damage_multipliers.length > 0) {
      obj.damage_multipliers.forEach((dm: any) => {
        this.damage_multipliers.push(new DamageMultiplier(dm));
      });
    }
    this.senses = [];
    if (obj && obj.senses && obj.senses.length > 0) {
      obj.senses.forEach((sense: any) => {
        this.senses.push(new CharacterSense(sense));
      });
    }
    this.connected = false;
  }

  toDBObj = () => {
    const actions: any[] = [];
    for (let i = 0; i < this.actions.length; i++) {
      actions.push(this.actions[i].toDBObj());
    }
    const legendary_actions: any[] = [];
    for (let i = 0; i < this.legendary_actions.length; i++) {
      legendary_actions.push(this.legendary_actions[i].toDBObj());
    }
    const special_abilities: any[] = [];
    for (let i = 0; i < this.special_abilities.length; i++) {
      special_abilities.push(this.special_abilities[i].toDBObj());
    }
    return {
      _id: this._id,
      imported_object: this.imported_object,
      name: this.name,
      description: this.description,
      creature_type: this.creature_type,
      subtype: this.subtype,
      image_url: this.image_url,
      ability_scores: this.ability_scores.toDBObj(),
      hit_dice: this.hit_dice.toDBObj(),
      actions,
      legendary_actions,
      special_abilities,
      challenge_rating: this.challenge_rating,
      max_hit_points: this.max_hit_points,
      speed: this.speed,
      passives: this.passives,
      saving_throws: this.saving_throws,
      skill_proficiencies: this.skill_proficiencies,
      tool_proficiencies: this.tool_proficiencies,
      initiative_modifier: this.initiative_modifier,
      armor_class: this.armor_class,
      size: this.size,
      alignment: this.alignment,
      xp: this.xp,
      condition_immunities: this.condition_immunities,
      damage_multipliers: this.damage_multipliers,
      languages: this.languages
    };
  }

  get hit_dice_string(): string {
    let response = `${this.hit_dice.count}d${this.hit_dice.size}`;
    return response;
  }

  get skills_string(): string {
    let response = "";
    Object.keys(this.skill_proficiencies).forEach(key => {
      if (response.length > 0) {
        response += ", ";
      }
      response += `${key}: ${this.skill_proficiencies[key]}`;
    });
    return response;
  }

  get tools_string(): string {
    let response = "";
    Object.keys(this.tool_proficiencies).forEach(key => {
      if (response.length > 0) {
        response += ", ";
      }
      response += `${key}: ${this.tool_proficiencies[key]}`;
    });
    return response;
  }

  get senses_string(): string {
    let response = "";
    this.senses.forEach(sense => {
      if (response.length > 0) {
        response += ", ";
      }
      response += `${sense.name} ${sense.range} ft.`;
    });
    if (this.passives.passive_perception > 0) {
      if (response.length > 0) {
        response += ", ";
      }
      response += `Passive Perception: ${this.passives.passive_perception}`;
    }
    if (this.passives.passive_insight > 0) {
      if (response.length > 0) {
        response += ", ";
      }
      response += `Passive Insight: ${this.passives.passive_insight}`;
    }
    if (this.passives.passive_investigation > 0) {
      if (response.length > 0) {
        response += ", ";
      }
      response += `Passive Investigation: ${this.passives.passive_investigation}`;
    }
    return response;
  }

  get saving_throws_string(): string {
    let response = "";
    Object.keys(this.saving_throws).forEach(key => {
      if (response.length > 0) {
        response += ", ";
      }
      response += `${key}: `;
      if (this.saving_throws[key] > 0) {
        response += "+";
      }
      response += `${this.saving_throws[key]}`;
    });
    return response;
  }

  get speed_string(): string {
    let response = "";
    Object.keys(this.speed).forEach(key => {
      if (this.speed[key]) {
        if (response.length > 0) {
          response += ", ";
        }
        if (key === "hover") {
          if (this.speed[key] === 1) {
            response += "hover";
          } else {
            response += "no hover";
          }
        } else {
          response += `${key} ${this.speed[key]} ft.`;
        }
      }
    });
    return response;
  }

  get immunities_string(): string {
    let return_me = "";
    this.damage_multipliers.filter(o => o.multiplier === 0).forEach(dm => {
      dm.damage_types.forEach(dt => {
        if (return_me.length > 0) {
          return_me += ", ";
        }
        return_me += dt;
      });
    });
    return return_me;
  }

  get resistances_string(): string {
    let return_me = "";
    this.damage_multipliers.filter(o => o.multiplier === 0.5).forEach(dm => {
      dm.damage_types.forEach(dt => {
        if (return_me.length > 0) {
          return_me += ", ";
        }
        return_me += dt;
      });
    });
    return return_me;
  }

  get vulnerabilities_string(): string {
    let return_me = "";
    this.damage_multipliers.filter(o => o.multiplier === 2).forEach(dm => {
      dm.damage_types.forEach(dt => {
        if (return_me.length > 0) {
          return_me += ", ";
        }
        return_me += dt;
      });
    });
    return return_me;
  }

  get condition_immunities_string(): string {
    let return_me = "";
    this.condition_immunities.forEach(ci => {
      if (return_me.length > 0) {
        return_me += ", ";
      }
      return_me += ci;
    });
    return return_me;
  }

  clone(): Creature {
    return new Creature(this);
  }

  copy(copyMe: Creature): void {
    this._id = copyMe._id;
    this.name = copyMe.name;
    this.description = copyMe.description;
    this.creature_type = copyMe.creature_type;
    this.connected = copyMe.connected;
    this.ability_scores = new AbilityScores(copyMe.ability_scores);
    this.image_url = copyMe.image_url;
    this.subtype = copyMe.subtype;
    this.hit_dice = new HitDice(copyMe.hit_dice);
    this.challenge_rating = copyMe.challenge_rating;
    this.max_hit_points = copyMe.max_hit_points;
    this.speed = {...copyMe.speed};
    this.passives = {...copyMe.passives};
    this.saving_throws = {...copyMe.saving_throws};
    this.skill_proficiencies = {...copyMe.skill_proficiencies};
    this.tool_proficiencies = {...copyMe.tool_proficiencies};
    this.initiative_modifier = copyMe.initiative_modifier;
    this.armor_class = copyMe.armor_class;
    this.actions = [];
    if (copyMe.actions && copyMe.actions.length > 0) {
      copyMe.actions.forEach((o: any) => {
        this.actions.push(new Feature(o));
      });
    }
    this.legendary_actions = [];
    if (copyMe.legendary_actions && copyMe.legendary_actions.length > 0) {
      copyMe.legendary_actions.forEach((o: any) => {
        this.legendary_actions.push(new Feature(o));
      });
    }
    this.special_abilities = [];
    if (copyMe.special_abilities && copyMe.special_abilities.length > 0) {
      copyMe.special_abilities.forEach((o: any) => {
        this.special_abilities.push(new Feature(o));
      });
    }
    this.size = copyMe.size;
    this.alignment = copyMe.alignment;
    this.xp = copyMe.xp;
    this.condition_immunities = [...copyMe.condition_immunities];
    this.damage_multipliers = [];
    if (copyMe.damage_multipliers && copyMe.damage_multipliers.length > 0) {
      copyMe.damage_multipliers.forEach((dm: any) => {
        this.damage_multipliers.push(new DamageMultiplier(dm));
      });
    }
    this.languages = copyMe.languages;
  }

  copyTemplate(copyMe: CreatureTemplate): void {
    this.name = copyMe.name;
    this.description = copyMe.description;
    this.creature_type = copyMe.creature_type;
    this.connected = copyMe.connected;
    this.ability_scores = new AbilityScores(copyMe.ability_scores);
    this.image_url = copyMe.image_url;
    this.subtype = copyMe.subtype;
    this.hit_dice = new HitDice(copyMe.hit_dice);
    this.challenge_rating = copyMe.challenge_rating;
    this.max_hit_points = copyMe.max_hit_points;
    this.speed = {...copyMe.speed};
    this.passives = {...copyMe.passives};
    this.saving_throws = {...copyMe.saving_throws};
    this.skill_proficiencies = {...copyMe.skill_proficiencies};
    this.tool_proficiencies = {...copyMe.tool_proficiencies};
    this.initiative_modifier = copyMe.initiative_modifier;
    this.armor_class = copyMe.armor_class;
    this.actions = [];
    if (copyMe.actions && copyMe.actions.length > 0) {
      copyMe.actions.forEach((o: any) => {
        this.actions.push(new Feature(o));
      });
    }
    this.legendary_actions = [];
    if (copyMe.legendary_actions && copyMe.legendary_actions.length > 0) {
      copyMe.legendary_actions.forEach((o: any) => {
        this.legendary_actions.push(new Feature(o));
      });
    }
    this.special_abilities = [];
    if (copyMe.special_abilities && copyMe.special_abilities.length > 0) {
      copyMe.special_abilities.forEach((o: any) => {
        this.special_abilities.push(new Feature(o));
      });
    }
    this.size = copyMe.size;
    this.alignment = copyMe.alignment;
    this.xp = copyMe.xp;
    this.condition_immunities = [...copyMe.condition_immunities];
    this.damage_multipliers = [];
    if (copyMe.damage_multipliers && copyMe.damage_multipliers.length > 0) {
      copyMe.damage_multipliers.forEach((dm: any) => {
        this.damage_multipliers.push(new DamageMultiplier(dm));
      });
    }
    this.languages = copyMe.languages;
  }

  copy5e(copyMe: any, senses: Sense[]): void {
    this.imported_object = copyMe;
    const data_util = DataUtilities.getInstance();
    this.name = copyMe.name;
    this.challenge_rating = copyMe.challenge_rating;
    this.alignment = data_util.capitalize_firsts(copyMe.alignment);
    this.languages = copyMe.languages;
    this.xp = copyMe.xp;
    this.condition_immunities = copyMe.condition_immunities;
    this.size = copyMe.size;
    this.armor_class = copyMe.armor_class;
    this.max_hit_points = copyMe.hit_points;
    this.creature_type = data_util.capitalize_firsts(copyMe.creature_type);
    if (copyMe.subtype) {
      this.subtype = data_util.capitalize_firsts(copyMe.subtype);
    }
    const hd_pieces = copyMe.hit_dice.split("d");
    const hit_dice = new HitDice();
    hit_dice.size = hd_pieces[1];
    hit_dice.count = hd_pieces[0];
    this.hit_dice = hit_dice;
    Object.keys(copyMe.speed).forEach((key: string) => {
      const speed = copyMe.speed[key];
      if (typeof speed === "string") {
        const pieces = speed.split(" ft.");
        switch(key) {
          case "walk": 
            this.speed.walk = +pieces[0];
          break;
          case "burrow": 
            this.speed.burrow = +pieces[0];
          break;
          case "climb": 
            this.speed.climb = +pieces[0];
          break;
          case "fly": 
            this.speed.fly = +pieces[0];
          break;
          case "swim": 
            this.speed.swim = +pieces[0];
          break;
        }
      } else if (key === "hover" && speed) {
        this.speed.hover = 1;
      }
    });
    Object.keys(copyMe.senses).forEach((key: string) => {
      const sense = copyMe.senses[key];

      if (["darkvision","blind_sight","blind_sense","true_sight","tremor_sense"].includes(key)) {
        let my_sense_name = "";
        switch(key) {
          case "darkvision":
            my_sense_name = "Darkvision";
          break;
          case "blind_sight":
          case "blind_sense":
            my_sense_name = "Blind Sight";
          break;
          case "true_sight":
            my_sense_name = "True Sight";
          break;
          case "tremor_sense":
            my_sense_name = "Tremor Sense";
          break;
        }
        const sense_finder = senses.filter(o => o.name === my_sense_name);
        if (sense_finder.length === 1) {
          const the_sense = sense_finder[0];
          const char_sense = new CharacterSense();
          char_sense.name = the_sense.name;
          char_sense.sense_id = the_sense._id;
          const pieces = sense.split(" ft.");
          char_sense.range = pieces[0];
          this.senses.push(char_sense);
        }
      } else {
        this.passives[key] = copyMe.senses[key];
      }
    });
    copyMe.condition_immunities.forEach((ci: any) => {
      this.condition_immunities.push(ci.name);
    });
    copyMe.damage_immunities.forEach((dm: any) => {
      const damage_multiplier = new DamageMultiplier();
      damage_multiplier.damage_types.push(dm);
      damage_multiplier.multiplier = 0;
      this.damage_multipliers.push(damage_multiplier);
    });
    copyMe.damage_resistances.forEach((dm: any) => {
      const damage_multiplier = new DamageMultiplier();
      damage_multiplier.damage_types.push(dm);
      damage_multiplier.multiplier = 0.5;
      this.damage_multipliers.push(damage_multiplier);
    });
    copyMe.damage_vulnerabilities.forEach((dm: any) => {
      const damage_multiplier = new DamageMultiplier();
      damage_multiplier.damage_types.push(dm);
      damage_multiplier.multiplier = 2;
      this.damage_multipliers.push(damage_multiplier);
    });
    copyMe.proficiencies.forEach((prof: any) => {
      if (prof.proficiency.name.includes("Saving Throw")) {
        const pieces = prof.proficiency.name.split("Saving Throw: ");
        this.saving_throws[pieces[1]] = prof.value;
      } else if (prof.proficiency.name.includes("Skill")) {
        const pieces = prof.proficiency.name.split("Skill: ");
        this.skill_proficiencies[pieces[1]] = prof.value;
      } else if (prof.proficiency.name.includes("Tool")) {
        const pieces = prof.proficiency.name.split("Tool: ");
        this.tool_proficiencies[pieces[1]] = prof.value;
      }
    });
    this.ability_scores.strength = copyMe.strength;
    this.ability_scores.dexterity = copyMe.dexterity;
    this.ability_scores.constitution = copyMe.constitution;
    this.ability_scores.intelligence = copyMe.intelligence;
    this.ability_scores.wisdom = copyMe.wisdom;
    this.ability_scores.charisma = copyMe.charisma;
    if (copyMe.actions) {
      copyMe.actions.forEach((action: any) => {
        const feature = new Feature();
        feature.name = action.name;
        feature.description = action.desc;
        if (action.name === "Multiattack") {

        } else {
          console.log(action);
          const ability = new CreatureAbility();
          ability.name = action.name;
          ability.description = action.desc;
          if (action.attack_bonus) {
            ability.attack_bonus = action.attack_bonus;
          }
          if (action.dc) {
            ability.saving_throw_ability_score = action.dc.dc_type.name;
            ability.dc = action.dc.dc_value;
          } 
          if (action.damage && action.damage.length > 0) {
            const effect = new AbilityEffect();
            const potence = new Potence();
            let flat = 0;
            let size = 0;
            let count = 0;
            if (action.damage[0].from) {
              if (action.damage[0].from.length > 0) {
                effect.type = action.damage[0].from[0].damage_type.name;
                effect.attack_type = ability.attack_bonus > 0 ? "Melee" : (ability.dc ? "Save" : "?");
                potence.rolls.type = effect.type;
                if (action.damage[0].from[0].damage_dice) {
                  const dice = action.damage[0].from[0].damage_dice;
                  if (dice.includes("d")) {
                    const pieces1 = dice.split("d");
                    count = +pieces1[0];
                    if (pieces1[1].includes("+")) {
                      const pieces2 = pieces1[1].split("+");
                      size = +pieces2[0];
                      flat = +pieces2[1];
                    } else {
                      size = +pieces1[1];
                    }
                  }
                }
              }
            } else {
              effect.type = action.damage[0].damage_type.name;
              effect.attack_type = ability.attack_bonus > 0 ? "Melee" : (ability.dc ? "Save" : "?");
              potence.rolls.type = effect.type;
              if (action.damage[0].damage_dice) {
                const dice = action.damage[0].damage_dice;
                if (dice.includes("d")) {
                  const pieces1 = dice.split("d");
                  count = +pieces1[0];
                  if (pieces1[1].includes("+")) {
                    const pieces2 = pieces1[1].split("+");
                    size = +pieces2[0];
                    flat = +pieces2[1];
                  } else {
                    size = +pieces1[1];
                  }
                }
              }
            }
            potence.rolls.flat = flat;
            potence.rolls.size = size;
            potence.rolls.count = count;
            effect.potences.push(potence);
            ability.effect = effect;
          }
          feature.feature_type = "Creature Ability";
          feature.the_feature = ability;
        }
        this.actions.push(feature);
      });
    }
    if (copyMe.legendary_actions) {
      copyMe.legendary_actions.forEach((action: any) => {
        const feature = new Feature();
        feature.name = action.name;
        feature.description = action.desc;
        if (action.name === "Multiattack") {

        } else {
          const ability = new Ability();
          ability.name = action.name;
          ability.description = action.desc;
          if (action.attack_bonus) {
            ability.attack_bonus = action.attack_bonus;
          }
          if (action.dc) {
            ability.saving_throw_ability_score = action.dc.dc_type.name;
            ability.dc = action.dc.dc_value;
          }
          if (action.damage && action.damage.length > 0) {
            const effect = new AbilityEffect();
            effect.type = action.damage[0].damage_type.name;
            effect.attack_type = ability.attack_bonus > 0 ? "Melee" : (ability.dc ? "Save" : "?");
            const potence = new Potence();
            potence.rolls.type = effect.type;
            let flat = 0;
            let size = 0;
            let count = 0;
            if (action.damage[0].damage_dice) {
              const dice = action.damage[0].damage_dice;
              if (dice.includes("d")) {
                const pieces1 = dice.split("d");
                count = +pieces1[0];
                if (pieces1[1].includes("+")) {
                  const pieces2 = pieces1[1].split("+");
                  size = +pieces2[0];
                  flat = +pieces2[1];
                } else {
                  size = +pieces1[1];
                }
              }
            }
            potence.rolls.flat = flat;
            potence.rolls.size = size;
            potence.rolls.count = count;
            effect.potences.push(potence);
            ability.effect = effect;
          }
          feature.feature_type = "Creature Ability";
          feature.the_feature = ability;
        }
        this.legendary_actions.push(feature);
      });
    }
    if (copyMe.special_abilities) {
      copyMe.special_abilities.forEach((action: any) => {
        const feature = new Feature();
        feature.name = action.name;
        feature.description = action.desc;
        if (action.name === "Multiattack") {

        } else {
          const ability = new Ability();
          ability.name = action.name;
          ability.description = action.desc;
          if (action.attack_bonus) {
            ability.attack_bonus = action.attack_bonus;
          }
          if (action.dc) {
            ability.saving_throw_ability_score = action.dc.dc_type.name;
            ability.dc = action.dc.dc_value;
          }
          if (action.damage && action.damage.length > 0) {
            const effect = new AbilityEffect();
            effect.type = action.damage[0].damage_type.name;
            effect.attack_type = ability.attack_bonus > 0 ? "Melee" : (ability.dc ? "Save" : "?");
            const potence = new Potence();
            potence.rolls.type = effect.type;
            let flat = 0;
            let size = 0;
            let count = 0;
            if (action.damage[0].damage_dice) {
              const dice = action.damage[0].damage_dice;
              if (dice.includes("d")) {
                const pieces1 = dice.split("d");
                count = +pieces1[0];
                if (pieces1[1].includes("+")) {
                  const pieces2 = pieces1[1].split("+");
                  size = +pieces2[0];
                  flat = +pieces2[1];
                } else {
                  size = +pieces1[1];
                }
              }
            }
            potence.rolls.flat = flat;
            potence.rolls.size = size;
            potence.rolls.count = count;
            effect.potences.push(potence);
            ability.effect = effect;
          }
          feature.feature_type = "Creature Ability";
          feature.the_feature = ability;
        }
        this.special_abilities.push(feature);
      });
    }
  }

  recopy5e(senses: Sense[]): void {
    this.copy5e(this.imported_object, senses);
  }
}