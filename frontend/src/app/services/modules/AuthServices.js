import resourse from "../../libs/resourse";

export default {
  login(data = null) {
      return resourse.post('/auth/admin-login', data);
  },
  logout(data = null, qs = null) {
    return resourse.post('', data, qs);
  },
  register(data = null, qs = null) {
    return resourse.post('', data, qs);
  },
  forgotPassword(data = null, qs = null) {
    return resourse.put('/auth/admin-forget-password', data, qs);
  },
  resetPassword(data = null, qs = null) {
    return resourse.put('/auth/admin-reset-password', data, qs);
  },
};
