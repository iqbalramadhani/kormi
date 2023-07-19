import resourse from "../../libs/resourse";

export default {
  list(qs = null) {
      return resourse.get('/pengurus', qs);
  },
  read(data = null, qs = null) {
    return resourse.get(`/pengurus/detail/${data.id}`, data, qs);
  },
  update(data = null, qs = null) {
    return resourse.put(`/pengurus/update/${qs.id}`, data, qs);
  },
  create(data = null, qs = null) {
    return resourse.post('/pengurus/create', data, qs);
  },
  delete(id) {
    return resourse.delete(`/pengurus/delete/${id}`);
  },
  export() {
    return resourse.get('/pengurus/export');
  },
};
