import { createSlice } from "@reduxjs/toolkit";

// our store is an array of projects
// each project is an object with an id (number) and a name (string)
let lastId = 0;

//function that creates action types and action creators automatically for us
const slice = createSlice({
  name: "projects",
  initialState: [],
  reducers: {
    //actions => action handlers
    projectAdded: (projects, action) => {
      projects.push({
        id: ++lastId,
        name: action.payload.name
      });
    },
    projectRemoved: (projects, action) => {
      return projects.filter(project => project.id !== action.payload.id);
    }
  }
});

console.log(slice);

export const { projectAdded, projectRemoved } = slice.actions;
export default slice.reducer;
