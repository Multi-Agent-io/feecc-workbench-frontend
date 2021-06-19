import {connect} from "react-redux";
import FourthStage from "./FourthStage";
// import {toStageZero} from "../../../redux/reducers/Geoscan/productParametersReducer";
import {setCallTimer, setGeneralStage} from "../../../redux/reducers/EndoStars/endoStarsReducer";

let mapStateToProps = (state) => {
    return {
        timer: state.endoStars.callTimer
        // isPrinted: state.productParameters.printingIsDone
    }
}

let mapDispatchToProps = (dispatch) => {
    return {
        goToStart: () => {
            dispatch(setGeneralStage(0))
        },
        setCallTimer: (timer) => {
            dispatch(setCallTimer(timer))
        }

    }
}

const FourthStageContainer = connect(mapStateToProps, mapDispatchToProps)(FourthStage)

export default FourthStageContainer