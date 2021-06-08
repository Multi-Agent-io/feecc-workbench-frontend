import {connect} from "react-redux";
import {nextStage} from "../../../redux/reducers/productParametersReducer";
import ZeroStage from "./ZeroStage";

let mapStateToProps = (state) => {
    return {
        stageNumber: state.productParameters.stageCounter,
        authorization: state.productParameters.authorization
    }
}

let mapDispatchToProps = (dispatch) => {
    return {
        nextStage: () => {
            // debugger;
            dispatch(nextStage())
        }
    }
}

const ZeroStageContainer = connect(mapStateToProps, mapDispatchToProps)(ZeroStage)

export default ZeroStageContainer