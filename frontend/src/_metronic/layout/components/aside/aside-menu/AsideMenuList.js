/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React from "react";
import { useLocation } from "react-router";
import { NavLink } from "react-router-dom";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl, checkIsActive } from "../../../../_helpers";

export function AsideMenuList({ layoutProps }) {
  const location = useLocation();
  const getMenuItemActive = (url, hasSubmenu = false) => {
    return checkIsActive(location, url)
      ? ` ${!hasSubmenu &&
          "menu-item-active"} menu-item-open menu-item-not-hightlighted`
      : "";
  };

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
              <SVG src={toAbsoluteUrl("/media/svg/icons/Design/Layers.svg")} />
            </span>
            <span className="menu-text">Beranda</span>
          </NavLink>
        </li>
        {/*end::1 Level*/}

        {/* Data */}
        {/* begin::section */}
        <li className="menu-section ">
          <h4 className="menu-text">DATA</h4>
          <i className="menu-icon flaticon-more-v2"></i>
        </li>
        {/* end:: section */}

        {/* Angota */}
        {/*begin::1 Level*/}
        <li
          className={`menu-item menu-item-submenu ${getMenuItemActive(
            "/member",
            false
          )}`}
          aria-haspopup="true"
        >
          <NavLink className="menu-link" to="/member">
            <span className="svg-icon menu-icon">
              <SVG src={toAbsoluteUrl("/media/svg/icons/Layout/Layout-4-blocks.svg")} />
            </span>
            <span className="menu-text">Anggota</span>
          </NavLink>
          </li>
          {/* end::1 Level */}

          {/* Indul Organisasi */}
          {/* begin::1 Level */}
        <li
          className={`menu-item menu-item-submenu ${getMenuItemActive(
            "/main-organization",
            false
          )}`}
          aria-haspopup="true"
        >
          <NavLink className="menu-link menu-toggle" to="/main-organization">
            <span className="svg-icon menu-icon">
              <SVG src={toAbsoluteUrl("/media/svg/icons/Layout/Layout-4-blocks.svg")} />
            </span>
            <span className="menu-text">Induk Organisasi</span>
          </NavLink>
          </li>
          {/* end::1 Level */}

          {/* Pengurus */}
          {/* begin::1 Level */}
        <li
          className={`menu-item menu-item-submenu ${getMenuItemActive(
            "/admin",
            false
          )}`}
          aria-haspopup="true"
        >
          <NavLink className="menu-link menu-toggle" to="/admin">
            <span className="svg-icon menu-icon">
              <SVG src={toAbsoluteUrl("/media/svg/icons/Layout/Layout-4-blocks.svg")} />
            </span>
            <span className="menu-text">Pengurus</span>
          </NavLink>
          </li>
          {/* end::1 Level */}

          {/* Komisi */}
          {/* begin::1 Level */}
        <li
          className={`menu-item menu-item-submenu ${getMenuItemActive(
            "/commission",
            false
          )}`}
          aria-haspopup="true"
        >
          <NavLink className="menu-link menu-toggle" to="/commission">
            <span className="svg-icon menu-icon">
              <SVG src={toAbsoluteUrl("/media/svg/icons/Layout/Layout-4-blocks.svg")} />
            </span>
            <span className="menu-text">Komisi</span>
          </NavLink>
          </li>
          {/* end::1 Level */}

          {/* Kesehatan */}
          {/* begin::1 Level */}
        <li
          className={`menu-item menu-item-submenu ${getMenuItemActive(
            "/healt",
            false
          )}`}
          aria-haspopup="true"
        >
          <NavLink className="menu-link menu-toggle" to="/healt">
            <span className="svg-icon menu-icon">
              <SVG src={toAbsoluteUrl("/media/svg/icons/Layout/Layout-4-blocks.svg")} />
            </span>
            <span className="menu-text">Kesehatan</span>
          </NavLink>
          </li>
          {/* end::1 Level */}

        {/* Informasi */}
        {/* begin::section */}
        <li className="menu-section ">
          <h4 className="menu-text">INFORMASI</h4>
          <i className="menu-icon flaticon-more-v2"></i>
        </li>
        {/* end:: section */}

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
              <SVG src={toAbsoluteUrl("/media/svg/icons/Layout/Layout-4-blocks.svg")} />
            </span>
            <span className="menu-text">Berita</span>
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
              <SVG src={toAbsoluteUrl("/media/svg/icons/Layout/Layout-4-blocks.svg")} />
            </span>
            <span className="menu-text">Acara</span>
          </NavLink>
          </li>
          {/* end::1 Level */}

        {/* Master Data */}
        {/* begin::section */}
        <li className="menu-section ">
          <h4 className="menu-text">MASTER DATA</h4>
          <i className="menu-icon flaticon-more-v2"></i>
        </li>
        {/* end:: section */}

        {/* Status Organisasi */}
        {/*begin::1 Level*/}
        <li
          className={`menu-item menu-item-submenu ${getMenuItemActive(
            "/status-organization",
            false
          )}`}
          aria-haspopup="true"
        >
          <NavLink className="menu-link menu-toggle" to="/status-organization">
            <span className="svg-icon menu-icon">
              <SVG src={toAbsoluteUrl("/media/svg/icons/Layout/Layout-4-blocks.svg")} />
            </span>
            <span className="menu-text">Status Organisasi</span>
          </NavLink>
          </li>
          {/* end::1 Level */}

          {/* Penomoran Angota*/}
          {/* begin::1 Level */}
        <li
          className={`menu-item menu-item-submenu ${getMenuItemActive(
            "/numbering",
            false
          )}`}
          aria-haspopup="true"
        >
          <NavLink className="menu-link menu-toggle" to="/numbering">
            <span className="svg-icon menu-icon">
              <SVG src={toAbsoluteUrl("/media/svg/icons/Layout/Layout-4-blocks.svg")} />
            </span>
            <span className="menu-text">Penomoran Angota</span>
          </NavLink>
          </li>
          {/* end::1 Level */}

          {/* Keluar*/}
          {/* begin::1 Level */}
        <li
          className={`mt-10 menu-item menu-item-submenu ${getMenuItemActive(
            "/logout",
            false
          )}`}
          aria-haspopup="true"
        >
          <NavLink className="menu-link menu-toggle" to="/logout">
            <span className="svg-icon menu-icon">
              <SVG src="/media/svg/icons/Design/Layers.svg" />
            </span>
            <span className="menu-text">Keluar</span>
          </NavLink>
          </li>
          {/* end::1 Level */}
      </ul>

      {/* end::Menu Nav */}
    </>
  );
}
