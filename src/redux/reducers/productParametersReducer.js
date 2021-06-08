import axios from "axios";
import ledModuleImg from "../../static/images/led-module.jpg"
import camModuleImg from "../../static/images/fpv.jpg"
import grabModuleImg from "../../static/images/cargo.jpg"
import internalNavigationImg from "../../static/images/lpsmodule.jpg"
import globalNavigationImg from "../../static/images/gps.jpg"
import programmableCamImg from "../../static/images/openmv.jpg"
import usbRadioImg from "../../static/images/modem.jpg"
import irNavigationImg from "../../static/images/irmodule.jpg"
import expansionModuleImg from "../../static/images/adapter.jpg"
import fpvTransmitterImg from "../../static/images/fpv-transmitter.jpg"
import fpvGlassesImg from "../../static/images/fpv-glass.jpg"

const NEXT_STAGE = "NEXT_STAGE"
const PREVIOUS_STAGE = "PREVIOUS_STAGE"
const SET_MODEL = "SET_MODEL"
const SET_STAGE = "SET_STAGE"
const SET_REPAIR_KIT = "SET_REPAIR_KIT"
const TO_STAGE_ZERO = "TO_STAGE_ZERO"
const TO_STAGE_ONE = "TO_STAGE_ONE"
const TO_STAGE_TWO = "TO_STAGE_TWO"
const TO_STAGE_THREE = "TO_STAGE_THREE"
const TO_STAGE_FOUR = "TO_STAGE_FOUR"
const CANCEL = "CANCEL"

const LED_SWITCH = "LED_SWITCH"
const CAM_MODULE_SWITCH = "CAM_MODULE_SWITCH"
const GRAB_SWITCH = "GRAB_SWITCH"
const INTERNAL_NAV_SWITCH = "INTERNAL_NAV_SWITCH"
const GLOBAL_NAV_SWITCH = "GLOBAL_NAV_SWITCH"
const PROGRAMMABLE_CAM_SWITCH = "PROGRAMMABLE_CAM_SWITCH"
const EXPANSION_SWITCH = "EXPANSION_SWITCH"
const USB_RADIO_SWITCH = "USB_RADIO_SWITCH"
const FPV_TRANS_SWITCH = "FPV_TRANS_SWITCH"
const FPV_GLASSES_SWITCH = "FPV_GLASSES_SWITCH"

const TIMER_TICK = "TIMER_TICK"
const TIMER_TO_ZERO = "TIMER_TO_ZERO"
let initialState = {
    firstStage: {
        deviceModel: null,
        productionStage: null,
        repairKitPioner: null
    },
    secondStage: {
        ledModule: {
            imgSrc: ledModuleImg,
            name: "LED-модуль",
            isChosen: false
        },
        camModule: {
            imgSrc: camModuleImg,
            name: "Камера для фото и видеосъемки",
            isChosen: false
        },
        grabModule: {
            imgSrc: grabModuleImg,
            name: "Модуль захвата груза",
            isChosen: false
        },
        internalNavigation: {
            imgSrc: internalNavigationImg,
            name: "Бортовой модульнавигации в помещении",
            isChosen: false
        },
        globalNavigation: {
            imgSrc: globalNavigationImg,
            name: "Модуль навигации GPS/ГЛОНАСС",
            isChosen: false
        },
        programmableCam: {
            imgSrc: programmableCamImg,
            name: "Программируемая камера OpenMV",
            isChosen: false
        },
        usbRadio: {
            imgSrc: usbRadioImg,
            name: "USB радиомодем",
            isChosen: false
        },
        irNavigation: {
            imgSrc: irNavigationImg,
            name: "Модуль ИК навигации",
            isChosen: false
        },
        expansionModule: {
            imgSrc: expansionModuleImg,
            name: "Плата подключения дополнительных модулей",
            isChosen: false
        },
        fpvTransmitter: {
            imgSrc: fpvTransmitterImg,
            name: "FPV передатчик",
            isChosen: false
        },
        fpvGlasses: {
            imgSrc: fpvGlassesImg,
            name: "FPV очки",
            isChosen: false
        }
    },
    stageCounter: 2,
    authorization: false,
    startTime: null,
    endTime: null,
    compositionDuration: 0,
    printingIsDone: true
}

const productParametersReducer = (state = initialState, action) => {
    switch (action.type) {
        case NEXT_STAGE:
            if (state.stageCounter < 2) {
                debugger;
                return {
                    ...state,
                    firstStage: state.firstStage,
                    secondStage: state.secondStage,
                    stageCounter: state.stageCounter + 1
                }
            } else {
                return {...state, firstStage: state.firstStage, secondStage: state.secondStage}
            }
        case PREVIOUS_STAGE:
            if (state.stageCounter > 0) {
                return {
                    ...state,
                    firstStage: state.firstStage,
                    secondStage: state.secondStage,
                    stageCounter: state.stageCounter - 1
                }
            } else {
                return {...state, firstStage: state.firstStage, secondStage: state.secondStage}
            }
        case SET_MODEL:
            return {
                ...state,
                firstStage: {
                    deviceModel: action.data.target.value,
                    productionStage: state.firstStage.productionStage,
                    repairComplectPioner: state.firstStage.repairComplectPioner
                },
                secondStage: state.secondStage
            }
        case SET_STAGE:
            return {
                ...state,
                firstStage: {
                    deviceModel: state.firstStage.deviceModel,
                    productionStage: action.data.target.value,
                    repairKitPioner: state.firstStage.repairComplectPioner
                },
                secondStage: state.secondStage
            }
        case SET_REPAIR_KIT:
            return {
                ...state,
                firstStage: {
                    deviceModel: state.firstStage.deviceModel,
                    productionStage: state.firstStage.productionStage,
                    repairKitPioner: action.data.target.value
                },
                secondStage: state.secondStage
            }
        case TO_STAGE_ZERO:
            return {
                ...state,
                stageCounter: 0,
                endTime: 0,
                startTime: 0
            }
        case TO_STAGE_ONE:
            return {
                ...state,
                stageCounter: 1
            }
        case TO_STAGE_TWO:
            // axios.post
            // debugger;
            return {
                ...state,
                firstStage: state.firstStage,
                secondStage: state.secondStage,
                stageCounter: 2
            }
        case TO_STAGE_THREE:
            // axios.post
            return {
                ...state,
                firstStage: state.firstStage,
                secondStage: state.secondStage,
                stageCounter: 3,
                startTime: new Date()
            }
        case TO_STAGE_FOUR:
            return {
                ...state,
                firstStage: state.firstStage,
                secondStage: state.secondStage,
                stageCounter: 4,
                endTime: state.startTime + state.compositionDuration
            }
        case CANCEL:
            // axios.
            return {
                ...state,
                firstStage: state.firstStage,
                secondStage: state.secondStage,
                stageCounter: 0
            }

        case LED_SWITCH :
            return {
                ...state,
                firstStage: state.firstStage,
                secondStage: {
                    ...state.secondStage,
                    ledModule: {
                        ...state.secondStage.ledModule,
                        isChosen: !state.secondStage.ledModule.isChosen
                    }
                }
            }
        case CAM_MODULE_SWITCH :
            return {
                ...state,
                firstStage: state.firstStage,
                secondStage: {
                    ...state.secondStage,
                    camModule: {
                        ...state.secondStage.camModule,
                        isChosen: !state.secondStage.camModule.isChosen
                    }
                }
            }
        case GRAB_SWITCH :
            return {
                ...state,
                firstStage: state.firstStage,
                secondStage: {
                    ...state.secondStage,
                    grabModule: {
                        ...state.secondStage.grabModule,
                        isChosen: !state.secondStage.grabModule.isChosen
                    }
                }
            }
        case INTERNAL_NAV_SWITCH :
            return {
                ...state,
                firstStage: state.firstStage,
                secondStage: {
                    ...state.secondStage,
                    internalNavigation: {
                        ...state.secondStage.internalNavigation,
                        isChosen: !state.secondStage.internalNavigation.isChosen
                    }
                }
            }
        case GLOBAL_NAV_SWITCH :
            return {
                ...state,
                firstStage: state.firstStage,
                secondStage: {
                    ...state.secondStage,
                    globalNavigation: {
                        ...state.secondStage.globalNavigation,
                        isChosen: !state.secondStage.globalNavigation.isChosen
                    }
                }
            }
        case PROGRAMMABLE_CAM_SWITCH :
            return {
                ...state,
                firstStage: state.firstStage,
                secondStage: {
                    ...state.secondStage,
                    programmableCam: {
                        ...state.secondStage.programmableCam,
                        isChosen: !state.secondStage.programmableCam.isChosen
                    }
                }
            }
        case USB_RADIO_SWITCH :
            return {
                ...state,
                firstStage: state.firstStage,
                secondStage: {
                    ...state.secondStage,
                    usbRadio: {
                        ...state.secondStage.usbRadio,
                        isChosen: !state.secondStage.usbRadio.isChosen
                    }
                }
            }
        case EXPANSION_SWITCH :
            return {
                ...state,
                firstStage: state.firstStage,
                secondStage: {
                    ...state.secondStage,
                    expansionModule: {
                        ...state.secondStage.expansionModule,
                        isChosen: !state.secondStage.expansionModule.isChosen
                    }
                }
            }
        case FPV_TRANS_SWITCH :
            return {
                ...state,
                firstStage: state.firstStage,
                secondStage: {
                    ...state.secondStage,
                    fpvTransmitter: {
                        ...state.secondStage.fpvTransmitter,
                        isChosen: !state.secondStage.fpvTransmitter.isChosen
                    }
                }
            }
        case FPV_GLASSES_SWITCH :
            debugger;
            return {
                ...state,
                firstStage: state.firstStage,
                secondStage: {
                    ...state.secondStage,
                    fpvGlasses: {
                        ...state.secondStage.fpvGlasses,
                        isChosen: !state.secondStage.fpvGlasses.isChosen
                    }
                }
            }
        case TIMER_TICK:
            return {
                ...state,
                firstStage: state.firstStage,
                secondStage: state.secondStage,
                compositionDuration: state.compositionDuration + 1
            }
        case TIMER_TO_ZERO:
            return {
                ...state,
                firstStage: state.firstStage,
                secondStage: state.secondStage,
                compositionDuration: 0
            }
        default: {
            return {
                ...state,
                firstStage: state.firstStage,
                secondStage: state.secondStage
            }
        }
    }
}

export const nextStage = () => ({type: NEXT_STAGE})
export const toStageZero = () => ({type: TO_STAGE_ZERO})
export const toStageOne = () => ({type: TO_STAGE_ONE})
export const toStageTwo = () => ({type: TO_STAGE_TWO})
export const toStageThree = () => ({type: TO_STAGE_THREE})
export const toStageFour = () => ({type: TO_STAGE_FOUR})
export const cancelWork = () => ({type: CANCEL})
export const previousStage = () => ({type: PREVIOUS_STAGE})
export const setMode = (e) => ({type: SET_MODEL, data: e})
export const setStage = (e) => ({type: SET_STAGE, data: e})
export const setRepairKit = (e) => ({type: SET_REPAIR_KIT, data: e})

export const ledSwitch = () => ({type: LED_SWITCH})
export const camModuleSwitch = () => ({type: CAM_MODULE_SWITCH})
export const grabModuleSwitch = () => ({type: GRAB_SWITCH})
export const internalNavigationSwitch = () => ({type: INTERNAL_NAV_SWITCH})
export const globalNavigationSwitch = () => ({type: GLOBAL_NAV_SWITCH})
export const programmableCamSwitch = () => ({type: PROGRAMMABLE_CAM_SWITCH})
export const usbRadioSwitch = () => ({type: USB_RADIO_SWITCH})
export const expansionModuleSwitch = () => ({type: EXPANSION_SWITCH})
export const fpvTransmitterSwitch = () => ({type: FPV_TRANS_SWITCH})
export const fpvGlassesSwitch = () => ({type: FPV_GLASSES_SWITCH})

export const timerTick = () => ({type: TIMER_TICK})
export const timerToZero = () => ({type: TIMER_TO_ZERO})
export default productParametersReducer