import React from 'react'
import s from "./MainWrapper.module.css"
import ZeroStageContainer from "./ZeroStage/ZeroStageContainer";
import FirstStageContainer from "./FirstStage/FirstStageContainer";
import SecondStageContainer from "./SecondStage/SecondStageContainer";
import ThirdStageContainer from "./ThirdStage/ThirdStageContainer";
import FourthStageContainer from "./FourthStage/FourthStageContainer";

class MainWrapper extends React.Component {


    render() {
        let stageComponent;
        switch (this.props.stageNumber) {
            case 0:
                stageComponent = <ZeroStageContainer/>
                break
            case 1:
                stageComponent = <FirstStageContainer />
                break
            case 2:
                stageComponent = <SecondStageContainer />
                break
            case 3:
                stageComponent = <ThirdStageContainer />
                break;
            case 4:
                stageComponent = <FourthStageContainer />
                break;
            default:
                stageComponent = <div>Stage number {this.props.stageNumber}</div>
                break
        }
        return (
            <div className={s.wrapper}>
                <div>
                    {stageComponent}
                </div>
            </div>
        )
    }
}

export default MainWrapper