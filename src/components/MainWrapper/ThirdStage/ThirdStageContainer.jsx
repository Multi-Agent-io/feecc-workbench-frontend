import {connect} from "react-redux";
// import from "../../../redux/reducers/productParametersReducer";
import ThirdStage from "./ThirdStage";
import {timerTick, timerToZero, toStageFour} from "../../../redux/reducers/Geoscan/productParametersReducer";
import {nextGeneralStage} from "../../../redux/reducers/EndoStars/endoStarsReducer";

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
            dispatch(nextGeneralStage())
        }

    }
}

const ThirdStageContainer = connect(mapStateToProps, mapDispatchToProps)(ThirdStage)

export default ThirdStageContainer