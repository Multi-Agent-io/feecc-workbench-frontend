import {connect} from "react-redux";
import FourthStage from "./FourthStage";
import {toStageZero} from "../../../redux/reducers/productParametersReducer";

let mapStateToProps = (state) => {
    return {
        isPrinted: state.productParameters.printingIsDone
    }
}

let mapDispatchToProps = (dispatch) => {
    return {
        goToStart: () => {
            dispatch(toStageZero())
        }

    }
}

const FourthStageContainer = connect(mapStateToProps, mapDispatchToProps)(FourthStage)

export default FourthStageContainer