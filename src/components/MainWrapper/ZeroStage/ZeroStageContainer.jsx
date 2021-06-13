import {connect} from "react-redux";
import ZeroStage from "./ZeroStage";
import {
    nextGeneralStage,
    setAuthorizationTimer, setCompositionID, setUserName, startSession
} from "../../../redux/reducers/EndoStars/endoStarsReducer";

let mapStateToProps = (state) => {
    return {
        stageNumber: state.endoStars.generalStageNumber,
        timer: state.endoStars.serverAuthorizationTimer
    }
}

let mapDispatchToProps = (dispatch) => {
    return {
        nextGeneralStage: () => {
            // debugger;
            dispatch(nextGeneralStage())
        },
        setTimer: (timer) => {
            dispatch(setAuthorizationTimer(timer))
        },
        setUserInfo: (userName) => {
            dispatch(setUserName(userName))
        },
        setCompositionID: (ID) => {
            dispatch(setCompositionID(ID))
        },
        startSession: () => {
            dispatch(startSession())
        }
    }
}

const ZeroStageContainer = connect(mapStateToProps, mapDispatchToProps)(ZeroStage)

export default ZeroStageContainer