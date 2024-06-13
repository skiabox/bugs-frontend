import { createSlice } from "@reduxjs/toolkit";
import { createSelector } from "reselect";

import { apiCallBegan } from "./api";
import moment from "moment";

//function that creates action types and action creators automatically for us
const slice = createSlice({
  name: "bugs",
  initialState: {
    list: [],
    loading: false,
    lastFetch: null
  },
  reducers: {
    //actions => action handlers
    bugsRequested: (bugs, action) => {
      bugs.loading = true;
    },
    bugsRequestFailed: (bugs, action) => {
      bugs.loading = false;
    },
    bugsReceived: (bugs, action) => {
      bugs.list = action.payload;
      bugs.loading = false;
      bugs.lastFetch = Date.now();
    },

    // command - event
    // addBug - bugAdded
    bugAdded: (bugs, action) => {
      bugs.list.push(action.payload);
    },

    // resolveBug (command) - bugResolved (event)
    bugResolved: (bugs, action) => {
      const index = bugs.list.findIndex(bug => bug.id === action.payload.id);
      bugs.list[index].resolved = true;
    },
    bugRemoved: (bugs, action) => {
      return bugs.list.filter(bug => bug.id !== action.payload.id);
    },
    bugAssignedToUser: (bugs, action) => {
      const { bugId, userId } = action.payload;
      const index = bugs.list.findIndex(bug => bug.id === bugId);
      bugs.list[index].userId = userId;
    }
  }
});

console.log(slice);

const {
  bugAdded,
  bugResolved,
  bugRemoved,
  bugAssignedToUser,
  bugsReceived,
  bugsRequested,
  bugsRequestFailed
} = slice.actions;
export default slice.reducer;

// Action Creators
const url = "/bugs";

//we refactor the action creator to return a function
//so that we can access the state
export const loadBugs = () => (dispatch, getState) => {
  const { lastFetch } = getState().entities.bugs;

  //10 minutes caching functionality
  const diffInMinutes = moment().diff(moment(lastFetch), "minutes");
  if (diffInMinutes < 10) return;

  console.log("bugsRequested.type:", bugsRequested.type);

  dispatch(
    apiCallBegan({
      url,
      onStart: bugsRequested.type, // Action to dispatch when the request starts
      onSuccess: bugsReceived.type, // Action to dispatch on successful response
      onError: bugsRequestFailed.type // Action to dispatch on error
    })
  );
};

//server methods
export const addBug = bug =>
  apiCallBegan({
    url,
    method: "post",
    data: bug,
    onSuccess: bugAdded.type // Action to dispatch on successful addition
  });

export const resolveBug = id =>
  apiCallBegan({
    // /bugs
    // PATCH /bugs/1
    url: url + "/" + id,
    method: "patch",
    data: { resolved: true },
    onSuccess: bugResolved.type
  });

export const assignBugToUser = (bugId, userId) =>
  apiCallBegan({
    url: url + "/" + bugId,
    method: "patch",
    data: { userId },
    onSuccess: bugAssignedToUser.type
  });

// Selector (is a function that gets the state and returns a computed state)
// export const getUnresolvedBugs = state =>
//   state.entities.bugs.filter(bug => !bug.resolved);

// Memoization
// bugs => get unresolved bugs from the cache
export const getUnresolvedBugs = createSelector(
  state => state.entities.bugs,
  bugs => bugs.list.filter(bug => !bug.resolved)
);

export const getBugsByUser = userId =>
  //createSelector returns a function
  createSelector(
    state => state.entities.bugs,
    bugs => bugs.list.filter(bug => bug.userId === userId)
  );
