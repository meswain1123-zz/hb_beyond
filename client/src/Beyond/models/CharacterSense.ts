
import { 
  SenseFeature
} from ".";

/**
 * 
 */
export class CharacterSense {
  sense_id: string;
  range: number;
  name: string;
  features: SenseFeature[];

  constructor(obj?: any) {
    this.sense_id = obj ? obj.sense_id : "";
    this.range = obj ? obj.range : 0;
    this.name = obj ? obj.name : "";
    this.features = obj && obj.features ? obj.features : [];
  }

  toDBObj = () => {
    return {
      sense_id: this.sense_id,
      range: this.range,
      name: this.name
    };
  }
}