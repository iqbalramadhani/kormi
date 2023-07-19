import resourse from "../../libs/resourse";

export default {
  getSetting(qs = null) {
      return resourse.get('/setting');
  },
  updateSettings(data) {
    return resourse.post('/setting', data);
  },
  getSettingInduk(data = null) {
    return resourse.get('/setting/induk/index');
  },
  updateSettingInduk(data = null) {
    return resourse.post('/setting/induk', data);
  },
  deleteSettingIndukImage(path) {
    return resourse.delete(`/setting/induk/delete/${path}`);
  },
 
};
