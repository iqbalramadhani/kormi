import queryString from "query-string";
import apiV1 from "./apiV1";
import storage from "./storage";
import states from "./states";

export default {
  get(endpoint, qs = null) {
    let params = "";
    if (qs) {
      params = queryString.stringify(qs);
    }
    let config = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${states.getAuth("authToken")}`,
      },
    };
    return apiV1(`${endpoint}?${params}`, config)
  },

  post(endpoint, data = null, qs = null) {
    let params = "";
    if (qs) {
      params = queryString.stringify(qs);
    }

    var formData = new FormData();

    if (Array.isArray(data) && data.length > 0) {
      data.map(item => {
        for ( var key in item ) {
          formData.append(key, item[key]);
        }
      })
    } else {
      for ( var key in data ) {
        formData.append(key, data[key]);
      }
      for (let key in data){
        if (data[key] instanceof Array){
          data[key].map(item => {
            formData.append(key, item);
          })
        }
      }
    }
    let config = {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${states.getAuth("authToken")}`,
      },
      body: formData,
    };
    return apiV1(`${endpoint}?${params}`, config)
  },

  put(endpoint, data = null, qs = null) {
    let params = "";
    if (qs) {
      params = queryString.stringify(qs);
    }

    var formData = new FormData();
    for ( var key in data ) {
      formData.append(key, data[key]);
    }
    let config = {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${states.getAuth("authToken")}`,
      },
      body: formData,
    };
    return apiV1(`${endpoint}?${params}`, config)
  },

  delete(endpoint, data = null, qs = null) {
    let params = "";
    if (qs) {
      params = queryString.stringify(qs);
    }

    var formData = new FormData();
    for ( var key in data ) {
      formData.append(key, data[key]);
    }
    let config = {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${states.getAuth("authToken")}`,
      },
      body: formData,
    };
    return apiV1(`${endpoint}?${params}`, config)
  },
};
