import React from 'react'
import s from "./Header.module.css"
import mvas from "../../static/logo_mvas.png"
import geoscan from "../../static/logo_geoskan.png"
import {Slider} from "@material-ui/core";

class Header extends React.Component {

    componentDidMount() {
        let countDuration = () => {
            if (this.props.generalStageNumber === 1) {
                this.props.countSessionDuration()
            }
        }
        setInterval(countDuration, 1000)
    }

    render() {
        let icons;
        let headerInfo;
        let marks = [
            {
                value: 1,
                label: '1',
            },
            {
                value: 2,
                label: '2',
            },
            {
                value: 3,
                label: '3',
            },
            {
                value: 4,
                label: '4',
            },
            {
                value: 5,
                label: '5',
            },
            {
                value: 6,
                label: '6',
            },
            {
                value: 7,
                label: '7',
            },
            {
                value: 8,
                label: '8',
            },
            {
                value: 9,
                label: '9',
            },
            {
                value: 10,
                label: '10',
            },
            {
                value: 11,
                label: '11',
            },
            {
                value: 12,
                label: '12',
            },
            {
                value: 13,
                label: '13',
            },
            {
                value: 14,
                label: '14',
            },


        ]
        if (this.props.generalStageNumber === 0) {
            icons = <div></div>
            headerInfo = <div className={s.navigation}></div>
        } else {
            icons =
                <div><img className={s.mvasLogo} src={mvas} alt="mvasLogo"/><img className={s.geoscanLogo} src={geoscan}
                                                                                 alt="geoscanLogo"/></div>
            headerInfo =
                <div>
                    <div className={s.info}>
                        <div>
                            <div className={s.userInfo}>
                                Авторизация: {this.props.userName}
                            </div>
                            <div>
                                Номер сборки: {this.props.compositionID}
                            </div>
                        </div>

                        <div className={s.mainTimer}>
                            <div className={s.timerHeader}>
                                Длительность текущей сессии:{" "}
                            </div>
                            <div className={s.timer}>
                                {parseInt(this.props.sessionDuration / 1000 / 3600)}
                                :
                                {parseInt((this.props.sessionDuration / 1000 / 60) % 60) < 10 ? "0" + parseInt((this.props.sessionDuration / 1000 / 60) % 60) : parseInt((this.props.sessionDuration / 1000 / 60) % 60)}
                                :
                                {parseInt((this.props.sessionDuration / 1000) % 60) < 10 ? "0" + parseInt((this.props.sessionDuration / 1000) % 60) : parseInt((this.props.sessionDuration / 1000) % 60)}
                            </div>
                        </div>
                    </div>
                    <div className={s.progressBar}>
                        <Slider
                            valueLabelDisplay="on"
                            value={this.props.stageNumber}
                            min={0}
                            max={14}
                            step={13}
                            marks={marks}
                            disabled={this.props.generalStageNumber !== 1}
                        />
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
}

export default Header