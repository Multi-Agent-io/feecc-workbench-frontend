import React from 'react'
import s from "./Header.module.css"
import mvas from "../../static/logo_mvas.png"
import geoscan from "../../static/logo_geoskan.png"

class Header extends React.Component {

    render() {
        let icons;
        let name;
        if (this.props.stageNumber === 0) {
            icons = <div></div>
            name = <div className={s.navigation}></div>
        } else {
            icons = <div><img className={s.mvasLogo} src={mvas} alt="mvasLogo"/><img className={s.geoscanLogo} src={geoscan} alt="geoscanLogo"/></div>
            name = <div className={s.navigation}></div>
        }

        return (
            <div className={s.wrapper}>
                <div className={s.iconsCorner}>
                    {icons}
                </div>
                <div className={s.navigation}>{name}</div>
            </div>
        )
    }
}

export default Header