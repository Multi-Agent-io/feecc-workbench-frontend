import {connect} from "react-redux";
import {
    cancelWork,
    // nextStage,
    setMode,
    setRepairKit,
    setStage,
    toStageTwo
} from "../../../../redux/reducers/Geoscan/productParametersReducer";
import FirstStage from "./FirstStage";

let mapStateToProps = (state) => {
    return {
    }
}

let mapDispatchToProps = (dispatch) => {
    return {
        // nextStage: () => {
        //     // dispatch(nextStage())
        // },
        setMode: (e) => {
            // debugger;
            dispatch(setMode(e))
        },
        setStage: (e) => {
            dispatch(setStage(e))
        },
        setRepairKit: (e) => {
            dispatch(setRepairKit(e))
        },
        toStageTwo: () => {
            dispatch(toStageTwo())
        },
        cancelWork: () => {
            dispatch(cancelWork())
        }

    }
}

const FirstStageContainer = connect(mapStateToProps, mapDispatchToProps)(FirstStage)

export default FirstStageContainer