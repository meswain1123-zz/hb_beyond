
const initialState = {
  loginOpen: false,
  menuOpen: true,
  height: 0,
  width: 0,
  item_type: "ALL",
  special_feature_type: "Any",
  source_book: "Any"
};
function rootReducer(state = initialState, action) {
  if (action.type === "SET") {
    const newState = {};
    newState[action.dataType] = action.payload;
    return Object.assign({}, state, newState);
  } else if (action.type === "ADD") {
    const newState = {};
    const objects = state[action.dataType];
    objects.push(action.payload);
    newState[action.dataType] = objects;
    return Object.assign({}, state, newState);
  } else if (action.type === "UPDATE") {
    const newState = {};
    const objects = state[action.dataType].filter(m => m._id !== action.payload._id);
    objects.push(action.payload);
    newState[action.dataType] = objects;
    return Object.assign({}, state, newState);
  } else if (action.type === "TOGGLE_LOGIN") {
    return Object.assign({}, state, {
      loginOpen: !state.loginOpen
    });
  } else if (action.type === "TOGGLE_MENU") {
    let width = state.width;
    if (!state.menuOpen) {
      // Opening the menu, so increase the width by 200
      width -= 200;
    } else {
      // Closing the menu, so decrease the width by 200
      width += 200;
    }
    return Object.assign({}, state, {
      menuOpen: !state.menuOpen,
      width
    });
  }
  return state;
}

export default rootReducer;

export const login = (user, history) => {};

export const logout = history => {};
