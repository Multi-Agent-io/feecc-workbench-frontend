import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import React from 'react'
import styles from './Composition.module.css'
import { Step, StepContent, StepLabel, Stepper, Typography, withStyles } from "@material-ui/core";
import clsx from 'clsx'
import {
  // doAddTimestampToIgnore,
  // doAddUnitToIgnore,
  // doFetchComposition,
  doCompositionUpload, doGetSchema, doGetUnitBiography, doGetUnitInformation,
  doRaiseNotification, doRemoveUnit,
  doSetBetweenFlag, doSetSteps,
  doStartStepRecord,
  doStopStepRecord
} from "@reducers/stagesActions";
import { push } from "connected-react-router";
import Stopwatch from "@components/Stopwatch/Stopwatch";
import Button from "@/uikit/Button";
// import config from '../../../configs/config.json'
import PropTypes from "prop-types";

const stylesMaterial = {
  root: {
    width: '60vw',
  },
  actionsContainer: {
    marginTop: "20px",
    marginBottom: "20px",
  },
  button: {
    // color       : "#20639B",
    marginRight: "20px"
  },
  buttonStart: {
    // color       : "#20639B",
    marginTop: "20px",
    marginLeft: "20px"
  },
  buttonCancel: {
    marginLeft: "20px",
    // color     : "#ED553B"
  },
  uploadButton: {
    // color       : "#20639B",
    marginBottom: "40px"
  }
}

export default withStyles(stylesMaterial)(withTranslation()(connect(
  (store) => ({
    steps: store.stages.get('steps')?.toJS(),
    unit: store.stages.get('unit')?.toJS(),
    compositionOngoing: store.stages.getIn(['composition', 'operation_ongoing']),
    compositionID: store.stages.getIn(['composition', 'unit_internal_id']),
    afterPause: new URLSearchParams(store.router.location.search).get('afterPause'),
    pauseTimestamp: new URLSearchParams(store.router.location.search)?.get('timestamp'),
    state: store.stages.getIn(['composition', 'state'])
  }),
  (dispatch) => ({
    goToMenu: () => dispatch(push('/menu')),
    startStepRecord: (productionStageName, additionalInfo, successChecker, errorChecker) => doStartStepRecord(dispatch, productionStageName, additionalInfo, successChecker, errorChecker),
    stopStepRecord: (additionalInfo, successChecker, errorChecker) => doStopStepRecord(dispatch, additionalInfo, successChecker, errorChecker),
    uploadComposition: (successChecker, errorChecker) => doCompositionUpload(dispatch, successChecker, errorChecker),
    // doFetchComposition: (successChecker, errorChecker) => doFetchComposition(dispatch, successChecker, errorChecker),
    raiseNotification: (notificationMessage) => doRaiseNotification(dispatch, notificationMessage),
    setSteps: (steps) => doSetSteps(dispatch, steps),
    setBetweenFlag: (state) => doSetBetweenFlag(dispatch, state),
    getUnitBiography: (unitID, successChecker, errorChecker) => doGetUnitBiography(dispatch, unitID, successChecker, errorChecker),
    dropUnit: (successChecker, errorChecker) => doRemoveUnit(dispatch, successChecker, errorChecker),

    // addCurrUnitToIgnore: () => doAddUnitToIgnore(dispatch),
    // addTimestampToIgnore: (timestamp) => doAddTimestampToIgnore(dispatch, timestamp),

    doGetSchema: (schemaId, successChecker, errorChecker) => doGetSchema(dispatch, schemaId, successChecker, errorChecker),
    doGetUnitDetails: (unitID, successChecker, errorChecker) => doGetUnitInformation(dispatch, unitID, successChecker, errorChecker)
  })
)(class Composition extends React.Component {

  static propTypes = {
    steps: PropTypes.object,
    unit: PropTypes.object,
    compositionOngoing: PropTypes.bool,
    compositionID: PropTypes.string,
    afterPause: PropTypes.string,
    pauseTimestamp: PropTypes.string,

    goToMenu: PropTypes.func.isRequired,
    startStepRecord: PropTypes.func.isRequired,
    stopStepRecord: PropTypes.func.isRequired,
    uploadComposition: PropTypes.func.isRequired,
    // doFetchComposition: PropTypes.func.isRequired,
    raiseNotification: PropTypes.func.isRequired,
    setSteps: PropTypes.func.isRequired,
    setBetweenFlag: PropTypes.func.isRequired,
    getUnitBiography: PropTypes.func.isRequired,
    dropUnit: PropTypes.func.isRequired,
    addTimestampToIgnore: PropTypes.func.isRequired,
  }

  constructor (props) {
    super(props);
    this.stageStopwatch = React.createRef()
  }

  state = {
    activeStep: -1,
    afterPauseStep: -1,
    stepDuration: 0,
    loading_1: false,
    loading_2: false,
    afterPause: false,
  }

  setStepDuration = (duration) => {
    this.setState({stepDuration: duration})
  }

  componentDidMount () {
    setTimeout(() => {
      if (this.props.compositionID !== undefined) {
        this.props.doGetUnitDetails(
          this.props.compositionID,
          (res) => {
            if (res.status_code === 200) {
              this.props.doGetSchema(
                res.schema_id,
                (res) => {
                  if (res.status_code === 200) {
                    setTimeout(() => {
                      let recoveryStage = this.props.unit.unit_biography[this.props.unit.unit_biography.length - 1]
                      let search        = this.props.steps.filter((v) => v.name === recoveryStage)
                      let index         = this.props.steps.indexOf(search[0])
                      if (this.props.state === 'ProductionStageOngoing') {
                        setTimeout(() => {
                          if (index !== -1) {
                            this.setState({activeStep: index})
                          } else {
                            this.props.raiseNotification('Ошибка определения этапа сборки. Попробуйте перазагрузить страницу.')
                          }
                        }, 300)
                      } else if (this.props.state === 'UnitAssignedIdling') {
                        if (this.props.unit.unit_biography.length > 0) {
                          setTimeout(() => {
                            if (index !== -1) {
                              this.setState({afterPauseStep: index + 1})
                              setTimeout(() => {
                                console.log(`After pause step is currently: ${this.state.afterPauseStep}`)
                              }, 2000)
                            } else {
                              this.props.raiseNotification(`Ошибка определения этапа сборки. Попробуйте перазагрузить страницу.`)
                            }
                          }, 300)
                        }
                      }
                    }, 200)
                    return true
                  } else {
                    this.props.raiseNotification('Ошибка получения схемы сборки. Попробуйте перезугрузить страницу.')
                    return false
                  }
                }, null)
              return true
            } else {
              this.props.raiseNotification('Ошибка получения информации о сборке. Попробуйте обновить страницу.')
              return false
            }
          }, null)
      }
    }, 400)
  }

  componentDidUpdate (prevProps, prevState, snapshot) {
    if (this.props.state === 'ProductionStageOngoing') {
      if (this.stageStopwatch !== undefined) {
        this.stageStopwatch?.current?.start()
      }
    }
  }

  // Start record for the current step
  handleStageRecordStart (stageName) {
    return new Promise((resolve, reject) => {
      this.props.startStepRecord(
        stageName,
        {},
        (res) => {
          if (res.status_code === 200) {
            this.setState({loading_1: false})
            resolve('OK')
            // this.stageStopwatch?.current?.reset()
            // this.stageStopwatch?.current?.start()
            return true
          } else {
            this.props.raiseNotification('Не удалось начать запись этапа. Попробуйте повторить позже. При многократном повторении данной ошибки обратитесь к системному администратору.')
            reject('Error during attempt to start recording')
            return false
          }
        },
        null)
    })

  }

  // Stop record for the current step
  handleStageRecordStop () {
    return new Promise((resolve, reject) => {
      this.setState({loading_1: true})
      this.props.stopStepRecord(
        {},
        (res) => {
          if (res.status_code === 200) {
            resolve('OK')
            return true
          } else {
            this.props.raiseNotification('Не удалось завершить запись этапа. Попробуйте повторить позже. При многократном повторении данной ошибки обратитесь к системному администратору.')
            reject('Error during attempt to stop recording')
            return false
          }
        }
      )
    })
  }

  // Stop current record, start next and move step
  handleNextCompositionStep (nextTitle, nextStepID) {
    this.handleStageRecordStop()
      .then(() => this.handleStageRecordStart(nextTitle))
      .then(() => {
        this.setState({activeStep: this.state.activeStep + 1})
        document.getElementById(nextStepID).scrollIntoView({
          behavior: "smooth",
          block: "center"
        })
      })

  }

  // Upload finished composition
  handleCompositionUpload () {
    this.setState({loading_1: true})
    return new Promise((resolve) => {
      this.props.uploadComposition(
        (res) => {
          if (res.status_code === 200) {
            resolve('OK')
            return true
          } else {
            this.props.raiseNotification('Ошибка загзузки сборки. Попробуйте повторить позже. При многократном повторении данной ошибки обратитесь к системному администратору.')
            return false
          }
        }, null)
    })
  }

  // Set this composition on pause and go to unit create selection
  setOnPause () {
    this.handleStageRecordStop()
      .then(() => this.props.dropUnit(
        (res) => {
          if (res.status_code === 200) {
            resolve('OK')
            return true
          } else {
            this.props.raiseNotification('Не удалось убрать сборку со стола. Попробуйте позже. Если ошибка повторится, то свяжитесь с системным администратором для устранения проблемы.')
            return false
          }
        }, null))
  }

  cancelComposition () {
    return new Promise((resolve) => {
      this.props.dropUnit(
        (res) => {
          if (res.status_code === 200) {
            resolve('OK')
            return true
          } else {
            this.props.raiseNotification('Не удалось убрать сборку со стола. Попробуйте позже. Если ошибка повторится, то свяжитесь с системным администратором для устранения проблемы.')
            return false
          }
        }, null)
    })
  }

  proceedComposition () {
    this.handleStageRecordStart(this.props.steps[this.state.afterPauseStep].name)
      .then(() => {
        this.setState({activeStep: this.state.afterPauseStep})
      })
  }

  // Important notice - start request only sendable if doMove flag is in true position

  // searchAndMoveToStep = (steps, title, doMove, sendStartRequest = false) => {
  //   let stepFound = false
  //   Object.values(steps).map((item, index) => {
  //     if (item.title === title) {
  //       stepFound = true
  //       if (index !== -1) {
  //         if (doMove) {
  //           if (sendStartRequest) {
  //             this.props.startStepRecord(
  //               this.props.unit.unit_internal_id,
  //               title,
  //               {},
  //               (res) => {
  //                 if (!this.successChecker(res))
  //                   return false
  //                 this.setState({activeStep: index})  // Select found step
  //                 this.setState({loading_1: false, loading_2: false})
  //                 setTimeout(() => {
  //                   let el = document.getElementById(`step_${index}`)
  //                   el.scrollIntoView({
  //                     block: "center",
  //                     inline: "center",
  //                     behavior: "smooth"
  //                   })
  //                 }, 200)
  //                 return true
  //               },
  //               (res) => {
  //                 if (res !== undefined)
  //                   this.props.raiseNotification('Error while sending data to server (return code !== 200)')
  //                 this.setState({loading_1: false, loading_2: false})
  //               }
  //             )
  //           } else {
  //             this.setState({activeStep: index})  // Select found step
  //             setTimeout(() => {
  //               let el = document.getElementById(`step_${index}`)
  //               el.scrollIntoView({
  //                 block: "center",
  //                 inline: "center",
  //                 behavior: "smooth"
  //               })
  //             }, 200) // Scroll to the selected step
  //           }
  //         }
  //       }
  //     }
  //   })
  //   return stepFound
  // }


  timeToRegular = (seconds) => {
    return new Date(seconds * 1000).toISOString().substr(11, 8)
  }

  render () {
    const {classes, t}                       = this.props
    const {activeStep, loading_1, loading_2} = this.state
    return (
      <div className={styles.wrapper}>
        {activeStep === -1 && this.state.afterPauseStep === -1 && (
          <div>
            <Button
              color="#20639B"
              radius="10px"
              staticWidth="240px"
              disabled={loading_1}
              loading={loading_1}
              onClick={() => {
                this.handleStageRecordStart(this.props.steps[0]?.name)
                  .then(() => {
                    this.setState({activeStep: this.state.activeStep + 1})
                    document.getElementById('step_0').scrollIntoView({
                      behavior: "smooth",
                      block: "center"
                    })
                  })
              }}
              className={classes.buttonStart}>{t('StartComposition')}</Button>
            <Button
              color="#ED553B"
              radius="10px"
              staticWidth="240px"
              disabled={loading_2}
              loading={loading_2}
              onClick={() => this.cancelComposition().then(() => setTimeout(() => this.props.goToMenu(), 400))}
              className={classes.buttonCancel}>{t('CancelComposition')}</Button>
          </div>
        )}
        {activeStep === -1 && this.state.afterPauseStep !== -1 && (
          <div>
            <div className={styles.textWrapper}>{t('DropWarning')}</div>
            <div>
              <Button
                color="#20639B"
                radius="10px"
                staticWidth="300px"
                disabled={loading_1}
                loading={loading_1}
                className={classes.buttonStart}
                onClick={() => this.proceedComposition()}
              >{t('ProceedComposition')}</Button>
              <Button
                color="#ED553B"
                radius="10px"
                staticWidth="240px"
                disabled={loading_2}
                loading={loading_2}
                className={classes.buttonStart}
                onClick={() => {
                  this.props.dropUnit()
                }}
              >{t('CancelComposition')}</Button>
            </div>
          </div>
        )}

        <Stepper className={clsx(classes.root, styles.button)} activeStep={activeStep} orientation="vertical">
          {this.props.steps?.map((item, index) =>
            (<Step id={`step_${index}`} key={item.description}>
              <StepLabel>{item.name}</StepLabel>
              <StepContent>
                <Typography>{item.description}</Typography>
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
                        if (activeStep === this.props.steps?.length - 1) {
                          this.handleStageRecordStop()
                            .then(() => {
                              this.setState({activeStep: activeStep + 1, loading_1: false})
                              document.getElementById('savePassportButton').scrollIntoView({
                                behavior: "smooth",
                                block: "center"
                              })
                            })
                        } else {
                          this.handleNextCompositionStep(this.props.steps[index + 1]?.name, `step_${index + 1}`)
                        }
                      }}
                    >
                      {activeStep === this.props.steps?.length - 1 ? t('Finish') : t('Next')}
                    </Button>
                    {activeStep !== this.props.steps?.length - 1 && (
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
                      {this.timeToRegular(item.duration_seconds)}
                    </div>
                  </div>
                </div>
              </StepContent>
            </Step>))}
        </Stepper>
        {activeStep === this.props.steps?.length && (
          <Button
            id="savePassportButton"
            color="#20639B"
            radius="10px"
            staticWidth="240px"
            loading={loading_1}
            disabled={loading_1}
            onClick={() => this.handleCompositionUpload().then(() => {
              this.props.dropUnit(() => {
                return true
              }, null)
              setTimeout(() => {
                this.props.goToMenu()
              }, 300)
            })}
            className={classes.uploadButton}>{t('SavePassport')}</Button>
        )}
      </div>
    )
  }
})))
