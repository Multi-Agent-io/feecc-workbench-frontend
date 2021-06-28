import React from 'react'
import s from "./MainWrapper.module.css"
import FourthStageContainer from "./FourthStage/FourthStageContainer";
import Stages from "../Stages/Stages";
import {useSelector} from "react-redux";
import ZeroStage from "./ZeroStage/ZeroStage";

const MainWrapper = (props) => {

    const generalStageNumber = useSelector((state)=> state.endoStarsState.generalStageNumber)

    let wrapperContent
    switch (generalStageNumber) {
        case 0:
            wrapperContent = <ZeroStage/>
            break
        case 1:
            wrapperContent = <Stages/>
            break
        case 2:
            wrapperContent = <Stages/>
            break
        // case 3:
        //     wrapperContent = <FourthStageContainer/>
        //     break
        // Тестирование нормального вида
        // case 10:
        //     wrapperContent = <Stages/>
        //     break
        default:
            wrapperContent = <ZeroStage/>
            break
    }
    return (
        <div className={s.wrapper}>
            {wrapperContent}
        </div>
    )
}

export default MainWrapper