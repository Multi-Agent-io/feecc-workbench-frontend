import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import React from 'react'
import styles from './Composition.module.css'
import { Button, Step, StepContent, StepLabel, Stepper, Typography, withStyles } from "@material-ui/core";
import clsx from 'clsx'
import {
  doCompositionUpload,
  doFetchComposition,
  doRaiseNotification,
  doStartStepRecord,
  doStopStepRecord
} from "@reducers/stagesActions";
import { replace } from "connected-react-router";
import StopWatch from "@components/Stopwatch/Stopwatch";

const stylesMaterial = {
  root            : {
    width: '60vw',
  },
  actionsContainer: {
    marginTop   : "20px",
    marginBottom: "20px",
  },
  button          : {
    marginRight: "20px"
  },
  buttonStart     : {
    marginTop : "20px",
    marginLeft: "20px"
  }
}

export default withStyles(stylesMaterial)(withTranslation()(connect(
  (store) => ({
    steps : store.stages.get('steps').toJS(),
    unitID: store.stages.getIn(['unit', 'unit_internal_id']),
  }),
  (dispatch) => ({
    goToMenu         : () => dispatch(replace({ pathname: '/menu' })),
    startStepRecord  : (unitID, productionStageName, additionalInfo, successChecker, errorChecker) => doStartStepRecord(dispatch, unitID, productionStageName, additionalInfo, successChecker, errorChecker),
    stopStepRecord   : (additionalInfo, unitInternalID, successChecker, errorChecker) => doStopStepRecord(dispatch, unitInternalID, additionalInfo, successChecker, errorChecker),
    uploadComposition: (unitID, successChecker, errorChecker) => doCompositionUpload(dispatch, unitID, successChecker, errorChecker),
    doFetchComposition: (successChecker, errorChecker) => doFetchComposition(dispatch, successChecker, errorChecker),
    raiseNotification: (notificationMessage) => doRaiseNotification(dispatch, notificationMessage)
  })
)(class Composition extends React.Component {
  
  state = {
    activeStep: -1,
  }
  
  successChecker = (res) => {
    if (res.status === false) {
      this.props.raiseNotification(res.comment)
      return false
    }
    return true
  }
  
  handleNextCompositionStep = (productionStageName) => {
    let finishFlag = this.state.activeStep === -1
    if (this.state.activeStep !== -1) {
      this.props.stopStepRecord(
        {},
        this.props.unitID,
        (res) => {
          if (!this.successChecker(res))
            return false
          finishFlag = true
          return true
        }, (res) => {
          if (res !== undefined)
            this.props.raiseNotification('Error while stopping record. Server connection error')
        })
    }
    
    setTimeout(() => {
      if (finishFlag && this.state.activeStep === Object.entries(this.props.steps).length - 1) {
        this.props.uploadComposition(
          this.props.unitID,
          (res) => {
            if (!this.successChecker(res))
              return false
            this.props.doFetchComposition(() => { return true }, null)
            this.props.goToMenu()
            return true
          },
          (res) => {
            if (res !== undefined)
              this.props.raiseNotification('Error while stopping record. Server connection error')
          })
        
      }
    }, 100)
    setTimeout(() => {
      if (finishFlag && this.state.activeStep !== Object.entries(this.props.steps).length - 1) {
        this.handleStageRecordStart(productionStageName)
      } else if (finishFlag !== true)
        this.setState({ 'activeStep': this.state.activeStep + 1 })
    }, 100)
  }
  
  handleStageRecordStart = (productionStageName) => {
    this.props.startStepRecord(
      this.props.unitID,
      productionStageName,
      {},
      (res) => {
        if (!this.successChecker(res))
          return false
        this.setState({ 'activeStep': this.state.activeStep + 1 })
        return true
      }, (res) => {
        if (res !== undefined)
          this.props.raiseNotification('Error while sending data to server (return code !== 200)')
      })
  }
  
  
  render() {
    const { classes, t, steps } = this.props
    const { activeStep } = this.state
    return (
      <div className={styles.wrapper}>
        {activeStep === -1 && (<Button
          variant="contained"
          color="primary"
          onClick={() => {
            this.handleNextCompositionStep(steps[0].title)
            this.props.doFetchComposition(() => { return true }, null)
          }}
          className={classes.buttonStart}>{t('StartComposition')}</Button>)}
        
        <Stepper className={clsx(classes.root, styles.button)} activeStep={activeStep} orientation="vertical">
          {Object.values(steps).map((item, index) =>
            (<Step key={item.context}>
              <StepLabel>{item.title}</StepLabel>
              <StepContent>
                <Typography>{item.context}</Typography>
                <div className={classes.actionsContainer}>
                  <div className={styles.controls}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => {
                        this.handleNextCompositionStep(steps[index+1]?.title)
                      }}
                      className={classes.button}
                    >
                      {activeStep === Object.entries(steps).length - 1 ? t('Finish') : t('Next')}
                    </Button>
                    <div className={styles.timerWrapper}><StopWatch/></div>
                  </div>
                </div>
              </StepContent>
            </Step>))}
        </Stepper>
      </div>
    )
  }
})))