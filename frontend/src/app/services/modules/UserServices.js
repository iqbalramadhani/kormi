import resourse from "../../libs/resourse";

export default {
  getMemberList(qs = null) {
      return resourse.get('/user/list-member', qs);
  },
  getMemberDetail(qs = null) {
    return resourse.get(`/user/detail-member/${qs.id}`, qs);
  },
  updateStatusMember(data = null, qs = null) {
    return resourse.put(`/user/change-status/${qs.id}`, data, qs);
  },
  delete(data = null, qs = null) {
    return resourse.delete(`/user/delete/${data.id}`, data, qs);
  },
  bulkAdd(data = null, qs = null) {
    return resourse.post('/user/create-by-admin', data, qs);
  },
  updateMember(data = null, qs = null, id = null) {
    return resourse.put(`/user/updatemember/${id}`, data, qs);
  },
  createInvoice(data = null, qs = null) {
    return resourse.post(`/user/create-invoice`, data, qs);
  },
  import(data = null, qs = null) {
    return resourse.post(`/user/import`, data, qs);
  },
  export(data = null, qs = null) {
    return resourse.post(`/user/export`, data, qs);
  },
  downloadTemplate(data = null, qs = null) {
    return resourse.get(`/user/download/template`, data, qs);
  },
  bulkPayment(data = null, qs = null) {
    return resourse.post(`/user/bulk-payment`, data, qs);
  },
  create(data = null, qs = null) {
    return resourse.post(`/user/create`, data, qs);
  },
};
