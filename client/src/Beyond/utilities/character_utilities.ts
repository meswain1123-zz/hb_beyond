
import { CharacterUtilitiesClass } from "./character_utilities_class";

var CharacterUtilities = (function () {
  let instance: CharacterUtilitiesClass;

  function createInstance() {
    let api = new CharacterUtilitiesClass();
    return api;
  }

  return {
    getInstance: function () {
      if (!instance) {
        instance = createInstance();
      }
      return instance;
    }
  };
})();

export default CharacterUtilities;
