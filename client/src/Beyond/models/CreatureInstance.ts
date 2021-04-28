
import { v4 as uuidv4 } from "uuid";
import { 
  AbilityScores,
  HitDice, 
  CharacterFeature,
  IStringNumHash,
  CharacterSense,
  DamageMultiplier,
  Creature,
  SummonStatBlock,
  Feature,
  MinionAbility,
  UpgradableNumber,
  Character
} from ".";

export class CreatureInstance {
  true_id: string;
  name: string;
  description: string;
  instance_type: string
  image_url: string;
  // home
  challenge_rating: number;
  xp: number;
  creature_type: string; // Beast, Dragon, Humanoid, etc.
  subtype: string; // Drow, Bronze, etc.
  hit_dice: HitDice;
  current_hit_points: number;
  max_hit_points: number;
  override_max_hit_points: number;
  max_hit_points_modifier: number;
  temp_hit_points: number;
  initiative_modifier: number;
  armor_class: number;
  size: string;
  alignment: string;
  // attributes
  current_speed: IStringNumHash;
  speed: IStringNumHash;
  current_senses: CharacterSense[];
  senses: CharacterSense[];
  passives: IStringNumHash;
  conditions: string[];
  condition_immunities: string[];
  damage_multipliers: DamageMultiplier[];
  tool_proficiencies: IStringNumHash;
  skill_proficiencies: IStringNumHash;
  saving_throws: IStringNumHash;
  languages: string;
  
  current_ability_scores: AbilityScores;
  ability_scores: AbilityScores;

  actions: CharacterFeature[];
  legendary_actions: CharacterFeature[];
  special_abilities: CharacterFeature[];

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
    this.true_id = obj ? obj.true_id : uuidv4().toString();
    this.instance_type = obj ? obj.instance_type : "Misc";
    this.name = obj ? obj.name : "";
    this.description = obj ? obj.description : "";
    this.creature_type = obj ? (obj.creature_type ? obj.creature_type : obj.type) : "";
    this.subtype = obj ? obj.subtype : "";
    this.challenge_rating = obj ? obj.challenge_rating : 0;
    this.image_url = obj && obj.image_url ? obj.image_url : "";
    this.current_ability_scores = obj ? new AbilityScores(obj.current_ability_scores) : new AbilityScores();
    this.ability_scores = obj ? new AbilityScores(obj.ability_scores) : new AbilityScores();
    this.actions = [];
    if (obj && obj.actions && obj.actions.length > 0) {
      obj.actions.forEach((o: any) => {
        this.actions.push(new CharacterFeature(o));
      });
    }
    this.legendary_actions = [];
    if (obj && obj.legendary_actions && obj.legendary_actions.length > 0) {
      obj.legendary_actions.forEach((o: any) => {
        this.legendary_actions.push(new CharacterFeature(o));
      });
    }
    this.special_abilities = [];
    if (obj && obj.special_abilities && obj.special_abilities.length > 0) {
      obj.special_abilities.forEach((o: any) => {
        this.special_abilities.push(new CharacterFeature(o));
      });
    }
    this.hit_dice = obj ? new HitDice(obj.hit_dice) : new HitDice();
    this.current_hit_points = obj ? obj.current_hit_points : 0;
    this.max_hit_points = obj ? obj.max_hit_points : 0;
    this.override_max_hit_points = obj && obj.override_max_hit_points ? obj.override_max_hit_points : -1;
    this.max_hit_points_modifier = obj && obj.max_hit_points_modifier ? obj.max_hit_points_modifier : 0;
    this.temp_hit_points = obj && obj.temp_hit_points ? obj.temp_hit_points : 0;
    this.current_speed = obj ? obj.current_speed : {
      walk: 0,
      swim: 0,
      climb: 0,
      fly: 0,
      burrow: 0,
      hover: 0
    };
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
    this.alignment = obj ? obj.alignment : "Neutral";
    this.xp = obj ? obj.xp : 0;
    this.conditions = obj ? obj.conditions : [];
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
    this.current_senses = [];
    if (obj && obj.current_senses && obj.current_senses.length > 0) {
      obj.current_senses.forEach((sense: any) => {
        this.current_senses.push(new CharacterSense(sense));
      });
    }
  }

  toDBObj = () => {
    const actions: any[] = [];
    for (let i = 0; i < this.actions.length; i++) {
      actions.push(this.actions[i].toDBObj(true));
    }
    const legendary_actions: any[] = [];
    for (let i = 0; i < this.legendary_actions.length; i++) {
      legendary_actions.push(this.legendary_actions[i].toDBObj(true));
    }
    const special_abilities: any[] = [];
    for (let i = 0; i < this.special_abilities.length; i++) {
      special_abilities.push(this.special_abilities[i].toDBObj(true));
    }
    return {
      true_id: this.true_id,
      instance_type: this.instance_type,
      name: this.name,
      description: this.description,
      creature_type: this.creature_type,
      subtype: this.subtype,
      image_url: this.image_url,
      current_ability_scores: this.current_ability_scores.toDBObj(),
      ability_scores: this.ability_scores.toDBObj(),
      hit_dice: this.hit_dice.toDBObj(),
      actions,
      legendary_actions,
      special_abilities,
      challenge_rating: this.challenge_rating,
      current_hit_points: this.current_hit_points, 
      max_hit_points: this.max_hit_points,
      override_max_hit_points: this.override_max_hit_points,
      max_hit_points_modifier: this.max_hit_points_modifier,
      temp_hit_points: this.temp_hit_points,
      current_speed: this.current_speed,
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
      conditions: this.conditions,
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
    this.current_senses.forEach(sense => {
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

  get_saving_throw(ability: string) {
    let modifier: number | null | undefined = this.saving_throws[ability];
    if (!modifier) {
      modifier = this.current_ability_scores.getModifier(ability);
    }
    if (!modifier) {
      return 0
    } else {
      return modifier;
    }
  }

  get speed_string(): string {
    let response = "";
    Object.keys(this.current_speed).forEach(key => {
      if (this.current_speed[key]) {
        if (response.length > 0) {
          response += ", ";
        }
        if (key === "hover") {
          if (this.current_speed[key] === 1) {
            response += "hover";
          } else {
            response += "no hover";
          }
        } else {
          response += `${key} ${this.current_speed[key]} ft.`;
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

  get conditions_string(): string {
    let return_me = "";
    this.conditions.forEach(ci => {
      if (return_me.length > 0) {
        return_me += ", ";
      }
      return_me += ci;
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

  clone(): CreatureInstance {
    return new CreatureInstance(this);
  }

  copy(copyMe: CreatureInstance): void {
    this.true_id = copyMe.true_id;
    this.instance_type = copyMe.instance_type;
    this.name = copyMe.name;
    this.description = copyMe.description;
    this.creature_type = copyMe.creature_type;
    this.current_ability_scores = new AbilityScores(copyMe.current_ability_scores);
    this.ability_scores = new AbilityScores(copyMe.ability_scores);
    this.image_url = copyMe.image_url;
    this.subtype = copyMe.subtype;
    this.hit_dice = new HitDice(copyMe.hit_dice);
    this.challenge_rating = copyMe.challenge_rating;
    this.current_hit_points = copyMe.current_hit_points;
    this.max_hit_points = copyMe.max_hit_points;
    this.override_max_hit_points = copyMe.override_max_hit_points;
    this.max_hit_points_modifier = copyMe.max_hit_points_modifier;
    this.temp_hit_points = copyMe.temp_hit_points;
    this.current_speed = {...copyMe.current_speed};
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
        this.actions.push(new CharacterFeature(o));
      });
    }
    this.legendary_actions = [];
    if (copyMe.legendary_actions && copyMe.legendary_actions.length > 0) {
      copyMe.legendary_actions.forEach((o: any) => {
        this.legendary_actions.push(new CharacterFeature(o));
      });
    }
    this.special_abilities = [];
    if (copyMe.special_abilities && copyMe.special_abilities.length > 0) {
      copyMe.special_abilities.forEach((o: any) => {
        this.special_abilities.push(new CharacterFeature(o));
      });
    }
    this.size = copyMe.size;
    this.alignment = copyMe.alignment;
    this.xp = copyMe.xp;
    this.conditions = [...copyMe.conditions];
    this.condition_immunities = [...copyMe.condition_immunities];
    this.damage_multipliers = [];
    if (copyMe.damage_multipliers && copyMe.damage_multipliers.length > 0) {
      copyMe.damage_multipliers.forEach((dm: any) => {
        this.damage_multipliers.push(new DamageMultiplier(dm));
      });
    }
    this.languages = copyMe.languages;
    this.senses = [];
    if (copyMe.senses && copyMe.senses.length > 0) {
      copyMe.senses.forEach((sense: any) => {
        this.senses.push(new CharacterSense(sense));
      });
    }
    this.current_senses = [];
    if (copyMe.senses && copyMe.senses.length > 0) {
      copyMe.senses.forEach((sense: any) => {
        this.current_senses.push(new CharacterSense(sense));
      });
    }
  }

  copyCreature(copyMe: Creature): void {
    this.name = copyMe.name;
    this.description = copyMe.description;
    this.creature_type = copyMe.creature_type;
    this.current_ability_scores = new AbilityScores(copyMe.ability_scores);
    this.ability_scores = new AbilityScores(copyMe.ability_scores);
    this.image_url = copyMe.image_url;
    this.subtype = copyMe.subtype;
    this.hit_dice = new HitDice(copyMe.hit_dice);
    this.challenge_rating = copyMe.challenge_rating;
    this.current_hit_points = copyMe.max_hit_points;
    this.max_hit_points = copyMe.max_hit_points;
    this.current_speed = {...copyMe.speed};
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
        const char_feat = new CharacterFeature();
        char_feat.copyFeature(o);
        this.actions.push(char_feat);
      });
    }
    this.legendary_actions = [];
    if (copyMe.legendary_actions && copyMe.legendary_actions.length > 0) {
      copyMe.legendary_actions.forEach((o: any) => {
        const char_feat = new CharacterFeature();
        char_feat.copyFeature(o);
        this.legendary_actions.push(char_feat);
      });
    }
    this.special_abilities = [];
    if (copyMe.special_abilities && copyMe.special_abilities.length > 0) {
      copyMe.special_abilities.forEach((o: any) => {
        const char_feat = new CharacterFeature();
        char_feat.copyFeature(o);
        this.special_abilities.push(char_feat);
      });
    }
    this.size = copyMe.size;
    this.alignment = copyMe.alignment;
    this.xp = copyMe.xp;
    this.conditions = [];
    this.condition_immunities = [...copyMe.condition_immunities];
    this.damage_multipliers = [];
    if (copyMe.damage_multipliers && copyMe.damage_multipliers.length > 0) {
      copyMe.damage_multipliers.forEach((dm: any) => {
        this.damage_multipliers.push(new DamageMultiplier(dm));
      });
    }
    this.languages = copyMe.languages;
    this.senses = [];
    if (copyMe.senses && copyMe.senses.length > 0) {
      copyMe.senses.forEach((sense: any) => {
        this.senses.push(new CharacterSense(sense));
      });
    }
    this.current_senses = [];
    if (copyMe.senses && copyMe.senses.length > 0) {
      copyMe.senses.forEach((sense: any) => {
        this.current_senses.push(new CharacterSense(sense));
      });
    }
  }

  copySummonStatBlock(copyMe: SummonStatBlock, char: Character, class_id: string, base_slot_level: number, slot_level: number): void {
    this.name = copyMe.name;
    this.description = copyMe.description;
    this.creature_type = copyMe.creature_type;
    this.current_ability_scores = new AbilityScores(copyMe.ability_scores);
    this.ability_scores = new AbilityScores(copyMe.ability_scores);
    this.image_url = copyMe.image_url;
    this.subtype = copyMe.subtype;
    this.hit_dice = new HitDice();
    this.hit_dice.size = copyMe.hit_dice_size.value(char, class_id, base_slot_level, slot_level);
    this.hit_dice.count = copyMe.hit_dice_count.value(char, class_id, base_slot_level, slot_level);
    this.challenge_rating = copyMe.challenge_rating.value(char, class_id, base_slot_level, slot_level);
    this.current_hit_points = copyMe.max_hit_points.value(char, class_id, base_slot_level, slot_level);
    this.max_hit_points = copyMe.max_hit_points.value(char, class_id, base_slot_level, slot_level);
    this.current_speed = {...copyMe.speed};
    this.speed = {...copyMe.speed};
    this.passives = {...copyMe.passives};
    this.saving_throws = {...copyMe.saving_throws};
    this.skill_proficiencies = {...copyMe.skill_proficiencies};
    this.tool_proficiencies = {...copyMe.tool_proficiencies};
    this.initiative_modifier = copyMe.initiative_modifier.value(char, class_id, base_slot_level, slot_level);
    this.armor_class = copyMe.armor_class.value(char, class_id, base_slot_level, slot_level);
    this.actions = [];
    if (copyMe.actions && copyMe.actions.length > 0) {
      copyMe.actions.forEach((o: Feature) => {
        const char_feat = new CharacterFeature();
        char_feat.copyFeature(o);
        if (o.feature_type === "Minion Ability") {
          const minion_ability = o.the_feature as MinionAbility;
          char_feat.feature.feature_type = "Creature Ability";
          char_feat.feature.the_feature = minion_ability.convert_to_creature_ability(char, class_id, base_slot_level, slot_level);
        } else if (o.feature_type === "Minion Extra Attacks") {
          char_feat.feature.feature_type = "Extra Attacks";
          char_feat.feature.the_feature = (o.the_feature as UpgradableNumber).value(char, class_id, base_slot_level, slot_level);
        }
        this.actions.push(char_feat);
      });
    }
    this.legendary_actions = [];
    if (copyMe.legendary_actions && copyMe.legendary_actions.length > 0) {
      copyMe.legendary_actions.forEach((o: any) => {
        const char_feat = new CharacterFeature();
        char_feat.copyFeature(o);
        this.legendary_actions.push(char_feat);
      });
    }
    this.special_abilities = [];
    if (copyMe.special_abilities && copyMe.special_abilities.length > 0) {
      copyMe.special_abilities.forEach((o: any) => {
        const char_feat = new CharacterFeature();
        char_feat.copyFeature(o);
        this.special_abilities.push(char_feat);
      });
    }
    this.size = copyMe.size;
    this.alignment = copyMe.alignment;
    this.conditions = [];
    this.condition_immunities = [...copyMe.condition_immunities];
    this.damage_multipliers = [];
    if (copyMe.damage_multipliers && copyMe.damage_multipliers.length > 0) {
      copyMe.damage_multipliers.forEach((dm: any) => {
        this.damage_multipliers.push(new DamageMultiplier(dm));
      });
    }
    this.languages = copyMe.languages;
    this.senses = [];
    if (copyMe.senses && copyMe.senses.length > 0) {
      copyMe.senses.forEach((sense: any) => {
        this.senses.push(new CharacterSense(sense));
      });
    }
    this.current_senses = [];
    if (copyMe.senses && copyMe.senses.length > 0) {
      copyMe.senses.forEach((sense: any) => {
        this.current_senses.push(new CharacterSense(sense));
      });
    }
  }
}