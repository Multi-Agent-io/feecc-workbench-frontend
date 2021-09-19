import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import React from 'react'
import styles from './Header.module.css'
import robonomicsLogo from '../../static/imageCenter.png'
import MVASLogo from '../../static/imageLeft.png'
import { push, replace } from "connected-react-router";
import Stopwatch from "@components/Stopwatch/Stopwatch";
import PropTypes from "prop-types";

export default withTranslation()(connect(
  (store) => ({
    composition: store.stages.get('composition').toJS(),
    location   : store.router.location.pathname,
    unitID     : store.stages.getIn(['unit', 'unit_internal_id']),
  }),
  (dispatch) => ({
    redirectToLogin      : () => dispatch(replace('/')),
    goToMenu             : () => dispatch(replace({ pathname: '/menu' })),
    redirectToComposition: () => dispatch(push('/composition')),
  })
)(class Header extends React.Component {
  
  static propTypes = {
    composition: PropTypes.object,
    location   : PropTypes.string,
    unitID     : PropTypes.string,
    
    redirectToLogin      : PropTypes.func.isRequired,
    goToMenu             : PropTypes.func.isRequired,
    redirectToComposition: PropTypes.func.isRequired
  }
  
  constructor(props) {
    super(props)
    this.stopwatchRef = React.createRef()
  }
  
  componentDidMount() {
    if (!this.props.composition.employee_logged_in)
      this.props.redirectToLogin()
  }
  
  componentDidUpdate(prevProps, prevState, snapshot) {
    // If employee_logged_in status changed ->
    if (this.props.composition.employee_logged_in !== prevProps.composition.employee_logged_in)
      // If employee_logged_in status is false
      if (!this.props.composition.employee_logged_in)
        // Do user logout
        this.props.redirectToLogin()
    // If backend returned operation_ongoing === true
    if (this.props?.composition.operation_ongoing)
      this.stopwatchRef?.current?.start()
    else {
      if (this.props.location.split('/')[1] !== 'menu'
        && (this.props.unitID === '' || this.props.unitID === undefined)
        && (this.props.composition.unit_internal_id === '' || this.props.composition.unit_internal_id === undefined)
        && this.props.composition.employee_logged_in) {
        this.props.goToMenu()
      }
      setTimeout(() => {
        if (this.props?.composition.operation_ongoing) {
          this.stopwatchRef?.current?.stop()
        }
      }, 500)
      
    }
    if ((this.props.composition.operation_ongoing === true || (this.props.unitBiography !== '' && this.props.unitBiography !== undefined))
      && this.props.location.split('/')[1] !== 'composition') {
      this.props.redirectToComposition()
    }
    
    // If unitID is present and not similar to the previous (removing permanent repeating redirect to composition)
    if (this.props.unitID !== undefined && this.props.location.split('/')[1] !== 'composition' && this.props.composition.employee?.name !== undefined) {
      this.props.redirectToComposition()
    }
    
    if (this.props.composition.unit_internal_id !== null && this.props.composition.unit_internal_id !== undefined && this.props.location.split('/')[1] !== 'composition') {
      this.props.redirectToComposition()
    }
  }
  
  renderHeader = () => {
    const { t, composition, unitID } = this.props
    return (
      <div className={styles.wrapper}>
        <div className={styles.icons}>
          <img className={styles.robonomicsLogo} alt={"Robonomics logo"} src={robonomicsLogo}/>
          <img className={styles.mvasLogo} alt={"MVAS logo"} src={MVASLogo}/>
        </div>
        <div className={styles.info}>
          <div>
            <div className={styles.userInfo}>
              <div className={styles.userName}>{t('AuthorizedEmployee')} {composition?.employee?.name}</div>
              <div className={styles.userPosition}>{t('Position')} {composition?.employee?.position}</div>
            </div>
            {unitID && (<div>{t('CompositionNumber')} {unitID}</div>)}
          </div>
          <div className={styles.mainTimer}>
            <div className={styles.timerHeader}>
              {composition.operation_ongoing ?
                <>
                  <div>{t('SessionDuration')}</div>
                  <Stopwatch ref={this.stopwatchRef}/>
                </>
                :
                <>
                  {composition.duration && (
                    <>
                      <div>{t('LastSessionDuration')}</div>
                      <div>00:00:00</div>
                    </>
                  )}
                </>
              }
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  render() {
    return (
      <>
        {this.props.location.split('/')[1] !== '' && this.renderHeader()}
        {/*<div>header</div>*/}
      </>
    )
  }
}))
