import { createSlice } from "@reduxjs/toolkit";

// our store is an array of users
let lastId = 0;

//function that creates action types and action creators automatically for us
const slice = createSlice({
  name: "users",
  initialState: [],
  reducers: {
    //actions => action handlers
    userAdded: (users, action) => {
      users.push({
        id: ++lastId,
        name: action.payload.name
      });
    }
  }
});

export const { userAdded } = slice.actions;
export default slice.reducer;
