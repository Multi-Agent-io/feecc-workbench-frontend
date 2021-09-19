import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import React from 'react'
import styles from './Composition.module.css'
import { Step, StepContent, StepLabel, Stepper, Typography, withStyles } from "@material-ui/core";
import clsx from 'clsx'
import {
  doCompositionUpload,
  doFetchComposition, doGetUnitBiography,
  doRaiseNotification, doResetUnit,
  doSetBetweenFlag, doSetSteps,
  doStartStepRecord,
  doStopStepRecord
} from "@reducers/stagesActions";
import { push, replace } from "connected-react-router";
import Stopwatch from "@components/Stopwatch/Stopwatch";
import Button from "@/uikit/Button";
import config from '../../../configs/config.json'
import PropTypes from "prop-types";
import steps_unit_1 from '@steps/pages_unit_1.csv'
import steps_unit_2 from '@steps/pages_unit_2.csv'

const stylesMaterial = {
  root            : {
    width: '60vw',
  },
  actionsContainer: {
    marginTop   : "20px",
    marginBottom: "20px",
  },
  button          : {
    // color       : "#20639B",
    marginRight: "20px"
  },
  buttonStart     : {
    // color       : "#20639B",
    marginTop : "20px",
    marginLeft: "20px"
  },
  buttonCancel    : {
    marginLeft: "20px",
    // color     : "#ED553B"
  },
  uploadButton    : {
    // color       : "#20639B",
    marginBottom: "40px"
  }
}

export default withStyles(stylesMaterial)(withTranslation()(connect(
  (store) => ({
    steps             : store.stages.get('steps').toJS(),
    unit              : store.stages.get('unit')?.toJS(),
    compositionOngoing: store.stages.getIn(['composition', 'operation_ongoing']),
    compositionID     : store.stages.getIn(['composition', 'unit_internal_id']),
    afterPause        : new URLSearchParams(store.router.location.search).get('afterPause'),
  }),
  (dispatch) => ({
    goToMenu          : () => dispatch(push('/menu')),
    startStepRecord   : (unitID, productionStageName, additionalInfo, successChecker, errorChecker) => doStartStepRecord(dispatch, unitID, productionStageName, additionalInfo, successChecker, errorChecker),
    stopStepRecord    : (additionalInfo, unitInternalID, successChecker, errorChecker) => doStopStepRecord(dispatch, unitInternalID, additionalInfo, successChecker, errorChecker),
    uploadComposition : (unitID, successChecker, errorChecker) => doCompositionUpload(dispatch, unitID, successChecker, errorChecker),
    doFetchComposition: (successChecker, errorChecker) => doFetchComposition(dispatch, successChecker, errorChecker),
    raiseNotification : (notificationMessage) => doRaiseNotification(dispatch, notificationMessage),
    setSteps          : (steps) => doSetSteps(dispatch, steps),
    setBetweenFlag    : (state) => doSetBetweenFlag(dispatch, state),
    getUnitBiography  : (unitID, successChecker, errorChecker) => doGetUnitBiography(dispatch, unitID, successChecker, errorChecker),
    dropUnit          : () => doResetUnit(dispatch)
  })
)(class Composition extends React.Component {
  
  static propTypes = {
    steps             : PropTypes.object,
    unit              : PropTypes.object,
    compositionOngoing: PropTypes.bool,
    compositionID     : PropTypes.string,
    afterPause        : PropTypes.string,
    
    goToMenu          : PropTypes.func.isRequired,
    startStepRecord   : PropTypes.func.isRequired,
    stopStepRecord    : PropTypes.func.isRequired,
    uploadComposition : PropTypes.func.isRequired,
    doFetchComposition: PropTypes.func.isRequired,
    raiseNotification : PropTypes.func.isRequired,
    setSteps          : PropTypes.func.isRequired,
    setBetweenFlag    : PropTypes.func.isRequired,
    getUnitBiography  : PropTypes.func.isRequired,
    dropUnit          : PropTypes.func.isRequired,
  }
  
  constructor(props) {
    super(props);
    this.stageStopwatch = React.createRef()
  }
  
  state = {
    activeStep  : -1,
    stepDuration: 0,
    loading_1   : false,
    loading_2   : false,
    afterPause  : false,
  }
  
  setStepDuration = (duration) => {
    this.setState({ stepDuration: duration })
  }
  
  successChecker = (res) => {
    if (res.status === false) {
      this.props.raiseNotification(res.comment)
      // this.setState({ loading: false })
      return false
    }
    return true
  }
  
  handleNextCompositionStep = (productionStageName, stepID) => {
    this.setState({ loading_1: true })
    let smartProtectionBlock = false
    let finishFlag = this.state.activeStep === -1
    
    if (this.state.activeStep !== -1) {
      if (config.smart_protection) {
        if (this.state.stepDuration < 3) {
          smartProtectionBlock = true
          this.props.raiseNotification(this.props.t('NotEnoughDuration'))
          setTimeout(() => this.setState({ loading_1: false }), 100)
        }
      }
      if (!smartProtectionBlock) {
        this.props.stopStepRecord(
          {},
          this.props.unit.unit_internal_id,
          (res) => {
            if (!this.successChecker(res))
              return false
            finishFlag = true
            return true
          }, (res) => {
            if (res !== undefined) {
              this.props.raiseNotification('Error while stopping record. Server connection error')
              this.setState({ loading_1: false })
            }
          })
        this.props.setBetweenFlag(true)
      }
    }
    if (!smartProtectionBlock) {
      setTimeout(() => {
        if (finishFlag && this.state.activeStep === Object.entries(this.props.steps).length - 1) {
          this.setState({ loading_1: false, activeStep: this.state.activeStep + 1 })
          this.props.setBetweenFlag(false)
        }
      }, 100)
      
      setTimeout(() => {
        if (finishFlag && this.state.activeStep < Object.entries(this.props.steps).length - 1) {
          this.handleStageRecordStart(productionStageName, stepID)
        } else if (finishFlag !== true)
          this.setState({ 'activeStep': this.state.activeStep + 1 })
      }, 100)
    }
  }
  
  handleStageRecordStart = (productionStageName, stepID) => {
    this.props.startStepRecord(
      this.props.unit.unit_internal_id,
      productionStageName,
      {},
      (res) => {
        if (!this.successChecker(res)) {
          return false
        }
        this.setState({ 'activeStep': this.state.activeStep + 1 })
        this.setState({ loading_1: false })
        setTimeout(() => {
          let el = document.getElementById(stepID)
          el.scrollIntoView({
            block   : "center",
            inline  : "center",
            behavior: "smooth"
          })
        }, 200)
        return true
      }, (res) => {
        if (res !== undefined)
          this.props.raiseNotification('Error while sending data to server (return code !== 200)')
        this.setState({ loading_1: false })
      })
  }
  
  handleCompositionUpload = () => {
    this.setState({ loading_1: true })
    this.props.uploadComposition(
      this.props.unit.unit_internal_id,
      (res) => {
        if (!this.successChecker(res))
          return false
        this.props.setBetweenFlag(false)
        this.props.doFetchComposition(() => { return true }, null)
        setTimeout(() => this.props.goToMenu(), 100)
        return true
      },
      (res) => {
        if (res !== undefined)
          this.props.raiseNotification('Error while uploading passport. Server connection error')
        this.setState({ loading_1: false })
      }
    )
  }
  
  componentDidMount() {
    // If no steps were specified but composition needs to be restored try first file and then next
    if (this.props.steps[0].title === 'title1') {
      this.props.setSteps(steps_unit_1)
    }
    if (
      this.props.steps !== undefined
      && this.props.unit?.unit_internal_id !== undefined
      && this.props.unit?.unit_biography !== ''
      && this.props.unit?.unit_biography !== undefined
      && this.props.unit?.unit_internal_id !== ''
    ) {
      const length_1 = Object.values(this.props.unit.unit_biography).length
      const title = Object.values(this.props.unit.unit_biography)[length_1 - 1].stage
      // Scroll to the element if it was found in this.props.steps
      if (this.props?.compositionOngoing) {
        // Check if step is in the first file. If not - function will return false and if will be started
        // If in the first steps file step was not found - move to the next and repeat search
        this.props.setSteps(steps_unit_1)
        setTimeout(() => {
          if (!this.searchAndMoveToStep(this.props.steps, title, true, false)) {
            this.props.setSteps(steps_unit_2)
            this.searchAndMoveToStep(this.props.steps, title, true, false)
          }
        }, 300)
        
      }
    }
    if (
      this.props.compositionOngoing !== true
      && this.props.unit?.unit_internal_id !== undefined
      && (this.props.unit?.unit_biography === undefined || this.props.unit?.unit_biography === '')) {
      this.props.getUnitBiography(
        this.props.unit.unit_internal_id,
        (res) => {
          let title = res.unit_biography[Object.values(res.unit_biography).length - 1].stage
          if (!this.searchAndMoveToStep(this.props.steps, title, false)) {
            this.props.setSteps(steps_unit_2)
            this.searchAndMoveToStep(this.props.steps, title, false)
          }
        }, null)
    }
    setTimeout(() => {
      if (this.props.afterPause === "true") {
        this.setState({ afterPause: true })
      }
    }, 1000)
    
  }
  
  // Important notice - start request only sendable if doMove flag is in true position
  searchAndMoveToStep = (steps, title, doMove, sendStartRequest = false) => {
    let stepFound = false
    Object.values(steps).map((item, index) => {
      if (item.title === title) {
        stepFound = true
        if (index !== -1) {
          if (doMove) {
            if (sendStartRequest) {
              this.handleStageRecordStart(title, index)
            }
            this.setState({ activeStep: index })  // Select found step
            setTimeout(() => {
              let el = document.getElementById(`step_${index}`)
              el.scrollIntoView({
                block   : "center",
                inline  : "center",
                behavior: "smooth"
              })
            }, 200) // Scroll to the selected step
          }
        }
      }
    })
    return stepFound
  }
  
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.stageStopwatch !== undefined) {
      this.stageStopwatch?.current?.start()
    }
  }
  
  proceedComposition = () => {
    this.props.getUnitBiography(
      this.props.unit.unit_internal_id,
      (res) => {
        let title = this.props.steps[Object.values(res.unit_biography).length].title
        this.searchAndMoveToStep(this.props.steps, title, true, true)
      }, null)
  }
  
  timeToRegular = (seconds) => {
    return new Date(seconds * 1000).toISOString().substr(11, 8)
  }
  
  render() {
    const { classes, t, steps } = this.props
    const { activeStep, loading_1, loading_2, afterPause } = this.state
    return (
      <div className={styles.wrapper}>
        {activeStep === -1 && !afterPause && (
          <div>
            <Button
              color="#20639B"
              radius="10px"
              staticWidth="240px"
              disabled={loading_1}
              loading={loading_1}
              onClick={() => {
                this.handleNextCompositionStep(steps[0].title)
                this.props.doFetchComposition(() => {
                  return true
                }, null)
              }}
              className={classes.buttonStart}>{t('StartComposition')}</Button>
            <Button
              color="#ED553B"
              radius="10px"
              staticWidth="240px"
              disabled={loading_2}
              loading={loading_2}
              onClick={() => {
                this.props.dropUnit()
                this.props.goToMenu()
              }}
              className={classes.buttonCancel}>{t('CancelComposition')}</Button>
          </div>
        )}
        {activeStep === -1 && afterPause === true && (
          <div>
            <Button
              color="#20639B"
              radius="10px"
              staticWidth="240px"
              disabled={loading_1}
              className={classes.buttonStart}
              onClick={() => this.proceedComposition()}
            >{t('ProceedComposition')}</Button>
          </div>
        )}
        
        <Stepper className={clsx(classes.root, styles.button)} activeStep={activeStep} orientation="vertical">
          {Object.values(steps).map((item, index) =>
            (<Step id={`step_${index}`} key={item.context}>
              <StepLabel>{item.title}</StepLabel>
              <StepContent>
                <Typography>{item.context}</Typography>
                <div className={classes.actionsContainer}>
                  <div className={styles.controls}>
                    <Button
                      variant="contained"
                      color="#20639B"
                      radius="10px"
                      staticWidth="120px"
                      loading={loading_1}
                      disabled={loading_1}
                      className={classes.button}
                      onClick={() => {
                        this.handleNextCompositionStep(steps[index + 1]?.title, `step_${index + 1}`)
                      }}
                    >
                      {activeStep === Object.entries(steps).length - 1 ? t('Finish') : t('Next')}
                    </Button>
                    {activeStep !== Object.entries(steps).length - 1 && (
                      <Button
                        variant="contained"
                        color="#20639B"
                        radius="10px"
                        staticWidth="120px"
                        loading={loading_2}
                        disabled={loading_2}
                        className={classes.button}
                        onClick={() => this.setOnPause()}
                      >{t('SetOnPause')}</Button>
                    )}
                    <div className={styles.timerWrapper}>
                      <Stopwatch setStepDuration={this.setStepDuration} ref={this.stageStopwatch}/>
                      {this.timeToRegular(item.duration)}
                    </div>
                  </div>
                </div>
              </StepContent>
            </Step>))}
        </Stepper>
        {activeStep === Object.entries(steps).length && (
          <Button
            color="#20639B"
            radius="10px"
            staticWidth="240px"
            loading={loading_1}
            disabled={loading_1}
            onClick={() => this.handleCompositionUpload()}
            className={classes.uploadButton}>{t('SavePassport')}</Button>
        )}
      </div>
    )
  }
})))
