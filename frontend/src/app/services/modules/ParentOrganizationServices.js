import resourse from '../../libs/resourse';

export default {
  browse(qs = null) {
    return resourse.get('/master/organitation-parent', qs);
  },
  read(data = null, qs = null) {
    return resourse.get('/master/organitation-parent', data, qs);
  },
  detail(qs = null, id = null) {
    return resourse.get(`/master/organitation-parent/detail/${id}`, qs);
  },
  edit(data = null, qs = null, id = null) {
    return resourse.post(`/master/organitation-parent/update/${id}`, data, qs);
  },
  add(data = null, qs = null) {
    return resourse.post('/master/organitation-parent/create', data, qs);
  },
  delete(data = null, qs = null, id = null) {
    return resourse.delete(`/master/organitation-parent/delete/${id}`, data, qs);
  },
  export() {
    return resourse.get('/master/organitation-parent/export');
  },
};
