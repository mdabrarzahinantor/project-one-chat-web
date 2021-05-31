export const initialState = {
  user: null,
  roomId: null,
  imageG: null,
};

export const actionTypes = {
  SET_USER: "SET_USER",
  DEL_USER: "DEL_USER",
  SET_G: "SET_IMAGE",
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
    case actionTypes.SET_IMAGE:
      return {
        ...state,
        imageG: action?.image,
      };

    default:
      return state;
  }
};

export default reducer;
