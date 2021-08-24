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
  doRevertCompositionStart, doSetSteps,
  doStartStepRecord,
  doStopStepRecord
} from "@reducers/stagesActions";
import { replace } from "connected-react-router";
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
    compositionID     : store.stages.getIn(['composition', 'unit_internal_id'])
  }),
  (dispatch) => ({
    goToMenu              : () => dispatch(replace({ pathname: '/menu' })),
    startStepRecord       : (unitID, productionStageName, additionalInfo, successChecker, errorChecker) => doStartStepRecord(dispatch, unitID, productionStageName, additionalInfo, successChecker, errorChecker),
    stopStepRecord        : (additionalInfo, unitInternalID, successChecker, errorChecker) => doStopStepRecord(dispatch, unitInternalID, additionalInfo, successChecker, errorChecker),
    uploadComposition     : (unitID, successChecker, errorChecker) => doCompositionUpload(dispatch, unitID, successChecker, errorChecker),
    doFetchComposition    : (successChecker, errorChecker) => doFetchComposition(dispatch, successChecker, errorChecker),
    raiseNotification     : (notificationMessage) => doRaiseNotification(dispatch, notificationMessage),
    revertCompositionStart: () => doRevertCompositionStart(dispatch),
    setSteps: (steps) => doSetSteps(dispatch, steps)
  })
)(class Composition extends React.Component {
  
  static propTypes = {
    
    unit              : PropTypes.object,
    compositionOngoing: PropTypes.bool,
    compositionID     : PropTypes.string,
    
    goToMenu          : PropTypes.func.isRequired,
    startStepRecord   : PropTypes.func.isRequired,
    stopStepRecord    : PropTypes.func.isRequired,
    uploadComposition : PropTypes.func.isRequired,
    doFetchComposition: PropTypes.func.isRequired,
    raiseNotification : PropTypes.func.isRequired,
  }
  
  constructor(props) {
    super(props);
    this.stageStopwatch = React.createRef()
  }
  
  state = {
    activeStep  : -1,
    stepDuration: 0,
    loading     : false
  }
  
  setStepDuration = (duration) => {
    this.setState({ stepDuration: duration })
  }
  
  successChecker = (res) => {
    if (res.status === false) {
      this.props.raiseNotification(res.comment)
      this.setState({ loading: false })
      return false
    }
    return true
  }
  
  handleNextCompositionStep = (productionStageName, stepID) => {
    this.setState({ loading: true })
    let smartProtectionBlock = false
    let finishFlag = this.state.activeStep === -1
    
    if (this.state.activeStep !== -1) {
      if (config.smart_protection) {
        if (this.state.stepDuration < 3) {
          smartProtectionBlock = true
          this.props.raiseNotification(this.props.t('NotEnoughDuration'))
          setTimeout(() => this.setState({ loading: false }), 100)
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
            // this.setState({ loading: false })
            return true
          }, (res) => {
            if (res !== undefined) {
              this.props.raiseNotification('Error while stopping record. Server connection error')
              this.setState({ loading: false })
            }
          })
      }
    }
    if (!smartProtectionBlock) {
      setTimeout(() => {
        if (finishFlag && this.state.activeStep === Object.entries(this.props.steps).length - 1)
          this.setState({ loading: false, activeStep: this.state.activeStep + 1 })
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
          this.setState({ loading: false })
          return false
        }
        // console.log('moving')
        this.setState({ 'activeStep': this.state.activeStep + 1 })
        this.setState({ loading: false })
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
        this.setState({ loading: false })
      })
  }
  
  handleCompositionUpload = () => {
    this.setState({ loading: true })
    this.props.uploadComposition(
      this.props.unit.unit_internal_id,
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
          this.props.raiseNotification('Error while uploading passport. Server connection error')
        this.setState({ loading: false })
      }
    )
  }
  
  componentDidMount() {
    // If no steps were specified but composition needs to be restored try first file and then next
    if(this.props.steps[0].title === 'title1') {
      this.props.setSteps(steps_unit_1)
    }
    if (
      this.props.steps !== undefined
      && this.props.unit.unit_biography !== undefined
      && this.props?.compositionOngoing
      && this.props.unit.unit_internal_id !== ''
      && this.props.unit.unit_internal_id !== undefined
    ) {
      const length_1 = Object.values(this.props.unit.unit_biography).length
      const title = Object.values(this.props.unit.unit_biography)[length_1 - 1].stage
      let stepFound = false
      Object.values(this.props.steps).map((item, index) => {
        if (item.title === title) {
          stepFound = true
          if (index !== -1) {
            this.setState({ activeStep: index })
            setTimeout(() => {
              let el = document.getElementById(`step_${index}`)
              el.scrollIntoView({
                block   : "center",
                inline  : "center",
                behavior: "smooth"
              })
            }, 200)
          }
        }
      })
      if (!stepFound){
        this.props.setSteps(steps_unit_2)
        setTimeout(()=>{
          Object.values(this.props.steps).map((item, index) => {
            if (item.title === title) {
              if (index !== -1) {
                this.setState({ activeStep: index })
                setTimeout(() => {
                  let el = document.getElementById(`step_${index}`)
                  el.scrollIntoView({
                    block   : "center",
                    inline  : "center",
                    behavior: "smooth"
                  })
                }, 200)
              }
            }
          })
        },200)
        
      }
    }
  }
  
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.stageStopwatch !== undefined) {
      this.stageStopwatch?.current?.start()
    }
  }
  
  timeToRegular = (seconds) => {
    return new Date(seconds * 1000).toISOString().substr(11, 8)
  }
  
  render() {
    const { classes, t, steps } = this.props
    const { activeStep, loading } = this.state
    return (
      <div className={styles.wrapper}>
        {activeStep === -1 && (
          <div>
            <Button
              color="#20639B"
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
            <Button
              color="#ED553B"
              radius="10px"
              staticWidth="240px"
              onClick={() => {
                this.props.revertCompositionStart()
                this.props.goToMenu()
              }}
              className={classes.buttonCancel}>{t('CancelComposition')}</Button>
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
                      loading={loading}
                      disabled={loading}
                      onClick={() => {
                        this.handleNextCompositionStep(steps[index + 1]?.title, `step_${index + 1}`)
                      }}
                      className={classes.button}
                    >
                      {activeStep === Object.entries(steps).length - 1 ? t('Finish') : t('Next')}
                    </Button>
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
            loading={loading}
            disabled={loading}
            onClick={this.handleCompositionUpload}
            className={classes.uploadButton}>{t('SavePassport')}</Button>
        )}
      </div>
    )
  }
})))
