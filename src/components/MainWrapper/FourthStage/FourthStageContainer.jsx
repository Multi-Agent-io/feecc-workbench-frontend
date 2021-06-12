import {connect} from "react-redux";
import FourthStage from "./FourthStage";
import {toStageZero} from "../../../redux/reducers/Geoscan/productParametersReducer";
import {setGeneralStage} from "../../../redux/reducers/EndoStars/endoStarsReducer";

let mapStateToProps = (state) => {
    return {
        isPrinted: state.productParameters.printingIsDone
    }
}

let mapDispatchToProps = (dispatch) => {
    return {
        goToStart: () => {
            dispatch(setGeneralStage(0))
        }

    }
}

const FourthStageContainer = connect(mapStateToProps, mapDispatchToProps)(FourthStage)

export default FourthStageContainer