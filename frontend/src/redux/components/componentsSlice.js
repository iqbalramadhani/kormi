import {createSlice} from "@reduxjs/toolkit";

const initialComponentsState = {
  blockUI: false,
};

export const componentsSlice = createSlice({
  name: "components",
  initialState: initialComponentsState,
  reducers: {
    startBlockUI: (state, action) => {
      state.blockUI = true
    },
    stopBlockUI: (state, action) => {
      state.blockUI = false
    }
  }
});
