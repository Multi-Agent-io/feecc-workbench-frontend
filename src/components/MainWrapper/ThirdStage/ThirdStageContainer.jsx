import {connect} from "react-redux";
import ThirdStage from "./ThirdStage";
import {timerTick, timerToZero} from "../../../redux/reducers/Geoscan/productParametersReducer";
import {nextGeneralStage, setCallTimer} from "../../../redux/reducers/EndoStars/endoStarsReducer";

let mapStateToProps = (state) => {
    return {
        startTime: state.endoStars.sessionStartTime,
        sessionDuration: state.endoStars.sessionDuration,
        timer: state.endoStars.callTimer
    }
}

let mapDispatchToProps = (dispatch) => {
    return {
        finishComposition: () => {
            dispatch(nextGeneralStage())
        },
        setCallTimer: (timer) => {
            dispatch(setCallTimer(timer))
        }

    }
}

const ThirdStageContainer = connect(mapStateToProps, mapDispatchToProps)(ThirdStage)

export default ThirdStageContainer