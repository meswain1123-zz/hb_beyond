
import { 
  UpgradableNumber,
  IStringNumHash,
  CharacterSense,
  DamageMultiplier,
  AbilityScores,
  Feature 
} from ".";

import { TemplateBase } from "./TemplateBase";
import { SummonStatBlock } from "./SummonStatBlock";


export class SummonStatBlockTemplate extends TemplateBase { 
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
    super(obj);
    this.type = "SummonStatBlock";
    this.creature_type = obj ? obj.creature_type : "";
    this.subtype = obj ? obj.subtype : "";
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
    this.alignment = obj ? obj.alignment : "Neutral";
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
    const senses: any[] = [];
    for (let i = 0; i < this.senses.length; i++) {
      senses.push(this.senses[i].toDBObj());
    }
    return {
      _id: this._id,
      name: this.name,
      description: this.description,
      source_type: this.source_type,
      source_id: this.source_id,
      type: "SummonStatBlock",
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
      senses: this.senses,
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

  clone(): SummonStatBlockTemplate {
    return new SummonStatBlockTemplate(this);
  }

  copy(copyMe: SummonStatBlockTemplate): void {
    this._id = copyMe._id;
    this.name = copyMe.name;
    this.description = copyMe.description;
    this.type = "SummonStatBlock";
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
    this.senses = [];
    if (copyMe.senses && copyMe.senses.length > 0) {
      copyMe.senses.forEach((o: any) => {
        this.senses.push(new CharacterSense(o));
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

  copyObj(copyMe: SummonStatBlock): void {
    this.name = copyMe.name;
    this.description = copyMe.description;
    this.type = "SummonStatBlock";
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
    this.senses = [];
    if (copyMe.senses && copyMe.senses.length > 0) {
      copyMe.senses.forEach((o: any) => {
        this.senses.push(new CharacterSense(o));
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