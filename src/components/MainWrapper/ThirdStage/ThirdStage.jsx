import React from 'react'
import s from "./ThirdStage.module.css"
import axios from "axios";
import {timerTick} from "../../../redux/reducers/productParametersReducer";

class ThirdStage extends React.Component {
    componentDidMount() {
        this.props.timerToZero()
        let tick = () => {
            this.props.timerTick()
        }
        setInterval(tick, 1000)
    }

    render() {


        return (
            <div className={s.wrapper}>
                <div className={s.header}>Идет запись сборки</div>
                <div className={s.time}>{
                    ((parseInt(this.props.compositionDuration / 3600) < 10) ? ("0" + parseInt(this.props.compositionDuration / 3600)) : (parseInt(this.props.compositionDuration / 3600))) + ":" +
                    ((parseInt((this.props.compositionDuration / 60) % 60) < 10) ? ("0" + (parseInt((this.props.compositionDuration / 60) % 60))) : (parseInt((this.props.compositionDuration / 60) % 60))) + ":" +
                    ((this.props.compositionDuration % 60 < 10) ? ("0"+(this.props.compositionDuration % 60)) : (this.props.compositionDuration % 60))
                }
                </div>
                <div className={s.buttons}>
                    <button onClick={this.props.finishComposition} className={s.finishComposition}>Завершить сборку</button>
                </div>
            </div>
        )
    }
}

export default ThirdStage