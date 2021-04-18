
import { DataUtilitiesClass } from "./data_utilities_class";

var DataUtilities = (function () {
  let instance: DataUtilitiesClass;

  function createInstance() {
    let api = new DataUtilitiesClass();
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


export default DataUtilities;
