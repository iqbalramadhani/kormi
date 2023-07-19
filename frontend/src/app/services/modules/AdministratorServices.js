import resourse from "../../libs/resourse";

export default {
  browse(qs = null) {
      return resourse.get('/administrator/list', qs);
  },
  read(data = null, qs = null) {
    return resourse.get(`/administrator/detail/${data.id}`, data, qs);
  },
  edit(data = null, qs = null) {
    return resourse.put(`/administrator/update/${qs.id}`, data, qs);
  },
  add(data = null, qs = null) {
    return resourse.post('/administrator/create', data, qs);
  },
  delete(id) {
    return resourse.delete(`/administrator/delete/${id}`);
  },
  export() {
    return resourse.get('/administrator/export');
  },
  type() {
    return resourse.get('/administrator/type');
  },
};
