import MainWrapper from "./MainWrapper";
import {connect} from "react-redux";

let mapStateToProps = (state) => {
    return {
        stageNumber: state.productParameters.stageCounter,
        firstStage: state.productParameters.firstStage,
        secondStage: state.productParameters.secondStage
    }
}

let mapDispatchToProps = (dispatch) => {
    return {

    }
}

const MainWrapperContainer = connect(mapStateToProps, mapDispatchToProps)(MainWrapper)

export default MainWrapperContainer