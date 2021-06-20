import React, {useEffect} from 'react'
import s from "./ZeroStage.module.css"
import geoscanLogo from "../../../static/logo_geoskan.png"
import robonomicsLogo from "../../../static/logo_robonomics.png"
import mvasLogo from "../../../static/logo_mvas.png"
import axios from "axios";
import {useDispatch, useSelector} from "react-redux";
import {
    setCompositionID,
    setCompositionTimer,
    setUserInfo,
    startComposition
} from "../../../redux/reducers/EndoStars/endoReducer";

const ZeroStage = () => {
    let dispatch = useDispatch()
    let socket = useSelector((state) => state.endoStarsState.socket)
    let workbenchNumber = useSelector((state) => state.endoStarsState.workbenchNumber)

    useEffect(() => {
            // Проверить если пользователь атворизовался
            dispatch(setCompositionTimer(setInterval(() => {
                    // console.log("checking authorization")
                    // dispatch(startComposition())
                    axios
                        .get(socket.concat("/api/workbench/".concat(workbenchNumber).concat("/status")))
                        .then((response) => {
                            // Если пользователь авторизован, то записываем данные о нём в state и начинаем сборку
                            if (response.data.employee_logged_id === true) {
                                dispatch(setCompositionID(response.data.unit_internal_id))
                                dispatch(setUserInfo(response.data.employee.name, "", response.data.employee.position, 0))
                                axios
                                    .post(socket.concat("/api/unit/new"),
                                        {
                                            "workbench_no": workbenchNumber
                                        })
                                    .then((response) => {
                                        if (response.data.status === true) {
                                            dispatch(startComposition())
                                        }
                                    })
                            }

                        })
                }, 1000)
                )
            )
        },
        []
    )


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