import React from 'react'
import s from "./FirstStage.module.css"
import axios from "axios";

class FirstStage extends React.Component {

    componentDidMount() {

    }

    render() {
        return (
            <div className={s.wrapper}>
                <div className={s.header}>Ввод параметров изделия</div>
                <div className={s.optionsWrapper}>
                    <div>
                        <div className={s.optionHeader}>Модель изделия</div>
                        <select onClick={this.props.setMode} className={s.options}>
                            <option>Геоскан Пионер</option>
                        </select>
                    </div>
                    <div>
                        <div className={s.optionHeader}>Этап производства</div>
                        <select onClick={this.props.setStage}  className={s.options}>
                            <option>Сборка устройства</option>
                            <option>Упаковка устройства</option>
                        </select>
                    </div>
                    <div>
                        <div className={s.optionHeader}>Ремкомплект Пионер</div>
                        <select className={s.options}>
                            <option>Да</option>
                            <option>Нет</option>
                        </select>
                    </div>
                </div>
                <div className={s.buttons}>
                    <button onClick={this.props.toStageTwo} className={s.nextButton}>Продолжить</button>
                    <button onClick={this.props.cancelWork} className={s.cancelButton}>Отмена</button>
                </div>
            </div>
        )
    }
}

export default FirstStage