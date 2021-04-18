
import { APIClass } from "./smart_api_class";

var API = (function() {
  let instance: APIClass;

  function createInstance() {
    let api = new APIClass();
    return api;
  }

  return {
    getInstance: function() {
      if (!instance) {
        instance = createInstance();
      }
      return instance;
    }
  };
})();


export default API;
