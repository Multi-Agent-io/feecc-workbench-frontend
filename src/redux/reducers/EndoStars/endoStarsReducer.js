import config from "../../../configs/configs.json"
import axios from "axios";

const NEXT_STAGE = "NEXT_STAGE"
const NEXT_GENERAL_STAGE = "NEXT_GENERAL_STAGE"
const SET_GENERAL_STAGE = "SET_GENERAL_STAGE"
const PREVIOUS_STAGE = "PREVIOUS_STAGE"
const STAR_SESSION = "STAR_SESSION"
const END_SESSION = "END_SESSION"
const CANCEL_WORK = "CANCEL_WORK"
const SET_STAGE_START_TIME = "SET_STAGE_START_TIME"
const COUNT_STAGE_DURATION = "COUNT_STAGE_DURATION"
const COUNT_SESSION_DURATION = "COUNT_SESSION_DURATION"
const SET_AUTHORIZATION_TIMER = "SET_AUTHORIZATION_TIMER"
const SET_USER_INFO = "SET_USER_INFO"
const SET_COMPOSITION_ID = "SET_COMPOSITION_ID"
const SET_CALL_TIMER = "SET_CALL_TIMER"
// 123


let initialState = {
    productionStages: {
        stageNumber: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
        useImg: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        imgUrls: [
            "t1",
            "t2",
            "t3",
            "t4",
            "t5",
            "t6",
            "t7",
            "t8",
            "t9",
            "t10",
            "t11",
            "t12",
            "t13",
            "t14",
            "t15"
        ],
        stageDescription: [
            "Лицевую панель обезжирить при помощи изопропилового спирта. Наклеить декоративную лицевую панель. При наклеивании следить за совпадением отверстий панелей.",
            "Смонтировать блок управления и индикации согласно требования сборочного чертежа. Ограничивать усилие при затягивнии гаек.",
            "Смонтировать переключатель согласно требования сборочного чертежа. После монтажа сборку защитить с лицевой стороны бронепленкой. Бронепленку заготавливать по трафарету. Отверстия для элементов лицевой изготовить пробойником, согласно требованиям чртежа.",
            "Смонтировать провода и разъемы переключателей согласно требований монтажной схемы.",
            "Подключить сборку к контролному устройству, протестировать работу индикаторов,  переключателей, наличие звуковых сигналов.",
            "Расположить основание педали на столе лицевой стороной вниз. При помощи отвертки устаровить ножки согласно требованиям сборочного чертежа.",
            "Расположить осование педали лицевой стороной вверх. Установить гермоввод. Продеть кабель через гермоввод. Смонтировать кабель на плату с микропереключателем. Оголенные токоведущие части на плате загерметизировать. Закрепить плату в основании согласно требованиям сборочного чертежа.",
            "Установть в основание пластиковые ограничительные винты, пружину. Установаить клавишу педали на основние, закрепить согласно требованиям сборочнго чертежа.",
            "Установить двигатель на держатель, смонтировать лицевую панель, роликовый механизм.",
            "Установить блок управления двигателя на основание согласно требованиям сборочного чертежа",
            "Смонтировать блок управления согласно требовниям сборочного чертежа.",
            "Смонтировать блок питания согласно требовниям сборочного чертежа.",
            "Расключить электические соединения согласно монтажной схеме. Подать питания, проконтролировать вращение роликового механизма.",
            "Установить кожух на сборку аппарата согласно требования сборочного чертежа, смонтировать рукоятку энкодера на лицевой панели. Контролировать нажатие кнопки энкодера.",
            "Обезжирить поверхности перед наклеванием при помощи изопропилового спирта. Наклеить шильды согласно требованиям сборочного чертежа. Серийный номер и дату производства наносить согласно маршрутной карте на изделие и паспорту.",
        ],
        stageName: [
            "Наклеивание лицевой декоративной панели",
            "Установка блока управления",
            "Монтаж переключателя",
            "Монтаж проводов",
            "Тестирование лицевой панели",
            "",
            "",
            "",
            "Сборка блока двигателя",
            "Монтаж блока двигателя",
            "Монтаж Блока управления двигателя",
            "Монтаж блока питания",
            "Расключение электрических соединений",
            "Финальная сборка аппарата в корпусе",
            "Установка шильдов, оформление документов"
        ],
        stageStartTime: [
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null
        ],
        stageEndTime: [
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null
        ],
        stageIdealDuration: [
            30,
            180,
            30,
            60,
            120,
            45,
            300,
            180,
            180,
            30,
            30,
            30,
            60,
            300,
            300,
            60
        ],
        stageDuration: [
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null
        ]
    },
    workbenchNumber: config.workbench_no,
    generalStageNumber: 1,
    stageNumber: 0,
    sessionStartTime: null,
    sessionEndTime: null,
    sessionDuration: 0,
    serverAuthorizationTimer: null,
    callTimer: null,
    userName: "test",
    userPosition: "dungeon master",
    compositionID: "1D85C6",
    socket: config.socket
}


const endoStarsReducer = (state = initialState, action) => {
    switch (action.type) {
        case NEXT_GENERAL_STAGE:
            return {
                ...state,
                productionStages: {
                    ...state.productionStages
                },
                generalStageNumber: state.generalStageNumber + 1
            }
        case SET_GENERAL_STAGE:
            // debugger;
            return {
                ...state,
                productionStages: {...state.productionStages},
                generalStageNumber: action.stageNumber
            }
        case NEXT_STAGE: {
            // Отправка запроса о завершении текущего этапа
            axios
                .post(state.socket.concat("/api/unit/").concat(state.compositionID).concat("/end"),
                    {
                        "workbench_no": state.workbenchNumber,
                        "production_stage_name": state.productionStages.stageName[state.stageNumber],
                        "additional_info": ""
                    })
                .then(response => {
                    console.log(state.productionStages.stageName[state.stageNumber].concat(".Record finished."))
                })
            // Отправка запроса о старте новой записи для следующего этапа
            if (state.stageNumber + 1 <= 14) {
                axios
                    .post(state.socket.concat("/api/unit/").concat(state.compositionID).concat("/start"),
                        {
                            "workbench_no": state.workbenchNumber,
                            "production_stage_name": state.productionStages.stageName[state.stageNumber + 1],
                            "additional_info": ""
                        })
                    .then(response => {
                        console.log(state.productionStages.stageName[state.stageNumber+1].concat(". Record started."))
                    })
            }
            return {
                ...state,
                productionStages: {
                    ...state.productionStages,
                    stageStartTime: state.productionStages.stageStartTime.map((item, index) => {
                        if (index === state.stageNumber + 1) {
                            item = new Date()
                        }
                        return item
                    }),
                    stageEndTime: state.productionStages.stageEndTime.map((item, index) => {
                        if (index === state.stageNumber) {
                            item = state.productionStages.stageStartTime[index].getTime() + state.productionStages.stageDuration[index]
                        }
                        return item
                    })
                },
                stageNumber: state.stageNumber + 1
            }
        }
        case PREVIOUS_STAGE: {
            return {
                ...state,
                productionStages: {
                    ...state.productionStages
                },
                stageNumber: state.stageNumber - 1
            }
        }
        case CANCEL_WORK:
            return {
                ...state,
                productionStages: {...state.productionStages},
                generalStageNumber: 0
            }
        case STAR_SESSION:
            return {
                ...state,
                productionStages: {...state.productionStages},
                sessionStartTime: +new Date() - 1000
            }
        case END_SESSION:
            return {
                ...state,
                productionStages: {...state.productionStages},
                sessionEndTime: +new Date()
            }
        case SET_STAGE_START_TIME:
            // debugger
            return {
                ...state,
                productionStages: {
                    ...state.productionStages,
                    stageStartTime: state.productionStages.stageStartTime.map((item, index) => {
                        if (index === action.stageNumber) {
                            // console.log("changing id: " + index)
                            item = new Date()
                        }
                        return item
                    })
                }
            }
        case COUNT_STAGE_DURATION:
            return {
                ...state,
                productionStages: {
                    ...state.productionStages,
                    stageDuration: state.productionStages.stageDuration.map((item, index) => {
                        if (index === action.stageNumber) {
                            // console.log("counting duration")
                            item = +new Date() - state.productionStages.stageStartTime[action.stageNumber]
                        }
                        return item
                    })
                }
            }
        case COUNT_SESSION_DURATION:
            return {
                ...state,
                productionStages: {
                    ...state.productionStages
                },
                sessionDuration: +new Date() - state.sessionStartTime
            }
        case SET_AUTHORIZATION_TIMER:
            return {
                ...state,
                productionStages: {...state.productionStages},
                serverAuthorizationTimer: action.timer
            }
        case SET_CALL_TIMER:
            return {
                ...state,
                productionStages: {...state.productionStages},
                callTimer: action.timer
            }
        case SET_USER_INFO:
            return {
                ...state,
                productionStages: {
                    ...state.productionStages
                },
                userName: action.userName,
                userPosition: action.userPosition
            }
        case SET_COMPOSITION_ID: {
            return {
                ...state,
                productionStages: {...state.productionStages},
                compositionID: action.ID
            }
        }
        default:
            // console.log({
            //     ...state,
            //     productionStages: {
            //         ...state.productionStages
            //     }
            // })
            return {
                ...state,
                productionStages: {
                    ...state.productionStages
                }
            }
    }
}


export const setCallTimer = (timer) => ({type: SET_CALL_TIMER, timer: timer})
export const setUserInfo = (name, position) => ({type: SET_USER_INFO, userName: name, userPosition: position})
export const setCompositionID = (ID) => ({type: SET_COMPOSITION_ID, ID: ID})
export const setAuthorizationTimer = (timer) => ({type: SET_AUTHORIZATION_TIMER, timer: timer})
export const startSession = () => ({type: STAR_SESSION})
export const endSession = () => ({type: END_SESSION})
export const countSessionDuration = () => ({type: COUNT_SESSION_DURATION})

export const setGeneralStage = (e) => ({type: SET_GENERAL_STAGE, stageNumber: e})
export const nextGeneralStage = () => ({type: NEXT_GENERAL_STAGE})

export const nextStage = () => ({type: NEXT_STAGE})
export const previousStage = () => ({type: PREVIOUS_STAGE})
export const cancelWork = () => ({type: CANCEL_WORK})

export const setStageStartTime = (e) => ({type: SET_STAGE_START_TIME, stageNumber: e})
export const countStageDuration = (e) => ({type: COUNT_STAGE_DURATION, stageNumber: e})

export default endoStarsReducer