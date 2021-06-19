import React from 'react'
import s from "./ZeroStage.module.css"
import geoscanLogo from "../../../static/logo_geoskan.png"
import robonomicsLogo from "../../../static/logo_robonomics.png"
import mvasLogo from "../../../static/logo_mvas.png"
import axios from "axios";

const ZeroStage = () => {

        // const checkAuthorization = () => {
        // }
        // this.props.setTimer(setInterval(() => {
        //
        //     // Проверяем логин пользователя
        //     axios
        //         .get(this.props.socket.concat("/api/workbench/").concat(this.props.workbenchNumber).concat("/status"))
        //         .then((response) => {
        //
        //             if (response.data.employee_logged_in === true) {
        //                 this.props.setCompositionID(response.data.unit_internal_id)
        //                 this.props.setUserInfo(response.data.employee.name, response.data.employee.position)
        //                 // Если с логином всё ок, то создаём новый юнит
        //                 axios.post(this.props.socket.concat("/api/unit/new",
        //                     {
        //                         "workbench_no" : this.props.workbenchNumber
        //                     }
        //                 )).then(response => {
        //                     if (response.data.status === true){
        //                         // Если юнит успешно создан, то отправляем пользователя на следующий этап
        //                         this.props.nextGeneralStage()
        //                     }
        //                 })
        //             }
        //         })
        //
        // }, 1000))
        // clearInterval(this.props.timer)


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

export default ZeroStage