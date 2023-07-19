import resourse from "../../libs/resourse";

export default {
  list(qs = null) {
      return resourse.get('/master/jabatan', qs);
  },
  read(data = null, qs = null) {
    return resourse.get(`/master/jabatan/detail/${data.id}`, data, qs);
  },
  update(data = null, qs = null) {
    return resourse.put(`/master/jabatan/update/${qs.id}`, data, qs);
  },
  create(data = null, qs = null) {
    return resourse.post('/master/jabatan/create', data, qs);
  },
  delete(id) {
    return resourse.delete(`/master/jabatan/delete/${id}`);
  },
};
