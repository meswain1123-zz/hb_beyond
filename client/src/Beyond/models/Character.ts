
import { 
  CharacterClass, 
  CharacterBackground,
  AbilityScores,
  CharacterASIBaseFeature,
  CharacterRace,
  CharacterResource, 
  CharacterSpecialFeature, 
  CharacterItem, 
  Money, 
  ModelBase, 
  CharacterFeat, 
  HitDice, 
  Advantage, 
  CharacterAbility, 
  BaseItem, 
  MagicItem,
  CharacterSpell, 
  Spell, 
  CharacterSlot,
  CharacterSense,
  IStringNumHash, IStringHash,
  DamageMultiplierSimple,
  Bonus,
  CreatureInstance,
  Reroll,
  AbilityEffect,
  CharacterSpecialSpell
} from ".";


export class Character extends ModelBase {
  static data_type: string = "character";
  static always_store: boolean = false;
  connected: boolean;
  image_url: string;
  race: CharacterRace;
  classes: CharacterClass[];
  background: CharacterBackground;
  base_ability_scores: AbilityScores;
  current_ability_scores: AbilityScores;
  bonus_ability_score_modifiers: AbilityScores;
  override_ability_scores: AbilityScores;
  max_ability_scores: AbilityScores;
  extra_skill_bonuses: IStringNumHash;
  skill_overrides: IStringNumHash;
  proficiency_overrides: IStringNumHash;
  organizations: string;
  allies: string;
  enemies: string;
  backstory: string;
  other_notes: string;
  characteristics: IStringHash;
  appearance: string;
  items: CharacterItem[];
  equipped_items: CharacterItem[];
  attuned_items: CharacterItem[];
  max_attuned_items: number;
  money: Money[];
  other_possessions: string;
  // These are feats granted by the DM, not gained through ASI or race choices
  extra_feats: CharacterFeat[];
  // These are damage multipliers added by spell effects, etc
  extra_damage_multipliers: DamageMultiplierSimple[];
  favorite_conditions: string[];
  conditions: string[];
  condition_immunities: string[];
  inspiration: number;
  override_max_hit_points: number;
  max_hit_points_modifier: number;
  current_hit_points: number;
  temp_hit_points: number;
  death_save_fails: number;
  death_save_successes: number;
  spells: CharacterSpell[];
  ritual_only: CharacterSpell[];
  special_spells: CharacterSpecialSpell[]; 
  concentrating_on: CharacterSpell | CharacterAbility | null;
  abilities: CharacterAbility[];
  spell_as_abilities: CharacterAbility[];
  advantage: boolean | null;
  minions: CreatureInstance[];
  transform: CreatureInstance | null;
  // Partially Calculated
  hit_dice: HitDice[];
  resources: CharacterResource[];
  slots: CharacterSlot[];
  // Calculated attributes
  ability_score_features: CharacterASIBaseFeature[] = [];
  languages_known: string[];
  saving_throw_proficiencies: string[];
  armor_proficiencies: string[];
  weapon_proficiencies: string[];
  special_weapon_proficiencies: string[];
  tool_proficiencies: IStringNumHash;
  skill_proficiencies: IStringNumHash;
  special_features: CharacterSpecialFeature[];
  character_level: number;
  max_hit_points: number;
  feats: CharacterFeat[];
  feat_ids: string[];
  eldritch_invocation_ids: string[];
  fighting_style_ids: string[];
  special_feature_ids: string[];
  pact_boon_id: string;
  speed: IStringNumHash;
  attack_bonuses: Bonus[];
  damage_bonuses: Bonus[];
  saving_throw_bonuses: Bonus[];
  check_bonuses: Bonus[];
  initiative_modifier: number;
  armor_class: number;
  saving_throws: IStringNumHash;
  weight_carried: number;
  armor_worn: boolean;
  shield_carried: boolean;
  senses: CharacterSense[];
  advantages: Advantage[];
  damage_multipliers: DamageMultiplierSimple[];
  actions: any;
  extra_attacks: number;
  unarmed_strike_scores: string[];
  unarmed_strike_bonus_action: boolean;
  unarmed_strike_damage_types: string[];
  unarmed_strike_size: number;
  unarmed_strike_count: number;
  rerolls: Reroll[];
  jack_of_all_trades: boolean = false;

  get proficiency_modifier(): number {
    if (this.character_level < 5) {
      return 2;
    } else if (this.character_level < 9) {
      return 3;
    } else if (this.character_level < 13) {
      return 4;
    } else if (this.character_level < 17) {
      return 5;
    } else {
      return 6;
    }
  }

  constructor(obj?: any) {
    super(obj);
    this.image_url = obj && obj.image_url ? obj.image_url : "";
    this.inspiration = obj && obj.inspiration ? obj.inspiration : 0;
    this.race = obj ? new CharacterRace(obj.race) : new CharacterRace();
    this.classes = [];
    if (obj && obj.classes && obj.classes.length > 0) {
      for (let i = 0; i < obj.classes.length; i++) {
        this.classes.push(new CharacterClass(obj.classes[i]));
      }
    }
    this.background = obj ? new CharacterBackground(obj.background) : new CharacterBackground();
    this.base_ability_scores = obj ? new AbilityScores(obj.base_ability_scores) : new AbilityScores();
    this.bonus_ability_score_modifiers = obj && obj.bonus_ability_score_modifiers ? new AbilityScores(obj.bonus_ability_score_modifiers) : new AbilityScores(0);
    this.override_ability_scores = obj && obj.override_ability_scores ? new AbilityScores(obj.override_ability_scores) : new AbilityScores(-1);
    this.extra_skill_bonuses = obj && obj.extra_skill_bonuses ? obj.extra_skill_bonuses : {};
    this.skill_overrides = obj && obj.skill_overrides ? obj.skill_overrides : {};
    this.proficiency_overrides = obj && obj.proficiency_overrides ? obj.proficiency_overrides : {};
    this.items = [];
    if (obj && obj.items && obj.items.length > 0) {
      for (let i = 0; i < obj.items.length; i++) {
        const char_item = new CharacterItem(obj.items[i])
        this.items.push(char_item);
      }
    }
    this.equipped_items = [];
    if (obj && obj.equipped_items && obj.equipped_items.length > 0) {
      for (let i = 0; i < obj.equipped_items.length; i++) {
        // All equipped items are also in items, and should have the same ids
        // All that gets saved to the db is the id
        const obj_finder = this.items.filter(o => o.true_id === obj.equipped_items[i]);
        if (obj_finder.length === 1) {
          this.equipped_items.push(obj_finder[0]);
        }
      }
    }
    this.attuned_items = [];
    if (obj && obj.attuned_items && obj.attuned_items.length > 0) {
      for (let i = 0; i < obj.attuned_items.length; i++) {
        // All equipped items are also in items, and should have the same ids
        // All that gets saved to the db is the id
        const obj_finder = this.items.filter(o => o.true_id === obj.attuned_items[i]);
        if (obj_finder.length === 1) {
          this.attuned_items.push(obj_finder[0]);
        }
      }
    }
    this.max_attuned_items = obj && obj.max_attuned_items ? obj.max_attuned_items : 3;
    this.money = [];
    if (obj && obj.money && obj.money.length > 0) {
      for (let i = 0; i < obj.money.length; i++) {
        this.money.push(new Money(obj.money[i]));
      }
    }
    this.other_possessions = obj ? obj.other_possessions : "";
    this.override_max_hit_points = obj ? obj.override_max_hit_points : -1;
    this.max_hit_points_modifier = obj && obj.max_hit_points_modifier ? obj.max_hit_points_modifier : 0;
    this.current_hit_points = obj && obj.current_hit_points ? obj.current_hit_points : 0;
    this.temp_hit_points = obj && obj.temp_hit_points ? obj.temp_hit_points : 0;
    this.death_save_fails = obj && obj.death_save_fails ? obj.death_save_fails : 0;
    this.death_save_successes = obj && obj.death_save_successes ? obj.death_save_successes : 0;
    this.extra_feats = [];
    if (obj && obj.extra_feats) {
      for (let i = 0; i < obj.extra_feats.length; i++) {
        const feat = new CharacterFeat(obj.extra_feats[i]);
        feat.id = this.extra_feats.length;
        this.extra_feats.push(feat);
      }
    }
    this.extra_damage_multipliers = [];
    if (obj && obj.extra_damage_multipliers) {
      for (let i = 0; i < obj.extra_damage_multipliers.length; i++) {
        const dm = new DamageMultiplierSimple(obj.extra_damage_multipliers[i]);
        this.extra_damage_multipliers.push(dm);
      }
    }
    this.favorite_conditions = obj && obj.favorite_conditions ? obj.favorite_conditions : [];
    this.conditions = obj && obj.conditions ? obj.conditions : [];
    this.condition_immunities = obj && obj.condition_immunities ? obj.condition_immunities : [];
    this.spells = [];
    if (obj && obj.spells && obj.spells.length > 0) {
      for (let i = 0; i < obj.spells.length; i++) {
        const char_spell = new CharacterSpell(obj.spells[i]);
        this.spells.push(char_spell);
      }
    }
    this.special_spells = [];
    if (obj && obj.special_spells && obj.special_spells.length > 0) {
      for (let i = 0; i < obj.special_spells.length; i++) {
        const char_spell = new CharacterSpecialSpell(obj.special_spells[i]);
        this.special_spells.push(char_spell);
      }
    }
    this.abilities = [];
    if (obj && obj.abilities && obj.abilities.length > 0) {
      for (let i = 0; i < obj.abilities.length; i++) {
        const char_ability = new CharacterAbility(obj.abilities[i]);
        this.abilities.push(char_ability);
      }
    }
    this.spell_as_abilities = [];
    if (obj && obj.spell_as_abilities && obj.spell_as_abilities.length > 0) {
      for (let i = 0; i < obj.spell_as_abilities.length; i++) {
        const char_ability = new CharacterAbility(obj.spell_as_abilities[i]);
        this.spell_as_abilities.push(char_ability);
      }
    }
    this.ritual_only = [];
    this.concentrating_on = null;
    if (obj && obj.concentrating_on) {
      if (obj.concentrating_on.ability_type) {
        this.concentrating_on = new CharacterAbility(obj.concentrating_on);
        const source_id = this.concentrating_on.source_id;
        if (this.concentrating_on.source_type === "Class") {
          const class_finder = this.classes.filter(o => o.game_class_id === source_id);
          if (class_finder.length === 1) {
            this.concentrating_on.connectSource(class_finder[0]);
          }
        }
      } else if (obj.concentrating_on.spell_id) {
        this.concentrating_on = new CharacterSpell(obj.concentrating_on);
        const source_id = this.concentrating_on.source_id;
        if (this.concentrating_on.source_type === "Class") {
          const class_finder = this.classes.filter(o => o.game_class_id === source_id);
          if (class_finder.length === 1) {
            this.concentrating_on.connectSource(class_finder[0]);
          }
        }
      }
    }
    this.organizations = obj && obj.organizations ? obj.organizations : "";
    this.allies = obj && obj.allies ? obj.allies : "";
    this.enemies = obj && obj.enemies ? obj.enemies : "";
    this.backstory = obj && obj.backstory ? obj.backstory : "";
    this.other_notes = obj && obj.other_notes ? obj.other_notes : "";
    this.characteristics = obj && obj.characteristics ? obj.characteristics : {};
    this.appearance = obj && obj.appearance ? obj.appearance : "";
    this.advantage = obj && obj.advantage ? obj.advantage : null;
    this.connected = false;
    this.minions = [];
    if (obj && obj.minions && obj.minions.length > 0) {
      obj.minions.forEach((ci: any) => {
        this.minions.push(new CreatureInstance(ci));
      });
    }
    this.transform = obj && obj.transform ? new CreatureInstance(obj.transform) : null;
    // Partially Calculated
    this.resources = [];
    if (obj && obj.resources && obj.resources.length > 0) {
      for (let i = 0; i < obj.resources.length; i++) {
        const char_resource = new CharacterResource(obj.resources[i]);
        this.resources.push(char_resource);
      }
    }
    this.slots = [];
    if (obj && obj.slots && obj.slots.length > 0) {
      for (let i = 0; i < obj.slots.length; i++) {
        const char_slot = new CharacterSlot(obj.slots[i]);
        this.slots.push(char_slot);
      }
    }
    this.hit_dice = [];
    if (obj && obj.hit_dice && obj.hit_dice.length > 0) {
      for (let i = 0; i < obj.hit_dice.length; i++) {
        const char_hit_dice = new HitDice(obj.hit_dice[i]);
        this.hit_dice.push(char_hit_dice);
      }
    }
    // Calculated
    this.current_ability_scores = new AbilityScores();
    this.languages_known = [];
    this.saving_throw_proficiencies = [];
    this.armor_proficiencies = [];
    this.weapon_proficiencies = [];
    this.special_weapon_proficiencies = [];
    this.tool_proficiencies = {};
    this.skill_proficiencies = {};
    this.special_features = [];
    this.character_level = 1;
    this.max_hit_points = 0;
    this.feats = [];
    this.feat_ids = [];
    this.eldritch_invocation_ids = [];
    this.fighting_style_ids = [];
    this.special_feature_ids = [];
    this.pact_boon_id = "";
    this.speed = {
      walk: 0,
      swim: 0,
      climb: 0,
      fly: 0,
      burrow: 0
    };
    this.attack_bonuses = [];
    this.damage_bonuses = [];
    this.saving_throw_bonuses = [];
    this.check_bonuses = [];
    this.initiative_modifier = 0;
    this.armor_class = 0;
    this.saving_throws = {
      STR: 0, DEX: 0, CON: 0, 
      INT: 0, WIS: 0, CHA: 0
    };
    this.max_ability_scores = new AbilityScores();
    this.weight_carried = 0;
    this.armor_worn = false;
    this.shield_carried = false;
    this.senses = [];
    this.advantages = [];
    this.damage_multipliers = [];
    this.actions = {};
    this.extra_attacks = 0;
    this.unarmed_strike_scores = ["STR"];
    this.unarmed_strike_bonus_action = false;
    this.unarmed_strike_damage_types = ["Bludgeoning"];
    this.unarmed_strike_size = 4;
    this.unarmed_strike_count = 1;
    this.rerolls = [];
  }

  toDBObj = () => {
    const classes: any[] = [];
    for (let i = 0; i < this.classes.length; i++) {
      classes.push(this.classes[i].toDBObj());
    }
    const items: any[] = [];
    for (let i = 0; i < this.items.length; i++) {
      items.push(this.items[i].toDBObj());
    }
    const equipped_items: any[] = [];
    for (let i = 0; i < this.equipped_items.length; i++) {
      equipped_items.push(this.equipped_items[i].true_id);
    }
    const attuned_items: any[] = [];
    for (let i = 0; i < this.attuned_items.length; i++) {
      attuned_items.push(this.attuned_items[i].true_id);
    }
    const spells: any[] = [];
    for (let i = 0; i < this.spells.length; i++) {
      spells.push(this.spells[i].toDBObj());
    }
    const special_spells: any[] = [];
    for (let i = 0; i < this.special_spells.length; i++) {
      special_spells.push(this.special_spells[i].toDBObj());
    }
    const abilities: any[] = [];
    for (let i = 0; i < this.abilities.length; i++) {
      abilities.push(this.abilities[i].toDBObj());
    }
    const spell_as_abilities: any[] = [];
    for (let i = 0; i < this.spell_as_abilities.length; i++) {
      spell_as_abilities.push(this.spell_as_abilities[i].toDBObj());
    }
    const money: any[] = [];
    for (let i = 0; i < this.money.length; i++) {
      money.push(this.money[i].toDBObj());
    }
    const extra_feats: any[] = [];
    for (let i = 0; i < this.extra_feats.length; i++) {
      extra_feats.push(this.extra_feats[i].toDBObj());
    }
    const extra_damage_multipliers: any[] = [];
    for (let i = 0; i < this.extra_damage_multipliers.length; i++) {
      extra_damage_multipliers.push(this.extra_damage_multipliers[i].toDBObj());
    }
    const resources: any[] = [];
    for (let i = 0; i < this.resources.length; i++) {
      resources.push(this.resources[i].toDBObj());
    }
    const slots: any[] = [];
    for (let i = 0; i < this.slots.length; i++) {
      slots.push(this.slots[i].toDBObj());
    }
    const hit_dice: any[] = [];
    for (let i = 0; i < this.hit_dice.length; i++) {
      hit_dice.push(this.hit_dice[i].toDBObj());
    }
    const minions: any[] = [];
    for (let i = 0; i < this.minions.length; i++) {
      minions.push(this.minions[i].toDBObj());
    }
    return {
      _id: this._id,
      name: this.name,
      description: this.description,
      source_type: this.source_type,
      source_id: this.source_id,
      image_url: this.image_url,
      race: this.race.toDBObj(),
      classes,
      background: this.background.toDBObj(),
      base_ability_scores: this.base_ability_scores.toDBObj(),
      bonus_ability_score_modifiers: this.bonus_ability_score_modifiers.toDBObj(),
      override_ability_scores: this.override_ability_scores.toDBObj(),
      extra_skill_bonuses: this.extra_skill_bonuses,
      skill_overrides: this.skill_overrides,
      proficiency_overrides: this.proficiency_overrides,
      resources,
      slots,
      hit_dice,
      items,
      equipped_items,
      attuned_items,
      max_attuned_items: this.max_attuned_items,
      spells,
      special_spells,
      abilities,
      spell_as_abilities,
      money,
      other_possessions: this.other_possessions,
      organizations: this.organizations,
      allies: this.allies,
      enemies: this.enemies,
      backstory: this.backstory,
      other_notes: this.other_notes,
      characteristics: this.characteristics,
      appearance: this.appearance,
      override_max_hit_points: this.override_max_hit_points,
      max_hit_points_modifier: this.max_hit_points_modifier,
      current_hit_points: this.current_hit_points,
      temp_hit_points: this.temp_hit_points,
      death_save_fails: this.death_save_fails,
      death_save_successes: this.death_save_successes,
      extra_feats,
      extra_damage_multipliers,
      favorite_conditions: this.favorite_conditions,
      conditions: this.conditions,
      condition_immunities: this.condition_immunities,
      advantage: this.advantage,
      inspiration: this.inspiration,
      concentrating_on: this.concentrating_on ? this.concentrating_on.toDBObj() : null,
      minions,
      transform: this.transform ? this.transform.toDBObj() : null
    };
  }

  hit_dice_string(): string {
    let response = "";
    for (let i = 0; i < this.hit_dice.length; i++) {
      const hd = this.hit_dice[i];
      if (response !== "") {
        response += ", ";
      }
      response += `${hd.count}d${hd.size}`;
    }
    return response;
  }

  clone(): Character {
    return new Character(this);
  }

  copy(copyMe: Character): void {
    this._id = copyMe._id;
    this.connected = copyMe.connected;
    this.race = copyMe.race;
    this.classes = copyMe.classes;
    this.background = copyMe.background;
    this.base_ability_scores = copyMe.base_ability_scores;
    this.bonus_ability_score_modifiers = copyMe.bonus_ability_score_modifiers;
    this.override_ability_scores = copyMe.override_ability_scores;
    this.extra_skill_bonuses = copyMe.extra_skill_bonuses;
    this.skill_overrides = copyMe.skill_overrides;
    this.proficiency_overrides = copyMe.proficiency_overrides;
    this.resources = copyMe.resources;
    this.slots = copyMe.slots;
    this.items = copyMe.items;
    this.equipped_items = copyMe.equipped_items;
    this.spells = copyMe.spells;
    this.special_spells = copyMe.special_spells;
    this.abilities = copyMe.abilities;
    this.spell_as_abilities = copyMe.spell_as_abilities;
    this.money = copyMe.money;
    this.other_possessions = copyMe.other_possessions;
    this.extra_feats = copyMe.extra_feats;
    this.extra_damage_multipliers = copyMe.extra_damage_multipliers;
    this.favorite_conditions = copyMe.favorite_conditions;
    this.conditions = copyMe.conditions;
    this.condition_immunities = copyMe.condition_immunities;
    this.advantage = copyMe.advantage;
    this.inspiration = copyMe.inspiration;
    this.override_max_hit_points = copyMe.override_max_hit_points;
    this.max_hit_points_modifier = copyMe.max_hit_points_modifier;
    this.current_hit_points = copyMe.current_hit_points;
    this.temp_hit_points = copyMe.temp_hit_points;
    this.death_save_fails = copyMe.death_save_fails;
    this.death_save_successes = copyMe.death_save_successes;
    this.minions = copyMe.minions;
    this.transform = copyMe.transform;
  }
  
  add_item(item: BaseItem | MagicItem) {
    const char_item = new CharacterItem();
    if (item instanceof BaseItem) {
      char_item.copyBaseItem(item);
    } else {
      char_item.copyMagicItem(item);
    }
    this.items.push(char_item);
  }
  
  remove_item(item: CharacterItem) {
    if (item.attuned) {
      this.unattune_item(item);
    }
    if (item.equipped) {
      this.unequip_item(item);
    }
    this.items = this.items.filter(o => o.true_id !== item.true_id);
  }

  equip_item(item: CharacterItem): void {
    if (item.base_item) {
      if (item.base_item.item_type === "Armor") {
        if (item.base_item.armor_type_name === "Shield") {
          if (!this.shield_carried) {
            item.equipped = true;
            this.equipped_items.push(item);
            this.shield_carried = true;
          }
        } else if (!this.armor_worn) {
          item.equipped = true;
          this.equipped_items.push(item);
          this.armor_worn = true;
        }
      } else {
        item.equipped = true;
        this.equipped_items.push(item);
      }
    }
  }

  unequip_item(item: CharacterItem): void {
    if (item.base_item) {
      if (item.base_item.item_type === "Armor") {
        if (item.base_item.armor_type_name === "Shield") {
          item.equipped = false;
          this.equipped_items = this.equipped_items.filter(o => o.true_id !== item.true_id);
          this.shield_carried = false;
        } else {
          item.equipped = false;
          this.equipped_items = this.equipped_items.filter(o => o.true_id !== item.true_id);
          this.armor_worn = false;
        }
      } else {
        item.equipped = false;
        this.equipped_items = this.equipped_items.filter(o => o.true_id !== item.true_id);
      }
    }
  }

  attune_item(item: CharacterItem): void {
    if (this.attuned_items.length < this.max_attuned_items) {
      item.attuned = true;
      this.attuned_items.push(item);
    }
  }

  unattune_item(item: CharacterItem): void {
    item.attuned = false;
    this.attuned_items = this.attuned_items.filter(o => o.true_id !== item.true_id);
  }
  
  add_spell(spell: Spell, 
    source: CharacterClass | CharacterFeat | CharacterItem) {
    const char_spell = new CharacterSpell();
    char_spell.copySpell(spell);
    char_spell.connectSource(source);
    this.spells.push(char_spell);
    if (source instanceof CharacterClass) {
      if (spell.level === 0) {
        source.cantrip_ids.push(spell._id);
      } else {
        source.spell_ids.push(spell._id);
      }
    }
  }
  
  remove_spell(spell_id: string, source_type: string, source_id: string) {
    if (source_type === "Class") {
      const class_finder = this.classes.filter(o => o.game_class_id === source_id);
      if (class_finder.length === 1) {
        const gc = class_finder[0];
        gc.spell_ids = gc.spell_ids.filter(id => id !== spell_id);
        gc.cantrip_ids = gc.cantrip_ids.filter(id => id !== spell_id);
      }
    }
    this.spells = this.spells.filter(o => o.source_type !== source_type || o.source_id !== source_id || o.spell_id !== spell_id);
  }
  
  add_spell_to_book(spell: Spell, 
    source: CharacterClass, // | CharacterFeat | CharacterItem,
    extra: boolean) {
    if (source.spell_book) {
      const char_spell = new CharacterSpell();
      char_spell.copySpell(spell);
      char_spell.connectSource(source);
      char_spell.prepared = false;
      char_spell.extra = extra;
      if (!extra) {
        source.spell_book.unused_free_spells--;
      }
      source.spell_book.spells.push(char_spell);
    }
  }
  
  remove_spell_from_book(spell: CharacterSpell, 
    source: CharacterClass) {
    if (source.spell_book) {
      if (!spell.extra) {
        source.spell_book.unused_free_spells++;
      }
      source.spell_book.spells = source.spell_book.spells.filter(o => o.true_id !== spell.true_id);
    }
  }
  
  toggle_book_spell_prepared(spell: CharacterSpell) {
    const class_finder = this.classes.filter(o => o.game_class_id === spell.source_id);
    if (class_finder.length === 1) {
      const obj_finder = this.spells.filter(o => o.true_id === spell.true_id);
      if (obj_finder.length === 1) {
        const char_spell = obj_finder[0];
        char_spell.prepared = !char_spell.prepared;
      }
    }
  }

  create_resource(effect: AbilityEffect, class_id: string, base_slot_level: number, slot_level: number) {
    const amount = effect.create_resource_amount.value(this, class_id, base_slot_level, slot_level);
    if (effect.create_resource_type === "Slot") {
      const level = effect.create_resource_level;
      const slots_finder = this.slots.filter(o => o.level === level && o.slot_name === "Slots");
      if (slots_finder.length === 1) {
        const slots = slots_finder[0];
        slots.created += amount;
      }
    } else {
      const resource_finder = this.resources.filter(o => o.type_id === effect.create_resource_type);
      if (resource_finder.length === 1) {
        const resource = resource_finder[0];
        resource.created += amount;
      }
    }
  }
}