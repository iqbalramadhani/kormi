import * as actions from "../../redux/components/componentsActions";
import * as auth from "../modules/Auth/_redux/authRedux";
import store from "../../redux/store";

const API_URL = process.env.REACT_APP_API_URL
  ? process.env.REACT_APP_API_URL
  : "https://api-staging.cms-kormi.id";

export default function apiV1(endpoint, config) {
  store.dispatch(actions.startFetch());
  return fetch(API_URL + endpoint, config)
    .then(async (response) => {
      setTimeout(function() {
        store.dispatch(actions.endFetch());
      }, 500);
      if (!response.ok) {
        switch (response.status) {
          case 400:
            const res = await response.json();
            return {error: res}
            break;
          case 401:
            store.dispatch(auth.actions.logout());
            throw new Error("Session Expired");
            break;
          case 403:
            throw new Error("Tidak ada permission");
            break;
          case 404:
            throw new Error("Request/Data tidak ditemukan");
            break;
          case 422:
            return response.json();
            break;
          case 500:
            throw new Error("Terjadi kesalahan pada sistem");
            break;
          case 502:
            throw new Error("Server tidak ditemukan");
            break;
          default:
            throw new Error(response.status);
            break;
        }
      } else {
        const res = response.headers.get("content-type");
        // if (res === Constants.octetStream || res === Constants.excel) {
        //   window.location = endpoint;
        //   return {
        //     status: true,
        //   };
        // }
        return response.json();
      }
    })
    .catch((error) => {
      store.dispatch(actions.endFetch());
      return {
        error,
      };
    });
}
