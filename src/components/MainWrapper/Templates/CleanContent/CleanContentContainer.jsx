import {connect} from "react-redux";
import CleanContent from "./CleanContent";
import {
    countStageDuration,
    setCallTimer, setGeneralStage,
    setStageStartTime
} from "../../../../redux/reducers/EndoStars/endoStarsReducer";

let mapStateToProps = (state) => {
    // debugger
    return {
        socket: state.endoStars.socket,
        useImg: state.endoStars.productionStages.useImg[state.endoStars.stageNumber],
        imgUrl: state.endoStars.productionStages.imgUrls[state.endoStars.stageNumber],
        stageDescription: state.endoStars.productionStages.stageDescription[state.endoStars.stageNumber],
        stageIdealDuration: state.endoStars.productionStages.stageIdealDuration[state.endoStars.stageNumber],
        startTime: state.endoStars.productionStages.stageStartTime[state.endoStars.stageNumber],
        endTime: state.endoStars.productionStages.stageEndTime[state.endoStars.stageNumber],
        stageNumber: state.endoStars.stageNumber,
        generalStageNumber: state.endoStars.generalStageNumber,
        timer: state.endoStars.callTimer,
        stageDuration: state.endoStars.productionStages.stageDuration[state.endoStars.stageNumber],
        unitInternalID: state.endoStars.compositionID
    }
}

let mapDispatchToProps = (dispatch) => {
    return {
        setStageStartTime: (stageNumber) => {
            dispatch(setStageStartTime(stageNumber))
        },
        countStageDuration: (stageNumber) => {
            dispatch(countStageDuration(stageNumber))
        },
        setCallTimer: (timer) => {
            dispatch(setCallTimer(timer))
        },
        setGeneralStage: (stageNumber) => {
            dispatch(setGeneralStage(stageNumber))
        }

    }
}

const CleanContentContainer = connect(mapStateToProps, mapDispatchToProps)(CleanContent)

export default CleanContentContainer