

export class AbilityScores {
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;

  constructor(obj?: any) {
    if (obj !== null && obj !== undefined) {
      if (typeof obj === "number") {
        this.strength = obj;
        this.dexterity = obj;
        this.constitution = obj;
        this.intelligence = obj;
        this.wisdom = obj;
        this.charisma = obj;
      } else {
        this.strength = obj.strength;
        this.dexterity = obj.dexterity;
        this.constitution = obj.constitution;
        this.intelligence = obj.intelligence;
        this.wisdom = obj.wisdom;
        this.charisma = obj.charisma;
      }
    } else {
      this.strength = 8;
      this.dexterity = 8;
      this.constitution = 8;
      this.intelligence = 8;
      this.wisdom = 8;
      this.charisma = 8;
    }
  }

  get STR(): number {
    return Math.floor((this.strength - 10) / 2);
  }

  get DEX(): number {
    return Math.floor((this.dexterity - 10) / 2);
  }

  get CON(): number {
    return Math.floor((this.constitution - 10) / 2);
  }

  get INT(): number {
    return Math.floor((this.intelligence - 10) / 2);
  }

  get WIS(): number {
    return Math.floor((this.wisdom - 10) / 2);
  }

  get CHA(): number {
    return Math.floor((this.charisma - 10) / 2);
  }

  getAbilityScore(ability: string) {
    let score: number | null = null;
    switch(ability) {
      case "STR":
        score = this.strength;
      break;
      case "Strength":
        score = this.strength;
      break;
      case "DEX":
        score = this.dexterity;
      break;
      case "Dexterity":
        score = this.dexterity;
      break;
      case "CON":
        score = this.constitution;
      break;
      case "Constitution":
        score = this.constitution;
      break;
      case "INT":
        score = this.intelligence;
      break;
      case "Intelligence":
        score = this.intelligence;
      break;
      case "WIS":
        score = this.wisdom;
      break;
      case "Wisdom":
        score = this.wisdom;
      break;
      case "CHA":
        score = this.charisma;
      break;
      case "Charisma":
        score = this.charisma;
      break;
    }
    return score;
  }

  setAbilityScore(ability: string, value: number) {
    switch(ability) {
      case "STR":
        this.strength = value;
      break;
      case "Strength":
        this.strength = value;
      break;
      case "DEX":
        this.dexterity = value;
      break;
      case "Dexterity":
        this.dexterity = value;
      break;
      case "CON":
        this.constitution = value;
      break;
      case "Constitution":
        this.constitution = value;
      break;
      case "INT":
        this.intelligence = value;
      break;
      case "Intelligence":
        this.intelligence = value;
      break;
      case "WIS":
        this.wisdom = value;
      break;
      case "Wisdom":
        this.wisdom = value;
      break;
      case "CHA":
        this.charisma = value;
      break;
      case "Charisma":
        this.charisma = value;
      break;
    }
  }

  getModifier(ability: string) {
    let score: number | null = null;
    switch(ability) {
      case "STR":
        score = this.STR;
      break;
      case "Strength":
        score = this.STR;
      break;
      case "DEX":
        score = this.DEX;
      break;
      case "Dexterity":
        score = this.DEX;
      break;
      case "CON":
        score = this.CON;
      break;
      case "Constitution":
        score = this.CON;
      break;
      case "INT":
        score = this.INT;
      break;
      case "Intelligence":
        score = this.INT;
      break;
      case "WIS":
        score = this.WIS;
      break;
      case "Wisdom":
        score = this.WIS;
      break;
      case "CHA":
        score = this.CHA;
      break;
      case "Charisma":
        score = this.CHA;
      break;
    }
    return score;
  }

  toDBObj = () => {
    return {
      strength: this.strength,
      dexterity: this.dexterity,
      constitution: this.constitution,
      intelligence: this.intelligence,
      wisdom: this.wisdom,
      charisma: this.charisma
    };
  }
}