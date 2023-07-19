/* eslint-disable no-restricted-imports */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React, { useMemo } from "react";
import { Link, useHistory } from "react-router-dom";
import Dropdown from "react-bootstrap/Dropdown";
import { useSelector } from "react-redux";
import objectPath from "object-path";
import { useHtmlClassService } from "../../../_core/MetronicLayout";
import { toAbsoluteUrl } from "../../../../_helpers";
import { DropdownTopbarItemToggler } from "../../../../_partials/dropdowns";
import Swal from 'sweetalert2';

export function UserProfileDropdown() {
  const { user } = useSelector((state) => state.auth);
  const uiService = useHtmlClassService();
  const history = useHistory();
  const layoutProps = useMemo(() => {
    return {
      light:
        objectPath.get(uiService.config, "extras.user.dropdown.style") ===
        "light",
    };
  }, [uiService]);

  const logout = () => {
    Swal.fire({
      title: 'Keluar',
      text:  'Anda akan keluar akun, lanjutkan?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#9E2063',
      confirmButtonText: 'Ya',
      cancelButtonText: 'Tidak',
    }).then((result) => {
      if (result.value) {
        history.push('/logout');
      }
    })
  };

  const getRoleInfo = () => {
    switch (user.role) {
      case 0:
        return 'Super Admin';
        break;
      case 1:
        return 'Admin Nasional';
        break;
      case 2:
        var info = 'Admin Provinsi '
        if (user.province) info = info + user.province.name
        return  info;
        break;
      case 3:
        var info = 'Admin Kota '
        if (user.city) info = info + user.city.name
        if (user.province) info = info + ', ' + user.province.name
        return  info;
        break;
      case 4:
        var info = 'Admin Komisi ';
        if (user.commission) info = info + user.commission.commission_name
        return  info;
        break;
      case 5:
        var info = 'Admin Komisi ';
        if (user.commission) info = info + user.commission.commission_name
        if (user.province) info = info + ' daerah ' + user.province.name
        return  info;
        break;
      default:
        break;
    }
  }

  return (
    <Dropdown drop="down" alignRight>
      <Dropdown.Toggle
        as={DropdownTopbarItemToggler}
        id="dropdown-toggle-user-profile"
      >
        <div
          className={
            "btn btn-icon w-auto btn-clean d-flex align-items-center btn-lg px-2"
          }
        >
          <span className="text-muted font-weight-bold font-size-base d-none d-md-inline mr-1">
            Hi,
          </span>{" "}
          <span className="text-dark-50 font-weight-bolder font-size-base d-none d-md-inline mr-3">
            {user.name}
          </span>
          <span className="symbol symbol-35 symbol-light-success">
            <span className="symbol-label font-size-h5 font-weight-bold">
              {user.name ? user.name.charAt(0) : null}
            </span>
          </span>
        </div>
      </Dropdown.Toggle>
      <Dropdown.Menu className="p-0 m-0 dropdown-menu-right dropdown-menu-anim dropdown-menu-top-unround dropdown-menu-xl">
        <>
          {/** ClassName should be 'dropdown-menu p-0 m-0 dropdown-menu-right dropdown-menu-anim dropdown-menu-top-unround dropdown-menu-xl' */}
          {layoutProps.light && (
            <>
              <div className="d-flex align-items-center p-8 rounded-top">
                <div className="symbol symbol-md bg-light-primary mr-3 flex-shrink-0">
                  <img src={toAbsoluteUrl("/media/users/300_21.jpg")} alt="" />
                </div>
                <div className="text-dark m-0 flex-grow-1 mr-3 font-size-h5">
                {user.name}
                </div>
              </div>
              <div className="separator separator-solid"></div>
            </>
          )}

          {!layoutProps.light && (
            <div
              className="d-flex align-items-center justify-content-between flex-wrap p-8 bgi-size-cover bgi-no-repeat rounded-top"
              style={{
                backgroundImage: `url(${toAbsoluteUrl(
                  "/media/misc/bg-1.jpg"
                )})`,
              }}
            >
              <div className="symbol bg-white-o-15 mr-3">
                <span className="symbol-label text-success font-weight-bold font-size-h4">
                {user.name ? user.name.charAt(0) : null}
                </span>
                {/*<img alt="Pic" className="hidden" src={user.pic} />*/}
              </div>
              <div className="text-white m-0 flex-grow-1 mr-3 font-size-h5">
              {user.name}
              <br />
              {getRoleInfo()}
              </div>
            </div>
          )}
        </>

        <div className="navi navi-spacer-x-0 pt-5">
          <Link to="/user-profile" className="navi-item px-8 cursor-pointer">
            <div className="navi-link">
              <div className="navi-icon mr-2">
                <i className="flaticon2-calendar-3 text-success" />
              </div>
              <div className="navi-text">
                <div className="font-weight-bold cursor-pointer">
                  Profil Saya
                </div>
                {/* <div className="text-muted">
                  Account settings and more
                  <span className="label label-light-danger label-inline font-weight-bold">
                    update
                  </span>
                </div> */}
              </div>
            </div>
          </Link>
                    <div className="navi-separator mt-3"></div>

          <div className="navi-footer  px-8 py-5">
            <Link
              onClick={logout}
              to={window.location.pathname}
              className="btn btn-light-primary font-weight-bold"
            >
              Keluar
            </Link>
          </div>
        </div>
      </Dropdown.Menu>
    </Dropdown>
  );
}
