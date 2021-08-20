import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import React from 'react'
import styles from './Composition.module.css'
import { Step, StepContent, StepLabel, Stepper, Typography, withStyles } from "@material-ui/core";
import clsx from 'clsx'
import {
  doCompositionUpload,
  doFetchComposition,
  doRaiseNotification,
  doStartStepRecord,
  doStopStepRecord
} from "@reducers/stagesActions";
import { replace } from "connected-react-router";
import Stopwatch from "@components/Stopwatch/Stopwatch";
import Button from "@/uikit/Button";

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
    steps             : store.stages.get('steps').toJS(),
    unitID            : store.stages.getIn(['unit', 'unit_internal_id']),
    unit              : store.stages.get('unit')?.toJS(),
    compositionOngoing: store.stages.getIn(['composition', 'operation_ongoing']),
    compositionID     : store.stages.getIn(['composition', 'unit_internal_id'])
  }),
  (dispatch) => ({
    goToMenu          : () => dispatch(replace({ pathname: '/menu' })),
    startStepRecord   : (unitID, productionStageName, additionalInfo, successChecker, errorChecker) => doStartStepRecord(dispatch, unitID, productionStageName, additionalInfo, successChecker, errorChecker),
    stopStepRecord    : (additionalInfo, unitInternalID, successChecker, errorChecker) => doStopStepRecord(dispatch, unitInternalID, additionalInfo, successChecker, errorChecker),
    uploadComposition : (unitID, successChecker, errorChecker) => doCompositionUpload(dispatch, unitID, successChecker, errorChecker),
    doFetchComposition: (successChecker, errorChecker) => doFetchComposition(dispatch, successChecker, errorChecker),
    raiseNotification : (notificationMessage) => doRaiseNotification(dispatch, notificationMessage)
  })
)(class Composition extends React.Component {
  
  constructor(props) {
    super(props);
    this.stageStopwatch = React.createRef()
  }
  
  state = {
    activeStep: -1,
    loading: false
  }
  
  successChecker = (res) => {
    if (res.status === false) {
      this.props.raiseNotification(res.comment)
      this.setState({loading: false})
      return false
    }
    return true
  }
  
  handleNextCompositionStep = (productionStageName) => {
    this.setState({loading: true})
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
          if (res !== undefined) {
            this.props.raiseNotification('Error while stopping record. Server connection error')
            this.setState({loading: false})
          }
        })
    }
    
    setTimeout(() => {
      if (finishFlag && this.state.activeStep === Object.entries(this.props.steps).length - 1) {
        this.props.uploadComposition(
          this.props.unitID,
          (res) => {
            if (!this.successChecker(res))
              return false
            this.props.doFetchComposition(() => {
              return true
            }, null)
            this.props.goToMenu()
            return true
          },
          (res) => {
            if (res !== undefined)
              this.props.raiseNotification('Error while stopping record. Server connection error')
            this.setState({loading: false})
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
        // console.log('moving')
        this.setState({ 'activeStep': this.state.activeStep + 1 })
        this.setState({loading: true})
  
        return true
      }, (res) => {
        if (res !== undefined)
          this.props.raiseNotification('Error while sending data to server (return code !== 200)')
        this.setState({loading: false})
      })
  }
  
  componentDidMount() {
    if (
      this.props.steps !== undefined
      && this.props.unit.unit_biography !== undefined
      && this.props?.compositionOngoing
      && this.props.unit.unit_internal_id !== ''
      && this.props.unit.unit_internal_id !== undefined
    ) {
      const length_1 = Object.values(this.props.unit.unit_biography).length
      const title = Object.values(this.props.unit.unit_biography)[length_1 - 1].stage
      Object.values(this.props.steps).map((item, index) => {
        if (item.title === title) {
          if (index !== -1)
            this.setState({ activeStep: index })
        }
      })
    }
  }
  
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.stageStopwatch !== undefined) {
      this.stageStopwatch?.current?.start()
    }
  }
  
  timeToRegular = (seconds) => {
    const hours = (seconds / 3600).toFixed(0)
    const minutes = (seconds / 60).toFixed(0)
    return `${(`0${hours}`).slice(-2)}:${(`0${minutes}`).slice(-2)}:${(`0${seconds}`).slice(-2)}`
  }
  
  render() {
    const { classes, t, steps } = this.props
    const { activeStep, loading } = this.state
    return (
      <div className={styles.wrapper}>
        {activeStep === -1 && (
          <Button
          color="blue1"
          radius="10px"
          staticWidth="240px"
          disabled={loading}
          onClick={() => {
            this.handleNextCompositionStep(steps[0].title)
            this.props.doFetchComposition(() => {
              return true
            }, null)
          }}
          className={classes.buttonStart}>{t('StartComposition')}</Button>
        )}
        
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
                      color="blue1"
                      radius="10px"
                      staticWidth="120px"
                      loading={loading}
                      disabled={loading}
                      onClick={() => {
                        this.handleNextCompositionStep(steps[index + 1]?.title)
                      }}
                      className={classes.button}
                    >
                      {activeStep === Object.entries(steps).length - 1 ? t('Finish') : t('Next')}
                    </Button>
                    <div className={styles.timerWrapper}>
                      <Stopwatch ref={this.stageStopwatch}/>
                      {this.timeToRegular(item.duration)}
                    </div>
                  </div>
                </div>
              </StepContent>
            </Step>))}
        </Stepper>
      </div>
    )
  }
})))
