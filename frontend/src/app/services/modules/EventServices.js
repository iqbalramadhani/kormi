import resourse from '../../libs/resourse';

export default {
  browse(qs = {}) {
    return resourse.get('/event', qs);
  },
  browseCategory(qs = {}) {
    return resourse.get('/event/category', qs);
  },
  read(data = null, qs = null) {
    return resourse.get(`/event/detail/${data.id}`);
  },
  member(data = null, qs = null) {
    return resourse.get(`/event/member/${data.id}`, qs);
  },
  export() {
    return resourse.get(`/event/export`);
  },
  edit(data = null, qs = null) {
    return resourse.post(`/event/update/${data.id}`, data);
  },
  add(data = null, qs = null) {
    return resourse.post('/event/create', data);
  },
  delete(id) {
    return resourse.delete(`/event/delete/${id}`);
  },
  deleteGallery(id) {
    return resourse.delete(`/event/delete/${id}/gallery`);
  },
  publish(id, data) {
    return resourse.post(`/event/published/${id}`, data);
  },
  comments(id) {
    return resourse.get(`/event/comment/${id}`);
  },
};
