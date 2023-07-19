import resourse from "../../libs/resourse";

export default {
  browse(qs = null) {
      return resourse.get('/master/commission', qs);
  },
  read(data = null, qs = null) {
    return resourse.get('/master/commission', data, qs);
  },
  detail( qs = null, id = null) {
    return resourse.get(`/master/commission/detail/${id}`, qs);
  },
  edit(data = null, qs = null, id = null) {
    return resourse.put(`/master/commission/update/${id}`, data, qs);
  },
  add(data = null, qs = null) {
    return resourse.post('/master/commission/create', data, qs);
  },
  delete(data = null, qs = null, id = null) {
    return resourse.delete(`/master/commission/delete/${id}`, data, qs);
  },
  parentOrganization(qs = null) {
    return resourse.get('/master/organitation-parent', qs);
},
};
