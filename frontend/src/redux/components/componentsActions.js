import { componentsSlice } from "./componentsSlice";

const {actions} = componentsSlice;

export const startFetch = () => dispatch => {
  dispatch(actions.startBlockUI());
};

export const endFetch = () => dispatch => {
    dispatch(actions.stopBlockUI());
  };