import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import React from 'react'
import styles from './Header.module.css'
import robonomicsLogo from '../../static/imageCenter.png'
import MVASLogo from '../../static/imageLeft.png'
import { push } from "connected-react-router";
import Stopwatch from "@components/Stopwatch/Stopwatch";
import PropTypes from "prop-types";
import { doGetBarcode, doGetUnitBiography, doSetCompositionID } from "@reducers/stagesActions";
import { setQueryValues } from "@reducers/routerActions";
import config from '../../../configs/config.json'

export default withTranslation()(connect(
  (store) => ({
    composition         : store.stages.get('composition').toJS(),
    location            : store.router.location.pathname,
    unitID              : store.stages.getIn(['unit', 'unit_internal_id']),
    finishedCompositions: store.stages.get('finishedCompositionsIDs')?.toJS()
  }),
  (dispatch) => ({
    redirectToLogin      : () => dispatch(push('/')),
    goToMenu             : () => dispatch(push({ pathname: '/menu' })),
    redirectToComposition: () => dispatch(push('/composition')),
    getBarcode           : (successChecker, errorChecker) => doGetBarcode(dispatch, successChecker, errorChecker),
    setQuery             : (query, url) => setQueryValues(dispatch, query, url),
    setCompositionID     : (unitID) => doSetCompositionID(dispatch, unitID),
    getUnitBiography     : (unitID, successChecker, errorChecker) => doGetUnitBiography(dispatch, unitID, successChecker, errorChecker),
    
  })
)(class Header extends React.Component {
  
  static propTypes = {
    composition         : PropTypes.object,
    location            : PropTypes.string,
    unitID              : PropTypes.string,
    finishedCompositions: PropTypes.arrayOf(PropTypes.string),
    
    redirectToLogin      : PropTypes.func.isRequired,
    goToMenu             : PropTypes.func.isRequired,
    redirectToComposition: PropTypes.func.isRequired,
    getBarcode           : PropTypes.func.isRequired,
    setQuery             : PropTypes.func.isRequired,
    setCompositionID     : PropTypes.func.isRequired,
    getUnitBiography     : PropTypes.func.isRequired,
  }
  
  state = {
    timerID: null
  }
  
  constructor(props) {
    super(props)
    this.stopwatchRef = React.createRef()
  }
  
  componentDidMount() {
    if (!this.props.composition.employee_logged_in) {
      this.props.redirectToLogin()
    }
    this.setState({
      timerID: setInterval(() => {
        this.props.getBarcode(
          (res) => {
            if (res && res.buffer !== undefined) {
              if (this.isNumeric(res.buffer) && res.buffer.length === 13) {
                if (!this.props.finishedCompositions.includes(res.buffer) && this.props.unitID !== res.buffer) {
                  if (this.props.unitID !== undefined || this.props.unitID !== '') {
                    if((Date.now() / 1000).toFixed(0) - res.added_on <= config.pause_sensitivity) {
                      this.props.setCompositionID(res.buffer)
                      setTimeout(() => {
                        this.props.setQuery({ afterPause: true }, this.props.location)
                      }, 1000)
                    }
                    
                    
                  }
                }
              } else {
                this.props.setQuery({ afterPause: undefined }, this.props.location)
              }
            }
            return true
          },
          undefined)
      }, 1000)
    })
  }
  
  isNumeric = (str) => {
    if (typeof str != "string") return false // we only process strings!
    return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
      !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
  }
  
  componentDidUpdate(prevProps, prevState, snapshot) {
    // If employee_logged_in status changed ->
    if (this.props.composition.employee_logged_in !== prevProps.composition.employee_logged_in)
      // If 'employee_logged_in' status is false
      if (!this.props.composition.employee_logged_in) {
        // Do user logout
        this.props.redirectToLogin()
      }
    // If backend returned operation_ongoing === true -> start main stopwatch
    if (this.props?.composition.operation_ongoing) {
      this.stopwatchRef?.current?.start()
    } else {
      // If no operation is ongoing - redirect to menu.
      if (this.props.location.split('/')[1] !== 'menu'
        && (this.props.unitID === '' || this.props.unitID === undefined)
        && (this.props.composition.unit_internal_id === '' || this.props.composition.unit_internal_id === undefined || this.props.composition.unit_internal_id === null)
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
