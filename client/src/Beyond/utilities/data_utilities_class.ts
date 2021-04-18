

export class DataUtilitiesClass {

  capitalize_first(fix_me: string) {
    let return_me = "";
    if (fix_me.length > 0) {
      return_me = fix_me[0].toUpperCase();
      return_me += fix_me.substring(1);
    }
    return return_me;
  }
  
  capitalize_firsts(fix_me: string) {
    let return_me = "";
    if (fix_me) {
      const fix_us = fix_me.split(" ");
      fix_us.forEach(fm => {
        if (return_me.length > 0) {
          return_me += " ";
        }
        return_me += this.capitalize_first(fm);
      });
    }
    return return_me;
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
        if ((typeof second === "number" && second < 0) || (typeof second === "string" && second.length > 0 && second[0] === "-")) {
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
    switch(score) {
      case "STR":
        abbreviation = "STR";
      break;
      case "Strength":
        abbreviation = "STR";
      break;
      case "DEX":
        abbreviation = "DEX";
      break;
      case "Dexterity":
        abbreviation = "DEX";
      break;
      case "CON":
        abbreviation = "CON";
      break;
      case "Constitution":
        abbreviation = "CON";
      break;
      case "INT":
        abbreviation = "INT";
      break;
      case "Intelligence":
        abbreviation = "INT";
      break;
      case "WIS":
        abbreviation = "WIS";
      break;
      case "Wisdom":
        abbreviation = "WIS";
      break;
      case "CHA":
        abbreviation = "CHA";
      break;
      case "Charisma":
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
}
