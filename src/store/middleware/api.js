import axios from "axios";
import * as actions from "../api";

//destructure the dispatch function from the store
const api =
  ({ dispatch }) =>
  next =>
  async action => {
    if (action.type !== actions.apiCallBegan.type) return next(action);

    const { url, method, data, onStart, onSuccess, onError } = action.payload;

    //dispatch the onStart action
    if (onStart) dispatch({ type: onStart });

    //use next(action) to see the current action in dev tools
    next(action);

    try {
      const response = await axios.request({
        baseURL: "http://localhost:9001/api",
        url,
        method,
        data
      });
      // General
      dispatch(actions.apiCallSuccess(response.data));
      // Specific
      if (onSuccess) dispatch({ type: onSuccess, payload: response.data });
    } catch (error) {
      // General
      dispatch(actions.apiCallFailed(error.message));
      // Specific
      if (onError) dispatch({ type: onError, payload: error.message });
    }
  };

export default api;
