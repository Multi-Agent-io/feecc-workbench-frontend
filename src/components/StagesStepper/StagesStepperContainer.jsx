import React, {Component} from 'react';
import {connect} from 'react-redux';
import StagesStepper from "./StagesStepper";

let mapStateToProps = (state) => {
    return {

    };
}

let mapDispatchToProps = (dispatch) => {
    return {

    };
}


const StagesStepperContainer = connect(mapStateToProps, mapDispatchToProps)(StagesStepper)

export default StagesStepperContainer