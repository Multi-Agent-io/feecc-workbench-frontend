import React from 'react'
import s from "./ThirdStage.module.css"
import axios from "axios";

class ThirdStage extends React.Component {
    componentDidMount() {
        this.props.setCallTimer(setInterval(() => {
            axios.get().then((response) => {

            })
        }, 1000))
    }

    render() {
        return (
            <div className={s.wrapper}>
                <div className={s.header}>Вы потратили на сборку</div>
                <div className={s.time}>
                    {parseInt(this.props.sessionDuration / 1000 / 3600)}
                    :
                    {parseInt(this.props.sessionDuration / 1000 / 60) < 10 ? "0" + parseInt(this.props.sessionDuration / 1000 / 60) : parseInt(this.props.sessionDuration / 1000 / 60)}
                    :
                    {parseInt((this.props.sessionDuration / 1000) % 60) < 10 ? "0" + parseInt((this.props.sessionDuration / 1000) % 60) : parseInt((this.props.sessionDuration / 1000) % 60)}
                </div>
                <div className={s.buttons}>
                    <button onClick={this.props.finishComposition} className={s.finishComposition}>Распечатать паспорт</button>
                </div>
            </div>
        )
    }
}

export default ThirdStage