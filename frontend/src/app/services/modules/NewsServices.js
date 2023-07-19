import resourse from '../../libs/resourse';

export default {
  browse(qs = null) {
    return resourse.get('/news', qs);
  },
  read(data = null, qs = null) {
    return resourse.get(`/news/detail/${data.id}`, data, qs);
  },
  category() {
    return resourse.get(`/news/category`);
  },
  export() {
    return resourse.get(`/news/export`);
  },
  edit(data = null, qs = null) {
    return resourse.post(`/news/update/${data.id}`, data, qs);
  },
  add(data = null, qs = null) {
    return resourse.post('/news/create', data, qs);
  },
  delete(data = null, qs = null) {
    return resourse.delete('', data, qs);
  },
  delete(id) {
    return resourse.delete(`/news/delete/${id}`);
  },
  deleteGallery(id) {
    return resourse.delete(`/news/delete/${id}/gallery`);
  },
  publish(id, data) {
    return resourse.post(`/news/published/${id}`, data);
  },
  comments(id) {
    return resourse.get(`/news/comment/${id}`);
  },
};
