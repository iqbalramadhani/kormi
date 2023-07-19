import resourse from '../../libs/resourse';

export default {
  browse(qs = null) {
    return resourse.get('/admin/list', qs);
  },
  add(data = null, qs = null) {
    return resourse.post('/admin/create', data, qs);
  },
  detail(qs = null, id = null) {
    return resourse.get(`/admin/detail/${id}`, qs);
  },
  edit(data = null, qs = null, id = null) {
    return resourse.post(`/admin/update/${id}`, data, qs);
  },
  delete(data = null, qs = null, id = null) {
    return resourse.delete(`/admin/delete/${data.id}`, data, qs);
  },
  updateStatus(id, data) {
    return resourse.put(`/admin/change-status/${id}`, data, data);
  },
  export() {
    return resourse.get('/admin/export');
  },
};
