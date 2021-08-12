
import { 
  CharacterItem,
  CharacterSpell,
  CharacterSpecialSpell,
  CharacterAbility,
  SlotLevel,
  Spell
} from ".";

export class CharacterAction {
  true_id: string;
  type: string;
  special_resource: boolean;
  action: CharacterItem | CharacterSpell | CharacterSpecialSpell | CharacterAbility | null;
  casting_time: 'A' | 'BA' | 'RA' | 'Special' | 'Attack';
  level: SlotLevel; // If it uses spell slots, this is the lowest level

  constructor(obj?: any) {
    this.true_id = obj && obj.true_id ? obj.true_id : "";
    this.type = obj ? obj.type : "";
    this.special_resource = false;
    this.action = obj ? obj.action : null;
    this.casting_time = obj ? obj.casting_time : 'A';
    this.level = obj ? new SlotLevel(obj.level) : new SlotLevel();
  }

  get name(): string {
    if (this.action) {
      return this.action.name;
    }
    return "";
  }

  get spell(): Spell | null {
    if (this.action) {
      if ((this.action instanceof CharacterSpell || 
        this.action instanceof CharacterAbility) && 
        this.action.spell) {
        return this.action.spell;
      }
    }
    return null;
  }

  toDBObj = () => {
    return {
      true_id: this.true_id,
      type: this.type,
      action: this.action ? this.action.toDBObj() : null,
      casting_time: this.casting_time,
      level: this.level.value
    };
  }
}