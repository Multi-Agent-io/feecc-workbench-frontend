import React from 'react'
import s from "./MainWrapper.module.css"
import CleanContent from "./Templates/CleanContent/CleanContent";
import ZeroStageContainer from "./ZeroStage/ZeroStageContainer";
import FourthStageContainer from "./FourthStage/FourthStageContainer";
import ThirdStageContainer from "./ThirdStage/ThirdStageContainer";
import axios from "axios";
import CleanContentContainer from "./Templates/CleanContent/CleanContentContainer";

class MainWrapper extends React.Component {

    componentDidMount() {

    }

    render() {
        let buttonsHolder

        if (this.props.endoStars.generalStageNumber !== 1) {
            buttonsHolder = <div></div>
        } else {
            if (this.props.endoStars.stageNumber === 0) {
                buttonsHolder =
                    <div className={s.buttons}>
                        <button onClick={this.props.nextStage} className={s.sendButton}>Продолжить</button>
                        {/*<button onClick={this.props.previousStage} className={s.backButton}>Назад</button>*/}
                        <button onClick={this.props.cancelWork} className={s.cancelButton}>Отмена</button>
                    </div>
            } else if (this.props.endoStars.stageNumber === 14) {
                buttonsHolder =
                    <div className={s.buttons}>
                        <button onClick={this.props.nextGeneralStage} className={s.sendButton}>Завершить сборку</button>
                        {/*<button onClick={this.props.previousStage} className={s.backButton}>Назад</button>*/}
                        {/*<button onClick={this.props.cancelWork} className={s.cancelButton}>Отмена</button>*/}
                    </div>
            } else {
                buttonsHolder =
                    <div className={s.buttons}>
                        <button onClick={this.props.nextStage} className={s.sendButton}>Продолжить</button>
                        {/*<button onClick={this.props.previousStage} className={s.backButton}>Назад</button>*/}
                        {/*<button onClick={this.props.cancelWork} className={s.cancelButton}>Отмена</button>*/}
                    </div>
            }
        }

        let wrapperContent
        switch (this.props.endoStars.generalStageNumber) {
            case 0:
                wrapperContent = <ZeroStageContainer/>
                break
            case 1:
                wrapperContent =
                    <div>
                        <CleanContentContainer />
                    </div>
                break
            case 2:
                wrapperContent = <ThirdStageContainer/>
                break
            case 3:
                wrapperContent = <FourthStageContainer/>
                break
            default:
                wrapperContent = <ZeroStageContainer/>
                break
        }
        return (
            <div className={s.wrapper}>
                {wrapperContent}
                {buttonsHolder}
            </div>
        )
    }
}

export default MainWrapper