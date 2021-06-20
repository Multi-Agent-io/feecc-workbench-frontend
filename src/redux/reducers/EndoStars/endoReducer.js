import config from "../../../configs/configs.json"
import axios from "axios";

const NEXT_PAGE = "go_to_next_step"
const FINISH_COMPOSITION = "finish_composition_and_send_request"
const SET_TIMER = "set_stage_composition_timer"
const SET_STAGE_START = "set_composition_stage_start_time"
const COUNT_STAGE_DURATION = "count_composition_stage_duration"
const SET_COMPOSITION_TIMER = "set_composition_counting_timer"
const COUNT_COMPOSITION_DURATION = "count_full_composition_duration"
const START_COMPOSITION = "start_composition"
const SET_COMPOSITION_ID = "set_composition_id_from_server"
const SET_USER_INFO = "set_user_info_and_position"
const SET_PRINT_TIMER = "set_printed_check_timer"
const SET_PAGES = "set_pages_via_papaparser"


let initialState = {
    pages: [
        {
            header: "Название этапа производства",
            context: "Описание этапа производства",
            startTime: null,
            endTime: null,
            duration: null,
            idealDuration: 365, // В секундах
        },
        {
            header: "Название этапа производства 2",
            context: "Описание этапа производства 2",
            startTime: null,
            endTime: null,
            duration: null,
            idealDuration: 3651, // В секундах
        },
        {
            header: "Название этапа производства 3",
            context: "Описание этапа производства 3",
            startTime: null,
            endTime: null,
            duration: null,
            idealDuration: 265, // В секундах
        }
    ],
    users: [
        {
            name: "Fucking",
            surname: "slave",
            position: "dungeon master"
        }
    ],
    userNumber: 0,
    workbenchNumber: 0,
    compositionID: "88005553535",
    compositionStartTime: null,
    compositionEndTime: null,
    compositionDuration: null,
    compositionIdealDuration: 6000, // В секундах
    generalStageNumber: 1,
    currentPageNumber: 0,
    socket: config.socket,
    stageTimer: null, // Переменная дла хранения таймера, который будет убиваться
                      // при переходе на новый этап производства
    compositionTimer: null,
    printTimer: null
}

const endoReducer = (state = initialState, action) => {
    switch (action.type) {
        case NEXT_PAGE:
            // Остановить запись предыдущего этапа
            axios
                .post(state.socket.concat("/api/unit/").concat(state.compositionID).concat("/end"),
                    {
                        "workbench_no": state.workbenchNumber
                    })
                .then((response) => {
                    console.log(response.data)
                })
            // начать запись производства следующего этапа
            axios
                .post(state.socket.concat("/api/unit/").concat(state.compositionID).concat("/start"),
                    {
                        "workbench_no": state.workbenchNumber,
                        "product_stage_name": state.pages[state.currentPageNumber].header
                    })
                .then((response) => {
                    console.log(response.data)
                })
            return {
                ...state,
                pages: state.pages.map((item, index) => {
                    if (index === state.currentPageNumber) {
                        item.endTime = new Date()
                        item.duration = item.endTime - item.startTime
                    }
                    return item
                }),
                currentPageNumber: state.currentPageNumber + 1
            }
        case FINISH_COMPOSITION:
            clearInterval(state.stageTimer)
            clearInterval(state.compositionTimer)
            // Закончить запись последнего этапа производства
            axios
                .post(state.socket.concat("/api/unit/").concat(state.compositionID).concat("/end"),
                    {
                        "workbench_no": state.workbenchNumber
                    })
                .then((response) => {
                    console.log(response.data)
                })
            // Закончить всю сборку
            axios
                .post(state.socket.concat("/api/unit/").concat(state.compositionID).concat("/upload"),
                    {
                        "workbench_no": state.workbenchNumber
                    })
                .then((response) => {
                    console.log(response.data)
                })

            return {
                ...state,
                pages: state.pages.map((item, index) => {
                    if (index === state.currentPageNumber) {
                        item.endTime = new Date()
                        item.duration = item.endTime - item.startTime
                    }
                    return item
                }),
                // currentPageNumber: state.currentPageNumber,
                generalStageNumber: state.generalStageNumber + 1
            }
        case SET_TIMER:
            return {
                ...state,
                pages: state.pages,
                stageTimer: action.timer
            }
        case SET_COMPOSITION_TIMER:
            return {
                ...state,
                pages: state.pages,
                compositionTimer: action.timer
            }
        case COUNT_COMPOSITION_DURATION:
            // console.log("counting full duration")
            if (state.generalStageNumber !== 2) {
                return {
                    ...state,
                    pages: state.pages,
                    compositionDuration: new Date() - state.compositionStartTime
                }
            } else {
                // console.log("cleaning")
                clearInterval(state.compositionTimer)
                return {
                    ...state,
                    pages: state.pages
                }
            }
        case SET_STAGE_START:
            return {
                ...state,
                pages: state.pages.map((item, index) => {
                    if (index === state.currentPageNumber) {
                        item.startTime = new Date()
                    }
                    return item
                })
            }
        case COUNT_STAGE_DURATION:
            // console.log("stage tick")
            return {
                ...state,
                pages: state.pages.map((item, index) => {
                    if (index === state.currentPageNumber) {
                        item.duration = new Date() - item.startTime
                    }
                    return item
                })
            }
        case START_COMPOSITION:
            clearInterval(state.compositionTimer)
            // Начать запись первого этапа роизводства. Остальные записываются и останавливаются NEXT_PAGE
            axios
                .post(state.socket.concat("/api/unit/").concat(state.compositionID).concat("/start"),
                    {
                        "workbench_no": state.workbenchNumber,
                        "product_stage_name": state.pages[state.currentPageNumber].header
                    })
            return {
                ...state,
                pages: state.pages,
                compositionStartTime: new Date(),
                generalStageNumber: state.generalStageNumber + 1
            }
        case SET_COMPOSITION_ID:
            return {
                ...state,
                pages: state.pages,
                compositionID: action.ID
            }
        case SET_USER_INFO:
            return {
                ...state,
                pages: state.pages,
                users: state.users.map((item, index) => {
                    if (index === action.userNumber) {
                        item.position = action.position
                        item.name = action.name
                        item.surname = action.surname
                    }
                    return item
                })
            }
        case SET_PRINT_TIMER:
            return {
                ...state,
                pages: state.pages,
                printTimer: action.timer
            }
        case SET_PAGES:
            // console.log(action.pages.data.slice())
            return {
                ...state,
                pages: action.pages.data.slice()
            }
        default:
            return {
                ...state,
                pages: state.pages
            }
    }
}


export default endoReducer

export const startComposition = () => ({type: START_COMPOSITION})
export const nextPage = () => ({type: NEXT_PAGE})
export const finishComposition = () => ({type: FINISH_COMPOSITION})
export const setTimer = (timer) => ({type: SET_TIMER, timer: timer})
export const setStageStartTime = () => ({type: SET_STAGE_START})
export const countStageDuration = () => ({type: COUNT_STAGE_DURATION})
export const setCompositionTimer = (timer) => ({type: SET_COMPOSITION_TIMER, timer: timer})
export const countCompositionDuration = () => ({type: COUNT_COMPOSITION_DURATION})
export const setCompositionID = (ID) => ({type: SET_COMPOSITION_ID, ID: ID})
export const setUserInfo = (name, surname, position, userNumber) => ({
    type: SET_USER_INFO,
    name: name,
    surname: surname,
    position: position,
    userNumber: userNumber
})
export const setPrintTimer = (timer) => ({type: SET_PRINT_TIMER, timer: timer})
export const setPages = (pages) => ({type: SET_PAGES, pages: pages})
