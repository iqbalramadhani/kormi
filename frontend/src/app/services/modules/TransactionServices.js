import resourse from '../../libs/resourse';

export default {
  registerList(qs = null) {
    return resourse.get('/register-payment/list', qs);
  },
  registerDetail(data = null, qs = null) {
    return resourse.get(`/register-payment/detail/${data.order_id}`, data, qs);
  },
  eventList(qs = null) {
    return resourse.get('/event-payment/list', qs);
  },
  eventDetail(data = null, qs = null) {
    return resourse.get(`/event-payment/detail/${data.order_id}`, data, qs);
  },
  exportAnggota() {
    return resourse.get('/register-payment/export');
  },
  exportAcara() {
    return resourse.get('/event-payment/export');
  },
};
