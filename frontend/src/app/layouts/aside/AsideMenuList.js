/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { NavLink, useHistory } from "react-router-dom";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl, checkIsActive } from "../../../_metronic/_helpers";
import { useSelector, shallowEqual } from "react-redux";
import useStore from "../../../zustand/store";
import { WebAppSettingsServices, CmsAdministratorServices } from "../../services";
import Swal from 'sweetalert2';

export function AsideMenuList({ layoutProps }) {
  const location = useLocation();
  const user = useSelector((state) => state.auth.user, shallowEqual);
  const roleId = user?.role;
  const setSidebarLogo = useStore(state => state.setSidebarLogo);
  const setParentName = useStore(state => state.setParentName);
  const history = useHistory();
  const [pathname, setPathname] = useState(window.location.pathname);

  const getMenuItemActive = (url, hasSubmenu = false) => {
    return checkIsActive(location, url)
      ? ` ${!hasSubmenu &&
          "menu-item-active"} menu-item-open menu-item-not-hightlighted`
      : "";
  };

  const getSettingInduk = async () => {
    let { data: { settings: { logo } } } = await WebAppSettingsServices.getSettingInduk();
    setSidebarLogo(logo);
  };

  const getParentName = async () => {
    let { data } = await CmsAdministratorServices.detail(null, user.id);
    if (data !== undefined && data.organitation_parent !== null) {
      setParentName(data.organitation_parent.parent_name);
    }
  };

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

  useEffect(() => {
    if ((roleId !== 0) && window.location.pathname !== '/main-organization') {
      getSettingInduk();
    }
    getParentName();
  }, []);

  return (
    <>
      {/* begin::Menu Nav */}
      <ul className={`menu-nav ${layoutProps.ulClasses}`}>
        {/*begin::1 Level*/}
        <li
          className={`menu-item ${getMenuItemActive("/dashboard", false)}`}
          aria-haspopup="true"
        >
          <NavLink className="menu-link" to="/dashboard">
            <span className="svg-icon menu-icon">
              <SVG src={toAbsoluteUrl("/media/kormi/icons/home-20-filled.svg")} />
            </span>
            <span className="menu-text">Beranda</span>
            <span className="my-auto">
                <SVG src={toAbsoluteUrl("/media/kormi/Svg/arrow-right.svg")} />
              </span>
          </NavLink>
        </li>
        {/*end::1 Level*/}

        {/* Data */}
        {/* begin::section */}
        <li className="menu-section mt-0">
          <h4 className="menu-text" style={{fontWeight: 'bolder', color: 'black'}}>DATA</h4>
          <i className="menu-icon flaticon-more-v2"></i>
        </li>
        {/* end:: section */}

        {/* Angota */}
        {/*begin::1 Level*/}
        <li
          className={`menu-item ${getMenuItemActive(
            "/member",
            false
          )}`}
          aria-haspopup="true"
        >
          <NavLink className="menu-link" to="/member">
            <span className="svg-icon menu-icon">
              <SVG
                src={toAbsoluteUrl(
                  "/media/kormi/icons/bxs-user.svg"
                )}
              />
            </span>
              <span className="menu-text">Anggota</span>
              <span className="my-auto">
                <SVG src={toAbsoluteUrl("/media/kormi/Svg/arrow-right.svg")} />
              </span>
          </NavLink>
        </li>
        {/* end::1 Level */}


        {/* Pengurus */}
        {/* begin::1 Level */}
        <li
          className={`menu-item menu-item-submenu ${getMenuItemActive(
            "/administrator",
            false
            )}`}
            aria-haspopup="true"
            >
          <NavLink className="menu-link menu-toggle" to="/administrator">
            <span className="svg-icon menu-icon">
              <SVG
                src={toAbsoluteUrl(
                  "/media/kormi/icons/bxs-user-detail.svg"
                  )}
                  />
            </span>
            <span className="menu-text">Pengurus</span>
            <span className="my-auto">
                <SVG src={toAbsoluteUrl("/media/kormi/Svg/arrow-right.svg")} />
              </span>
          </NavLink>
        </li>
        {/* end::1 Level */}

        {/* Komisi */}
        {/* begin::1 Level */}
        {(roleId === 0) && (
          <li
          className={`menu-item menu-item-submenu ${getMenuItemActive(
            "/commission",
            false
            )}`}
            aria-haspopup="true"
            >
            <NavLink className="menu-link menu-toggle" to="/commission">
              <span className="svg-icon menu-icon">
                <SVG
                  src={toAbsoluteUrl(
                    "/media/kormi/icons/komisi.svg"
                    )}
                    />
              </span>
              <span className="menu-text">Komisi</span>
              <span className="my-auto">
                <SVG src={toAbsoluteUrl("/media/kormi/Svg/arrow-right.svg")} />
              </span>
            </NavLink>
          </li>
        )}
        {/* end::1 Level */}
        {/* Indul Organisasi */}
        {/* begin::1 Level */}
        {(roleId === 0 || roleId === 1) && (
        <li
          className={`menu-item menu-item-submenu ${getMenuItemActive(
            "/main-organization",
            false
          )}`}
          aria-haspopup="true"
        >
          <NavLink className="menu-link menu-toggle" to="/main-organization">
            <span className="svg-icon menu-icon">
              <SVG
                src={toAbsoluteUrl(
                  "/media/kormi/icons/induk.svg"
                )}
              />
            </span>
            <span className="menu-text">Induk</span>
            <span className="my-auto">
                <SVG src={toAbsoluteUrl("/media/kormi/Svg/arrow-right.svg")} />
              </span>
          </NavLink>
        </li>
        )}
        {/* end::1 Level */}

        {/* Kesehatan */}
        {/* begin::1 Level */}

        {/* <li
          className={`menu-item menu-item-submenu ${getMenuItemActive(
            "/healt",
            false
          )}`}
          aria-haspopup="true"
        >
          <NavLink className="menu-link menu-toggle" to="/healt">
            <span className="svg-icon menu-icon">
              <SVG
                src={toAbsoluteUrl(
                  "/media/svg/icons/Layout/Layout-4-blocks.svg"
                )}
              />
            </span>
            <span className="menu-text">Kesehatan</span>
          </NavLink>
        </li> */}

        {/* end::1 Level */}

        {/* Informasi */}
        {/* begin::section */}
        <li className="menu-section mt-0">
          <h4 className="menu-text" style={{fontWeight: 'bolder', color: 'black'}}>INFORMASI</h4>
          <i className="menu-icon flaticon-more-v2"></i>
        </li>
        {/* end:: section */}

        {
          (roleId <= 1) && (
            <>
            {/* Berita */}
            {/*begin::1 Level*/}
            <li
              className={`menu-item menu-item-submenu ${getMenuItemActive(
                "/news",
                false
              )}`}
              aria-haspopup="true"
            >
              <NavLink className="menu-link menu-toggle" to="/news">
                <span className="svg-icon menu-icon">
                  <SVG
                    src={toAbsoluteUrl(
                      "/media/kormi/icons/berita.svg"
                    )}
                  />
                </span>
                <span className="menu-text">Berita</span>
                <span className="my-auto">
                    <SVG src={toAbsoluteUrl("/media/kormi/Svg/arrow-right.svg")} />
                  </span>
              </NavLink>
            </li>
            {/* end::1 Level */}

            {/* Acara */}
            {/* begin::1 Level */}
            <li
              className={`menu-item menu-item-submenu ${getMenuItemActive(
                "/event",
                false
              )}`}
              aria-haspopup="true"
            >
              <NavLink className="menu-link menu-toggle" to="/event">
                <span className="svg-icon menu-icon">
                  <SVG
                    src={toAbsoluteUrl(
                      "/media/kormi/icons/acara.svg"
                    )}
                  />
                </span>
                <span className="menu-text">Acara</span>
                <span className="my-auto">
                    <SVG src={toAbsoluteUrl("/media/kormi/Svg/arrow-right.svg")} />
                  </span>
              </NavLink>
            </li>
            </>
          )
        }



        {/* Riwayat Transaksi */}
        {/* begin::1 Level */}
        <li
          className={`menu-item menu-item-submenu ${getMenuItemActive(
            "/transaction",
            false
          )}`}
          aria-haspopup="true"
        >
          <NavLink className="menu-link menu-toggle" to="/transaction">
            <span className="svg-icon menu-icon">
              <SVG
                src={toAbsoluteUrl(
                  "/media/kormi/icons/riwayat.svg"
                )}
              />
            </span>
            <span className="menu-text">Riwayat Transaksi</span>
            <span className="my-auto">
                <SVG src={toAbsoluteUrl("/media/kormi/Svg/arrow-right.svg")} />
              </span>
          </NavLink>
        </li>
        {/* end::1 Level */}

        {/* Oengaturan */}
        {/* begin::section */}
        <li className="menu-section mt-0">
          <h4 className="menu-text" style={{fontWeight: 'bolder', color: 'black'}}>Pengaturan</h4>
          <i className="menu-icon flaticon-more-v2"></i>
        </li>
        {/* end:: section */}

        {/* Status Organisasi */}
        {/*begin::1 Level*/}
        {/* <li
          className={`menu-item menu-item-submenu ${getMenuItemActive(
            "/status-organization",
            false
          )}`}
          aria-haspopup="true"
        >
          <NavLink className="menu-link menu-toggle" to="/status-organization">
            <span className="svg-icon menu-icon">
              <SVG
                src={toAbsoluteUrl(
                  "/media/kormi/icons/ai-status.svg"
                )}
              />
            </span>
            <span className="menu-text">Status Anggota</span>
          </NavLink>
        </li> */}
        {/* end::1 Level */}

        {/* Master Admin */}
        {/*begin::1 Level*/}
        
          <li
            className={`menu-item menu-item-submenu ${getMenuItemActive(
              "/cms-administrator",
              false
            )}`}
            aria-haspopup="true"
          >
            <NavLink className="menu-link menu-toggle" to="/cms-administrator">
              <span className="svg-icon menu-icon">
                <SVG
                  src={toAbsoluteUrl(
                    "/media/kormi/icons/administrator-solid.svg"
                  )}
                />
              </span>
              <span className="menu-text">Admin</span>
              <span className="my-auto">
                <SVG src={toAbsoluteUrl("/media/kormi/Svg/arrow-right.svg")} />
              </span>
            </NavLink>
          </li>
        
        {/* end::1 Level */}

        {/* Jabatan */}
        {/*begin::1 Level*/}
        {
          (roleId == 0) && (
            <li
              className={`menu-item menu-item-submenu ${getMenuItemActive(
                "/jabatan",
                false
              )}`}
              aria-haspopup="true"
            >
              <NavLink className="menu-link menu-toggle" to="/jabatan">
                <span className="svg-icon menu-icon">
                  <SVG
                    src={toAbsoluteUrl(
                      "/media/kormi/icons/umum.svg"
                    )}
                  />
                </span>
                <span className="menu-text">Jabatan</span>
                <span className="my-auto">
                <SVG src={toAbsoluteUrl("/media/kormi/Svg/arrow-right.svg")} />
              </span>
              </NavLink>
            </li>
          )
        }
        
        {/* end::1 Level */}

        {/* Setting */}
        {/*begin::1 Level*/}
        {
          (roleId === 0) && (
            <li
              className={`menu-item menu-item-submenu ${getMenuItemActive(
                "/web-app-settings",
                false
              )}`}
              aria-haspopup="true"
            >
              <NavLink className="menu-link menu-toggle" to="/web-app-settings">
                <span className="svg-icon menu-icon">
                  <SVG
                    src={toAbsoluteUrl(
                      "/media/kormi/icons/geart.svg"
                    )}
                  />
                </span>
                <span className="menu-text">Setting</span>
                <span className="my-auto">
                <SVG src={toAbsoluteUrl("/media/kormi/Svg/arrow-right.svg")} />
              </span>
              </NavLink>
            </li>
          )
        }
        {/* end::1 Level */}

        {/* <li
          className={`menu-item menu-item-submenu ${getMenuItemActive(
            "/transaction",
            false
          )}`}
          aria-haspopup="true"
          style={{display: 'none'}}
        >
          <NavLink className="menu-link menu-toggle" to="/transaction">
            <span className="svg-icon menu-icon">
              <SVG
                src={toAbsoluteUrl(
                  "/media/kormi/icons/riwayat.svg"
                )}
              />
            </span>
            <span className="menu-text">Transaksi</span>
            <span className="my-auto">
                <SVG src={toAbsoluteUrl("/media/kormi/Svg/arrow-right.svg")} />
              </span>
          </NavLink>
        </li> */}

        {/* Penomoran Angota*/}
        {/* begin::1 Level */}
        {/* <li
          className={`menu-item menu-item-submenu ${getMenuItemActive(
            "/numbering",
            false
          )}`}
          aria-haspopup="true"
        >
          <NavLink className="menu-link menu-toggle" to="/numbering">
            <span className="svg-icon menu-icon">
              <SVG
                src={toAbsoluteUrl(
                  "/media/svg/icons/Layout/Layout-4-blocks.svg"
                )}
              />
            </span>
            <span className="menu-text">Penomoran Angota</span>
          </NavLink>
        </li> */}
        {/* end::1 Level */}

        {/* Master Data */}
        {/* begin::section */}
        {/* <li className="menu-section mt-0">
          <h4 className="menu-text" style={{fontWeight: 'bolder', color: 'black'}}>PENGATURAN</h4>
          <i className="menu-icon flaticon-more-v2"></i>
        </li> */}
        {/* end:: section */}

        {/* Status Organisasi */}
        {/*begin::1 Level*/}
        {/* <li
          className={`menu-item menu-item-submenu ${getMenuItemActive(
            "/reset-password",
            false
          )}`}
          aria-haspopup="true"
        >
          <NavLink className="menu-link menu-toggle" to="/reset-password">
            <span className="svg-icon menu-icon">
              <SVG
                src={toAbsoluteUrl(
                  "/media/svg/icons/Layout/Layout-4-blocks.svg"
                )}
              />
            </span>
            <span className="menu-text">Reset Password</span>
          </NavLink>
        </li> */}
        {/* end::1 Level */}

        {/* Keluar*/}
        {/* begin::1 Level */}
        <li
          className={`menu-item menu-item-submenu aside-logout ${getMenuItemActive(
            "/logout",
            false
          )}`}
          aria-haspopup="true"
          onClick={logout}
        >
          <NavLink className="menu-link menu-toggle" to="/auth">
            <span className="svg-icon menu-icon">
              <SVG src="/media/kormi/icons/logout.svg" />
            </span>
            <span className="menu-text">Keluar</span>
            <span className="my-auto">
                <SVG src={toAbsoluteUrl("/media/kormi/Svg/arrow-right.svg")} />
              </span>
          </NavLink>
        </li>
        {/* end::1 Level */}
      </ul>

      {/* end::Menu Nav */}
    </>
  );
}
