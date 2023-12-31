import React, {useMemo} from "react";
import {Link} from "react-router-dom";
import objectPath from "object-path";
import SVG from "react-inlinesvg";
import {toAbsoluteUrl} from "../../../_helpers";
import {useHtmlClassService} from "../../_core/MetronicLayout";
import useStore from "../../../../zustand/store";
import { useSelector, shallowEqual } from "react-redux";

export function HeaderMobile() {
  const uiService = useHtmlClassService();
  const sidebarLogo = useStore(state => state.sidebarLogo);
  const user = useSelector((state) => state.auth.user, shallowEqual);
  const roleId = user?.role;

  const layoutProps = useMemo(() => {
    return {
      headerLogo: uiService.getStickyLogo(),
      asideDisplay: objectPath.get(uiService.config, "aside.self.display"),
      headerMenuSelfDisplay:
          objectPath.get(uiService.config, "header.menu.self.display") === true,
      headerMobileCssClasses: uiService.getClasses("header_mobile", true),
      headerMobileAttributes: uiService.getAttributes("header_mobile")
    };
  }, [uiService]);

  return (
      <>
        {/*begin::Header Mobile*/}
        <div
            id="kt_header_mobile"
            className={`header-mobile align-items-center ${layoutProps.headerMobileCssClasses}`}
            {...layoutProps.headerMobileAttributes}
        >
          {/*begin::Logo*/}
          {
            (roleId !== 0 && roleId !== 7) ? (
              <Link to="/">
                <img style={{width: '100%', height: '50px'}} alt="logo" src={sidebarLogo}/>
              </Link>
            ) : (
              <Link to="/">
                <img style={{width: '160px', height: '43px'}} alt="logo" src="/media/kormi/KORMI_Logo2.png"/>
              </Link>
            )
          }
          {/*end::Logo*/}

          {/*begin::Toolbar*/}
          <div className="d-flex align-items-center">
            {layoutProps.asideDisplay && (
                <>
                  {/*begin::Aside Mobile Toggle*/}
                  <button className="btn p-0 burger-icon burger-icon-left" id="kt_aside_mobile_toggle">
                    <span/>
                  </button>
                  {/*end::Aside Mobile Toggle*/}
                </>
            )}
            
            {/*begin::Topbar Mobile Toggle*/}
            <button
                className="btn btn-hover-text-primary p-0 ml-2"
                id="kt_header_mobile_topbar_toggle"
            >
              <span className="svg-icon svg-icon-xl">
                <SVG src={toAbsoluteUrl("/media/svg/icons/General/User.svg")} />
              </span>
            </button>
            {/*end::Topbar Mobile Toggle*/}
          </div>
          {/*end::Toolbar*/}
        </div>
        {/*end::Header Mobile*/}
      </>
  );
}
