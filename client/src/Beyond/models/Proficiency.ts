
export class Proficiency {
  name: string;
  description: string;
  proficiency_type: string;
  choice_count: number;
  double: boolean;
  the_proficiencies: string[];

  constructor(obj?: any) {
    this.name = obj ? `${obj.name}` : "";
    this.description = obj ? `${obj.description}` : "";
    this.proficiency_type = obj ? `${obj.proficiency_type}` : "";
    this.choice_count = obj && obj.choice_count ? obj.choice_count : 0;
    this.double = obj ? obj.double : false;
    this.the_proficiencies = obj ? [...obj.the_proficiencies] : [];
  }

  toDBObj = () => {
    return {
      name: this.name,
      description: this.description,
      proficiency_type: this.proficiency_type,
      choice_count: this.choice_count,
      double: this.double,
      the_proficiencies: this.the_proficiencies
    };
  }
}