import React from 'react'
import s from "./CleanContent.module.css"
import axios from "axios";

class CleanContent extends React.Component {

    componentDidMount() {
        // Записываем время старта этапа
        this.props.setStageStartTime(this.props.stageNumber)
        // Отправляем на сервак информацию о старте конкретного этапа сборки (используется только для первого этапа, тк
        // остальные не монтируют компоненту заново)
        axios.post(this.props.socket.concat("/api/unit/".concat(this.props.unitInternalID).concat("/start")),
            {
                "workbench_no": this.props.workbenchNumber,
                "production_stage_name" : this.props.stageName,
                "additional_info" : ""
            })
            .then(response => {
                console.log(response.data.status)
            })

        let countDuration = () => {
            if (this.props.stageStartTime === 0) {
                this.props.setStageStartTime(this.props.stageNumber)
            }
            if (this.props.generalStageNumber === 1) {
                this.props.countStageDuration(this.props.stageNumber)
            }
        }
        this.props.setCallTimer(setInterval(countDuration, 1000))
    }
    componentWillUnmount() {
        clearInterval(this.props.timer)
    }

    render() {
        let contentComponent
        if (this.props.useImg === 1) {
            contentComponent =
                <div className={s.contentWithImage}>
                    <img className={s.contentImage} src={this.props.imgUrl} alt="here would be something"/>
                    <div>
                        <div className={s.stageDescriptionHeader}>Технологическое описание</div>
                        <div className={s.contentDescription}>
                            {this.props.stageDescription}
                        </div>
                    </div>
                </div>
        } else {
            contentComponent =
                <div>
                    <div className={s.stageDescriptionHeader}>Технологическое описание</div>
                    <div className={s.contentDescription}>
                        {this.props.stageDescription}
                    </div>
                </div>
        }

        return (
            <div className={s.wrapper}>
                <div className={s.innerWrapper}>
                    <div className={s.content}>{contentComponent}</div>
                    <div className={s.timers}>
                        <div className={s.timer}>Норма:{" "}
                            {parseInt(this.props.stageIdealDuration / 3600)}
                            :
                            {parseInt((this.props.stageIdealDuration / 60) % 60) < 10 ? "0" + parseInt((this.props.stageIdealDuration / 60) % 60) : parseInt((this.props.stageIdealDuration / 60) % 60)}
                            :
                            {parseInt(this.props.stageIdealDuration % 60) < 10 ? "0" + parseInt(this.props.stageIdealDuration % 60) : parseInt(this.props.stageIdealDuration % 60)}
                        </div>
                        <div className={s.timer}>Длительность этапа:{" "}
                            {parseInt((this.props.stageDuration / 1000) / 3600)}
                            :
                            {parseInt(((this.props.stageDuration / 1000) / 60) % 60) < 10 ? "0" + parseInt(((this.props.stageDuration / 1000) / 60) % 60) : parseInt(((this.props.stageDuration / 1000) / 60) % 60)}
                            :
                            {parseInt((this.props.stageDuration / 1000) % 60) < 10 ? "0" + parseInt((this.props.stageDuration / 1000) % 60) : parseInt((this.props.stageDuration / 1000) % 60)}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default CleanContent