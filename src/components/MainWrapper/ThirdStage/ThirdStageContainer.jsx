import {connect} from "react-redux";
// import from "../../../redux/reducers/productParametersReducer";
import ThirdStage from "./ThirdStage";
import {timerTick, timerToZero, toStageFour} from "../../../redux/reducers/productParametersReducer";

let mapStateToProps = (state) => {
    return {
        startTime: state.productParameters.startTime,
        compositionDuration: state.productParameters.compositionDuration
    }
}

let mapDispatchToProps = (dispatch) => {
    return {
        timerTick: () => {
            dispatch(timerTick())
        },
        timerToZero: () => {
            dispatch(timerToZero())
        },
        finishComposition: () => {
            dispatch(toStageFour())
        }

    }
}

const ThirdStageContainer = connect(mapStateToProps, mapDispatchToProps)(ThirdStage)

export default ThirdStageContainer