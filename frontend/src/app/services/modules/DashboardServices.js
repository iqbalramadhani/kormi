import resourse from "../../libs/resourse";

export default {
  browse(qs = null) {
      return resourse.get('/dashboard', qs);
  },
  read(data = null, qs = null) {
    return resourse.get('', data, qs);
  },
  edit(data = null, qs = null) {
    return resourse.put('', data, qs);
  },
  add(data = null, qs = null) {
    return resourse.post('', data, qs);
  },
  delete(data = null, qs = null) {
    return resourse.delete('', data, qs);
  },
};
