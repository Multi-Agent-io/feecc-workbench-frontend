import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import React from 'react'
import styles from './Login.module.css'
import robonomicsLogo from '../../static/imageCenter.png'
import MVASLogo from '../../static/imageLeft.png'
import endoStarsLogo from '../../static/imageRight.png'
import { push, replace } from "connected-react-router";
import { doFetchComposition, doGetWorkbenchNumber, doRaiseNotification } from "@reducers/stagesActions";
import PropTypes from "prop-types";
import { ReactComponent as LoadingIcon } from '../../icons/Loading.svg'

export default withTranslation()(connect(
  (store) => ({
    authorized: store.stages.getIn(['composition', 'employee_logged_in']),
    workbenchNumber: store.stages.get('workbench_no')
  }),
  (dispatch) => ({
    goToMenu          : () => dispatch(push('/menu')),
    raiseNotification : (notificationMessage) => doRaiseNotification(dispatch, notificationMessage),
    doFetchComposition: (successChecker, errorChecker) => doFetchComposition(dispatch, successChecker, errorChecker),
    getWorkbenchNumber: (successChecker, errorChecker) => doGetWorkbenchNumber(dispatch, successChecker, errorChecker)
  })
)(class Login extends React.Component {
  
  static propTypes = {
    authorized: PropTypes.bool,
    workbenchNumber: PropTypes.number.isRequired,
    
    goToMenu          : PropTypes.func.isRequired,
    doFetchComposition: PropTypes.func.isRequired
  }
  
  state = {
    loading: true,
    timerID: null
  }
  
  componentDidMount() {
    this.setState({
      timerID: setInterval(() => {
        this.props.getWorkbenchNumber(
          (res) => {
            if (!res.status){
              this.props.raiseNotification(res.comment)
              return false
            }
            this.setState({ loading: false })
            clearInterval(this.state.timerID)
            this.setState({timerID: setInterval(() => {
                this.props.doFetchComposition((r) => { return true }, null)
              }, 1000)})
            return true
          },
          null)
      }, 1000)
    })
    if (this.props.authorized === true)
      this.props.goToMenu()
  }
  
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.authorized === true)
      this.props.goToMenu()
  }
  
  componentWillUnmount() {
    clearInterval(this.state.timerID)
  }
  
  renderLoading = () => {
    return (<div className={styles.loading}/>)
  }
  
  render() {
    const { t } = this.props
    const { loading } = this.state
    return (
      <div className={styles.wrapper}>
        <div className={styles.header}>{t('QualityMonitoringSystem')}</div>
        <div className={styles.icons}>
          <div className={styles.icon}><img className={styles.leftLogo} src={MVASLogo} alt="MVAS-logo(img1)"/></div>
          <div className={styles.icon}><img className={styles.centerLogo} src={robonomicsLogo}
                                            alt="robonomics-logo(img2)"/></div>
          <div className={styles.icon}><img className={styles.rightLogo} src={endoStarsLogo} alt="geoscan-logo(img3)"/>
          </div>
        </div>
        <div className={styles.message}>{!loading ? t('AuthorizeToProceed') : t('GettingWorkbenchNo')}</div>
        {loading && this.renderLoading()}
      </div>
    )
  }
}))
