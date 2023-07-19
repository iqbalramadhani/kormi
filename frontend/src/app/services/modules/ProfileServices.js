import resourse from "../../libs/resourse";

export default {
  getProfile(qs = null) {
      return resourse.get('/admin/profile');
  },
  updateAvatar(data) {
    return resourse.post('/admin/avatar', data);
  },
  updateProfile(data) {
    return resourse.post('/admin/profile', data);
  },
  changePassword(data = null, qs = null) {
    return resourse.put('/admin/change-password', data, qs);
  }
  
};
