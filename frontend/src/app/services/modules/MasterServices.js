import resourse from "../../libs/resourse";

export default {
  browseCity(qs = {}) {
    return resourse.get("/city/list", qs);
  },
  browseProvince(qs = {}) {
    return resourse.get("/province/list", qs);
  },
  getRoleList(qs = {}) {
    return resourse.get("/admin/role-list", qs);
  },
  getCategoryEvent(qs = {}) {
    return resourse.get("/event/category", qs);
  },
  getTypeOffline(qs = {}) {
    return resourse.get("/event/type/offline", qs);
  }
};
