
import { 
  HitDice,
  IStringNumHash,
  CharacterSense,
  DamageMultiplier,
  AbilityScores,
  Feature 
} from ".";

import { TemplateBase } from "./TemplateBase";
import { Creature } from "./Creature";


export class CreatureTemplate extends TemplateBase { 
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

  constructor(obj?: any) {
    super(obj);
    this.type = "Creature";
    this.creature_type = obj ? (obj.creature_type ? obj.creature_type : obj.type) : "";
    this.subtype = obj ? obj.subtype : "";
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
    this.alignment = obj ? obj.alignment : "Neutral";
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
      name: this.name,
      description: this.description,
      type: "Creature",
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

  clone(): CreatureTemplate {
    return new CreatureTemplate(this);
  }

  copy(copyMe: CreatureTemplate): void {
    this._id = copyMe._id;
    this.name = copyMe.name;
    this.description = copyMe.description;
    this.type = "Creature";
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

  copyObj(copyMe: Creature): void {
    this.name = copyMe.name;
    this.description = copyMe.description;
    this.type = "Creature";
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
}