const NEXT_STAGE = "NEXT_STAGE"
const NEXT_GENERAL_STAGE = "NEXT_GENERAL_STAGE"
const SET_GENERAL_STAGE = "SET_GENERAL_STAGE"
const PREVIOUS_STAGE = "PREVIOUS_STAGE"
const STAR_SESSION = "STAR_SESSION"
const END_SESSION = "END_SESSION"
const CANCEL_WORK = "CANCEL_WORK"
    // 123
let initialState = {
    productionStages: {
        stageNumber: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
        useImg: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
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
            "s1 description",
            "s2 description",
            "s3 description",
            "s4 description",
            "s5 description",
            "s6 description",
            "s7 description",
            "s8 description",
            "s9 description",
            "s10 description",
            "s11 description",
            "s12 description",
            "s13 description",
            "s14 description",
            "s15 description",
        ],
        stageStartTime: [16],
        stageEndTime: [16],

    },
    generalStageNumber: 1,
    stageNumber: 0,
    sessionStartTime: null,
    sessionEndTime: null
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
            return {
                ...state,
                productionStages: {
                    ...state.productionStages
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
                sessionStartTime: + new Date()
            }
        case END_SESSION:
            return {
                ...state,
                productionStages: {...state.productionStages},
                sessionEndTime: + new Date()
            }
        default:
            // debugger;
            console.log({
                ...state,
                productionStages: {
                    ...state.productionStages
                }
            })
            return {
                ...state,
                productionStages: {
                    ...state.productionStages
                }
            }
    }
}

export const startSession = () => ({type: STAR_SESSION})
export const endSession = () => ({type: END_SESSION})

export const setGeneralStage = (e) => ({type: SET_GENERAL_STAGE, stageNumber: e})
export const nextGeneralStage = () => ({type: NEXT_GENERAL_STAGE})

export const nextStage = () => ({type: NEXT_STAGE})
export const previousStage = () => ({type: PREVIOUS_STAGE})
export const cancelWork = () => ({type: CANCEL_WORK})

export default endoStarsReducer