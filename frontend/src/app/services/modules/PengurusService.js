import resourse from '../../libs/resourse';

export default {
  list(qs = null) {
    return resourse.get('/pengurus-kormi', qs);
  },
  read(data = null, qs = null) {
    return resourse.get(`/pengurus-kormi/detail/${data.id}`, data, qs);
  },
  update(data = null, qs = null) {
    return resourse.put(`/pengurus-kormi/update/${qs.id}`, data, qs);
  },
  create(data = null, qs = null) {
    return resourse.post('/pengurus-kormi/create', data, qs);
  },
  delete(id) {
    return resourse.delete(`/pengurus-kormi/delete/${id}`);
  },
  export() {
    return resourse.get('/pengurus-kormi/export');
  },
};
