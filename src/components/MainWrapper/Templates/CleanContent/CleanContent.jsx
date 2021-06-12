import React from 'react'
import s from "./CleanContent.module.css"
import axios from "axios";

class CleanContent extends React.Component {

    componentDidMount() {
        // let tickTimer = () => {

        // }
        // setInterval()
    }


    render() {

        let contentComponent;
        if (this.props.useImg === 1) {
            contentComponent =
                <div className={s.contentWithImage}>
                    <img src={this.props.imgUrl} alt="here would be something"/>
                    <div className={s.contentDescription}>{this.props.stageDescription}</div>
                </div>
        } else {
            contentComponent = <div>{this.props.stageDescription}</div>
        }

        return (
            <div className={s.wrapper}>
                <div className={s.innerWrapper}>
                    <div className={s.content}>{contentComponent}</div>
                    <div className={s.timers}>timer and ideal time</div>
                </div>
            </div>
        )
    }
}

export default CleanContent