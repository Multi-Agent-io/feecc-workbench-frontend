import config from "../../../configs/configs.json"

const NEXT_PAGE = "go_to_next_step"
const FINISH_COMPOSITION = "finish_composition_and_send_request"
const SET_TIMER = "set_stage_composition_timer"
const SET_STAGE_START = "set_composition_stage_start_time"
const COUNT_STAGE_DURATION = "count_composition_stage_duration"
const SET_COMPOSITION_TIMER = "set_composition_counting_timer"
const COUNT_COMPOSITION_DURATION = "count_full_composition_duration"
const START_COMPOSITION = "start_composition"

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
    generalStageNumber: 0,
    currentPageNumber: 0,
    socket: config.socket,
    stageTimer: null, // Переменная дла хранения таймера, который будет убиваться
                      // при переходе на новый этап производства
    compositionTimer: null,
}

const endoReducer = (state = initialState, action) => {
    switch (action.type) {
        case NEXT_PAGE:
            // axios
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
            return {
                ...state,
                pages: state.pages,
                compositionDuration: new Date() - state.compositionStartTime
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
            // console.log("counting")
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
            return {
                ...state,

            }
            default:
            return {
                ...state,
                pages: state.pages
            }
    }
}


export default endoReducer

export const startCompostion = () => ({type: START_COMPOSITION})
export const nextPage = () => ({type: NEXT_PAGE})
export const finishComposition = () => ({type: FINISH_COMPOSITION})
export const setTimer = (timer) => ({type: SET_TIMER, timer: timer})
export const setStageStartTime = () => ({type: SET_STAGE_START})
export const countStageDuration = () => ({type: COUNT_STAGE_DURATION})
export const setCompositionTimer = (timer) => ({type: SET_COMPOSITION_TIMER, timer: timer})
export const countCompositionDuration = () => ({type: COUNT_COMPOSITION_DURATION})