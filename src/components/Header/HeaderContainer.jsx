import {connect} from "react-redux";
import Header from "./Header";
import {countSessionDuration} from "../../redux/reducers/EndoStars/endoStarsReducer";

let mapStateToProps = (state) => {
    return {
        generalStageNumber: state.endoStars.generalStageNumber,
        userName: "Test User",
        sessionStartTime: state.endoStars.sessionStartTime,
        sessionDuration: state.endoStars.sessionDuration,
        stageNumber: state.endoStars.stageNumber,
        compositionID: state.endoStars.compositionID
    }
}

let mapDispatchToProps = (dispatch) => {
    return {
        countSessionDuration: () => {
            dispatch(countSessionDuration())
        }
    }
}

const HeaderContainer = connect(mapStateToProps, mapDispatchToProps)(Header)

export default HeaderContainer