import { 
  RollPlus 
} from "../models";


export class DataUtilitiesClass {

  capitalize_first(fix_me: string, only: boolean = false) {
    let return_me = "";
    if (fix_me.length > 0) {
      return_me = fix_me[0].toUpperCase();
      return_me += only ? fix_me.substring(1).toLowerCase() : fix_me.substring(1);
    }
    return return_me;
  }
  
  capitalize_firsts(fix_me: string, only: boolean = false) {
    let return_me = "";
    if (fix_me) {
      const fix_us = fix_me.split(" ");
      fix_us.forEach(fm => {
        if (return_me.length > 0) {
          return_me += " ";
        }
        return_me += this.capitalize_first(fm, only);
      });
    }
    return return_me.trim();
  }

  // Takes a string of what should be a number, and fixes it.
  // The reason for this is sometimes we are given O instead of 0 or S instead of 5.
  // It also removes unnecessary + signs.
  // It then returns it as a number
  fix_number_string(fix_me: string) {
    let return_me = "";
    for (let i = 0; i < fix_me.length; ++i) {
      const c = fix_me[i];
      if (c === "S") {
        return_me += "5";
      } else if (["O","o"].includes(c)) {
        return_me += "0";
      } else if (["L","l","I"].includes(c)) {
        return_me += "1";
      } else if (!["+",","," ","(",")","{", "}", "[", "]", "!", "'", '"'].includes(c)) {
        return_me += c;
      }
    }
    if (return_me.includes("/")) {
      const pieces = return_me.split("/");
      if (pieces.length === 2) {
        return +pieces[0] / +pieces[1];
      } else {
        return 0;
      }
    } else {
      return +return_me;
    }
  }

  add_plus_maybe(add_to_me: string | number, blank_on_0: (boolean | null) = null): string {
    if (typeof add_to_me === "string") {
      if (add_to_me.length > 0) {
        if (add_to_me[0] === "0") {
          if (blank_on_0 !== true) {
            return `+${add_to_me}`;
          } else {
            return `${add_to_me}`;
          }
        } else if (add_to_me[0] !== "-") {
          return `+${add_to_me}`;
        }
      }
      return add_to_me;
    } else {
      if (add_to_me === 0) {
        if (blank_on_0 === true) {
          return "";
        } else if (blank_on_0 === false) {
          return "0";
        } else {
          return "+0";
        }
      } else if (add_to_me > 0) {
        return `+${add_to_me}`;
      }
      return `${add_to_me}`;
    }
  }

  add_plus_maybe_2_strings(first: string, second: string | number, reverse: boolean = false): string {
    if (reverse) {
      if (typeof second === "number") {
        if (second > 0) {
          return `+${second}${first}`;
        } else if (second < 0) {
          return `${second}${first}`;
        } else if (first === "") {
          return "+0";
        } else {
          return first;
        }
      } else {
        if (first.length > 0) {
          if (first[0] === "-") {
            return `${second}${first}`;
          } else {
            return `${second}+${first}`;
          }
        } else {
          return `${second}`;
        }
      }
    } else {
      if (first.length > 0) {
        if (first[first.length - 1] === ")") {
          return `${first} ${second}`;
        } else if ((typeof second === "number" && second < 0) || (typeof second === "string" && second.length > 0 && second[0] === "-")) {
          return `${first}${second}`;
        } else {
          return `${first}+${second}`;
        }
      } else {
        return `${second}`;
      }
    }
  }

  ability_score_abbreviation(score: string): string {
    let abbreviation = "";
    switch(score.toLowerCase().trim()) {
      case "str":
        abbreviation = "STR";
      break;
      case "strength":
        abbreviation = "STR";
      break;
      case "dex":
        abbreviation = "DEX";
      break;
      case "dexterity":
        abbreviation = "DEX";
      break;
      case "con":
        abbreviation = "CON";
      break;
      case "constitution":
        abbreviation = "CON";
      break;
      case "int":
        abbreviation = "INT";
      break;
      case "intelligence":
        abbreviation = "INT";
      break;
      case "wis":
        abbreviation = "WIS";
      break;
      case "wisdom":
        abbreviation = "WIS";
      break;
      case "cha":
        abbreviation = "CHA";
      break;
      case "charisma":
        abbreviation = "CHA";
      break;
    }
    return abbreviation;
  }

  ability_score_full(abbreviation: string): string {
    let score = "";
    switch(abbreviation) {
      case "STR":
        score = "Strength";
      break;
      case "Strength":
        score = "Strength";
      break;
      case "DEX":
        score = "Dexterity";
      break;
      case "Dexterity":
        score = "Dexterity";
      break;
      case "CON":
        score = "Constitution";
      break;
      case "Constitution":
        score = "Constitution";
      break;
      case "INT":
        score = "Intelligence";
      break;
      case "Intelligence":
        score = "Intelligence";
      break;
      case "WIS":
        score = "Wisdom";
      break;
      case "Wisdom":
        score = "Wisdom";
      break;
      case "CHA":
        score = "Charisma";
      break;
      case "Charisma":
        score = "Charisma";
      break;
    }
    return score;
  }

  clean_for_parse(clean_me: string): string {
    let cleaned = this.replaceAll(clean_me, ",", "");
    cleaned = this.replaceAll(cleaned, ".", "");
    cleaned = this.replaceAll(cleaned, ";", "");
    cleaned = this.replaceAll(cleaned, ":", "");
    cleaned = this.replaceAll(cleaned, "(", " ");
    cleaned = this.replaceAll(cleaned, ")", " ");
    cleaned = this.replaceAll(cleaned, "{", " ");
    cleaned = this.replaceAll(cleaned, "}", " ");
    cleaned = this.replaceAll(cleaned, "[", " ");
    cleaned = this.replaceAll(cleaned, "]", " ");
    cleaned = this.replaceAll(cleaned, "!", "");
    cleaned = this.replaceAll(cleaned, "'", "");
    cleaned = this.replaceAll(cleaned, '"', "");
    cleaned = this.replaceAll(cleaned, "·", "");

    return cleaned.toLowerCase();
  }

  parse_dice_roll(str: string): RollPlus {
    const dice_roll = new RollPlus();
    const pieces = str.split("d");
    if (pieces.length === 2) {
      dice_roll.count = this.fix_number_string(pieces[0]);
      dice_roll.size = this.fix_number_string(pieces[1]);
    }
    return dice_roll;
  }

  replaceAll(cleanMe: string, replaceMe: string, withMe: string) {
    let dirtyString = cleanMe;
    let newString = "";
    while (dirtyString.indexOf(replaceMe) > -1) {
      newString += dirtyString.substring(0, dirtyString.indexOf(replaceMe)) + withMe;
      dirtyString = dirtyString.substring(dirtyString.indexOf(replaceMe) + replaceMe.length);
    }
    newString += dirtyString;
    return newString;
  }

  find_overlap(arr1: string[], arr2: string[]) {
    for (let i = 0; i < arr1.length; ++i) {
      if (arr2.includes(arr1[i])) {
        return arr1[i];
      }
    }
    return "";
  }

  find_one_in_string(str: string, arr: string[], starts_with: boolean = false) {
    for (let i = 0; i < arr.length; ++i) {
      if (starts_with) {
        if (str.toLowerCase().startsWith(arr[i].toLowerCase())) {
          return arr[i];
        }
      } else {
        if (str.toLowerCase().includes(arr[i].toLowerCase())) {
          return arr[i];
        }
      }
    }
    return "";
  }

  in_list_ignore_case(str: string, arr: string[]) {
    str = str.toLowerCase().trim();
    for (let i = 0; i < arr.length; ++i) {
      if (arr[i].toLowerCase().trim() === str) {
        return arr[i];
      }
    }
    return "";
  }
}
