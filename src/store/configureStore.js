// import { createStore } from "redux";
import { configureStore } from "@reduxjs/toolkit";
import reducer from "./reducer";
import logger from "./middleware/logger";
import toast from "./middleware/toast";
import api from "./middleware/api";

export default function () {
  return configureStore({
    reducer,
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware()
        .concat(logger({ destination: "console" }))
        .concat(toast)
        .concat(api)
  });
  // return store;
}
