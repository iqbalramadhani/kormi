import store from "../../redux/store";
export default {
  get(key) {
    const state = store.getState();
    return state[key]
  },
  getAuth(key) {
    const state = store.getState();
    const auth = state.auth
    if (auth) {
      return auth[key]
    } else {
      return null
    }
  }
}