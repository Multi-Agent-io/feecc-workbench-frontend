import React from 'react'
import s from "./ZeroStage.module.css"
import geoscanLogo from "../../../static/logo_geoskan.png"
import robonomicsLogo from "../../../static/logo_robonomics.png"
import mvasLogo from "../../../static/logo_mvas.png"
import axios from "axios";

class ZeroStage extends React.Component {

    componentDidMount() {
        // const checkAuthorization = () => {
        // }

        this.props.setTimer(setInterval(() => {

            this.props.nextGeneralStage()
            this.props.startSession()
            // axios.get("https://localhost:5000/state").then((response) => {
            //     if (response.data.state_no === 1) {
            //         this.props.nextGeneralStage()
            //     }
            // })

        }, 5000))

    }

    componentWillUnmount() {
        clearInterval(this.props.timer)
    }

    render() {
        return (
            <div className={s.wrapper}>
                <div className={s.header}>Система контроля качества производства на базе платформы Feecc</div>
                <div className={s.icons}>
                    <div className={s.icon}><img className={s.mvasLogo} src={mvasLogo} alt="MVAS-logo"/></div>
                    <div><img className={s.robonomicsLogo} src={robonomicsLogo} alt="robonomics-logo"/></div>
                    <div><img className={s.geoscanLogo} src={geoscanLogo} alt="geoscan-logo"/></div>
                </div>
                <div className={s.message}>Приложите пропуск к сканеру чтобы начать сборку изделия.</div>
            </div>
        )
    }
}

export default ZeroStage