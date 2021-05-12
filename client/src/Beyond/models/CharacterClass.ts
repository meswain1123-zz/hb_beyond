
import { 
  GameClass,
  Subclass,
  CharacterFeatureBase,
  CharacterSpellBook,
  BonusSpells
} from ".";

export class CharacterClass {
  position: number;
  game_class_id: string;
  subclass_id: string;
  game_class: GameClass | null;
  subclass: Subclass | null;
  class_features: CharacterFeatureBase[];
  subclass_features: CharacterFeatureBase[];
  level: number;
  // Spellcasting
  spellcasting_ability: string;
  spell_dc: number;
  spell_attack: number;
  spell_table: string;
  spell_level_max: number;
  spellcasting_level: number; // Full, Half, Third, etc
  spell_list_id: string;
  spell_ids: string[];
  cantrip_ids: string[];
  knowledge_type: string; // Prepared, Known, Spell Book
  // These can be increased through other features.
  cantrips_max: number;
  base_spell_count: number;
  spell_count_per_level: number;
  extra_prepared_from_ability: string; // This increases the number of spells Prepared/Known
  spells_prepared_max: number; // This is calculated from the two above
  // These can be granted through other features
  ritual_casting: boolean;
  spellcasting_focus: string;
  // These are only from other features
  spell_book: CharacterSpellBook | null;
  bonus_spells: BonusSpells[];

  constructor(obj?: any) {
    this.position = 0;
    if (obj) {
      this.position = obj.position ? obj.position : (obj.id ? obj.id : 0);
    }
    this.game_class_id = obj ? obj.game_class_id : "";
    this.subclass_id = obj ? obj.subclass_id : "";
    this.class_features = [];
    if (obj && obj.class_features && obj.class_features.length > 0) {
      obj.class_features.forEach((o: any) => {
        const fb = new CharacterFeatureBase(o);
        fb.source_id = this.game_class_id;
        this.class_features.push(fb);
      });
    }
    this.subclass_features = [];
    if (obj && obj.subclass_features && obj.subclass_features.length > 0) {
      obj.subclass_features.forEach((o: any) => {
        const fb = new CharacterFeatureBase(o);
        fb.source_id = this.game_class_id;
        this.subclass_features.push(fb);
      });
    }
    this.level = obj ? obj.level : 0;
    this.game_class = obj && obj.game_class ? new GameClass(obj.game_class) : null;
    this.subclass = obj && obj.subclass ? new Subclass(obj.subclass) : null;
    this.spell_book = obj && obj.spell_book ? new CharacterSpellBook(obj.spell_book) : null;
    
    this.spellcasting_ability = "";
    this.spell_dc = 0;
    this.spell_attack = 0;
    this.spell_table = "";
    this.spellcasting_level = 0;
    this.spell_list_id = "";
    this.knowledge_type = "";
    this.cantrips_max = 0;
    this.spell_level_max = 0;
    this.spell_ids = [];
    this.cantrip_ids = [];
    this.base_spell_count = 0;
    this.spell_count_per_level = 0;
    this.extra_prepared_from_ability = "";
    this.spells_prepared_max = 0;
    this.ritual_casting = false;
    this.spellcasting_focus = "";
    this.bonus_spells = [];
  }

  get name(): string {
    if (this.game_class) {
      return this.game_class.name;
    }
    return "";
  }

  toDBObj = () => {
    const class_features: any[] = [];
    this.class_features.forEach(f => {
      class_features.push(f.toDBObj());
    });
    const subclass_features: any[] = [];
    this.subclass_features.forEach(f => {
      subclass_features.push(f.toDBObj());
    });
    return {
      position: this.position,
      game_class_id: this.game_class_id,
      subclass_id: this.subclass_id,
      class_features,
      subclass_features,
      level: this.level,
      spell_book: this.spell_book ? this.spell_book.toDBObj() : null
    };
  }

  copyGameClass = (game_class: GameClass, level: number) => {
    this.game_class_id = game_class._id;
    this.game_class = game_class;
    if (this.level > level) {
      this.class_features = this.class_features.filter(fb => fb.feature_base && fb.feature_base.level <= level);
    } else {
      game_class.features.filter(fb => fb.level > this.level && fb.level <= level).forEach(fb => {
        if (fb.multiclassing === 0 || (fb.multiclassing === 2 && this.position > 0) || (fb.multiclassing === 1 && this.position === 0)) {
          const char_feature_base = new CharacterFeatureBase();
          char_feature_base.copyFeatureBase(fb, this.game_class_id);
          this.class_features.push(char_feature_base);
        }
      });
    }
  }

  /**
   * This is like copyGameClass, 
   * but it's specifically for the situation where the 
   * character is multiclassed, and they just deleted the
   * first class, and this was the second class.
   * @param game_class 
   */
  fixWithGameClass = () => {
    this.class_features = this.class_features.filter(fb => fb.feature_base && fb.feature_base.multiclassing === 0);
    this.subclass_features = this.subclass_features.filter(fb => fb.feature_base && fb.feature_base.multiclassing === 0);
    if (this.game_class) {
      this.game_class.features.filter(fb => fb.level <= this.level && fb.multiclassing === 1).forEach(fb => {
        const char_feature_base = new CharacterFeatureBase();
        char_feature_base.copyFeatureBase(fb, this.game_class_id);
        char_feature_base.source_id = this.game_class_id;
        this.class_features.push(char_feature_base);
      });
    }
    if (this.subclass) {
      this.subclass.features.filter(fb => fb.level <= this.level && fb.multiclassing === 1).forEach(fb => {
        const char_feature_base = new CharacterFeatureBase();
        char_feature_base.copyFeatureBase(fb, this.game_class_id);
        char_feature_base.source_id = this.game_class_id;
        this.subclass_features.push(char_feature_base);
      });
    }
  }

  copySubclass = (subclass: Subclass, level: number) => {
    let do_all = false;
    if (this.subclass_id !== subclass._id) {
      this.subclass_features = [];
      do_all = true;
    }
    this.subclass_id = subclass._id;
    this.subclass = subclass;
    if (do_all) {
      subclass.features.filter(fb => fb.level <= level).forEach(fb => {
        const char_feature_base = new CharacterFeatureBase();
        char_feature_base.copyFeatureBase(fb, this.game_class_id);
        char_feature_base.source_id = this.game_class_id;
        this.subclass_features.push(char_feature_base);
      });
    } else {
      if (this.level > level) {
        this.subclass_features = this.subclass_features.filter(fb => fb.feature_base && fb.feature_base.level <= level);
      } else {
        subclass.features.filter(fb => fb.level > this.level && fb.level <= level).forEach(fb => {
          const char_feature_base = new CharacterFeatureBase();
          char_feature_base.copyFeatureBase(fb, this.game_class_id);
          char_feature_base.source_id = this.game_class_id;
          this.subclass_features.push(char_feature_base);
        });
      }
    }
  }

  connectGameClass = (game_class: GameClass) => {
    this.game_class = game_class;
    this.class_features.forEach(fb => {
      const objFinder = game_class.features.filter(fb2 => fb2.true_id === fb.true_id);
      if (objFinder.length === 1) {
        fb.connectFeatureBase(objFinder[0]);
      }
    });
  }

  connectSubclass = (subclass: Subclass) => {
    this.subclass = subclass;
    this.subclass_features.forEach(fb => {
      const objFinder = subclass.features.filter(fb2 => fb2.true_id === fb.true_id);
      if (objFinder.length === 1) {
        fb.connectFeatureBase(objFinder[0]);
      }
    });
  }
}