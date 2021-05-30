export const initialState = {
  user: null,
  roomId: null,
};

export const actionTypes = {
  SET_USER: "SET_USER",
  DEL_USER: "DEL_USER",
};

const reducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_USER:
      return {
        ...state,
        user: action?.user,
      };
    case actionTypes.DEL_USER:
      return {
        ...state,
        user: null,
      };

    default:
      return state;
  }
};

export default reducer;
