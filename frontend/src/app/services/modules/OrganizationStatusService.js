import resourse from "../../libs/resourse";

export default {
  browse(qs = null) {
      return resourse.get('/master/organitation-status', qs);
  },
  read(data = null, qs = null) {
    return resourse.get('/master/organitation-status', data, qs);
  },
  detail( qs = null, id = null) {
    return resourse.get(`/master/organitation-status/detail/${id}`, qs);
  },
  edit(data = null, qs = null, id = null) {
    return resourse.put(`/master/organitation-status/update/${id}`, data, qs);
  },
  add(data = null, qs = null) {
    return resourse.post('/master/organitation-status/create', data, qs);
  },
  delete(data = null, qs = null, id = null) {
    return resourse.delete(`/master/organitation-status/delete/${id}`, data, qs);
  },
};
