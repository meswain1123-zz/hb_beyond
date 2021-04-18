
import { v4 as uuidv4 } from "uuid";
import { 
  AbilityScores,
  Character,
  Feature,
  IStringNumHash,
  CharacterSense,
  DamageMultiplier,
  UpgradableNumber,
  SummonStatBlockTemplate
} from ".";

import DataUtilities from "../utilities/data_utilities";

export class SummonStatBlock {
  true_id: string;
  name: string;
  description: string;
  connected: boolean;
  image_url: string;
  // home
  challenge_rating: UpgradableNumber;
  creature_type: string; // Beast, Dragon, Humanoid, etc.
  subtype: string; // Drow, Bronze, etc.
  hit_dice_size: UpgradableNumber;
  hit_dice_count: UpgradableNumber;
  max_hit_points: UpgradableNumber;
  initiative_modifier: UpgradableNumber;
  armor_class: UpgradableNumber;
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


  constructor(obj?: any) {
    this.true_id = obj && obj.true_id ? obj.true_id : uuidv4().toString();
    this.name = obj ? obj.name : "";
    this.description = obj ? obj.description : "";
    const data_util = DataUtilities.getInstance();
    this.creature_type = obj ? (obj.creature_type ? data_util.capitalize_firsts(obj.creature_type) : data_util.capitalize_firsts(obj.type)) : "";
    this.subtype = obj ? data_util.capitalize_firsts(obj.subtype) : "";
    this.challenge_rating = obj ? new UpgradableNumber(obj.challenge_rating) : new UpgradableNumber();
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
    this.hit_dice_size = obj ? new UpgradableNumber(obj.hit_dice_size) : new UpgradableNumber();
    this.hit_dice_count = obj ? new UpgradableNumber(obj.hit_dice_count) : new UpgradableNumber();
    this.max_hit_points = obj ? new UpgradableNumber(obj.max_hit_points) : new UpgradableNumber();
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
    this.initiative_modifier = obj ? new UpgradableNumber(obj.initiative_modifier) : new UpgradableNumber();
    this.armor_class = obj ? new UpgradableNumber(obj.armor_class) : new UpgradableNumber();
    this.size = obj ? obj.size : "Medium";
    this.alignment = obj ? data_util.capitalize_firsts(obj.alignment) : "Neutral";
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
      true_id: this.true_id,
      name: this.name,
      description: this.description,
      creature_type: this.creature_type,
      subtype: this.subtype,
      image_url: this.image_url,
      ability_scores: this.ability_scores.toDBObj(),
      hit_dice_size: this.hit_dice_size.toDBObj(),
      hit_dice_count: this.hit_dice_count.toDBObj(),
      actions,
      legendary_actions,
      special_abilities,
      challenge_rating: this.challenge_rating.toDBObj(),
      max_hit_points: this.max_hit_points.toDBObj(),
      speed: this.speed,
      passives: this.passives,
      saving_throws: this.saving_throws,
      skill_proficiencies: this.skill_proficiencies,
      tool_proficiencies: this.tool_proficiencies,
      initiative_modifier: this.initiative_modifier,
      armor_class: this.armor_class,
      size: this.size,
      alignment: this.alignment,
      condition_immunities: this.condition_immunities,
      damage_multipliers: this.damage_multipliers,
      languages: this.languages
    };
  }

  hit_dice_string(char: Character): string {
    let response = `${this.hit_dice_count.value(char)}d${this.hit_dice_size.value(char)}`;
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

  clone(): SummonStatBlock {
    return new SummonStatBlock(this);
  }

  copy(copyMe: SummonStatBlock): void {
    this.true_id = copyMe.true_id;
    this.name = copyMe.name;
    this.description = copyMe.description;
    this.creature_type = copyMe.creature_type;
    this.connected = copyMe.connected;
    this.ability_scores = new AbilityScores(copyMe.ability_scores);
    this.image_url = copyMe.image_url;
    this.subtype = copyMe.subtype;
    this.hit_dice_size = new UpgradableNumber(copyMe.hit_dice_size);
    this.hit_dice_count = new UpgradableNumber(copyMe.hit_dice_count);
    this.challenge_rating = new UpgradableNumber(copyMe.challenge_rating);
    this.max_hit_points = new UpgradableNumber(copyMe.max_hit_points);
    this.speed = {...copyMe.speed};
    this.passives = {...copyMe.passives};
    this.saving_throws = {...copyMe.saving_throws};
    this.skill_proficiencies = {...copyMe.skill_proficiencies};
    this.tool_proficiencies = {...copyMe.tool_proficiencies};
    this.initiative_modifier = new UpgradableNumber(copyMe.initiative_modifier);
    this.armor_class = new UpgradableNumber(copyMe.armor_class);
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
    this.condition_immunities = [...copyMe.condition_immunities];
    this.damage_multipliers = [];
    this.damage_multipliers = [];
    if (copyMe.damage_multipliers && copyMe.damage_multipliers.length > 0) {
      copyMe.damage_multipliers.forEach((dm: any) => {
        this.damage_multipliers.push(new DamageMultiplier(dm));
      });
    }
    this.languages = copyMe.languages;
  }

  copyTemplate(copyMe: SummonStatBlockTemplate): void {
    this.name = copyMe.name;
    this.description = copyMe.description;
    this.creature_type = copyMe.creature_type;
    this.connected = copyMe.connected;
    this.ability_scores = new AbilityScores(copyMe.ability_scores);
    this.image_url = copyMe.image_url;
    this.subtype = copyMe.subtype;
    this.hit_dice_size = new UpgradableNumber(copyMe.hit_dice_size);
    this.hit_dice_count = new UpgradableNumber(copyMe.hit_dice_count);
    this.challenge_rating = new UpgradableNumber(copyMe.challenge_rating);
    this.max_hit_points = new UpgradableNumber(copyMe.max_hit_points);
    this.speed = {...copyMe.speed};
    this.passives = {...copyMe.passives};
    this.saving_throws = {...copyMe.saving_throws};
    this.skill_proficiencies = {...copyMe.skill_proficiencies};
    this.tool_proficiencies = {...copyMe.tool_proficiencies};
    this.initiative_modifier = new UpgradableNumber(copyMe.initiative_modifier);
    this.armor_class = new UpgradableNumber(copyMe.armor_class);
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
    this.condition_immunities = [...copyMe.condition_immunities];
    this.damage_multipliers = [];
    this.damage_multipliers = [];
    if (copyMe.damage_multipliers && copyMe.damage_multipliers.length > 0) {
      copyMe.damage_multipliers.forEach((dm: any) => {
        this.damage_multipliers.push(new DamageMultiplier(dm));
      });
    }
    this.languages = copyMe.languages;
  }
}