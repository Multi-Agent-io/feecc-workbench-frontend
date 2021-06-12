import MainWrapper from "./MainWrapper";
import {connect} from "react-redux";
import {
    cancelWork,
    nextGeneralStage,
    nextStage,
    previousStage,
    setGeneralStage
} from "../../redux/reducers/EndoStars/endoStarsReducer";

let mapStateToProps = (state) => {
    // debugger;
    // console.log(state.endoStars)
    return {
        endoStars: state.endoStars
        // stageNumber: state.productParameters.stageCounter,
        // firstStage: state.productParameters.firstStage,
        // secondStage: state.productParameters.secondStage
    }
}

let mapDispatchToProps = (dispatch) => {
    return {
        nextGeneralStage: () => {
          dispatch(nextGeneralStage())
        },
        setGeneralStageNumber: (e) => {
            dispatch(setGeneralStage(e))
        },
        nextStage: () => {
            dispatch(nextStage())
        },
        previousStage: () => {
            dispatch(previousStage())
        },
        cancelWork: () => {
            dispatch(cancelWork())
        }
    }
}

const MainWrapperContainer = connect(mapStateToProps, mapDispatchToProps)(MainWrapper)

export default MainWrapperContainer