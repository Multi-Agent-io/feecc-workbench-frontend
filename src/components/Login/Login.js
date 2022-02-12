import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import React from 'react'
import styles from './Login.module.css'
import robonomicsLogo from '../../static/imageCenter.png'
import multiAgentLogo from '../../static/imageLeft_black.png'
import endoStarsLogo from '../../static/imageRight.png'
import { push } from "connected-react-router";
import { doFetchComposition, doGetWorkbenchNumber, doRaiseNotification } from "@reducers/stagesActions";
import PropTypes from "prop-types";
import config from '../../../configs/config.json'

export default withTranslation()(connect(
  (store) => ({
    authorized: store.stages.getIn(['composition', 'employee_logged_in']),
    workbenchNumber: store.stages.get('workbench_no'),
    location: store.router.location.pathname,
  }),
  (dispatch) => ({
    goToMenu: () => dispatch(push('/menu')),
    goToGatheringComponents: () => dispatch(push('/gatherComponents')),
    goToComposition: () => dispatch(push('/composition')),
    raiseNotification: (notificationMessage) => doRaiseNotification(dispatch, notificationMessage),
    doFetchComposition: (successChecker, errorChecker) => doFetchComposition(dispatch, successChecker, errorChecker),
  })
)(class Login extends React.Component {

  static propTypes = {
    authorized: PropTypes.bool,
    workbenchNumber: PropTypes.number.isRequired,
    location: PropTypes.string.isRequired,

    goToMenu: PropTypes.func.isRequired,
    goToGatheringComponents: PropTypes.func.isRequired,
    doFetchComposition: PropTypes.func.isRequired,
    raiseNotification: PropTypes.func.isRequired,
  }

  state = {
    timerID: null
  }

  componentDidMount () {
    this.setState({
      // Composition information pulling with pulling_period
      timerID: setInterval(() => {
        this.props.doFetchComposition((res) => {
          // TODO add server response validation
          let location = this.props.location.split('/')[1]
          switch(res.state){
            case 'ProductionStageOngoing':
              // console.log("PRODUCTION__ONGOING")
              if(location !== 'composition')
                this.props.goToComposition()
              break;
            case 'GatherComponents':
              // console.log("GATHER__COMPONENTS")
              if(location !== 'gatherComponents')
                this.props.goToGatheringComponents()
              break;
            case 'AwaitLogin':
              // console.log("AWAIT__LOGIN")
              break;
            case 'AuthorizedIdling':
              if(location !== 'menu')
                this.props.goToMenu()
              // console.log("AUTHORIZED__IDLING")
              break;
            case 'UnitAssignedIdling':
              // console.log('UNIT__ASSIGNED__IDLING')
              if(location !== 'composition')
                this.props.goToComposition()
              break;
            default:
              // console.log('Redirect to login')
              break;
          }
          return true
        }, null)
      }, config.pulling_period)
    })
  }

  render () {
    const {t} = this.props
    return (
      <div className={styles.fullWrapper}>
        <div className={styles.wrapper}>
          <div className={styles.header}>{t('QualityMonitoringSystem')}</div>
          <div className={styles.icons}>
            <div className={styles.icon}><img className={styles.leftLogo} src={multiAgentLogo} alt="MVAS-logo(img1)"/></div>
            <div className={styles.icon}><img className={styles.centerLogo} src={robonomicsLogo}
                                              alt="robonomics-logo(img2)"/></div>
            <div className={styles.icon}><img className={styles.rightLogo} src={endoStarsLogo}
                                              alt="geoscan-logo(img3)"/>
            </div>
          </div>
          <div className={styles.message}>{t('AuthorizeToProceed')}</div>
        </div>
      </div>
    )
  }
}))
