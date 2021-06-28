import React, {useEffect} from 'react'
import s from "./Header.module.css"
import mvas from "../../static/logo_mvas.png"
import geoscan from "../../static/logo_geoskan.png"
// import {Slider} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {countCompositionDuration, setCompositionTimer, setPages} from "../../redux/reducers/EndoStars/endoReducer";
import csvFile from "../../configs/pages.csv";
import {readString} from "react-papaparse";

const Header = (props) => {


    let userNumber = useSelector((state) => state.endoStarsState.userNumber)
    let user = useSelector((state) => state.endoStarsState.users[userNumber])
    let generalStageNumber = useSelector((state) => state.endoStarsState.generalStageNumber)
    let compositionID = useSelector((state) => state.endoStarsState.compositionID)
    // let startTime = useSelector((state) => state.endoStarsState.compositionStartTime)
    let duration = useSelector((state) => state.endoStarsState.compositionDuration)
    // let timer = useSelector((state) => state.endoStarsState.compositionTimer)
    let dispatch = useDispatch()


    let icons;
    let headerInfo;

    useEffect(() => {
        // Читаем данные из файла
        fetch(csvFile)
            .then(response => response.text())
            .then((text) => {
                // console.log(readString(text, {header: true, delimiter: ";"}).data)
                dispatch(setPages(readString(text, {header: true, delimiter: ";"})))
            })
    }, [])

    useEffect(() => {
        dispatch(setCompositionTimer(setInterval(() => {
            dispatch(countCompositionDuration())
            // console.log("counting")
        }, 500)))
    }, [])

    if (generalStageNumber === 0) {
        // console.log("test")
        icons = <div></div>
        headerInfo = <div className={s.navigation}></div>
    } else {
        // console.log("test2")
        icons =
            <div>
                <img className={s.mvasLogo} src={mvas} alt="mvasLogo"/>
                <img className={s.geoscanLogo} src={geoscan} alt="geoscanLogo"/>
            </div>
        headerInfo =
            <div>
                <div className={s.info}>
                    <div>
                        <div className={s.userInfo}>
                            <div className={s.userName}>
                                Авторизация: {user.name} {user.surname}
                            </div>
                            <div className={s.userPosition}>
                                Статус: {user.position}
                            </div>
                        </div>
                        <div>
                            Номер сборки: {compositionID}
                        </div>
                    </div>

                    <div className={s.mainTimer}>
                        <div className={s.timerHeader}>
                            Длительность сессии:{" "}
                        </div>
                        <div className={s.timer}>
                            {/*{parseInt((duration))}*/}
                            {parseInt(duration / 1000 / 3600) % 24}
                            :
                            {parseInt((duration / 1000 / 60) % 60) < 10 ? "0" + parseInt((duration / 1000 / 60) % 60) : parseInt((duration / 1000 / 60) % 60)}
                            :
                            {parseInt((duration / 1000) % 60) < 10 ? "0" + parseInt((duration / 1000) % 60) : parseInt((duration / 1000) % 60)}
                        </div>
                    </div>
                </div>
            </div>
    }

    return (
        <div className={s.wrapper}>
            <div className={s.iconsCorner}>
                {icons}
            </div>
            <div className={s.navigation}>
                {headerInfo}
            </div>
        </div>
    )

}

export default Header