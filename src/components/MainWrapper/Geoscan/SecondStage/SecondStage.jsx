import React from 'react'
import s from "./SecondStage.module.css"
import axios from "axios";

class SecondStage extends React.Component {

    componentDidMount() {

    }

    render() {
        // let parameters = Object.entries(this.props.secondStage)
        let ledClass = (this.props.secondStage.ledModule.isChosen === true) ? s.parameter + " " + s.selected : s.parameter
        let camModuleClass = (this.props.secondStage.camModule.isChosen === true) ? s.parameter + " " + s.selected : s.parameter
        let grabModuleClass = (this.props.secondStage.grabModule.isChosen === true) ? s.parameter + " " + s.selected : s.parameter
        let internalNavigationClass = (this.props.secondStage.internalNavigation.isChosen === true) ? s.parameter + " " + s.selected : s.parameter
        let globalNavigationClass = (this.props.secondStage.globalNavigation.isChosen === true) ? s.parameter + " " + s.selected : s.parameter
        let programmableCamClass = (this.props.secondStage.programmableCam.isChosen === true) ? s.parameter + " " + s.selected : s.parameter
        let usbRadioClass = (this.props.secondStage.usbRadio.isChosen === true) ? s.parameter + " " + s.selected : s.parameter
        let expansionModuleClass = (this.props.secondStage.expansionModule.isChosen === true) ? s.parameter + " " + s.selected : s.parameter
        let fpvTransmitterClass = (this.props.secondStage.fpvTransmitter.isChosen === true) ? s.parameter + " " + s.selected : s.parameter
        let fpvGlassesClass = (this.props.secondStage.fpvGlasses.isChosen === true) ? s.parameter + " " + s.selected : s.parameter
        // debugger;
        return (
            <div className={s.wrapper}>
                <div className={s.header}>Ввод параметров изделия</div>
                <div className={s.productPrameters}>
                        <div onClick={this.props.ledSwitch}>
                            <div className={ledClass}>
                                <img className={s.parameterImg} src={this.props.secondStage.ledModule.imgSrc}/>
                                <div className={s.parameterDescription}>
                                    {this.props.secondStage.ledModule.name}
                                </div>
                            </div>
                        </div>
                        <div onClick={this.props.camModuleSwitch}>
                            <div className={camModuleClass}>
                                <img className={s.parameterImg} src={this.props.secondStage.camModule.imgSrc}/>
                                <div className={s.parameterDescription}>
                                    {this.props.secondStage.camModule.name}
                                </div>
                            </div>
                        </div>
                        <div onClick={this.props.grabModuleSwitch}>
                            <div className={grabModuleClass}>
                                <img className={s.parameterImg} src={this.props.secondStage.grabModule.imgSrc}/>
                                <div className={s.parameterDescription}>
                                    {this.props.secondStage.grabModule.name}
                                </div>
                            </div>
                        </div>
                        <div onClick={this.props.internalNavigationSwitch}>
                            <div className={internalNavigationClass}>
                                <img className={s.parameterImg} src={this.props.secondStage.internalNavigation.imgSrc}/>
                                <div className={s.parameterDescription}>
                                    {this.props.secondStage.internalNavigation.name}
                                </div>
                            </div>
                        </div>
                        <div onClick={this.props.globalNavigationSwitch}>
                            <div className={globalNavigationClass}>
                                <img className={s.parameterImg} src={this.props.secondStage.globalNavigation.imgSrc}/>
                                <div className={s.parameterDescription}>
                                    {this.props.secondStage.globalNavigation.name}
                                </div>
                            </div>
                        </div>
                        <div onClick={this.props.programmableCamSwitch}>
                            <div className={programmableCamClass}>
                                <img className={s.parameterImg} src={this.props.secondStage.programmableCam.imgSrc}/>
                                <div className={s.parameterDescription}>
                                    {this.props.secondStage.programmableCam.name}
                                </div>
                            </div>
                        </div>
                        <div onClick={this.props.usbRadioSwitch}>
                            <div className={usbRadioClass}>
                                <img className={s.parameterImg} src={this.props.secondStage.usbRadio.imgSrc}/>
                                <div className={s.parameterDescription}>
                                    {this.props.secondStage.usbRadio.name}
                                </div>
                            </div>
                        </div>
                        <div onClick={this.props.expansionModuleSwitch}>
                            <div className={expansionModuleClass}>
                                <img className={s.parameterImg} src={this.props.secondStage.expansionModule.imgSrc}/>
                                <div className={s.parameterDescription}>
                                    {this.props.secondStage.expansionModule.name}
                                </div>
                            </div>
                        </div>
                        <div onClick={this.props.fpvTransmitterSwitch}>
                            <div className={fpvTransmitterClass}>
                                <img className={s.parameterImg} src={this.props.secondStage.fpvTransmitter.imgSrc}/>
                                <div className={s.parameterDescription}>
                                    {this.props.secondStage.fpvTransmitter.name}
                                </div>
                            </div>
                        </div>
                        <div onClick={this.props.fpvGlassesSwitch}>
                            <div className={fpvGlassesClass}>
                                <img className={s.parameterImg} src={this.props.secondStage.fpvGlasses.imgSrc}/>
                                <div className={s.parameterDescription}>
                                    {this.props.secondStage.fpvGlasses.name}
                                </div>
                            </div>
                        </div>
                </div>
                <div className={s.buttons}>
                    <button onClick={this.props.sendData} className={s.sendButton}>Отправить</button>
                    <button onClick={this.props.goBack} className={s.backButton}>Назад</button>
                    <button onClick={this.props.cancelWork} className={s.cancelButton}>Отмена</button>
                </div>
            </div>
        )
    }
}

export default SecondStage