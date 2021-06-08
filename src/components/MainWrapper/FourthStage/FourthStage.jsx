import React from 'react'
import s from "./FourthStage.module.css"
import axios from "axios";

class FourthStage extends React.Component {
    componentDidMount() {
        let checkStatus = () => {

            // axios.get
            if (this.props.isPrinted === true){
                this.props.goToStart()
            }
        }
        setInterval(checkStatus, 1000)
    }

    render() {
        return (
            <div className={s.wrapper}>
                <div className={s.header}>
                    Идёт обработка записей и печать паспорта
                </div>
            </div>
        )
    }
}

export default FourthStage