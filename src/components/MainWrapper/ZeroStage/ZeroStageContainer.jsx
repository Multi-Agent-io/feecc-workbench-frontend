import {connect} from "react-redux";
import ZeroStage from "./ZeroStage";
import {nextGeneralStage} from "../../../redux/reducers/EndoStars/endoStarsReducer";

let mapStateToProps = (state) => {
    return {
        stageNumber: state.endoStars.generalStageNumber,
    }
}

let mapDispatchToProps = (dispatch) => {
    return {
        nextStage: () => {
            // debugger;
            dispatch(nextGeneralStage())
        }
    }
}

const ZeroStageContainer = connect(mapStateToProps, mapDispatchToProps)(ZeroStage)

export default ZeroStageContainer