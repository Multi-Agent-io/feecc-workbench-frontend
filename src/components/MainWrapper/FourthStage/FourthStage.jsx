import React from 'react'
import s from "./FourthStage.module.css"
import CircularProgress from '@material-ui/core/CircularProgress';
import axios from "axios";
import {LinearProgress} from "@material-ui/core";

class FourthStage extends React.Component {
    componentDidMount() {
        this.props.setCallTimer(setInterval(()=>{
            if (false){
                this.props.goToStart()
            }
        }, 5000))

    }
    componentWillUnmount() {
        clearInterval(this.props.timer)
    }

    render() {
        return (
            <div className={s.wrapper}>
                <div className={s.header}>
                    Идёт обработка записей и печать паспорта
                </div>
                <div className={s.load}>
                    <CircularProgress className={s.loading} size={100} color="primary" />
                    {/*<LinearProgress variant="indeterminate"/>*/}
                </div>
            </div>
        )
    }
}

export default FourthStage