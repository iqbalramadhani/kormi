import React, {useMemo, useState} from "react";
import {Link} from "react-router-dom";
import objectPath from "object-path";
import SVG from "react-inlinesvg";
import {useHtmlClassService} from "../../_core/MetronicLayout";
import {toAbsoluteUrl} from "../../../_helpers";
import useStore from "../../../../zustand/store";
import { useSelector, shallowEqual } from "react-redux";

export function Brand() {
  const uiService = useHtmlClassService();
  const user = useSelector((state) => state.auth.user, shallowEqual);
  const roleId = user?.role;

  const layoutProps = useMemo(() => {
    return {
      brandClasses: uiService.getClasses("brand", true),
      asideSelfMinimizeToggle: objectPath.get(
          uiService.config,
          "aside.self.minimize.toggle"
      ),
      headerLogo: uiService.getLogo(),
      headerStickyLogo: uiService.getStickyLogo()
    };
  }, [uiService]);

  const sidebarLogo = useStore(state => state.sidebarLogo);
  const parentName = useStore(state => state.parentName);
  const [active, setActive] = useState(false);

  return (
    <>
      {/* begin::Brand */}
      <div
          className={`brand flex-column-auto ${layoutProps.brandClasses}`}
          id="kt_brand"
          style={{height: 'max-content'}}
      >
        {/* begin::Logo */}
        {
          (roleId !== 0 && roleId !== 7) ? (
            <div className="d-flex" style={{flexDirection: 'column', position: 'relative', top: '10px'}}>
              <Link to="" className="brand-logo" style={{justifyContent: 'center'}}>
                <img alt="logo" style={{width: "40%"}} src={sidebarLogo}/>
              </Link>
              {
                (!active) && (
                  <div style={{fontSize: '12px'}} align="center" className="ml-auto mr-auto">{parentName}</div>
                )
              }
            </div>
          ) : (
            <div className="d-flex" style={{flexDirection: 'column'}}>
              <Link to="" className="brand-logo">
                <img style={{width: '90%', marginLeft: 'auto'}} alt="logo" src={layoutProps.headerLogo}/>
              </Link>
              {/* <div className="ml-auto mr-auto">asdasdas</div> */}
            </div>
          )
        }
        {/* end::Logo */}

        {layoutProps.asideSelfMinimizeToggle && (
          <>
            {/* begin::Toggle */}
            <button className="brand-toggle btn btn-sm px-0" id="kt_aside_toggle" onClick={() => {setActive(!active)}}>
              <span className="svg-icon svg-icon-xl">
                  <SVG src={toAbsoluteUrl("/media/svg/icons/Navigation/Angle-double-left.svg")}/>
              </span>
            </button>
            {/* end::Toolbar */}
            </>
        )}
      </div>
      {/* end::Brand */}
      </>
  );
}
