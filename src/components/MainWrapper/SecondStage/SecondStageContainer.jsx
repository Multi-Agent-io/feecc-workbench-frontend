import {connect} from "react-redux";
// import from "../../../redux/reducers/productParametersReducer";
import SecondStage from "./SecondStage";
import {
    camModuleSwitch, cancelWork, expansionModuleSwitch, fpvGlassesSwitch, fpvTransmitterSwitch, globalNavigationSwitch,
    grabModuleSwitch,
    internalNavigationSwitch,
    ledSwitch, programmableCamSwitch, toStageOne, toStageThree, usbRadioSwitch
} from "../../../redux/reducers/productParametersReducer";

let mapStateToProps = (state) => {
    return {
        secondStage: state.productParameters.secondStage
    }
}

let mapDispatchToProps = (dispatch) => {
    return {
        ledSwitch: () => {
            dispatch(ledSwitch())
        },
        camModuleSwitch: () => {
            dispatch(camModuleSwitch())
        },
        grabModuleSwitch: () => {
            dispatch(grabModuleSwitch())
        },
        internalNavigationSwitch: () => {
            dispatch(internalNavigationSwitch())
        },
        globalNavigationSwitch: () => {
            dispatch(globalNavigationSwitch())
        },
        programmableCamSwitch: () => {
            dispatch(programmableCamSwitch())
        },
        usbRadioSwitch: () => {
            dispatch(usbRadioSwitch())
        },
        expansionModuleSwitch: () => {
            dispatch(expansionModuleSwitch())
        },
        fpvTransmitterSwitch: () => {
            dispatch(fpvTransmitterSwitch())
        },
        fpvGlassesSwitch: () => {
            debugger;
            dispatch(fpvGlassesSwitch())
        },
        sendData: () => {
            dispatch(toStageThree())
        },
        cancelWork: () => {
            dispatch(cancelWork())
        },
        goBack: () => {
            dispatch(toStageOne())
        }
        
    }
}

const SecondStageContainer = connect(mapStateToProps, mapDispatchToProps)(SecondStage)

export default SecondStageContainer